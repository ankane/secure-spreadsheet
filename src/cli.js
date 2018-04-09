#!/usr/bin/env node

const assert = require('assert');
const getStdin = require('get-stdin');
const parse = require('csv-parse');
const program = require('commander');
const XlsxPopulate = require('xlsx-populate');

process.on('uncaughtException', function (err) {
  // eslint-disable-next-line no-console
  console.error('Error: ' + err.message);
  process.exit(1);
});

program
  .option('--password <password>', 'Password')
  .option('--input-format <format>', 'Input format')
  .parse(process.argv);

assert(program.password, "--password required");

if (program.inputFormat == "xlsx") {
  getStdin.buffer().then(str => {
    XlsxPopulate.fromDataAsync(str).then(workbook => {
      workbook.outputAsync({password: program.password}).then(data => {
        process.stdout.write(data);
      });
    });
  });
} else {
  const parser = parse((err, data) => {
    XlsxPopulate.fromBlankAsync().then(workbook => {
      workbook.sheet(0).cell('A1').value(data);
      workbook.outputAsync({password: program.password}).then(data => {
        process.stdout.write(data);
      });
    });
  });

  process.stdin.pipe(parser);
}
