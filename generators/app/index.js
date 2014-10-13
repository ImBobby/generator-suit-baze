var yeoman          = require('yeoman-generator'),
    file            = require('yeoman-generator').file,
    updateNotifier  = require('../../update-notifier'),
    pkg             = require('../../package.json');

// Path config
var endPath = '_front-end/';
var Path = {

    sass: {
        root    : 'dev/sass/',
        mixin   : 'dev/sass/mixin/',
        modules : 'dev/sass/modules/',
        partial : 'dev/sass/partial/',
        plugin  : 'dev/sass/plugin/'
    },

    js: {
        root    : 'dev/js/',
        vendor  : 'dev/js/vendor/'
    },

    img: {
        root    : 'dev/img/',
        webp    : 'dev/img/webp/'
    }

};

var SuitBaze = module.exports = yeoman.generators.Base.extend({

    initializing: {

        checkUpdate: function () {
            var options = {
                packageName         : pkg.name,
                packageVersion      : pkg.version,
                updateCheckInterval : 1000 * 60 * 60 * 24
            };

            var notifier = updateNotifier(options);

            if ( notifier.update ) {
                notifier.notify();
            }
        }

    },

    default: {

        copyFiles: function () {

            // .gitignore
            this.src.copy('_gitignore'  , '.gitignore');

            // Copy files
            this.src.copy('home.html'   , 'home.html');
            this.src.copy('gulpfile.js' , 'gulpfile.js');
            this.src.copy('package.json', 'package.json');
            this.src.copy('bower.json'  , 'bower.json');

            // ---------- Copy SCSS Files ---------- //
            // main
            this.src.copy( Path.sass.root + 'main.scss'             , Path.sass.root + 'main.scss' );

            // mixins
            this.src.copy( Path.sass.mixin + '_brandscolor.scss'    , Path.sass.mixin + '_brandscolor.scss' );
            this.src.copy( Path.sass.mixin + '_mixin.scss'          , Path.sass.mixin + '_mixin.scss' );
            this.src.copy( Path.sass.mixin + '_mq.scss'             , Path.sass.mixin + '_mq.scss' );

            // modules
            this.src.copy( Path.sass.modules + '_baze-grid.scss'    , Path.sass.modules + '_baze-grid.scss' );
            this.src.copy( Path.sass.modules + '_breadcrumb.scss'   , Path.sass.modules + '_breadcrumb.scss' );
            this.src.copy( Path.sass.modules + '_buttons.scss'      , Path.sass.modules + '_buttons.scss' );
            this.src.copy( Path.sass.modules + '_forms.scss'        , Path.sass.modules + '_forms.scss' );
            this.src.copy( Path.sass.modules + '_modules.scss'      , Path.sass.modules + '_modules.scss' );
            this.src.copy( Path.sass.modules + '_table.scss'        , Path.sass.modules + '_table.scss' );
            this.src.copy( Path.sass.modules + '_typography.scss'   , Path.sass.modules + '_typography.scss' );
            this.src.copy( Path.sass.modules + '_pagination.scss'   , Path.sass.modules + '_pagination.scss' );
            this.src.copy( Path.sass.modules + '_media.scss'        , Path.sass.modules + '_media.scss' );

            // partial
            this.src.copy( Path.sass.partial + '_helpers.scss'      , Path.sass.partial + '_helpers.scss' );
            this.src.copy( Path.sass.partial + '_normalize.scss'    , Path.sass.partial + '_normalize.scss' );
            this.src.copy( Path.sass.partial + '_print.scss'        , Path.sass.partial + '_print.scss' );
            this.src.copy( Path.sass.partial + '_resets.scss'       , Path.sass.partial + '_resets.scss' );
            this.src.copy( Path.sass.partial + '_variables.scss'    , Path.sass.partial + '_variables.scss' );

            // plugin
            this.src.copy( Path.sass.plugin + '_plugin.scss'        , Path.sass.plugin + '_plugin.scss' );


            // ---------- Copy JS Files ---------- //
            // main
            this.src.copy( Path.js.root + 'main.js'         , Path.js.root + 'main.js' );

            // vendor
            this.src.copy( Path.js.vendor + 'fastclick.js'  , Path.js.vendor + 'fastclick.js' );
            this.src.copy( Path.js.vendor + 'jquery.js'     , Path.js.vendor + 'jquery.js' );
            this.src.copy( Path.js.vendor + 'modernizr.js'  , Path.js.vendor + 'modernizr.js' );


            // ---------- Copy images Files ---------- //
            this.src.copy( Path.img.root + 'apple-icon.png' , Path.img.root + 'apple-icon.png' );
            this.src.copy( Path.img.root + 'favicon.png'    , Path.img.root + 'favicon.png' );
        }
        
    },

    install: {

        installDep: function () {
            this.installDependencies();
        }

    }


});