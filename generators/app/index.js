var generators      = require('yeoman-generator'),
    updateNotifier  = require('update-notifier'),
    pkg             = require('../../package.json'),
    jsonFile        = require('json-file'),
    jsonPretty      = require('json-pretty'),
    fs              = require('fs');

module.exports = generators.Base.extend({
    initializing: {
        checkUpdate: function () {
            updateNotifier({pkg: pkg}).notify();
        }
    },

    prompting: function () {
        var done = this.async();

        this.prompt({
            type: 'list',
            name: 'options',
            message: 'What can I do for you?',
            choices: ['boilerplate', 'slick-carousel', 'font-awesome', 'exit']
        }, function (answers) {
            this.answers = answers.options;
            done();
        }.bind(this));
    },

    write: function () {
        var _this = this;

        var options = {
            boilerplate: boilerplate,
            slickcarousel: slickCarousel,
            fontawesome: fontAwesome,
            exit: function () {}
        };

        function boilerplate() {
            _this.fs.copy(
                _this.templatePath('boilerplate/**/*'),
                _this.destinationPath('./')
            );

            _this.fs.copy(
                _this.templatePath('_gitignore'),
                _this.destinationPath('./.gitignore')
            );
        }

        function slickCarousel() {
            _this.fs.copy(
                _this.templatePath('slick-carousel/slick.js'),
                _this.destinationPath('./dev/js/vendor/slick.js')
            );

            _this.fs.copy(
                _this.templatePath('slick-carousel/_slick.scss'),
                _this.destinationPath('./dev/sass/plugin/_slick.scss')
            );

            var bowerJson = jsonFile.read(_this.destinationPath('./bower.json'));

            bowerJson.set('dependencies.slick-carousel', '~1.5.8');
            bowerJson.writeSync();

            beautifyBowerJson();
        }

        function fontAwesome() {
            _this.fs.copy(
                _this.templatePath('font-awesome/fonts/*'),
                _this.destinationPath('./dev/fonts/')
            );

            _this.fs.copy(
                _this.templatePath('font-awesome/_font-awesome.scss'),
                _this.destinationPath('./dev/sass/plugin/_font-awesome.scss')
            );

            var bowerJson = jsonFile.read(_this.destinationPath('./bower.json'));

            bowerJson.set('dependencies.font-awesome', 'fontawesome#~4.4.0');
            bowerJson.writeSync();

            beautifyBowerJson();
        }

        function beautifyBowerJson() {
            var file = _this.destinationPath('./bower.json');

            fs.readFile(file, function (err, data) {
                if ( err ) throw err;

                fs.writeFile(file, jsonPretty(JSON.parse(data)), function (error) {
                    if ( error ) throw error;
                });
            });
        }

        var func = options[_this.answers.replace('-', '')];

        func();
    }
});
