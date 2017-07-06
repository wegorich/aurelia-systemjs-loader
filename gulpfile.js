// all gulp tasks are located in the ./build/tasks directory
// gulp configuration is in files in ./build directory
require('babel-core/register');
require('require-dir')('build/tasks');