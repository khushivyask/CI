module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      jasmine: {
        random: true
      },
      clearContext: false
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/ecommerce-frontend'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' },
        { type: 'lcovonly' }
      ]
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['ChromeHeadless'],       // ← use ChromeHeadless directly
    flags: [
      '--no-sandbox',
      '--disable-gpu',
      '--disable-web-security',
      '--disable-dev-shm-usage'         // ← important for CI environments
    ],
    singleRun: true,
    restartOnFileChange: false
  });
};