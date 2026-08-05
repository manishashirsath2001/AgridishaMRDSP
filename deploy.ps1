$source = "c:\Users\LENOVO\Desktop\Manisha Update\AGRIDISHA(2 aug 2025)\AGRIDISHA"
$destination = "Y:\RELEASE\ReactPublish\AgriDisha\frontend"
$preserveFile = "web.config"
$preservePath = Join-Path $destination $preserveFile

$tempConfigBackup = ""
if (Test-Path $preservePath) {
    Write-Host "Backing up web.config temporarily..."
    $tempConfigBackup = Join-Path $env:TEMP "web.config"
    Copy-Item $preservePath $tempConfigBackup -Force
}

function Copy-OnlyChangedFiles {
    param (
        [string]$sourceDir,
        [string]$destDir
    )

    $sourceFiles = Get-ChildItem -Path $sourceDir -Recurse -File
    foreach ($sourceFile in $sourceFiles) {
        $relativePath = $sourceFile.FullName.Substring($sourceDir.Length).TrimStart("\")
        $destFile = Join-Path $destDir $relativePath

        if (!(Test-Path $destFile)) {
            New-Item -ItemType Directory -Path (Split-Path $destFile) -Force | Out-Null
            Copy-Item $sourceFile.FullName $destFile -Force
            Write-Host "Copied new file: $relativePath"
        }
        else {
            $sourceTime = (Get-Item $sourceFile.FullName).LastWriteTimeUtc
            $destTime = (Get-Item $destFile).LastWriteTimeUtc
            if ($sourceTime -gt $destTime) {
                Copy-Item $sourceFile.FullName $destFile -Force
                Write-Host "Updated file: $relativePath"
            }
        }
    }
}

Write-Host "Incremental copying only for changed files..."
Copy-OnlyChangedFiles -sourceDir $source -destDir $destination

if (Test-Path $tempConfigBackup) {
    Write-Host "Restoring web.config..."
    Copy-Item $tempConfigBackup $preservePath -Force
    Remove-Item $tempConfigBackup -Force
}

Start-Process "http://adsvr:71/"
Write-Host "Incremental deployment complete and site opened!"
