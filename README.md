# TBUILDER

[![Build Status](https://travis-ci.org/sixpounder/tbuilder.svg?branch=master)](https://travis-ci.org/sixpounder/tbuilder)

A simple module to generate folders/file structures from templates. Useful to create application skeletons from personal templates.

## Usage

```bash
npm install [--save] tbuilder
```
```javascript
var TBuilder = require('tbuilder');
var builder = new TBuilder({
  exitOnError: true,
  test: false,
  template: _.template
});

builder
  .build({ source: './source', target: '/some/target/path'})
  .on('error', function(err) {
    console.log("Whoops!");
  });
  // .on(...)
```

## Constructor options
- **exitOnError**: *boolean* stops the build process if some error occurs while processing a file. Default is true.
- **test**: *boolean* defaults to false. If true, no files or folder will be created during the build.
- **template**: *function* the function used to compile a template from a file. By default, *template* function from lodash is used.
- **templateSettings**: *object* options for the template function. Since **template** defaults to lodash template function, this will be a reference to _.templateSettings.

# Build options
- **ext**: *string* the extension to look in files to process. Default is *.template*. This means every file with that extension will be processed. The specified extension is removed on the compiled version. Example:

```bash
  /source/file1.js.template -> /target/file1.js
```
- **source**: *string* the root of the source directory containing the files to build
- **target**: *string* the directory in which files will be built


## Events
- **error**: fired when an error occurs
- **file**: emitted when a file is found and queued for processing
- **directory**: emitted when a sub directory of *source* path is walked by the crawler
- **compiled**: emitted when a template is successfully compiled
- **generated**: emitted when a file under *target* is successfully created
- **end**: emitted when the build process completes
