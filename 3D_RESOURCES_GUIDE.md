# 🎨 HƯỚNG DẪN NGUỒN VÀ TỐI ƯU HÓA 3D MODELS

> **Mục đích:** Cung cấp danh sách nguồn 3D models chất lượng cao và hướng dẫn tối ưu hóa  
> **Cập nhật:** 31/05/2025

---

## 🌟 **NGUỒN 3D MODELS MIỄN PHÍ CHẤT LƯỢNG CAO**

### **1. Sketchfab (sketchfab.com)**
- **Ưu điểm:** Cộng đồng lớn, models chất lượng cao, có filter CC0
- **Định dạng:** GLB, GLTF, OBJ, FBX
- **Phù hợp:** Furniture, electronics, characters
- **Cách tải:** Search → Filter "Downloadable" + "CC0" → Download

### **2. Poly Haven (polyhaven.com)**
- **Ưu điểm:** CC0 license, PBR materials, HDRIs
- **Định dạng:** GLB, GLTF, Blend
- **Phù hợp:** Props, environments, materials
- **Đặc biệt:** Có cả HDR environments cho lighting

### **3. Kenney Assets (kenney.nl)**
- **Ưu điểm:** Low-poly style, game-ready, CC0
- **Định dạng:** GLB, OBJ
- **Phù hợp:** Stylized objects, game assets
- **Style:** Clean, minimalist, perfect cho e-commerce

### **4. Quaternius (quaternius.com)**
- **Ưu điểm:** Consistent style, optimized cho games
- **Định dạng:** GLB, FBX
- **Phù hợp:** Characters, props, environments
- **License:** CC0

### **5. Free3D (free3d.com)**
- **Ưu điểm:** Variety lớn, nhiều categories
- **Định dạng:** Multiple formats
- **Phù hợp:** Mixed quality, cần filter kỹ
- **Lưu ý:** Check license carefully

### **6. TurboSquid Free (turbosquid.com)**
- **Ưu điểm:** Professional quality
- **Định dạng:** Multiple formats
- **Phù hợp:** High-end models
- **Lưu ý:** Limited free models, mostly paid

---

## 🛠️ **CÔNG CỤ TỐI ƯU HÓA 3D MODELS**

### **1. Blender (Miễn phí)**
```bash
# Cài đặt Blender
# Download từ blender.org
# Hoặc qua Microsoft Store
winget install BlenderFoundation.Blender
```

**Workflow tối ưu hóa trong Blender:**
1. **Import model** → File → Import
2. **Reduce polygons** → Modifier → Decimate
3. **Optimize textures** → Shader Editor → Resize textures
4. **Export GLB** → File → Export → glTF 2.0

### **2. gltf-pipeline (Command line)**
```bash
# Cài đặt
npm install -g gltf-pipeline

# Optimize GLB file
gltf-pipeline -i input.glb -o output.glb --draco.compressionLevel 10

# Convert formats
gltf-pipeline -i model.gltf -o model.glb
```

### **3. Draco Compression**
```bash
# Cài đặt Draco tools
npm install -g draco3d

# Compress geometry
draco_encoder -i input.ply -o output.drc
```

---

## 📏 **TIÊU CHUẨN TỐI ƯU HÓA CHO WEB**

### **File Size Guidelines:**
- **Mobile:** < 2MB per model
- **Desktop:** < 5MB per model
- **Hero models:** < 10MB (trang chủ, featured)

### **Polygon Count:**
- **Low detail:** 1K - 5K triangles
- **Medium detail:** 5K - 15K triangles
- **High detail:** 15K - 50K triangles
- **Hero models:** 50K+ triangles (limited use)

### **Texture Optimization:**
```javascript
// Recommended texture sizes
const textureSizes = {
  mobile: {
    diffuse: '512x512',
    normal: '512x512',
    roughness: '256x256'
  },
  desktop: {
    diffuse: '1024x1024',
    normal: '1024x1024', 
    roughness: '512x512'
  }
}
```

---

## 🎯 **DANH SÁCH MODELS ƯU TIÊN CHO E-COMMERCE**

### **Furniture Category:**
- [ ] Modern chair (office/dining)
- [ ] Coffee table
- [ ] Sofa/couch
- [ ] Bookshelf
- [ ] Desk lamp

### **Electronics Category:**
- [ ] Smartphone
- [ ] Laptop
- [ ] Headphones
- [ ] Smart watch
- [ ] Tablet

### **Fashion & Accessories:**
- [ ] Handbag
- [ ] Sunglasses
- [ ] Watch
- [ ] Shoes (sneakers)
- [ ] Backpack

### **Home & Decor:**
- [ ] Vase
- [ ] Picture frame
- [ ] Candle
- [ ] Plant pot
- [ ] Mirror

---

## 🔧 **AUTOMATION SCRIPTS**

