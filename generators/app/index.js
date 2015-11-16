var generators      = require('yeoman-generator'),
    updateNotifier  = require('update-notifier'),
    pkg             = require('../../package.json'),
    jsonPretty      = require('json-pretty'),
    fs              = require('fs');

module.exports = generators.Base.extend({
    initializing: {
        checkUpdate: function () {
            updateNotifier({pkg: pkg}).notify();
        },

        getDirectoryList: function () {
            this.choices = [];

            var list = fs.readdirSync(this.templatePath('./'));

            list.forEach( function (value, index) {
                var path = fs.lstatSync(this.templatePath('./' + value));

                if ( path.isDirectory() ) {
                    this.choices.push(value);
                }
            }.bind(this));

            this.choices.push('exit');
        }
    },

    prompting: function () {
        var done = this.async();

        this.prompt({
            type: 'list',
            name: 'options',
            message: 'What can I do for you?',
            choices: this.choices
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
                this.templatePath(this.answers + '/**/*'),
                this.destinationPath('./')
            );

            this.fs.copy(
                this.templatePath('_gitignore'),
                this.destinationPath('./.gitignore')
            );
        }

        function slickCarousel() {
            this.fs.copy(
                this.templatePath(this.answers + '/slick.js'),
                this.destinationPath('./dev/js/vendor/slick.js')
            );

            this.fs.copy(
                this.templatePath(this.answers + '/_slick.scss'),
                this.destinationPath('./dev/sass/plugin/_slick.scss')
            );

            updateBower.bind(this)('slick-carousel', '~1.5.8');
        }

        function fontAwesome() {
            this.fs.copy(
                this.templatePath(this.answers + '/fonts/*'),
                this.destinationPath('./dev/fonts/')
            );

            this.fs.copy(
                this.templatePath(this.answers + '/_font-awesome.scss'),
                this.destinationPath('./dev/sass/plugin/_font-awesome.scss')
            );

            updateBower.bind(this)('font-awesome', 'fontawesome#~4.4.0');
        }

        function fitvids() {
            this.fs.copy(
                this.templatePath(this.answers + '/*'),
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
