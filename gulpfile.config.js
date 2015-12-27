'use strict';
var GulpConfig = (function () {
    function gulpConfig() {
        this.source = './src/';
        this.allTypeScript = this.source + 'ts/**/*.ts';
        this.allSCSS = this.source + 'scss/**/*.scss';

        this.output = './web/';
        this.outputCssPath = this.output + 'css';
        this.outputJsPath = this.output + 'js';
        this.outputJsBundleFile = 'bundle.js';

        this.typings = './tools/typings/';
        this.libraryTypeScriptDefinitions = this.typings + '**/*.ts';
        this.appTypeScriptReferences = this.typings + 'app.d.ts';
    }
    return gulpConfig;
})();
module.exports = GulpConfig;