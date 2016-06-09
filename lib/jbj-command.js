/*jshint node:true*/
"use strict";

var program    = require('commander');
var npmPackage = require('../package.json');
var JBJ        = require('jbj');
var fs         = require('fs');
var JSON5      = require('json5');
var es         = require('event-stream');
var JSONStream = require('JSONStream');

function use(val, memo) {
  memo.push(val.replace(/^jbj-/,''));
  return memo;
}

program
.version(npmPackage.version)
.usage('[options] STYLESHEET {INPUT-FILE | -}')
.option('-u, --use [module]','Name of the JBJ module to use (repeatable)', use, [])
.option('-l, --multi-line', 'apply stylesheet on each line')
.option('-j, --multi-json', 'apply stylesheet on each json')
.option('-t, --text-output', 'to force text output')
.option('-e, --encoding [charset]', 'Change charset of input (binary, ascii)', /^(ascii|utf8|binary)$/i, 'utf8')
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
    encoding: program.encoding
  });
inputStream.setEncoding(program.encoding);

if (program.multiJSON || program.multiLine) {
  var stream = process.stdin;
  if (program.multiJSON) {
    stream = stream.pipe(JSONStream.parse('*'))
  }
  else {
    stream = stream.pipe(es.split())
  }
  stream = stream.pipe(es.map(function (data, callback) {
    if (data === '') {
      callback();
    }
    else {
      callback(null, data);
    }
  }))
  stream = stream.pipe(es.map(function (data, callback) {
    JBJ.render(stylesheet, data, function (error, output) {
      if (error) {
        callback(error);
      }
      else {
        callback(null, output);
      }
    });
  }))
  // stream = stream.pipe(es.map(function (data, callback) {
  // callback(null, data);
  // }))
  if (!program.textOutput) {
    stream = stream.pipe(JSONStream.stringify())
  }
  stream.pipe(process.stdout);
}
else {
  var input = '';
  inputStream.on('readable', function() {
    var chunk;
    while (null !== (chunk = inputStream.read())) {
      input += chunk;
    }
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
}

inputStream.on('error', function (error) {
  if (34 === error.errno) {
    console.error('The file "' + inputPath + '" does not exist.');
    process.exit(2);
  }
  console.error(error);
  process.exit(1);
});


