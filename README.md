# JBJ command

JBJ command gives a `jbj` command that allow the use of
[JBJ](https://github.com/Inist-CNRS/node-jbj/) without having to write a
[nodejs](http://nodejs.org/) program.

## Contributors

- [François Parmentier](https://github.com/parmentf)

## Installation

With [npm](https://www.npmjs.com/) do:

```bash
$ npm install jbj-command -g
```

## Usage

```bash
$ jbj [options] STYLESHEET {INPUT-FILE | -}
```

The stylesheet file is a required parameter.

You also need an input file to transform. But this file can be replaced by the standard input:

```bash
$ jbj test/style1.json -
{"a":2}
2
```

Thus, you can pipe any file on the standard input:

```bash
$ cat test/input1.json | jbj test/style1.json -
1
```

## Options

### help

Show the available options (and the usage).

```bash
$ jbj --help
```

or

```bash
$ jbj -h
```

or

```bash
$ jbj
```

### version

Output the version number

```bash
$ jbj --version
```

or

```bash
$ jbj -V
```

### use
*-u, --use [module]*

Give the non-default [JBJ module](https://github.com/Inist-CNRS/node-jbj#actions) to use.
This option is repeatable.

```bash
$ jbj -u parse -u array test/style1.json test/input1.json 
1
```

Warning: if you use a JBJ module, it has to be installed, otherwise, there will be an error:

```bash
$ jbj -u parse -u array test/style1.json test/input1.json 

module.js:340
    throw err;
          ^
Error: Cannot find module 'jbj-array'
    at Function.Module._resolveFilename (module.js:338:15)
    at Function.Module._load (module.js:280:25)
    at Module.require (module.js:364:17)
    at require (module.js:380:17)
    at /home/parmentf/dev/node-jbj-command/lib/jbj-command.js:40:11
    at Array.forEach (native)
    at Object.<anonymous> (/home/parmentf/dev/node-jbj-command/lib/jbj-command.js:39:13)
    at Module._compile (module.js:456:26)
    at Object.Module._extensions..js (module.js:474:10)
    at Module.load (module.js:356:32)
```

To install a JBJ module (like `jbj-array`, for example):

```bash
$ npm install jbj-array
```

or better, if you want to use it from anywhere:

```bash
$ npm install jbj-array -g
```


## Examples

TODO

## License

[MIT](./LICENSE)
