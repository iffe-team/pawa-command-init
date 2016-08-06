'use strict';
var init = require('./main')
exports.name = 'init';
exports.usage = '<names> [path] [options]';
exports.desc = 'init project';
exports.register = function(commander){
    commander
        .option('-s, --spa', 'spa for project, used in `init` command')
        .action(function(){
            var args = Array.prototype.slice.call(arguments);
            var options = args.pop();
            var names = args.shift();
            var path = args.shift();
            // var spa = options.spa
            var dest = process.cwd();
            if(path){
                if(!fis.util.isAbsolute(path)){
                    dest = fis.util(dest, path);
                }
            }
            init.createProject(names, commander)
           
        });
};