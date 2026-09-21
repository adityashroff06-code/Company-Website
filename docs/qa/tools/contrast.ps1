# WCAG 2.1 contrast ratios for the §4.2 ramp and for the alpha-white text the site uses today.
function ToLin([double]$c) { $c = $c / 255; if ($c -le 0.03928) { $c / 12.92 } else { [Math]::Pow(($c + 0.055) / 1.055, 2.4) } }
function Rgb([string]$hex) { $h = $hex.TrimStart('#'); ,@([Convert]::ToInt32($h.Substring(0,2),16), [Convert]::ToInt32($h.Substring(2,2),16), [Convert]::ToInt32($h.Substring(4,2),16)) }
function Lum($rgb) { 0.2126 * (ToLin $rgb[0]) + 0.7152 * (ToLin $rgb[1]) + 0.0722 * (ToLin $rgb[2]) }
function Ratio($a, $b) { $la = Lum $a; $lb = Lum $b; if ($la -lt $lb) { $t = $la; $la = $lb; $lb = $t }; ($la + 0.05) / ($lb + 0.05) }
function Blend($fg, $bg, [double]$alpha) { ,@(0..2 | ForEach-Object { [Math]::Round($fg[$_] * $alpha + $bg[$_] * (1 - $alpha)) }) }
function Hex($rgb) { '#{0:X2}{1:X2}{2:X2}' -f [int]$rgb[0], [int]$rgb[1], [int]$rgb[2] }
function Verdict([double]$r) { if ($r -ge 7) { 'AAA' } elseif ($r -ge 4.5) { 'AA' } elseif ($r -ge 3) { 'large-only' } else { 'FAIL' } }

$T = [ordered]@{
  'ink-900'='#071628'; 'ink-800'='#0D2038'; 'ink-700'='#12304F'; 'ink-600'='#1B4374'; 'ink-500'='#55637A'; 'ink-400'='#8996A8'
  'brand-700'='#2E4E88'; 'brand-600'='#3A5D9F'; 'brand-500'='#4A72B8'; 'brand-400'='#7B9BD6'; 'brand-300'='#A9C4F0'; 'brand-100'='#E4ECF9'; 'brand-50'='#F3F7FD'
  'surface-0'='#FFFFFF'; 'surface-1'='#FAFBFD'; 'surface-2'='#F1F4F8'; 'eco-600'='#2E8B6B'; 'white'='#FFFFFF'
}
function Row($fg, $bg) { $r = Ratio (Rgb $T[$fg]) (Rgb $T[$bg]); '{0,-10} on {1,-10} {2,6:N2}:1  {3}' -f $fg, $bg, $r, (Verdict $r) }

"=== NEW RAMP: text on light surfaces ==="
foreach ($fg in 'ink-900','ink-800','ink-700','ink-600','ink-500','ink-400','brand-700','brand-600','brand-500','brand-400','eco-600') {
  foreach ($bg in 'surface-0','surface-1','surface-2') { Row $fg $bg } }
"`n=== NEW RAMP: text on tinted brand surfaces ==="
foreach ($fg in 'ink-700','ink-500','brand-700','brand-600') { foreach ($bg in 'brand-50','brand-100') { Row $fg $bg } }
"`n=== NEW RAMP: text on dark (gallery) chapters ==="
foreach ($fg in 'white','brand-50','brand-100','brand-300','brand-400','brand-500','ink-400','ink-500','eco-600') {
  foreach ($bg in 'ink-900','ink-800','ink-700') { Row $fg $bg } }
"`n=== NEW RAMP: white label on action fills ==="
foreach ($bg in 'brand-700','brand-600','brand-500','eco-600') { Row 'white' $bg }

"`n=== TODAY: text-white/NN over the backgrounds it actually sits on ==="
$bgs = [ordered]@{ 'navy #0f2a4e (bg-navy)'='#0F2A4E'; 'primary #4164a8 (bg-primary)'='#4164A8'; 'stage #07172e'='#07172E' }
foreach ($bgName in $bgs.Keys) {
  foreach ($a in 40,50,60,65,70,75,80,90) {
    $mix = Blend (Rgb '#FFFFFF') (Rgb $bgs[$bgName]) ($a / 100)
    $r = Ratio $mix (Rgb $bgs[$bgName])
    '{0,-30} text-white/{1,-3} -> {2}  {3,6:N2}:1  {4}' -f $bgName, $a, (Hex $mix), $r, (Verdict $r)
  } }

"`n=== TODAY: other pairs ==="
$pairs = @(
  @('muted-foreground hsl(205 15% 45%) ~#627684 on white', '#627684', '#FFFFFF'),
  @('muted-foreground on secondary #f4f5f7',              '#627684', '#F4F5F7'),
  @('primary #4164a8 on white',                           '#4164A8', '#FFFFFF'),
  @('white on primary #4164a8',                           '#FFFFFF', '#4164A8'),
  @('navy #0f2a4e on white',                              '#0F2A4E', '#FFFFFF'),
  @('lime #32CD32 on white (the word "sustainable")',     '#32CD32', '#FFFFFF'),
  @('accent #93b4e8 on navy',                             '#93B4E8', '#0F2A4E'),
  @('accent #93b4e8 on primary',                          '#93B4E8', '#4164A8'),
  @('a9c4f0 on stage #07172e',                            '#A9C4F0', '#07172E'),
  @('WhatsApp white on #25D366',                          '#FFFFFF', '#25D366')
)
foreach ($p in $pairs) { $r = Ratio (Rgb $p[1]) (Rgb $p[2]); '{0,-52} {1,6:N2}:1  {2}' -f $p[0], $r, (Verdict $r) }

"`n=== minimum white alpha that reaches 4.5:1 on each dark background ==="
foreach ($bgName in @('ink-900','ink-800','ink-700')) {
  foreach ($a in 40..100) { $mix = Blend (Rgb '#FFFFFF') (Rgb $T[$bgName]) ($a/100); if ((Ratio $mix (Rgb $T[$bgName])) -ge 4.5) { '{0}: white/{1} -> {2}' -f $bgName, $a, (Hex $mix); break } } }
foreach ($bgName in $bgs.Keys) {
  foreach ($a in 40..100) { $mix = Blend (Rgb '#FFFFFF') (Rgb $bgs[$bgName]) ($a/100); if ((Ratio $mix (Rgb $bgs[$bgName])) -ge 4.5) { '{0}: white/{1} -> {2}' -f $bgName, $a, (Hex $mix); break } } }

"`n=== hairline rgba(11,31,59,0.08) composited ==="
foreach ($bg in 'surface-0','surface-1','surface-2') { $mix = Blend @(11,31,59) (Rgb $T[$bg]) 0.08; '{0}: {1}  ({2:N2}:1 against the surface - decorative, not a text colour)' -f $bg, (Hex $mix), (Ratio $mix (Rgb $T[$bg])) }
