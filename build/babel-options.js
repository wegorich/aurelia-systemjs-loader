var path = require('path');

module.exports = function() {
    return {
        filename: '',
        filenameRelative: '',
        sourceMap: true,
        sourceRoot: '',
        moduleRoot: path.resolve('src').replace(/\\/g, '/'),
        moduleIds: false,
        comments: false,
        compact: false,
        code: true,
        presets: [
            ["env", {
                "targets": {
                    "browsers": ["last 2 Chrome versions"]
                }
            }]
        ],
        plugins: [
            'syntax-flow',
            'transform-class-properties',
            'transform-decorators-legacy',
            'transform-flow-strip-types',
            'syntax-object-rest-spread',
            'transform-object-rest-spread'
        ]
    };
};