### **Batch Optimization Script (PowerShell):**
```powershell
# optimize-models.ps1
param(
    [string]$InputDir = "./raw-models",
    [string]$OutputDir = "./optimized-models"
)

# Tạo output directory
New-Item -ItemType Directory -Force -Path $OutputDir

# Process tất cả GLB files
Get-ChildItem -Path $InputDir -Filter "*.glb" | ForEach-Object {
    $inputFile = $_.FullName
    $outputFile = Join-Path $OutputDir $_.Name
    
    Write-Host "Optimizing: $($_.Name)"
    
    # Optimize với gltf-pipeline
    gltf-pipeline -i $inputFile -o $outputFile --draco.compressionLevel 7
    
    # Check file size
    $originalSize = (Get-Item $inputFile).Length / 1MB
    $optimizedSize = (Get-Item $outputFile).Length / 1MB
    $reduction = [math]::Round((($originalSize - $optimizedSize) / $originalSize) * 100, 2)
    
    Write-Host "  Original: $([math]::Round($originalSize, 2))MB"
    Write-Host "  Optimized: $([math]::Round($optimizedSize, 2))MB"
    Write-Host "  Reduction: $reduction%"
    Write-Host ""
}

Write-Host "Optimization complete!"
```

### **Model Validation Script:**
```javascript
// validate-models.js
const fs = require('fs')
const path = require('path')

const validateModel = (filePath) => {
  const stats = fs.statSync(filePath)
  const sizeInMB = stats.size / (1024 * 1024)
  
  const validation = {
    file: path.basename(filePath),
    size: `${sizeInMB.toFixed(2)}MB`,
    valid: sizeInMB < 5, // 5MB limit
    warnings: []
  }
  
  if (sizeInMB > 5) {
    validation.warnings.push('File size exceeds 5MB limit')
  }
  
  if (sizeInMB > 2 && sizeInMB <= 5) {
    validation.warnings.push('Consider further optimization for mobile')
  }
  
  return validation
}

// Validate all models in directory
const modelsDir = './public/models'
const models = fs.readdirSync(modelsDir)
  .filter(file => file.endsWith('.glb'))
  .map(file => validateModel(path.join(modelsDir, file)))

console.table(models)
```

---

## 📱 **MOBILE OPTIMIZATION**

### **Adaptive Loading Strategy:**
```typescript
// hooks/useAdaptiveModel.ts
export const useAdaptiveModel = (modelUrls: {
  mobile: string
  desktop: string
  high: string
}) => {
  const [modelUrl, setModelUrl] = useState('')
  
  useEffect(() => {
    const isMobile = window.innerWidth < 768
    const isLowEnd = navigator.hardwareConcurrency < 4
    const isSlowConnection = navigator.connection?.effectiveType === '2g'
    
    if (isMobile || isLowEnd || isSlowConnection) {
      setModelUrl(modelUrls.mobile)
    } else if (window.innerWidth < 1200) {
      setModelUrl(modelUrls.desktop)
    } else {
      setModelUrl(modelUrls.high)
    }
  }, [])
  
  return modelUrl
}
```

### **Progressive Loading:**
```typescript
// Progressive model loading
const useProgressiveModel = (baseUrl: string) => {
  const [currentModel, setCurrentModel] = useState('')
  const [isUpgrading, setIsUpgrading] = useState(false)
  
  useEffect(() => {
    // Load low-res first
    setCurrentModel(`${baseUrl}_low.glb`)
    
    // Then upgrade to high-res
    setTimeout(() => {
      setIsUpgrading(true)
      setCurrentModel(`${baseUrl}_high.glb`)
    }, 1000)
  }, [baseUrl])
  
  return { currentModel, isUpgrading }
}
```

---

## 🎨 **STYLE GUIDELINES**

### **Consistent Visual Style:**
- **Lighting:** Neutral, soft lighting
- **Materials:** PBR materials với realistic properties
- **Colors:** Consistent color palette
- **Scale:** Real-world proportions

### **Naming Convention:**
```
product-category-name-quality.glb

Examples:
furniture-chair-office-low.glb
electronics-phone-iphone-medium.glb
fashion-bag-handbag-high.glb
```

---

## 📊 **PERFORMANCE MONITORING**

### **Key Metrics to Track:**
- Model loading time
- Memory usage
- FPS during interaction
- User engagement với 3D features
- Conversion rates: 3D view → purchase

### **Monitoring Setup:**
```typescript
// Performance tracking
const trackModelPerformance = (modelName: string) => {
  const startTime = performance.now()
  
  return {
    onLoad: () => {
      const loadTime = performance.now() - startTime
      analytics.track('3D_Model_Loaded', {
        model: modelName,
        loadTime: loadTime,
        device: isMobile ? 'mobile' : 'desktop'
      })
    },
    onError: (error: Error) => {
      analytics.track('3D_Model_Error', {
        model: modelName,
        error: error.message
      })
    }
  }
}
```

---

**📅 Last Updated:** 31/05/2025  
**🎯 Purpose:** 3D Model Resource Management  
**👤 Maintainer:** Development Team

> **Lưu ý:** Luôn kiểm tra license trước khi sử dụng models trong commercial projects. Ưu tiên CC0 hoặc royalty-free licenses.