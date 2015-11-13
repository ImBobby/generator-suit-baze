var generators      = require('yeoman-generator'),
    updateNotifier  = require('update-notifier'),
    pkg             = require('../../package.json'),
    jsonPretty      = require('json-pretty'),
    fs              = require('fs');

var choices = [
    'boilerplate',
    'slick-carousel',
    'font-awesome',
    'fitvids',
    'exit'
];

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
            choices: choices
        }, function (answers) {
            this.answers = answers.options;
            done();
        }.bind(this));
    },

    write: function () {
        var options = {
            boilerplate: boilerplate,
            slickcarousel: slickCarousel,
            fontawesome: fontAwesome,
            fitvids: fitvids,
            exit: function () {}
        };

        function boilerplate() {
            this.fs.copy(
                this.templatePath('boilerplate/**/*'),
                this.destinationPath('./')
            );

            this.fs.copy(
                this.templatePath('_gitignore'),
                this.destinationPath('./.gitignore')
            );
        }

        function slickCarousel() {
            this.fs.copy(
                this.templatePath('slick-carousel/slick.js'),
                this.destinationPath('./dev/js/vendor/slick.js')
            );

            this.fs.copy(
                this.templatePath('slick-carousel/_slick.scss'),
                this.destinationPath('./dev/sass/plugin/_slick.scss')
            );

            updateBower.bind(this)('slick-carousel', '~1.5.8');
        }

        function fontAwesome() {
            this.fs.copy(
                this.templatePath('font-awesome/fonts/*'),
                this.destinationPath('./dev/fonts/')
            );

            this.fs.copy(
                this.templatePath('font-awesome/_font-awesome.scss'),
                this.destinationPath('./dev/sass/plugin/_font-awesome.scss')
            );

            updateBower.bind(this)('font-awesome', 'fontawesome#~4.4.0');
        }

        function fitvids() {
            this.fs.copy(
                this.templatePath('fitvids/*'),
                this.destinationPath('./dev/js/vendor/')
            );

            updateBower.bind(this)('jquery.fitvids', 'fitvids#~1.1.0');
        }

        function updateBower(name, version) {
            var _this = this;
            var bowerJson = this.destinationPath('./bower.json');

            fs.readFile(bowerJson, function (err, data) {
                if (err) throw err;

                var json = JSON.parse(data);

                json.dependencies[name] = version;

                fs.writeFile(bowerJson, JSON.stringify(json), function (err) {
                    if (err) throw err;

                    beautifyBowerJson.bind(_this)();
                });
            });
        }

        function beautifyBowerJson() {
            var file = this.destinationPath('./bower.json');

            fs.readFile(file, function (err, data) {
                if ( err ) throw err;

                fs.writeFile(file, jsonPretty(JSON.parse(data)), function (error) {
                    if ( error ) throw error;
                });
            });
        }

        var func = options[this.answers.replace('-', '')];

        func.bind(this)();
    }
});
