[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$flows = @{}

# Find file by wildcard to avoid encoding issues with Hebrew filename in script
$file = Get-ChildItem -Path . -Filter "*.csv" | Where-Object { $_.Name -like "EVENT*" } | Select-Object -First 1

if (-not $file) {
    Write-Error "CSV file not found"
    exit
}

$data = Import-Csv -Path $file.FullName -Encoding UTF8

if ($data.Count -eq 0) {
    Write-Error "No data"
    exit
}

$first = $data[0]
$props = $first.PSObject.Properties.Name
# Assuming index 4 and 5 are correct based on previous view
$originProp = $props[4]
$destProp = $props[5]

foreach ($row in $data) {
    $origin = $row.$originProp
    $destsStr = $row.$destProp
    
    if ([string]::IsNullOrWhiteSpace($origin)) { continue }
    
    $origin = $origin.Trim()
    $dests = $destsStr -split ","
    
    foreach ($d in $dests) {
        $d = $d.Trim()
        if ([string]::IsNullOrWhiteSpace($d)) { continue }
        
        $key = "$origin|$d"
        if ($flows.ContainsKey($key)) {
            $flows[$key]++
        }
        else {
            $flows[$key] = 1
        }
    }
}

$out = @()
foreach ($key in $flows.Keys) {
    $parts = $key -split "\|"
    $out += @{
        from  = $parts[0]
        to    = $parts[1]
        count = $flows[$key]
    }
}

$json = $out | ConvertTo-Json -Depth 5
Write-Output $json
