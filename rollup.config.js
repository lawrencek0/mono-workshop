import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';

export default {
  input: 'src/index.js',
  output: {
    file: 'build/bundle.js',
    format: 'cjs'
  },
  plugins: [
    resolve(),
    commonjs({
      include: ['/node_modules/**', './src/index.js']
    }),
    babel({
      exclude: 'node_modules/**'
    })
  ]
};
