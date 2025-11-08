module.exports = {
  root: true,
  extends: ['turbo', 'plugin:@typescript-eslint/recommended', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: [
      './apps/*/tsconfig.json',
      './packages/*/tsconfig.json',
      './tests/*/tsconfig.json'
    ],
    tsconfigRootDir: __dirname
  },
  plugins: ['@typescript-eslint'],
  ignorePatterns: ['dist', 'build', 'storybook-static', 'coverage', 'node_modules']
};

