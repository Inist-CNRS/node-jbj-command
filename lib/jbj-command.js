/*jshint node:true*/
"use strict";

var program    = require('commander');
var npmPackage = require('../package.json');
var JBJ        = require('jbj');
var fs         = require('fs');
var JSON5      = require('json5');

function use(val, memo) {
  memo.push(val.replace(/^jbj-/,''));
  return memo;
}

program
.version(npmPackage.version)
.usage('[options] STYLESHEET {INPUT-FILE | -}')
.option('-u, --use [module]','Name of the JBJ module to use (repeatable)', use, [])
.parse(process.argv);

var stylesheetPath = program.args[0]; // required
var inputPath      = program.args[1]; // filepath or -

if (!stylesheetPath) {
  program.help(function (txt) {
    return txt + '  STYLESHEET is a required parameter\n\n';
  });
}

if (!inputPath) {
  program.help(function (txt) {
    return txt + '  INPUT-FILE is a required parameter (- is for stdin)\n\n';
  });
}

// console.log(' use: %j', program.use);
// console.log(' STYLESHEET: ', stylesheetPath);
// console.log(' INPUT-FILE: ', inputPath);

program.use.forEach(function (module) {
  JBJ.use(require('jbj-'+module));
});

try {
  var stylesheet = JSON5.parse(fs.readFileSync(stylesheetPath, 'utf8'));
}
catch(error) {
  if (34 === error.errno) {
    console.error('The stylesheet file "' + stylesheetPath + '" does not exist.');
    process.exit(2);
  }
  console.error('Error in stylesheet "' + stylesheetPath + '"',error);
  process.exit(3);
}

var inputStream = inputPath === '-' ?
  process.stdin : fs.createReadStream(inputPath, {
    encoding: 'utf8'
  });

var input = '';
inputStream.setEncoding('utf8');
inputStream.on('readable', function() {
  var chunk;
  while (null !== (chunk = inputStream.read())) {
    input += chunk;
  }
});

inputStream.on('error', function (error) {
  if (34 === error.errno) {
    console.error('The file "' + inputPath + '" does not exist.');
    process.exit(2);
  }
  console.error(error);
  process.exit(1);
});

inputStream.on('end', function () {
  input = JSON5.parse(input);
  JBJ.render(stylesheet, input, function (error, output) {
    if (error) {
      console.error(error);
      process.exit(4);
    }
    console.log(output);
  });
});
