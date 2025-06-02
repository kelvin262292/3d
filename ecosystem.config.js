module.exports = {
  apps: [
    {
      name: '3d-store',
      script: 'npm',
      args: 'start',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      env_staging: {
        NODE_ENV: 'staging',
        PORT: 3001
      },
      // Logging
      log_file: './logs/combined.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Restart policy
      restart_delay: 4000,
      max_restarts: 10,
      min_uptime: '10s',
      
      // Memory management
      max_memory_restart: '1G',
      
      // Health monitoring
      health_check_grace_period: 3000,
      health_check_fatal_exceptions: true,
      
      // Auto restart on file changes (development only)
      watch: false,
      ignore_watch: ['node_modules', 'logs', '.next'],
      
      // Environment variables
      env_file: '.env.local'
    }
  ],
  
  deploy: {
    production: {
      user: 'deploy',
      host: 'your-server.com',
      ref: 'origin/main',
      repo: 'git@github.com:your-username/3d-store.git',
      path: '/var/www/3d-store',
      'pre-deploy-local': '',
      'post-deploy': 'npm ci && npm run build && npx prisma migrate deploy && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    },
    staging: {
      user: 'deploy',
      host: 'staging-server.com',
      ref: 'origin/develop',
      repo: 'git@github.com:your-username/3d-store.git',
      path: '/var/www/3d-store-staging',
      'pre-deploy-local': '',
      'post-deploy': 'npm ci && npm run build && npx prisma migrate deploy && pm2 reload ecosystem.config.js --env staging',
      'pre-setup': ''
    }
  }
};