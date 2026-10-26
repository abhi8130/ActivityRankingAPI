module.exports = {
  default: {
    formatOptions: { snippetInterface: 'async-await' },
    paths: ['features/**/*.feature'],
    require: ['src/step-definitions/**/*.ts'],
    requireModule: ['tsx/cjs'],
    format: ['progress', 'html:reports/cucumber-report.html','json:reports/cucumber-report.json'],
    timeout: 20000
  }
};
