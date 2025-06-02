# Simple 3D Models Setup Script
# Tác giả: AI Development Assistant
# Mục đích: Tải và triển khai 3D models cơ bản

param(
    [string]$ProjectRoot = (Get-Location)
)

# Colors
$Green = "Green"
$Yellow = "Yellow"
$Red = "Red"
$Cyan = "Cyan"

function Write-ColorOutput {
    param([string]$Message, [string]$Color = "White")
    Write-Host $Message -ForegroundColor $Color
}

Write-ColorOutput "🚀 Starting Simple 3D Models Setup..." $Cyan
Write-ColorOutput "Project Root: $ProjectRoot" $Yellow

# Step 1: Create directories
Write-ColorOutput "📁 Creating directories..." $Cyan
$directories = @(
    "$ProjectRoot\public\models",
    "$ProjectRoot\public\models\furniture",
    "$ProjectRoot\public\models\electronics",
    "$ProjectRoot\public\models\fashion",
    "$ProjectRoot\public\models\home-decor",
    "$ProjectRoot\temp"
)

foreach ($dir in $directories) {
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Force -Path $dir | Out-Null
        Write-ColorOutput "  Created: $dir" $Green
    }
}

# Step 2: Download sample models
Write-ColorOutput "📥 Downloading sample 3D models..." $Cyan

$models = @(
    @{
        Name = "Chair.glb"
        Url = "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Chair/glTF-Binary/Chair.glb"
        Category = "furniture"
    },
    @{
        Name = "AntiqueCamera.glb"
        Url = "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/AntiqueCamera/glTF-Binary/AntiqueCamera.glb"
        Category = "electronics"
    },
    @{
        Name = "DamagedHelmet.glb"
        Url = "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb"
        Category = "fashion"
    }
)

foreach ($model in $models) {
    $outputPath = "$ProjectRoot\temp\$($model.Name)"
    $finalPath = "$ProjectRoot\public\models\$($model.Category)\$($model.Name)"
    
    try {
        Write-ColorOutput "  📥 Downloading $($model.Name)..." $Cyan
        Invoke-WebRequest -Uri $model.Url -OutFile $outputPath -UseBasicParsing
        
        # Copy to final location
        Copy-Item -Path $outputPath -Destination $finalPath -Force
        Write-ColorOutput "  ✅ Downloaded and deployed $($model.Name)" $Green
    }
    catch {
        Write-ColorOutput "  ❌ Failed to download $($model.Name): $($_.Exception.Message)" $Red
    }
}

# Step 3: Create model metadata
Write-ColorOutput "📝 Creating model metadata..." $Cyan

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
Write-ColorOutput "  ✅ Created metadata file: $metadataPath" $Green

# Step 4: Update seed data
Write-ColorOutput "📝 Updating seed data..." $Cyan

$seedPath = "$ProjectRoot\prisma\seed.ts"
if (Test-Path $seedPath) {
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
    userId: 1 // Assuming user with ID 1 exists
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
    
    $seedUpdatePath = "$ProjectRoot\prisma\sample-models-seed.ts"
    $seedContent | Out-File -FilePath $seedUpdatePath -Encoding UTF8
    Write-ColorOutput "  ✅ Created sample seed data: $seedUpdatePath" $Green
}

# Step 5: Cleanup
Write-ColorOutput "🧹 Cleaning up temporary files..." $Cyan
if (Test-Path "$ProjectRoot\temp") {
    Remove-Item -Path "$ProjectRoot\temp" -Recurse -Force
    Write-ColorOutput "  ✅ Cleaned up temp directory" $Green
}

# Step 6: Generate report
Write-ColorOutput "📊 Generating setup report..." $Cyan

$report = @"
# 3D Models Setup Report

## Setup Summary
- **Date**: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
- **Project Root**: $ProjectRoot
- **Models Downloaded**: $($models.Count)

## Downloaded Models

"@

foreach ($model in $models) {
    $report += "### $($model.Name)`n"
    $report += "- **Category**: $($model.Category)`n"
    $report += "- **File Path**: /models/$($model.Category)/$($model.Name)`n"
    $report += "- **Source**: $($model.Url)`n`n"
}

$report += @"

## Directory Structure
```
public/
└── models/
    ├── furniture/
    │   └── Chair.glb
    ├── electronics/
    │   └── AntiqueCamera.glb
    ├── fashion/
    │   └── DamagedHelmet.glb
    └── models-metadata.json
```

## Next Steps
1. Update your Prisma seed file with the sample data from `prisma/sample-models-seed.ts`
2. Run `npm run db:seed` to populate your database
3. Test the 3D model viewer in your application
4. Add more models as needed

## Files Created
- Models metadata: `public/models/models-metadata.json`
- Sample seed data: `prisma/sample-models-seed.ts`
- This report: `3D_SETUP_REPORT.md`
"@

$reportPath = "$ProjectRoot\3D_SETUP_REPORT.md"
$report | Out-File -FilePath $reportPath -Encoding UTF8
Write-ColorOutput "  ✅ Generated report: $reportPath" $Green

Write-ColorOutput "`n🎉 3D Models setup completed successfully!" $Green
Write-ColorOutput "📋 Check the report at: $reportPath" $Yellow
Write-ColorOutput "📁 Models are available in: $ProjectRoot\public\models" $Yellow