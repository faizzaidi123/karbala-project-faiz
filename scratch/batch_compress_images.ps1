Add-Type -AssemblyName System.Drawing

function Optimize-ImageFile {
    param (
        [string]$Path,
        [int]$MaxDim = 640,
        [int]$Quality = 70
    )

    try {
        $fileInfo = Get-Item $Path
        if ($fileInfo.Length -lt 15KB) {
            return # Already tiny
        }

        $origBytes = [System.IO.File]::ReadAllBytes($Path)
        $ms = [System.IO.MemoryStream]::new($origBytes)
        $origBmp = [System.Drawing.Bitmap]::FromStream($ms)

        $w = $origBmp.Width
        $h = $origBmp.Height

        # Calculate new dimensions
        $scale = 1.0
        if ($w -gt $MaxDim -or $h -gt $MaxDim) {
            $scale = [Math]::Min([double]$MaxDim / $w, [double]$MaxDim / $h)
        }
        $newW = [int][Math]::Round($w * $scale)
        $newH = [int][Math]::Round($h * $scale)

        $targetBmp = [System.Drawing.Bitmap]::new($newW, $newH, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
        $g = [System.Drawing.Graphics]::FromImage($targetBmp)
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

        $g.DrawImage($origBmp, 0, 0, $newW, $newH)
        $g.Dispose()
        $origBmp.Dispose()
        $ms.Dispose()

        # Find JPEG codec
        $codecs = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders()
        $jpegCodec = $codecs | Where-Object { $_.MimeType -eq "image/jpeg" }

        $encoderParams = [System.Drawing.Imaging.EncoderParameters]::new(1)
        $encoderParams.Param[0] = [System.Drawing.Imaging.EncoderParameter]::new(
            [System.Drawing.Imaging.Encoder]::Quality,
            [long]$Quality
        )

        $tempOut = "$Path.tmp"
        $targetBmp.Save($tempOut, $jpegCodec, $encoderParams)
        $targetBmp.Dispose()
        $encoderParams.Dispose()

        $tempInfo = Get-Item $tempOut
        if ($tempInfo.Length -lt $fileInfo.Length -and $tempInfo.Length -gt 5KB) {
            Remove-Item $Path -Force
            Move-Item $tempOut $Path -Force
        } else {
            Remove-Item $tempOut -Force
        }
    } catch {
        # ignore non-critical
    }
}

Write-Host "Compressing images to 640px/70% for ~30MB target..."
$count = 0
Get-ChildItem "client\assets\images\*.jpg" | ForEach-Object {
    Optimize-ImageFile -Path $_.FullName -MaxDim 640 -Quality 70
    $count++
    if ($count % 50 -eq 0) {
        Write-Host "Processed $count images..."
    }
}
Write-Host "Compression completed."
