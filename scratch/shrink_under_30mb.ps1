Add-Type -AssemblyName System.Drawing

function Compress-Img {
    param (
        [string]$Path,
        [int]$MaxDim = 480,
        [int]$Quality = 65,
        [int]$MinSizeKB = 8
    )

    try {
        $fileInfo = Get-Item $Path
        if ($fileInfo.Length -le ($MinSizeKB * 1024)) {
            return
        }

        $origBytes = [System.IO.File]::ReadAllBytes($Path)
        $ms = [System.IO.MemoryStream]::new($origBytes)
        $origBmp = [System.Drawing.Bitmap]::FromStream($ms)

        $w = $origBmp.Width
        $h = $origBmp.Height

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
        if ($tempInfo.Length -lt $fileInfo.Length -and $tempInfo.Length -ge ($MinSizeKB * 1024)) {
            Remove-Item $Path -Force
            Move-Item $tempOut $Path -Force
        } else {
            Remove-Item $tempOut -Force
        }
    } catch {
        # ignore non-critical
    }
}

Write-Host "Optimizing client/assets/images to 480px / 65% quality..."
$count = 0
Get-ChildItem "client\assets\images\*.jpg" | ForEach-Object {
    Compress-Img -Path $_.FullName -MaxDim 480 -Quality 65 -MinSizeKB 5
    $count++
    if ($count % 50 -eq 0) {
        Write-Host "Processed $count gallery images..."
    }
}

Write-Host "Optimizing client/assets/airports (preserving > 15KB for audit)..."
Get-ChildItem "client\assets\airports\*\*.jpg" | ForEach-Object {
    Compress-Img -Path $_.FullName -MaxDim 900 -Quality 75 -MinSizeKB 20
}

Write-Host "Optimizing client/assets/pole_navigation (preserving > 15KB for audit)..."
Get-ChildItem "client\assets\pole_navigation\*.jpg" | ForEach-Object {
    Compress-Img -Path $_.FullName -MaxDim 800 -Quality 75 -MinSizeKB 20
}

Write-Host "Image compression complete!"
