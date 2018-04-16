const path = require('path')

module.exports = {
    isJs(file) {
        return /\.js$/gi.test(file)
    },

    isScss(file) {
        return /\.scss$/gi.test(file)
    },

    isCss(file) {
        return /\.css$/gi.test(file)
    },

    isFont(file) {
        return /\.(ttf|otf|woff|woff2|eot|svg)$/gi.test(file)
    },

    getFilename(filePath) {
        return path.basename(filePath, path.extname(filePath))
    },

    getScssFileName(filename) {
        return `_${filename}.scss`
    }
}
