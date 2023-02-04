const path = require('path');

module.exports = {
    entry: './ts-compiled/main.js',
    watch: true,
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js',
    },
};