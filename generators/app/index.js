var generators      = require('yeoman-generator'),
    updateNotifier  = require('update-notifier'),
    pkg             = require('../../package.json'),
    jsonPretty      = require('json-pretty'),
    fs              = require('fs'),
    helper          = require('./helper.js');

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
        var answer = this.answers;

        if (answer === 'boilerplate') {
            boilerplate.bind(this)();
        } else if (answer === 'exit') {

        } else {
            var path = this.templatePath('./' + answer);

            var files = fs.readdirSync(path);

            files.forEach( function (value, index) {
                if ( helper.isJs(value) ) {
                    copyAssets.bind(this)(value, './dev/js/vendor/');
                } else if ( helper.isScss(value) ) {
                    copyAssets.bind(this)(value, './dev/sass/plugin/');
                } else if ( helper.isFont(value) ) {
                    copyAssets.bind(this)(value, './dev/fonts/');
                }
            }.bind(this));
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

        function copyAssets(file, destination) {
            this.fs.copy(
                this.templatePath(answer + '/' + file),
                this.destinationPath(destination + file)
            );
        }
    }
});
