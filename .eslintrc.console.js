// ESLint configuration to prevent console.log usage
// This can be merged into your main .eslintrc.js file

module.exports = {
  rules: {
    // Prevent console.log in production code
    'no-console': [
      'error',
      {
        allow: [
          'warn', // Allow console.warn for important warnings
          'error', // Allow console.error for critical errors
          'info'   // Allow console.info for important information
        ]
      }
    ],
    
    // Custom rule to suggest using logger instead
    'prefer-logger': 'off' // This would be a custom rule if implemented
  },
  
  // Override for test files - allow console.log in tests
  overrides: [
    {
      files: [
        '**/*.test.js',
        '**/*.test.ts',
        '**/*.spec.js', 
        '**/*.spec.ts',
        '**/test-*.js',
        '**/debug-*.js',
        'test/**/*',
        'tests/**/*',
        '__tests__/**/*'
      ],
      rules: {
        'no-console': 'off' // Allow console.log in test files
      }
    },
    {
      // Allow console.log in development scripts
      files: [
        'scripts/**/*',
        'prisma/seed.ts',
        'prisma/seed.js'
      ],
      rules: {
        'no-console': 'warn' // Warn but don't error in scripts
      }
    }
  ]
};

// Instructions for integration:
// 1. Merge these rules into your existing .eslintrc.js
// 2. Run: npm run lint to check for console.log usage
// 3. Use logger from @/lib/logger instead of console.log
// 4. For legitimate console usage, use console.warn, console.error, or console.info