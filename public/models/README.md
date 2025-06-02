# 3D Models Directory

This directory contains 3D model files for the application.

## Supported Formats
- GLB (recommended for web)
- GLTF
- FBX
- OBJ

## File Organization
```
models/
├── architecture/
│   ├── modern-villa.glb
│   ├── office-building.glb
│   └── apartment-complex.glb
├── furniture/
│   ├── modern-chair.glb
│   ├── dining-table.glb
│   └── sofa-set.glb
├── vehicles/
│   ├── sports-car.glb
│   ├── motorcycle.glb
│   └── truck.glb
└── electronics/
    ├── smartphone.glb
    ├── laptop.glb
    └── headphones.glb
```

## Optimization Guidelines

### File Size
- Keep models under 10MB for web performance
- Use DRACO compression for large models
- Optimize textures (max 2048x2048 for most cases)

### Geometry
- Target 5,000-50,000 triangles for most models
- Use LOD (Level of Detail) for complex models
- Remove unnecessary vertices and faces

### Textures
- Use power-of-2 dimensions (512, 1024, 2048)
- Combine multiple textures when possible
- Use appropriate formats (JPEG for diffuse, PNG for alpha)

### Materials
- Limit number of materials per model
- Use PBR (Physically Based Rendering) workflow
- Include normal maps for detail

## Testing Models

For development and testing, you can use free models from:
- [Sketchfab](https://sketchfab.com/3d-models?features=downloadable&sort_by=-likeCount)
- [Poly Haven](https://polyhaven.com/models)
- [Kenney Assets](https://kenney.nl/assets)
- [Mixamo](https://www.mixamo.com/) (for characters)

## Model Attribution

When using third-party models, ensure proper attribution:
```
// Example attribution in model metadata
{
  "title": "Modern Villa",
  "author": "Artist Name",
  "license": "CC BY 4.0",
  "source": "https://example.com/model"
}
```

## Performance Tips

1. **Progressive Loading**: Load low-res version first, then high-res
2. **Instancing**: Reuse models for multiple objects
3. **Culling**: Hide models outside camera view
4. **Caching**: Cache loaded models in memory
5. **Compression**: Use DRACO for geometry compression

## Troubleshooting

### Common Issues
- **Model not loading**: Check file path and format
- **Poor performance**: Reduce polygon count or texture size
- **Missing textures**: Ensure texture files are included
- **Wrong scale**: Adjust model scale in 3D software

### Browser Compatibility
- WebGL 2.0 required for advanced features
- DRACO compression needs decoder files
- Some mobile devices have memory limitations