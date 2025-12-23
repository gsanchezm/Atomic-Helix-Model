module.exports = {
  default: {
    paths: ['src/slices/**/features/**/*.feature'],
    require: [
      'src/test/world.ts',
      'src/test/hooks.ts',
      'src/slices/**/steps/**/*.ts'
    ],
    requireModule: ['ts-node/register', 'tsconfig-paths/register'],
    format: ['progress-bar', 'json:reports/cucumber-report.json', 'allure-cucumberjs/reporter']
  }
};
