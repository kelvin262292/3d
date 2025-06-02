module.exports = {
  // Cấu hình cơ bản
  projectName: 'my-v0-project',
  
  // Cấu hình cho các công cụ
  tools: {
    // Cấu hình cho công cụ kiểm thử
    testing: {
      framework: 'playwright',
      configFile: 'playwright.config.ts'
    },
    
    // Cấu hình cho công cụ linting
    linting: {
      framework: 'eslint',
      configFile: '.eslintrc.json'
    },
    
    // Cấu hình cho công cụ type checking
    typeChecking: {
      framework: 'typescript',
      configFile: 'tsconfig.json'
    }
  },
  
  // Cấu hình cho các script
  scripts: {
    test: 'playwright test',
    lint: 'next lint',
    build: 'next build',
    dev: 'next dev'
  }
} 