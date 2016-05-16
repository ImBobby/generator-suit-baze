var path = require('path');

module.exports = {
    isJs: function (file) {
        return /\.js$/gi.test(file);
    },

    isScss: function (file) {
        return /\.scss$/gi.test(file);
    },

    isCss: function (file) {
        return /\.css$/gi.test(file);
    },

    isFont: function (file) {
        return /\.(ttf|otf|woff|woff2|eot)$/gi.test(file);
    },

    getFilename: function (filePath) {
        return path.basename(filePath, path.extname(filePath));
    }
};
