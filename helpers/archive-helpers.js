var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt'),
  index: path.join(__dirname, '../web/public/index.html'),
  loading: path.join(__dirname, '../web/public/loading.html')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  fs.readFile(exports.paths.list, 'utf8', (err, data) => {
    if (err) throw err;
    var arr = data.split('\n');
    callback(arr);
  });
};

exports.isUrlInList = function(url, callback) {
  fs.readFile(exports.paths.list, 'utf8', (err, data) => {
    if (err) throw err;
    var arr = data.split('\n');
    callback(arr.includes(url));
  });
};

exports.addUrlToList = function(url, callback) {
  exports.isUrlInList(url, function (bool) {
    if (bool) {
      var u = exports.paths.archivedSites + '/' + url;
      callback(u);
    } else {
      fs.appendFile(exports.paths.list, (url + '\n'), 'utf8', (err) => {
        if(err) throw err;
        var u = exports.paths.archivedSites + '/' + url;
        callback(u);
      });
    }
  });
};

exports.isUrlArchived = function(url, callback) {
  fs.readdir(exports.paths.archivedSites, 'utf8', (err, data) => {
    if (err) throw err;
    callback(data.includes(url));
  });
};

exports.downloadUrls = function(urls) {
  urls.forEach(function (url) {
    if (url !== '') {
      if(exports.isUrlArchived(url, function (bool){
        if (!bool) {
          http.get('http://www.' + url, (response) => {
            var body = '';
            response.on('data', function (chunk) {
              body += chunk;
            });
            response.on('end', function () {
              fs.appendFile(exports.paths.archivedSites + '/' + url, body, (err) => {
                if(err) throw err;
              });
            });
          });
        }
      }));
    }
  });
};
