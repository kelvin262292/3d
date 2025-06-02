# Simple 3D Models Setup Script
param(
    [string]$ProjectRoot = (Get-Location)
)

# Colors for output
$Green = "Green"
$Yellow = "Yellow"
$Red = "Red"
$Cyan = "Cyan"

function Write-ColorOutput {
    param([string]$Message, [string]$Color = "White")
    Write-Host $Message -ForegroundColor $Color
}

Write-ColorOutput "Starting 3D Models Setup..." $Cyan
Write-ColorOutput "Project Root: $ProjectRoot" $Yellow

# Create directories
Write-ColorOutput "Creating directories..." $Cyan
$directories = @(
    "$ProjectRoot\public\models",
    "$ProjectRoot\public\models\furniture",
    "$ProjectRoot\public\models\electronics",
    "$ProjectRoot\public\models\fashion",
    "$ProjectRoot\temp"
)

foreach ($dir in $directories) {
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Force -Path $dir | Out-Null
        Write-ColorOutput "  Created: $dir" $Green
    }
}

# Download models
Write-ColorOutput "Downloading 3D models..." $Cyan

# Model 1: Chair
$chairUrl = "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Chair/glTF-Binary/Chair.glb"
$chairTemp = "$ProjectRoot\temp\Chair.glb"
$chairFinal = "$ProjectRoot\public\models\furniture\Chair.glb"

try {
    Write-ColorOutput "  Downloading Chair.glb..." $Cyan
    Invoke-WebRequest -Uri $chairUrl -OutFile $chairTemp -UseBasicParsing
    Copy-Item -Path $chairTemp -Destination $chairFinal -Force
    Write-ColorOutput "  Downloaded Chair.glb successfully" $Green
}
catch {
    Write-ColorOutput "  Failed to download Chair.glb: $($_.Exception.Message)" $Red
}

# Model 2: Camera
$cameraUrl = "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/AntiqueCamera/glTF-Binary/AntiqueCamera.glb"
$cameraTemp = "$ProjectRoot\temp\AntiqueCamera.glb"
$cameraFinal = "$ProjectRoot\public\models\electronics\AntiqueCamera.glb"

try {
    Write-ColorOutput "  Downloading AntiqueCamera.glb..." $Cyan
    Invoke-WebRequest -Uri $cameraUrl -OutFile $cameraTemp -UseBasicParsing
    Copy-Item -Path $cameraTemp -Destination $cameraFinal -Force
    Write-ColorOutput "  Downloaded AntiqueCamera.glb successfully" $Green
}
catch {
    Write-ColorOutput "  Failed to download AntiqueCamera.glb: $($_.Exception.Message)" $Red
}

# Model 3: Helmet
$helmetUrl = "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb"
$helmetTemp = "$ProjectRoot\temp\DamagedHelmet.glb"
$helmetFinal = "$ProjectRoot\public\models\fashion\DamagedHelmet.glb"

try {
    Write-ColorOutput "  Downloading DamagedHelmet.glb..." $Cyan
    Invoke-WebRequest -Uri $helmetUrl -OutFile $helmetTemp -UseBasicParsing
    Copy-Item -Path $helmetTemp -Destination $helmetFinal -Force
    Write-ColorOutput "  Downloaded DamagedHelmet.glb successfully" $Green
}
catch {
    Write-ColorOutput "  Failed to download DamagedHelmet.glb: $($_.Exception.Message)" $Red
}

# Create metadata
Write-ColorOutput "Creating metadata..." $Cyan

$metadata = @{
    models = @(
        @{
            name = "Modern Chair"
            file = "Chair.glb"
            category = "furniture"
            description = "A modern chair model"
            price = 299.99
            tags = @("furniture", "chair", "modern")
        },
        @{
            name = "Antique Camera"
            file = "AntiqueCamera.glb"
            category = "electronics"
            description = "A vintage camera model"
            price = 199.99
            tags = @("electronics", "camera", "vintage")
        },
        @{
            name = "Damaged Helmet"
            file = "DamagedHelmet.glb"
            category = "fashion"
            description = "A battle-worn helmet"
            price = 149.99
            tags = @("fashion", "helmet", "armor")
        }
    )
    created = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
}

$metadataJson = $metadata | ConvertTo-Json -Depth 10
$metadataPath = "$ProjectRoot\public\models\models-metadata.json"
$metadataJson | Out-File -FilePath $metadataPath -Encoding UTF8
Write-ColorOutput "  Created metadata file" $Green

