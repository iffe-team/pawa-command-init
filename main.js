/*
 * fis
 * http://fis.baidu.com/
 */

'use strict';
var fs = require('fs')
var path = require('path')
var colors = require('colors')
var thinkit = require('thinkit')

/**
 * global think variable
 * @type {Object}
 */
global.think = Object.create(thinkit);
var sep = path.sep;
var cwd = process.cwd();
var templatePath = __dirname  + '\\template';
var projectRootPath = cwd;

colors.enabled = true;

think.log = function (msg, type, showTime) {
  if (think.isFunction(msg)) {
    msg = msg(colors);
  }
  console.log(msg); 
};
var log = function log(fn) {
  think.log(function (colors) {
    return '  ' + fn(colors);
  }, '', null);
};
var getProjectAppPath = function(name) {
  var path = projectRootPath + '\\' + name;
  return path;
};
var Project = {
    init: function(name, commander) {
        think.APP_PATH = getProjectAppPath(name);
        this.mkdir(think.APP_PATH)
        this.mkdir(think.APP_PATH + '/www/pages');
        this.mkdir(think.APP_PATH + '/www/template');

        this.mkdir(think.APP_PATH + '/www/assets/static/');
        this.mkdir(think.APP_PATH + '/www/assets/static/js');
        this.mkdir(think.APP_PATH + '/www/assets/static/css');
        this.mkdir(think.APP_PATH + '/www/assets/static/img');
        this.mkdir(think.APP_PATH + '/www/assets/static/libs');
        this.mkdir(think.APP_PATH + '/www/assets/static/plugins');
        this.mkdir(think.APP_PATH + '/www/assets/static/vendors');

        this.mkdir(think.APP_PATH + '/build/');
        this.mkdir(think.APP_PATH + '/dist/');
        this.mkdir(think.APP_PATH + '/rebuild/');
        this.mkdir(think.APP_PATH + '/release/');
        this.mkdir(think.APP_PATH + '/docs/');

        this.copyFile('/build/r.js', think.APP_PATH + '/build/r.js')
        this.copyFile('/build/r.js', think.APP_PATH + '/build/js.jar')
        this.copyFile('/build/r.js', think.APP_PATH + '/build/conf-dev.js')
        this.copyFile('/build/r.js', think.APP_PATH + '/build/conf-stg.js')

        this.copyFile('/docs/README.md', think.APP_PATH + '/docs/README.md')

        this.copyFile('/www/index.shtml', think.APP_PATH + '/www/index.shtml')
    },
    copyFile: function(source, target, replace, showWarning) {
        if (showWarning === undefined) {
            showWarning = true;
        }

        if (think.isBoolean(replace)) {
            showWarning = replace;
            replace = '';
        }

        //if target file is exist, ignore it
        if (think.isFile(target)) {
            if (showWarning) {
                log(colors => {
                    return colors.yellow('exist') + ' : ' + path.normalize(target);
                });
            }
            return;
        }

        this.mkdir(path.dirname(target));
        if (cmder.spa) {
            source = 'project-avalon-spa' + source
        }

        // console.log(templatePath + think.sep + source)
        // console.log(target)
        //if source file is not exist
        if (!think.isFile(templatePath + think.sep + source)) {
            return;
        }

        let content = fs.readFileSync(templatePath + think.sep + source, 'utf8');
        //replace content 
        if (think.isObject(replace)) {
            for (let key in replace) {
                /*eslint-disable no-constant-condition*/
                while (1) {
                    let content1 = content.replace(key, replace[key]);
                    if (content1 === content) {
                        content = content1;
                        break;
                    }
                    content = content1;
                }
            }
        }

        fs.writeFileSync(target, content);
        log(function(colors) {
            return colors.cyan('create') + ' : ' + path.relative(cwd, target);
        });
    },
    mkdir: function(dir) {
        if(think.isDir(dir)){
            return;
        }
        // console.log(dir)
        think.mkdir(dir);
        log(function(colors) {
            return colors.cyan('create') + ' : ' + path.relative(cwd, dir);
        });
    }
};

exports.createProject = function(name, commander) {
    if (!name) {
        return
    } else {
        global.cmder = commander
        Project.init(name, commander)
    }
};
