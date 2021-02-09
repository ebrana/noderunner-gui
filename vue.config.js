// vue.config.js
module.exports = {
    configureWebpack: {
        devtool: (process.env.NODE_ENV === 'development') ? 'inline-source-map' : false,
        mode: process.env.NODE_ENV,
        performance: {
            hints: (process.env.NODE_ENV === 'development') ? true : false
        },
        optimization: {
            splitChunks: {
                minSize: 10000,
                maxSize: 250000,
            }
        }
    }
}