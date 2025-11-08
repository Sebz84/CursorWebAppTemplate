Add-Type -AssemblyName System.Drawing
Add-Type -Namespace IconUtil -Name NativeMethods -MemberDefinition '[DllImport( user32.dll)] public static extern bool DestroyIcon(System.IntPtr handle);'
function New-Image(, ) {
   = New-Object System.Drawing.Bitmap(, )
   = [System.Drawing.Graphics]::FromImage()
  .SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  .PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  .TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
   = New-Object System.Drawing.Rectangle(0, 0, , )
   = New-Object System.Drawing.Drawing2D.LinearGradientBrush(, [System.Drawing.Color]::FromArgb(255, 37, 99, 235), [System.Drawing.Color]::FromArgb(255, 15, 23, 42), 45)
  .FillRectangle(, )
   = [Math]::Round( * 0.32)
   = New-Object System.Drawing.Font('Segoe UI Semibold', , [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
   = New-Object System.Drawing.StringFormat
  .Alignment = [System.Drawing.StringAlignment]::Center
  .LineAlignment = [System.Drawing.StringAlignment]::Center
  .DrawString('AI', , [System.Drawing.Brushes]::White, , )
  .Flush()
  .Save(, [System.Drawing.Imaging.ImageFormat]::Png)
  .Dispose()
  .Dispose()
  .Dispose()
  .Dispose()
}
function New-IconFile(, ) {
   = New-Object System.Drawing.Bitmap(, )
   = [System.Drawing.Graphics]::FromImage()
  .SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  .PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  .TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
   = New-Object System.Drawing.Rectangle(0, 0, , )
   = New-Object System.Drawing.Drawing2D.LinearGradientBrush(, [System.Drawing.Color]::FromArgb(255, 37, 99, 235), [System.Drawing.Color]::FromArgb(255, 15, 23, 42), 45)
  .FillRectangle(, )
   = [Math]::Round( * 0.4)
   = New-Object System.Drawing.Font('Segoe UI Semibold', , [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
   = New-Object System.Drawing.StringFormat
  .Alignment = [System.Drawing.StringAlignment]::Center
  .LineAlignment = [System.Drawing.StringAlignment]::Center
  .DrawString('AI', , [System.Drawing.Brushes]::White, , )
  .Flush()
   = .GetHicon()
   = [System.Drawing.Icon]::FromHandle()
   = New-Object System.IO.FileStream(, [System.IO.FileMode]::Create)
  .Save()
  .Close()
  .Dispose()
  [IconUtil.NativeMethods]::DestroyIcon() | Out-Null
  .Dispose()
  .Dispose()
  .Dispose()
  .Dispose()
}
 = Join-Path (Get-Location) 'public'
 = Join-Path  'icons'
if (-not (Test-Path )) {
  New-Item -ItemType Directory -Path  | Out-Null
}
New-Image (Join-Path  'icon-512.png') 512
New-Image (Join-Path  'icon-192.png') 192
New-IconFile (Join-Path  'favicon.ico') 64
