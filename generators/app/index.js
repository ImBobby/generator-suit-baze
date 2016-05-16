var generators      = require('yeoman-generator');
var updateNotifier  = require('update-notifier');
var pkg             = require('../../package.json');
var jsonPretty      = require('json-pretty');
var fs              = require('fs');
var helper          = require('./helper.js');
var inquirer        = require('inquirer');
var chalk           = require('chalk');
var clear           = require('clear');
var plugins         = require('./assets.json').data;
var download        = require('download');
var fileName        = require('file-name');

var paths = {
    js: './dev/js/vendor/',
    scss: './dev/sass/plugin/',
    font: './dev/fonts/'
};

var separator = ' —';

var msgs = {
    boilerplate: 'Boilerplate may have been installed.',
    bower: 'bower.json is not exist. Install boilerplate first.',
    downloading: 'Downloading asset(s) from cdn...',
    created: 'asset will be created in '
};

module.exports = generators.Base.extend({
    initializing: {
        checkUpdate: function () {
            updateNotifier({pkg: pkg}).notify();
        },

        showCurrentVersion: function () {
            clear();
            console.log('\n');
            console.log(chalk.black.bgYellow.underline(' You are running ' + pkg.name + ' version ' + pkg.version + ' '));
            console.log(chalk.black.bgYellow.underline(' Ecmascript 6 version \n'));
        },

        buildMenuList: function () {
            this.choices = [];
            this.choices.push('boilerplate');

            plugins.forEach( function (plugin, index) {
                this.choices.push(plugin.name + separator + chalk.underline(plugin.url));
            }.bind(this));

            this.choices.push(new inquirer.Separator());
            this.choices.push('exit');
            this.choices.push(new inquirer.Separator());
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
        if ( this.answers === 'exit' ) {
            process.exit(1);
        }

        var answer = this.answers;
        var bowerJson = this.destinationPath('./bower.json');

        var choice = plugins.filter( function (plugin) {
            return plugin.name === answer.split(separator)[0];
        })[0];

        if ( answer === 'boilerplate' ) {
            try {
                fs.openSync(bowerJson, 'r');
                console.log(msgs.boilerplate);
                process.exit(1);
            } catch (e) {
                boilerplate.bind(this)();
            }
        } else {
            try {
                fs.openSync(bowerJson, 'r');
            } catch(e) {
                console.log(msgs.bower);
                process.exit(1);
            }

            console.log(msgs.downloading);

            choice.assets.forEach(function (asset, index) {
                if (helper.isJs(asset)) {
                    new download()
                        .get(asset)
                        .dest(this.destinationPath(paths.js))
                        .run();

                    logDownloadedAsset(paths.js);
                } else if (helper.isCss(asset)) {
                    var filename = fileName(asset);

                    new download()
                        .get(asset)
                        .rename(getScssFileName(filename))
                        .dest(this.destinationPath(paths.scss))
                        .run();

                    logDownloadedAsset(paths.scss);
                } else if (helper.isFont(asset)) {
                    new download()
                        .get(asset)
                        .dest(this.destinationPath(paths.font))
                        .run();

                    logDownloadedAsset(paths.font);
                }
            }.bind(this));

            updateBower.bind(this)(choice.registryName, choice.version);
        }

        function boilerplate() {
            this.fs.copy(
                this.templatePath(answer + '/**/*'),
                this.destinationPath('./')
            );

            this.fs.copy(
                this.templatePath('_gitignore'),
                this.destinationPath('./.gitignore')
            );
        }

        function getScssFileName(name) {
            return '_' + name + '.scss';
        }

        function logDownloadedAsset(path) {
            console.log(chalk.green(msgs.created) + path);
        }

        function copyAssets(file, destination) {
            this.fs.copy(
                this.templatePath(answer + '/' + file),
                this.destinationPath(destination + file)
            );
        }

        function updateBower(name, version) {
            var _this = this;
            var bowerJson = this.destinationPath('./bower.json');

            fs.readFile(bowerJson, function (err, data) {
                if ( err ) throw err;

                var json = JSON.parse(data);

                json.dependencies[name] = version;

                fs.writeFile(bowerJson, JSON.stringify(json), function (err) {
                    if ( err ) throw err;

                    beautifyBowerJson(bowerJson);
                });
            });
        }

        function beautifyBowerJson(bowerJson) {
            fs.readFile(bowerJson, function (err, data) {
                if ( err ) throw err;

                var output = jsonPretty(JSON.parse(data));

                fs.writeFile(bowerJson, output, function (error) {
                    if ( error ) throw error;
                });
            });
        }
    }
});
