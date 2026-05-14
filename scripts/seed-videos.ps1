# seed-videos.ps1
# Añade los videos de YouTube como features de categoría (type: "video")
# Uso: .\scripts\seed-videos.ps1 -ApiUrl "https://xxxx.ngrok-free.app/api/v1" -ApiKey "tu-clave"

param(
    [Parameter(Mandatory=$true)]
    [string]$ApiUrl,

    [Parameter(Mandatory=$true)]
    [string]$ApiKey
)

$ApiUrl = $ApiUrl.TrimEnd('/')

$videos = @(
    # KAISE SOLAR (AGM Solar)  — ID: a11c1e00-1000-4000-8000-000000000006
    @{ catId = "a11c1e00-1000-4000-8000-000000000006"; title = "Kaise AGM Solar";    url = "https://youtu.be/GbpXDo8AS2E";                          order = 1 },
    @{ catId = "a11c1e00-1000-4000-8000-000000000006"; title = "Kaise AGM Solar";    url = "https://youtube.com/shorts/mSJsn53GNr4?feature=share";  order = 2 },

    # KAISE HIGH RATE           — ID: a11c1e00-1000-4000-8000-000000000005
    @{ catId = "a11c1e00-1000-4000-8000-000000000005"; title = "Kaise High Rate";    url = "https://youtu.be/OHfQolmFHRs";                          order = 1 },
    @{ catId = "a11c1e00-1000-4000-8000-000000000005"; title = "Kaise High Rate";    url = "https://youtube.com/shorts/SOkrcHMp9DA?feature=share";  order = 2 },

    # KAISE LITIO (LiFePO4)     — ID: a11c1e00-1000-4000-8000-000000000001
    @{ catId = "a11c1e00-1000-4000-8000-000000000001"; title = "Kaise LiFePO4";      url = "https://youtu.be/HHYI90fHCKs";                          order = 1 },
    @{ catId = "a11c1e00-1000-4000-8000-000000000001"; title = "Kaise LiFePO4";      url = "https://youtube.com/shorts/64YpFUAAUf4?feature=share";  order = 2 },

    # KAISE SOLAR GEL            — ID: a13c1e00-1000-4000-8000-000000000004
    @{ catId = "a13c1e00-1000-4000-8000-000000000004"; title = "Kaise Solar GEL";   url = "https://youtu.be/tV49oyy7cm8";                          order = 1 },
    @{ catId = "a13c1e00-1000-4000-8000-000000000004"; title = "Kaise Solar GEL";   url = "https://youtube.com/shorts/ZoXHz7nprTg?feature=share";  order = 2 }
)

$headers = @{
    "X-API-Key"    = $ApiKey
    "Content-Type" = "application/json"
}

$ok    = 0
$fail  = 0

foreach ($v in $videos) {
    $label = @{ title = $v.title; url = $v.url } | ConvertTo-Json -Compress
    $body  = @{ type = "video"; label = $label; order = $v.order } | ConvertTo-Json

    $endpoint = "$ApiUrl/categories/$($v.catId)/features"

    try {
        $resp = Invoke-RestMethod -Uri $endpoint -Method POST -Headers $headers -Body $body
        Write-Host "OK  [$($v.catId)] $($v.title) — $($v.url)" -ForegroundColor Green
        $ok++
    } catch {
        Write-Host "ERR [$($v.catId)] $($v.title) — $($_.Exception.Message)" -ForegroundColor Red
        $fail++
    }
}

Write-Host "`n$ok OK / $fail errores" -ForegroundColor Cyan
