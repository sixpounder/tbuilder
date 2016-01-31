var assert = require('assert');
var TBuilder = require('./index');

var builder = new TBuilder({test: false});
builder.on('begin', function(path) {
  // console.log("Walking " + path);
}).on('error', function(err) {
  console.log(" ***** ");
  console.log(err);
}).on('compiled', function(item) {
  // console.log("Compiled item from source " + item.path + " to be written to " + item.writeTargetPath);
  // console.log(item.compiled);
}).on('generated', function(item) {
  // console.log("Item from source " + item.path + " written to " + item.writeTargetPath);
}).build({
  source: './specimen',
  target: './out'
}, function(err, result) {
  assert.equal(undefined, err);
  if(err) {
    throw err;
  } else {
    console.log("Everything is fine");
  }
});
