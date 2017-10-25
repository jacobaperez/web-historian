var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers');
var url = require("url");
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  if (req.method === 'GET') {
    if (req.url === '/') {
      httpHelpers.sendResponse(res, archive.paths.index, 200);
    } else {
      httpHelpers.sendResponse(res, (archive.paths.archivedSites + '/' + req.url), 200);
    }
  }
  if (req.method === 'POST') {
    var data = '';
    req.on('data', function(chunk){
      data += chunk;
    });
    req.on('end', function() {
      console.log('finished data', data);
      httpHelpers.sendResponse(res, archive.paths.list, 302, data.slice(4));
    });
  }
};
