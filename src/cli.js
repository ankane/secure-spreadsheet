#!/usr/bin/env node

import assert from 'assert';
import getStdin from 'get-stdin';
import parse from 'csv-parse';
import program from 'commander';
import XlsxPopulate from 'xlsx-populate';

process.on('uncaughtException', function (err) {
  // eslint-disable-next-line no-console
  console.error('Error: ' + err.message);
  process.exit(1);
});

program
  .option('--password <password>', 'Password')
  .option('--input-format <format>', 'Input format')
  .parse(process.argv);

const options = program.opts();

assert(options.password, "--password required");

function writeWorkbook(workbook) {
  workbook.outputAsync({password: options.password}).then(data => {
    process.stdout.write(data);
  });
}

if (options.inputFormat == "xlsx") {
  getStdin.buffer().then(str => {
    XlsxPopulate.fromDataAsync(str).then(workbook => {
      writeWorkbook(workbook);
    });
  });
} else {
  const parser = parse((err, data) => {
    if (err) {
      assert.fail(err);
    }
    XlsxPopulate.fromBlankAsync().then(workbook => {
      workbook.sheet(0).cell('A1').value(data);
      writeWorkbook(workbook);
    });
  });

  process.stdin.pipe(parser);
}
