/* jshint -W083 */

var async         = require('async');
var _             = require('lodash');
var util          = require('util');
var EventEmitter  = require('events');
var fse           = require('fs-extra');
var path          = require('path');

var TBuilder = function(options) {

  'use strict';

  var ensureDir = function(dir, cb) {
    if(this._options.test) {
      return process.nextTick(cb);
    } else {
      return fse.ensureDir(dir, cb);
    }
  }.bind(this);

  this._options = _.extend({template: _.template, templateSettings: _.templateSettings, test: false, exitOnError: true}, options);

  this.templateFunction = this._options.template;

  this.build = function compile(options, cb) {
    var self          = this;
    var sourcePath    = path.resolve(options.source || options.sourcePath);
    var targetPath    = path.resolve(options.target || options.targetPath);
    var ext           = options.ext    || '.template';
    var locals        = options;

    var readTree = function(step) {
      async.series([
        function ensureTargetDir(next) {
          ensureDir(targetPath, next);
        },

        function walkTree(next) {

          fse.walk(sourcePath)

          .on('error', function(err) {
            self.emit("error");
            next(err);
          })
          .on('readable', function() {
            var content;
            while((content = this.read())) {
              var item = content;

              if(item.stats.isFile()) {
                self.emit("file", item);

                fse.readFile(item.path, function(err, data) {

                  item = _.extend(item, {content: data, pathInfo: path.parse(item.path)});

                  self.emit("data", data);

                  var targetDir = path.resolve(targetPath);
                  targetDir = path.join(targetDir, item.pathInfo.dir.replace(sourcePath, "")); // Adds relative path to dest


                  ensureDir(targetDir, function(err) {
                    if(err) {
                      return next(err);
                    }

                    if(item.pathInfo.ext === ext) {
                      item.writeTargetPath = path.resolve(targetDir, item.pathInfo.base.replace(ext, ""));
                    } else {
                      item.writeTargetPath = path.resolve(targetDir, item.pathInfo.base);
                    }

                    item.compiled = self.templateFunction(item.content)(options);

                    self.emit("compiled", item.compiled);
                    if(!self._options.test) {
                      fse.writeFile(item.writeTargetPath, item.compiled, function(err) {
                        if(err) {
                          self.emit("error", err);
                          if(self._options.exitOnError) {
                            return next(err);
                          }
                        } else {
                          self.emit("generated", item.writeTargetPath);
                        }
                      });
                    } else {
                      self.emit("generated", item);
                    }
                  });
                });
              } else {
                self.emit("directory", item);
              }
            }

          }).on('end', next);
        },
      ], step);
    };

    process.nextTick(function() {
      if(!sourcePath) {
        return cb(new Error("Source path cannot be empty"));
      }

      if(!sourcePath) {
        return cb(new Error("Target path cannot be empty"));
      }

      readTree(function(err) {
        self.emit('end');
        return cb(err);
      });


    });

    return self;

  };

};

util.inherits(TBuilder, EventEmitter);

module.exports = TBuilder;
