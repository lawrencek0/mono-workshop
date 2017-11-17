import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';

export default {
  input: 'src/index.js',
  output: {
    file: 'build/bundle.js',
    format: 'cjs'
  },
  external: ['preferences', 'chalk', 'figlet', 'inquirer'],
  plugins: [
    resolve({ jsnext: true }),
    commonjs({
      include: ['/node_modules/**']
    })
  ]
};
