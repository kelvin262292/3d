# 3D Models Setup Script
# Tác giả: AI Development Assistant
# Ngày tạo: 31/05/2025
# Mục đích: Tự động tải và tối ưu hóa 3D models cho dự án

param(
    [string]$ProjectRoot = (Get-Location),
    [switch]$SkipDownload,
    [switch]$OptimizeOnly,
    [string]$Quality = "medium" # low, medium, high
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

function Test-Dependencies {
    Write-ColorOutput "🔍 Checking dependencies..." $Cyan
    
    # Check if gltf-pipeline is installed
    try {
        $null = Get-Command gltf-pipeline -ErrorAction Stop
        Write-ColorOutput "✅ gltf-pipeline found" $Green
    } catch {
        Write-ColorOutput "❌ gltf-pipeline not found. Installing..." $Yellow
        npm install -g gltf-pipeline
    }
    
    # Check if Node.js is available
    try {
        $null = Get-Command node -ErrorAction Stop
        Write-ColorOutput "✅ Node.js found" $Green
    } catch {
        Write-ColorOutput "❌ Node.js not found. Please install Node.js first." $Red
        exit 1
    }
}

function Initialize-Directories {
    Write-ColorOutput "📁 Setting up directories..." $Cyan
    
    $directories = @(
        "$ProjectRoot\public\models",
        "$ProjectRoot\public\models\furniture",
        "$ProjectRoot\public\models\electronics",
        "$ProjectRoot\public\models\fashion",
        "$ProjectRoot\public\models\home-decor",
        "$ProjectRoot\temp\raw-models",
        "$ProjectRoot\temp\optimized-models"
    )
    
    foreach ($dir in $directories) {
        if (!(Test-Path $dir)) {
            New-Item -ItemType Directory -Force -Path $dir | Out-Null
            Write-ColorOutput "  Created: $dir" $Green
        }
    }
}

function Get-SampleModels {
    if ($SkipDownload) {
        Write-ColorOutput "⏭️ Skipping model download" $Yellow
        return
    }
    
    Write-ColorOutput "📥 Downloading sample 3D models..." $Cyan
    
    # Sample models from various free sources
    $models = @(
        @{
            Name = "modern-chair"
            Category = "furniture"
            Url = "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Chair/glTF-Binary/Chair.glb"
            Description = "Modern office chair"
        },
        @{
            Name = "vintage-camera"
            Category = "electronics"
            Url = "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/AntiqueCamera/glTF-Binary/AntiqueCamera.glb"
            Description = "Vintage camera model"
        },
        @{
            Name = "helmet"
            Category = "fashion"
            Url = "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb"
            Description = "Damaged helmet with PBR materials"
        },
        @{
            Name = "lantern"
            Category = "home-decor"
            Url = "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Lantern/glTF-Binary/Lantern.glb"
            Description = "Decorative lantern"
        },
        @{
            Name = "water-bottle"
            Category = "home-decor"
            Url = "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/WaterBottle/glTF-Binary/WaterBottle.glb"
            Description = "Water bottle"
        }
    )
    
    foreach ($model in $models) {
        $outputPath = "$ProjectRoot\temp\raw-models\$($model.Name).glb"
        
        if (Test-Path $outputPath) {
            Write-ColorOutput "  ⏭️ $($model.Name) already exists" $Yellow
            continue
        }
        
        try {
            Write-ColorOutput "  📥 Downloading $($model.Name)..." $Cyan
            Invoke-WebRequest -Uri $model.Url -OutFile $outputPath -UseBasicParsing
            Write-ColorOutput "  ✅ Downloaded $($model.Name)" $Green
        } catch {
            Write-ColorOutput "  ❌ Failed to download $($model.Name): $($_.Exception.Message)" $Red
        }
    }
}

function Optimize-Models {
    Write-ColorOutput "⚡ Optimizing 3D models..." $Cyan
    
    $rawModelsDir = "$ProjectRoot\temp\raw-models"
    $optimizedDir = "$ProjectRoot\temp\optimized-models"
    
    if (!(Test-Path $rawModelsDir)) {
        Write-ColorOutput "❌ No raw models found in $rawModelsDir" $Red
        return
    }
    
    # Optimization settings based on quality
    $settings = @{
        "low" = @{
            compressionLevel = 10
            quantizePosition = 14
            quantizeNormal = 10
            quantizeTexcoord = 12
        }
        "medium" = @{
            compressionLevel = 7
            quantizePosition = 16
            quantizeNormal = 12
            quantizeTexcoord = 14
        }
        "high" = @{
            compressionLevel = 5
            quantizePosition = 18
            quantizeNormal = 14
            quantizeTexcoord = 16
        }
    }
    
    $currentSettings = $settings[$Quality]
    
    Get-ChildItem -Path $rawModelsDir -Filter "*.glb" | ForEach-Object {
        $inputFile = $_.FullName
        $outputFile = Join-Path $optimizedDir $_.Name
        
        Write-ColorOutput "  ⚡ Optimizing $($_.Name)..." $Cyan
        
        try {
            # Build gltf-pipeline command
            $cmd = "gltf-pipeline"
            $args = @(
                "-i", $inputFile,
                "-o", $outputFile,
                "--draco.compressionLevel", $currentSettings.compressionLevel,
                "--draco.quantizePosition", $currentSettings.quantizePosition,
                "--draco.quantizeNormal", $currentSettings.quantizeNormal,
                "--draco.quantizeTexcoord", $currentSettings.quantizeTexcoord
            )
            
            & $cmd $args 2>$null
            
            if (Test-Path $outputFile) {
                # Calculate compression ratio
                $originalSize = (Get-Item $inputFile).Length / 1MB
                $optimizedSize = (Get-Item $outputFile).Length / 1MB
                $reduction = [math]::Round((($originalSize - $optimizedSize) / $originalSize) * 100, 2)
                
                Write-ColorOutput "    📊 Original: $([math]::Round($originalSize, 2))MB → Optimized: $([math]::Round($optimizedSize, 2))MB ($reduction% reduction)" $Green
            } else {
                Write-ColorOutput "    ❌ Optimization failed for $($_.Name)" $Red
            }
        } catch {
            Write-ColorOutput "    ❌ Error optimizing $($_.Name): $($_.Exception.Message)" $Red
        }
    }
}

function Deploy-Models {
    Write-ColorOutput "🚀 Deploying optimized models..." $Cyan
    
    $optimizedDir = "$ProjectRoot\temp\optimized-models"
    $publicModelsDir = "$ProjectRoot\public\models"
    
    if (!(Test-Path $optimizedDir)) {
        Write-ColorOutput "❌ No optimized models found" $Red
        return
    }
    
    # Model categorization mapping
    $categoryMapping = @{
        "modern-chair" = "furniture"
        "vintage-camera" = "electronics"
        "helmet" = "fashion"
        "lantern" = "home-decor"
        "water-bottle" = "home-decor"
    }
    
    Get-ChildItem -Path $optimizedDir -Filter "*.glb" | ForEach-Object {
        $modelName = [System.IO.Path]::GetFileNameWithoutExtension($_.Name)
        $category = $categoryMapping[$modelName]
        
        if ($category) {
            $categoryDir = "$publicModelsDir\$category"
            $destinationPath = "$categoryDir\$($_.Name)"
            
            Copy-Item -Path $_.FullName -Destination $destinationPath -Force
            Write-ColorOutput "  ✅ Deployed $($_.Name) to $category category" $Green
        } else {
            # Default to general models directory
            $destinationPath = "$publicModelsDir\$($_.Name)"
            Copy-Item -Path $_.FullName -Destination $destinationPath -Force
            Write-ColorOutput "  ✅ Deployed $($_.Name) to general models" $Yellow
        }
    }
}

function Update-SeedData {
    Write-ColorOutput "🌱 Updating seed data..." $Cyan
    
    $seedFile = "$ProjectRoot\prisma\seed.ts"
    
    if (!(Test-Path $seedFile)) {
        Write-ColorOutput "❌ Seed file not found at $seedFile" $Red
        return
    }
    
    # Sample 3D model data for seeding
    $modelData = @"
// 3D Models data for seeding
const sampleModels = [
  {
    name: "Modern Office Chair",
    description: "Ergonomic office chair with modern design",
    price: 299.99,
    category: "furniture",
    modelPath: "/models/furniture/modern-chair.glb",
    images: ["/images/chair-1.jpg", "/images/chair-2.jpg"],
    specifications: {
      dimensions: "60cm x 60cm x 120cm",
      material: "Mesh and plastic",
      weight: "15kg"
    }
  },
  {
    name: "Vintage Camera",
    description: "Classic vintage camera for photography enthusiasts",
    price: 450.00,
    category: "electronics",
    modelPath: "/models/electronics/vintage-camera.glb",
    images: ["/images/camera-1.jpg", "/images/camera-2.jpg"],
    specifications: {
      era: "1960s",
      condition: "Restored",
      weight: "800g"
    }
  },
  {
    name: "Tactical Helmet",
    description: "Durable tactical helmet with battle-worn finish",
    price: 189.99,
    category: "fashion",
    modelPath: "/models/fashion/helmet.glb",
    images: ["/images/helmet-1.jpg", "/images/helmet-2.jpg"],
    specifications: {
      size: "Medium",
      material: "Composite",
      weight: "1.2kg"
    }
  },
  {
    name: "Decorative Lantern",
    description: "Beautiful decorative lantern for ambient lighting",
    price: 75.50,
    category: "home-decor",
    modelPath: "/models/home-decor/lantern.glb",
    images: ["/images/lantern-1.jpg", "/images/lantern-2.jpg"],
    specifications: {
      height: "25cm",
      material: "Metal and glass",
      lightSource: "LED compatible"
    }
  },
  {
    name: "Premium Water Bottle",
    description: "Insulated water bottle for active lifestyle",
    price: 29.99,
    category: "home-decor",
    modelPath: "/models/home-decor/water-bottle.glb",
    images: ["/images/bottle-1.jpg", "/images/bottle-2.jpg"],
    specifications: {
      capacity: "750ml",
      material: "Stainless steel",
      insulation: "Double-wall vacuum"
    }
  }
];

// Add this to your existing seed function
// await prisma.product.createMany({ data: sampleModels });
"@
    
    # Append model data to seed file
    Add-Content -Path $seedFile -Value "`n`n$modelData"
    Write-ColorOutput "  ✅ Updated seed data with 3D models" $Green
}

function Generate-Report {
    Write-ColorOutput "📊 Generating optimization report..." $Cyan
    
    $reportPath = "$ProjectRoot\3D_OPTIMIZATION_REPORT.md"
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    
    $report = @"
# 3D Models Optimization Report

**Generated:** $timestamp  
**Quality Setting:** $Quality  
**Project Root:** $ProjectRoot

## Summary

"@
    
    # Count models in each directory
    $rawCount = 0
    $optimizedCount = 0
    $deployedCount = 0
    
    if (Test-Path "$ProjectRoot\temp\raw-models") {
        $rawCount = (Get-ChildItem "$ProjectRoot\temp\raw-models" -Filter "*.glb").Count
    }
    
    if (Test-Path "$ProjectRoot\temp\optimized-models") {
        $optimizedCount = (Get-ChildItem "$ProjectRoot\temp\optimized-models" -Filter "*.glb").Count
    }
    
    if (Test-Path "$ProjectRoot\public\models") {
        $deployedCount = (Get-ChildItem "$ProjectRoot\public\models" -Filter "*.glb" -Recurse).Count
    }
    
    $report += @"
- **Raw Models Downloaded:** $rawCount
- **Models Optimized:** $optimizedCount
- **Models Deployed:** $deployedCount

## Optimization Settings Used

- **Compression Level:** $($settings[$Quality].compressionLevel)
- **Position Quantization:** $($settings[$Quality].quantizePosition)
- **Normal Quantization:** $($settings[$Quality].quantizeNormal)
- **Texcoord Quantization:** $($settings[$Quality].quantizeTexcoord)

## Next Steps

1. ✅ Models are ready for use in your React Three Fiber components
2. 🔄 Update your product database with the new model paths
3. 🎨 Consider adding custom textures or materials
4. 📱 Test performance on mobile devices
5. 🚀 Deploy to production when ready

## Model Categories

- **Furniture:** `/public/models/furniture/`
- **Electronics:** `/public/models/electronics/`
- **Fashion:** `/public/models/fashion/`
- **Home Decor:** `/public/models/home-decor/`

## Performance Tips

- Use `Suspense` components for loading states
- Implement LOD (Level of Detail) for complex scenes
- Consider using `useGLTF.preload()` for critical models
- Monitor bundle size and loading times

---
*Report generated by 3D Models Setup Script*
"@
    
    Set-Content -Path $reportPath -Value $report
    Write-ColorOutput "  ✅ Report saved to $reportPath" $Green
}

function Cleanup-TempFiles {
    Write-ColorOutput "🧹 Cleaning up temporary files..." $Cyan
    
    $tempDir = "$ProjectRoot\temp"
    
    if (Test-Path $tempDir) {
        Remove-Item -Path $tempDir -Recurse -Force
        Write-ColorOutput "  ✅ Temporary files cleaned up" $Green
    }
}

# Main execution
Write-ColorOutput "🚀 Starting 3D Models Setup..." $Cyan
Write-ColorOutput "Project Root: $ProjectRoot" $Yellow
Write-ColorOutput "Quality Setting: $Quality" $Yellow

try {
    # Step 1: Check dependencies
    Test-Dependencies
    
    # Step 2: Initialize directories
    Initialize-Directories
    
    # Step 3: Download sample models (unless skipped)
    if (!$OptimizeOnly) {
        Get-SampleModels
    }
    
    # Step 4: Optimize models
    Optimize-Models
    
    # Step 5: Deploy to public directory
    Deploy-Models
    
    # Step 6: Update seed data
    Update-SeedData
    
    # Step 7: Generate report
    Generate-Report
    
    # Step 8: Cleanup (optional)
    # Cleanup-TempFiles
    
    Write-ColorOutput "🎉 3D Models setup completed successfully!" $Green
    Write-ColorOutput "📁 Models are available in: $ProjectRoot\public\models" $Cyan
    Write-ColorOutput "📊 Check the optimization report for details" $Cyan
    
} catch {
    Write-ColorOutput "❌ Setup failed: $($_.Exception.Message)" $Red
    exit 1
}