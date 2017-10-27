var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var htmlFetcher = require('../workers/htmlfetcher.js');

exports.headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'text/html'
};

exports.serveAssets = function(res, asset, callback) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...),
  // css, or anything that doesn't change often.)
};

exports.sendRedirect = function (response, location, status = 302) {
  response.writeHead(status, {Location: location});
  response.end();
};

exports.sendResponse = function(response, content, statusCode = 200, urls) {
  if (statusCode === 200) {
    fs.readFile(content, 'utf8', (err, data) => {
      if (err) {
        response.writeHead(404, exports.headers);
        response.end();
      } else {
        response.statusCode = statusCode;
        response.writeHead(statusCode, exports.headers);
        response.end(data);
      }
    });
  }
  if (statusCode === 302) {
    archive.isUrlArchived(urls, function (bool) {
      htmlFetcher.getHTML();
      if(bool) {
        exports.sendRedirect(response, urls, statusCode);
      } else {
        archive.addUrlToList(urls, function() {
          exports.sendRedirect(response, '/loading.html', statusCode);
        });
      }
    });
  }
};

// As you progress, keep thinking about what helper functions you can put here!
