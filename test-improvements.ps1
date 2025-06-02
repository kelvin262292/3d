# Test Script for Recent Improvements
# Kiem tra cac cai thien gan day

Write-Host "=== TESTING 3D MODEL STORE IMPROVEMENTS ===" -ForegroundColor Green
Write-Host ""

# Test 1: Kiem tra cau truc thu muc 3D models
Write-Host "1. Kiem tra cau truc thu muc 3D models..." -ForegroundColor Yellow
$modelsPath = "public\models"
if (Test-Path $modelsPath) {
    Write-Host "[OK] Thu muc models ton tai" -ForegroundColor Green
    
    # Kiem tra cac danh muc
    $categories = @("furniture", "electronics", "fashion")
    foreach ($category in $categories) {
        $categoryPath = "$modelsPath\$category"
        if (Test-Path $categoryPath) {
            $files = Get-ChildItem $categoryPath -Filter "*.glb"
            Write-Host "[OK] Danh muc $category`: $($files.Count) mo hinh" -ForegroundColor Green
            foreach ($file in $files) {
                Write-Host "  - $($file.Name) ($([math]::Round($file.Length/1KB, 2)) KB)" -ForegroundColor Cyan
            }
        } else {
            Write-Host "[ERROR] Thieu danh muc: $category" -ForegroundColor Red
        }
    }
} else {
    Write-Host "[ERROR] Thu muc models khong ton tai" -ForegroundColor Red
}

Write-Host ""

# Test 2: Kiem tra metadata file
Write-Host "2. Kiem tra file metadata..." -ForegroundColor Yellow
$metadataPath = "$modelsPath\models-metadata.json"
if (Test-Path $metadataPath) {
    Write-Host "[OK] File metadata ton tai" -ForegroundColor Green
    try {
        $metadata = Get-Content $metadataPath | ConvertFrom-Json
        Write-Host "[OK] So luong mo hinh trong metadata: $($metadata.models.Count)" -ForegroundColor Green
    } catch {
        Write-Host "[ERROR] Khong doc duoc metadata" -ForegroundColor Red
    }
} else {
    Write-Host "[ERROR] File metadata khong ton tai" -ForegroundColor Red
}

Write-Host ""

# Test 3: Kiem tra Prisma seed file
Write-Host "3. Kiem tra Prisma seed file..." -ForegroundColor Yellow
$seedPath = "prisma\sample-models-seed.ts"
if (Test-Path $seedPath) {
    Write-Host "[OK] File seed ton tai" -ForegroundColor Green
    $seedContent = Get-Content $seedPath -Raw
    if ($seedContent -match "sampleModels") {
        Write-Host "[OK] Seed data duoc dinh nghia dung" -ForegroundColor Green
    }
} else {
    Write-Host "[ERROR] File seed khong ton tai" -ForegroundColor Red
}

Write-Host ""

# Test 4: Kiem tra server status
Write-Host "4. Kiem tra trang thai server..." -ForegroundColor Yellow
try {
    $response = Test-NetConnection -ComputerName localhost -Port 3000 -WarningAction SilentlyContinue
    if ($response.TcpTestSucceeded) {
        Write-Host "[OK] Server dang chay tren port 3000" -ForegroundColor Green
    } else {
        Write-Host "[ERROR] Server khong chay tren port 3000" -ForegroundColor Red
    }
} catch {
    Write-Host "[ERROR] Khong the kiem tra server" -ForegroundColor Red
}

Write-Host ""

# Test 5: Kiem tra cac file quan trong
Write-Host "5. Kiem tra cac file quan trong..." -ForegroundColor Yellow
$importantFiles = @(
    "package.json",
    "next.config.mjs",
    "prisma\schema.prisma",
    "3D_SETUP_REPORT.md",
    "IMPROVEMENT_PLAN.md"
)

foreach ($file in $importantFiles) {
    if (Test-Path $file) {
        Write-Host "[OK] $file" -ForegroundColor Green
    } else {
        Write-Host "[ERROR] $file" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=== KIEM TRA HOAN TAT ===" -ForegroundColor Green
Write-Host "Thoi gian: $(Get-Date)" -ForegroundColor Cyan