# Create seed data
Write-ColorOutput "Creating seed data..." $Cyan

$seedContent = @"
// Sample 3D Models Data
const sampleModels = [
  {
    name: 'Modern Chair',
    description: 'A modern chair model',
    price: 299.99,
    category: 'furniture',
    modelUrl: '/models/furniture/Chair.glb',
    imageUrl: '/images/chair-preview.jpg',
    tags: ['furniture', 'chair', 'modern'],
    userId: 1
  },
  {
    name: 'Antique Camera',
    description: 'A vintage camera model',
    price: 199.99,
    category: 'electronics',
    modelUrl: '/models/electronics/AntiqueCamera.glb',
    imageUrl: '/images/camera-preview.jpg',
    tags: ['electronics', 'camera', 'vintage'],
    userId: 1
  },
  {
    name: 'Damaged Helmet',
    description: 'A battle-worn helmet',
    price: 149.99,
    category: 'fashion',
    modelUrl: '/models/fashion/DamagedHelmet.glb',
    imageUrl: '/images/helmet-preview.jpg',
    tags: ['fashion', 'helmet', 'armor'],
    userId: 1
  }
];

// Add this to your existing seed.ts file
// await prisma.model.createMany({ data: sampleModels });
"@

$seedPath = "$ProjectRoot\prisma\sample-models-seed.ts"
$seedContent | Out-File -FilePath $seedPath -Encoding UTF8
Write-ColorOutput "  Created seed data file" $Green

# Cleanup
Write-ColorOutput "Cleaning up..." $Cyan
if (Test-Path "$ProjectRoot\temp") {
    Remove-Item -Path "$ProjectRoot\temp" -Recurse -Force
    Write-ColorOutput "  Cleaned up temp files" $Green
}

# Generate report
Write-ColorOutput "Generating report..." $Cyan

$currentDate = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
$report = "# 3D Models Setup Report`n`n"
$report += "## Setup Summary`n"
$report += "- **Date**: $currentDate`n"
$report += "- **Project Root**: $ProjectRoot`n"
$report += "- **Models Downloaded**: 3`n`n"
$report += "## Downloaded Models`n`n"
$report += "### Chair.glb`n"
$report += "- **Category**: furniture`n"
$report += "- **File Path**: /models/furniture/Chair.glb`n"
$report += "- **Source**: GitHub glTF Sample Models`n`n"
$report += "### AntiqueCamera.glb`n"
$report += "- **Category**: electronics`n"
$report += "- **File Path**: /models/electronics/AntiqueCamera.glb`n"
$report += "- **Source**: GitHub glTF Sample Models`n`n"
$report += "### DamagedHelmet.glb`n"
$report += "- **Category**: fashion`n"
$report += "- **File Path**: /models/fashion/DamagedHelmet.glb`n"
$report += "- **Source**: GitHub glTF Sample Models`n`n"
$report += "## Directory Structure`n"
$report += "public/`n"
$report += "|-- models/`n"
$report += "    |-- furniture/`n"
$report += "    |   |-- Chair.glb`n"
$report += "    |-- electronics/`n"
$report += "    |   |-- AntiqueCamera.glb`n"
$report += "    |-- fashion/`n"
$report += "    |   |-- DamagedHelmet.glb`n"
$report += "    |-- models-metadata.json`n`n"
$report += "## Next Steps`n"
$report += "1. Update your Prisma seed file with the sample data from prisma/sample-models-seed.ts`n"
$report += "2. Run npm run db:seed to populate your database`n"
$report += "3. Test the 3D model viewer in your application`n"
$report += "4. Add more models as needed`n`n"
$report += "## Files Created`n"
$report += "- Models metadata: public/models/models-metadata.json`n"
$report += "- Sample seed data: prisma/sample-models-seed.ts`n"
$report += "- This report: 3D_SETUP_REPORT.md`n"

$reportPath = "$ProjectRoot\3D_SETUP_REPORT.md"
$report | Out-File -FilePath $reportPath -Encoding UTF8
Write-ColorOutput "  Generated report" $Green

Write-ColorOutput "" $White
Write-ColorOutput "3D Models setup completed successfully!" $Green
Write-ColorOutput "Check the report at: $reportPath" $Yellow
Write-ColorOutput "Models are available in: $ProjectRoot\public\models" $Yellow