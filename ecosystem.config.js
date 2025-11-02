require('dotenv').config();

module.exports = {
  apps: [
    {
      name: process.env.APP_NAME || 'niddify-nestjs-api',
      script: 'dist/main.js',
      exec_mode: 'fork',
      watch: false,
      env_file: '.env',
      env: {
        NODE_ENV: process.env.NODE_ENV || 'development',
        PORT: process.env.PORT || 3000,
      },
    },
  ],
};
