Add-Type -AssemblyName System.Drawing

function Optimize-Image {
    param (
        [string]$Path,
        [int]$MaxDim = 1600,
        [int]$Quality = 80
    )

    try {
        $fileInfo = Get-Item $Path
        if ($fileInfo.Length -lt 80KB) {
            return # Already very small
        }

        $origBytes = [System.IO.File]::ReadAllBytes($Path)
        $ms = [System.IO.MemoryStream]::new($origBytes)
        $origBmp = [System.Drawing.Bitmap]::FromStream($ms)

        $w = $origBmp.Width
        $h = $origBmp.Height

        if ($w -le $MaxDim -and $h -le $MaxDim -and $fileInfo.Length -lt 200KB) {
            $origBmp.Dispose()
            $ms.Dispose()
            return
        }

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
        if ($tempInfo.Length -lt $fileInfo.Length -and $tempInfo.Length -gt 10KB) {
            Remove-Item $Path -Force
            Move-Item $tempOut $Path -Force
            $savedMB = [math]::Round(($fileInfo.Length - $tempInfo.Length) / 1MB, 2)
            Write-Host "Optimized: $($fileInfo.Name) -> $($newW)x$($newH), saved $savedMB MB (now $([math]::Round($tempInfo.Length/1KB)) KB)"
        } else {
            Remove-Item $tempOut -Force
        }
    } catch {
        Write-Warning "Failed to optimize $Path : $($_.Exception.Message)"
    }
}

Write-Host "--- Optimizing Airport Assets ---"
Get-ChildItem -Path "client/assets/airports" -Recurse -File -Include *.jpg, *.jpeg | ForEach-Object {
    Optimize-Image -Path $_.FullName -MaxDim 1600 -Quality 82
}

Write-Host "--- Optimizing Pole Navigation Assets ---"
Get-ChildItem -Path "client/assets/pole_navigation" -Recurse -File -Include *.jpg, *.jpeg | ForEach-Object {
    Optimize-Image -Path $_.FullName -MaxDim 1600 -Quality 82
}

Write-Host "--- Optimizing Shrine & Gallery Images ---"
Get-ChildItem -Path "client/assets/images" -Recurse -File -Include *.jpg, *.jpeg | ForEach-Object {
    Optimize-Image -Path $_.FullName -MaxDim 1400 -Quality 80
}

Write-Host "Optimization Completed!"
