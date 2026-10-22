param([string]$in, [string]$out, [int]$width = 2400, [switch]$pdf)
# 書き出し用。ユーザーが開いている PowerPoint のプレゼンテーションには触れない。
#   - 自分が開いたファイルだけを閉じる
#   - PowerPoint を終了させるのは、もともと起動しておらず、自分のファイル以外に何も開いていないときだけ
$ErrorActionPreference = 'Stop'
New-Item -ItemType Directory -Force $out | Out-Null
$wasRunning = $null -ne (Get-Process POWERPNT -ErrorAction SilentlyContinue)
for ($try = 0; $try -lt 6; $try++) {
  try { $pp = New-Object -ComObject PowerPoint.Application; break } catch { Start-Sleep -Seconds 4 }
}
$pres = $null
try {
  $pres = $pp.Presentations.Open($in, $true, $false, $false)
  $h = [int]($width * $pres.PageSetup.SlideHeight / $pres.PageSetup.SlideWidth)
  for ($i = 1; $i -le $pres.Slides.Count; $i++) {
    $pres.Slides.Item($i).Export((Join-Path $out ("page-{0:D2}.png" -f $i)), 'PNG', $width, $h)
  }
  if ($pdf) { $pres.SaveAs((Join-Path $out 'existing-customers-sample.pdf'), 32) }
  Write-Output ("exported {0} slides at {1}x{2}" -f $pres.Slides.Count, $width, $h)
} finally {
  if ($pres) { $pres.Close() }
  if (-not $wasRunning -and $pp.Presentations.Count -eq 0) { $pp.Quit() }
  [System.Runtime.InteropServices.Marshal]::ReleaseComObject($pp) | Out-Null
}
