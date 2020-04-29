const path = require('path')
function resolve(dir) {
  return path.join(__dirname, dir)
}

/**
 * @typedef { import("@vue/cli-service").ProjectOptions } Options
 * @typedef { import("webpack-chain") } ChainWebpack
 */


/**
 * @type { Options }
 */
module.exports = {

  css: {
    sourceMap: true
  },
  filenameHashing:     true,
  productionSourceMap: false,
  runtimeCompiler:     true,


  configureWebpack: config => {

    /**
     * Copy datasets directory into build
     */
    const CopyWebpackPlugin = require('copy-webpack-plugin')
    config.plugins.push(
      new CopyWebpackPlugin([
        {
          from:   resolve('static'),
          ignore: ['.*'],
          to:     'static'
        }
      ])
    )
    if(process.env.NODE_ENV === 'production') {

      const CompressionPlugin = require('compression-webpack-plugin')
      config.plugins.push(
        new CompressionPlugin()
      )

      const TerserPlugin = require('terser-webpack-plugin')
      config.optimization.minimizer.push(
        new TerserPlugin({
          terserOptions: {
            compress: {
              // drop_console:  true,
              dead_code:     true,
              drop_debugger: true,
              unused:        true,
              passes:        4
            }
          }
        })
      )

    }
  }

}
