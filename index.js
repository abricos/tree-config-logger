/**
 * @author Alexander Kuzmin <roosit@abricos.org>
 */

'use strict';

var path = require('path');
var winston = require('winston');
var chalk = require('chalk');
var dateFormat = require('dateformat');

var helper = {
    path: function(dir, from){
        from = from || process.cwd();
        var s = path.relative(from, dir);
        return chalk.underline(s);
    },
    file: function(file){
        var s = path.basename(file);
        return chalk.underline(s);
    },
    number: function(n){
        var s = n + '';
        return chalk.cyan(s);
    },
    string: function(s){
        s = '`' + s + '`';
        return chalk.green(s);
    }
};

var LoggerPlugin = function(config){
    this.config = config;
    this._logger = null;
    this.helper = helper;
};

LoggerPlugin.prototype._getLogger = function(){
    if (this._logger){
        return this._logger;
    }
    var logOptions = this.config.get('log', {
        recursive: true
    });

    for (var n in logOptions){
        (function(transport){
            var format = transport.timestamp;
            if (typeof format !== 'string'){
                return;
            }
            transport.timestamp = function(){
                var str = dateFormat(new Date(), format);
                if (transport.colorize === 'true'){
                    str = chalk.gray(str);
                    return str;
                }
                return str;
            };
        })(logOptions[n]);
    }

    var logId = this.config.id + (new Date()).getTime();
    this._logger = winston.loggers.add(logId, logOptions);

    return this._logger;
};

LoggerPlugin.prototype.log = function(level){
    var logger = this._getLogger();

    var args = Array.prototype.slice.call(arguments);
    logger.log.apply(logger, args);
};

LoggerPlugin.prototype.silly = function(){
    var args = Array.prototype.slice.call(arguments);
    args.unshift('silly');
    this.log.apply(this, args);
};

LoggerPlugin.prototype.debug = function(){
    var args = Array.prototype.slice.call(arguments);
    args.unshift('debug');
    this.log.apply(this, args);
};

LoggerPlugin.prototype.verbose = function(){
    var args = Array.prototype.slice.call(arguments);
    args.unshift('verbose');
    this.log.apply(this, args);
};

LoggerPlugin.prototype.info = function(){
    var args = Array.prototype.slice.call(arguments);
    args.unshift('info');
    this.log.apply(this, args);
};

LoggerPlugin.prototype.warn = function(){
    var args = Array.prototype.slice.call(arguments);
    args.unshift('warn');
    this.log.apply(this, args);
};

LoggerPlugin.prototype.error = function(){
    var args = Array.prototype.slice.call(arguments);
    args.unshift('error');
    this.log.apply(this, args);
};

module.exports = LoggerPlugin;
