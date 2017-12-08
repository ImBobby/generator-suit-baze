'use strict'

const generators      = require('yeoman-generator')
const updateNotifier  = require('update-notifier')
const pkg             = require('../../package.json')
const jsonPretty      = require('json-pretty')
const fs              = require('fs')
const helper          = require('./helper.js')
const inquirer        = require('inquirer')
const chalk           = require('chalk')
const clear           = require('clear')
const plugins         = require('./assets.json')
const download        = require('download')
const log             = console.log

const pwd = process.env.PWD || process.cwd()

const paths = {
    js: './dev/js/vendor/',
    scss: './dev/sass/plugin/',
    font: './dev/fonts/'
}

const msgs = {
    boilerplate: 'Boilerplate may have been installed.',
    bower: 'bower.json is not exist. Install boilerplate first.',
    downloading: 'Downloading asset(s) from cdn...',
    created: 'asset will be created in'
}

const pluginScssFile = `${pwd}/dev/sass/plugin/_plugin.scss`

module.exports = generators.Base.extend({
    initializing: {
        checkUpdate() {
            clear()
            updateNotifier({pkg: pkg}).notify()
        },

        showCurrentVersion() {
            log(chalk.white.underline(`You are running ${pkg.name} version ${pkg.version}\n`))
        },

        buildMenuList() {
            this.choices = []
            this.choices.push('boilerplate')

            plugins.forEach( (plugin, i) => {
                this.choices.push(`${plugin.name} - ${chalk.underline(plugin.url)}`)
            })

            this.choices.push(new inquirer.Separator())
            this.choices.push('exit')
            this.choices.push(new inquirer.Separator())
        }
    },

    prompting() {
        let done = this.async()

        this.prompt({
            type: 'list',
            name: 'options',
            message: 'What can I do for you?',
            choices: this.choices
        }, answers => {
            this.answers = answers.options
            done()
        })
    },

    write() {
        if ( this.answers === 'exit' ) {
            process.exit(1)
        }

        const BOWER_FILE = this.destinationPath('./bower.json')
        let answer = this.answers
        let choice = plugins.filter( plugin => plugin.name === answer.split(' - ')[0] )[0]

        if ( answer === 'boilerplate' ) {
            try {
                fs.openSync(BOWER_FILE, 'r')
                log(msgs.boilerplate)
                process.exit(1)
            } catch (e) {
                boilerplate.bind(this)()
            }
        } else {
            try {
                fs.openSync(BOWER_FILE, 'r')
            } catch(e) {
                log(msgs.bower)
                process.exit(1)
            }

            log(msgs.downloading)

            choice.assets.forEach( (asset, index) => {
                let filetype

                if ( helper.isJs(asset) )
                    filetype = 'js'
                else if ( helper.isCss(asset) )
                    filetype = 'scss'
                else if ( helper.isFont(asset) )
                    filetype = 'font'

                if ( filetype !== 'scss' ) {
                    new download()
                        .get(asset)
                        .dest(this.destinationPath(paths[filetype]))
                        .run()
                } else {
                    let filename = helper.getFilename(asset)

                    new download()
                        .get(asset)
                        .rename(helper.getScssFileName(filename))
                        .dest(this.destinationPath(paths[filetype]))
                        .run()

                    let content = fs.readFileSync(`${pluginScssFile}`, {
                        encoding: 'utf8'
                    })
                    content += `\n@import "${helper.getFilename(filename)}";`

                    fs.writeFileSync(`${pluginScssFile}`, content)
                }

                log(`${chalk.green(msgs.created)} ${paths[filetype]}`)
            })

            updateBower(choice.registryName, choice.version)
        }

        function boilerplate() {
            this.fs.copy(
                this.templatePath(`${answer}/**/*`),
                this.destinationPath('./')
            )

            this.fs.copy(
                this.templatePath('_gitignore'),
                this.destinationPath('./.gitignore')
            )

            this.fs.copy(
                this.templatePath('_editorconfig'),
                this.destinationPath('./.editorconfig')
            )

            fs.mkdirSync(`./_partials`)
            this.fs.write(`./_partials/head.php`, '')
            this.fs.write(`./_partials/header.php`, '')
            this.fs.write(`./_partials/footer.php`, '')
            this.fs.write(`./_partials/scripts.php`, '')
        }

        function updateBower(name, version) {
            fs.readFile(BOWER_FILE, (err, data) => {
                if ( err ) throw err;

                let content = JSON.parse(data)
                content.dependencies[name] = version

                fs.writeFile(BOWER_FILE, jsonPretty(content), err => {
                    if ( err ) throw err;
                })
            })
        }
    }
})
