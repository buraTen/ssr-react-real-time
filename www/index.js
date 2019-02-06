const path = require('path');
require('css-modules-require-hook')({
  generateScopedName: '[hash:base64:5]',
  rootDir: path.join(__dirname, 'src'),
  extensions: [ '.scss', '.css' ]
});
require("@babel/polyfill");
require('@babel/register');
require('./src/server');