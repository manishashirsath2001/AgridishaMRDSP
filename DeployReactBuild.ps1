<#
  Deploy-ReactBuild.ps1
  ---------------------
  Deploys React app to:
  https://perfectkrushimarketyard.com/
#>

$buildPath  = "Y:\RELEASE\ReactPublish\MarketCommittee\frontend"
$deployPath = "\\103.120.176.18\C$\inetpub\vhosts\perfectkrushimarketyard.com\httpdocs"

$cred = Get-Credential

Write-Host "⬆ Deploying React build..."
robocopy $buildPath $deployPath /MIR /XF web.config /Z /R:2 /W:5 | Out-Null
Write-Host "`n✅ React app successfully deployed at https://perfectkrushimarketyard.com/"
