module.exports = {
  projects: [
    {
      name: 'Admin Flow',
      testMatch: '**/admin-flow/**/*.spec.ts',
      use: {
        baseURL: 'http://localhost:3000/admin',
        storageState: 'playwright/.auth/admin.json',
        viewport: { width: 1920, height: 1080 }
      }
    },
    {
      name: 'User Flow',
      testMatch: '**/user-flow/**/*.spec.ts',
      use: {
        baseURL: 'http://localhost:3000',
        viewport: { width: 1280, height: 720 }
      }
    }
  ],
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report' }]
  ],
  timeout: 60000
};
