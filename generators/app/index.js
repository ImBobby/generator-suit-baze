var generators      = require('yeoman-generator'),
    updateNotifier  = require('update-notifier'),
    pkg             = require('../../package.json');

module.exports = generators.Base.extend({
    initializing: {
        checkUpdate: function () {
            updateNotifier({pkg: pkg}).notify();
        }
    },

    write: function () {
        this.fs.copy(
            this.templatePath('boilerplate/**/*'),
            this.destinationPath('./')
        );

        this.fs.copy(
            this.templatePath('_gitignore'),
            this.destinationPath('./.gitignore')
        );
    },

    install: function () {
        this.installDependencies();
    }
});