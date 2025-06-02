# Deployment Guide - 3D Store

Hướng dẫn triển khai ứng dụng 3D Store lên production mà không sử dụng Docker.

## Tổng quan

Dự án hỗ trợ deployment trên các platform sau:
- **Vercel** (Khuyến nghị)
- **Netlify**
- **Traditional VPS/Server**

## 1. Deployment với Vercel

### Chuẩn bị

1. **Tạo tài khoản Vercel**
   ```bash
   npm install -g vercel
   vercel login
   ```

2. **Cấu hình Environment Variables**
   - Truy cập Vercel Dashboard
   - Thêm các biến môi trường từ `.env.production`

### Deploy

```bash
# Deploy lần đầu
vercel

# Deploy production
npm run deploy:vercel
```

### Cấu hình Database

```bash
# Chạy migrations trên production
vercel env pull .env.local
npx prisma migrate deploy
```

## 2. Deployment với Netlify

### Chuẩn bị

1. **Cài đặt Netlify CLI**
   ```bash
   npm install -g netlify-cli
   netlify login
   ```

2. **Cấu hình Environment Variables**
   - Truy cập Netlify Dashboard
   - Site settings > Environment variables
   - Thêm các biến từ `.env.production`

### Deploy

```bash
# Deploy lần đầu
netlify init

# Deploy production
npm run deploy:netlify
```

## 3. Traditional Server Deployment

### Yêu cầu hệ thống

- Node.js 18+ hoặc 20+
- PostgreSQL 13+
- Redis (optional)
- Nginx (khuyến nghị)
- PM2 (process manager)

### Cài đặt

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd 3d-store
   ```

2. **Cài đặt dependencies**
   ```bash
   npm ci --production
   ```

3. **Cấu hình environment**
   ```bash
   cp .env.production .env.local
   # Chỉnh sửa các giá trị trong .env.local
   ```

4. **Setup database**
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   npm run db:seed
   ```

5. **Build application**
   ```bash
   npm run build
   ```

6. **Cài đặt PM2**
   ```bash
   npm install -g pm2
   ```

7. **Tạo ecosystem file**
   ```javascript
   // ecosystem.config.js
   module.exports = {
     apps: [{
       name: '3d-store',
       script: 'npm',
       args: 'start',
       instances: 'max',
       exec_mode: 'cluster',
       env: {
         NODE_ENV: 'production',
         PORT: 3000
       }
     }]
   }
   ```

8. **Khởi động ứng dụng**
   ```bash
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

### Cấu hình Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Static files caching
    location /_next/static {
        alias /path/to/app/.next/static;
        expires 365d;
        access_log off;
    }
}
```

## 4. CI/CD với GitHub Actions

### Setup

1. **Thêm secrets vào GitHub repository**
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`
   - Các environment variables khác

2. **Workflow tự động**
   - File `.github/workflows/deploy.yml` đã được cấu hình
   - Tự động test và deploy khi push lên main branch
   - Preview deployment cho pull requests

## 5. Environment Variables

### Required Variables

```bash
# Database
DATABASE_URL="postgresql://..."

# Authentication
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-secret"

# OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Payment
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_PUBLISHABLE_KEY="pk_live_..."

# File Upload
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Email
SENDGRID_API_KEY="SG..."

# Security
JWT_SECRET="your-jwt-secret"

# Cache (Optional)
REDIS_URL="redis://..."
```

## 6. Monitoring và Logging

### Vercel Analytics
- Tự động có sẵn với Vercel deployment
- Real-time performance monitoring

### Sentry Error Tracking
```bash
npm install @sentry/nextjs
```

### Custom Logging
- Winston logger đã được cấu hình
- Logs được ghi vào file và console

## 7. Performance Optimization

### CDN
- Vercel/Netlify tự động cung cấp CDN
- Static assets được cache tự động

### Image Optimization
- Next.js Image component
- Cloudinary transformation
- WebP format support

### Caching
- Redis caching cho API responses
- Browser caching headers
- Static generation cho pages

## 8. Security

### Headers
- Security headers đã được cấu hình
- CORS protection
- XSS protection

### Rate Limiting
- API rate limiting
- DDoS protection

### SSL/TLS
- Tự động với Vercel/Netlify
- Let's Encrypt cho traditional servers

## 9. Backup và Recovery

### Database Backup
```bash
# Tự động backup với PostgreSQL
pg_dump $DATABASE_URL > backup.sql
```

### File Backup
- Cloudinary tự động backup files
- Regular database snapshots

## 10. Troubleshooting

### Common Issues

1. **Build Errors**
   ```bash
   npm run type-check
   npm run lint
   ```

2. **Database Connection**
   ```bash
   npx prisma db push
   npx prisma generate
   ```

3. **Environment Variables**
   - Kiểm tra tất cả required variables
   - Verify connection strings

### Logs

```bash
# Vercel logs
vercel logs

# PM2 logs
pm2 logs

# Application logs
tail -f logs/app.log
```

## Support

Nếu gặp vấn đề trong quá trình deployment:
1. Kiểm tra logs
2. Verify environment variables
3. Test locally trước
4. Liên hệ team support