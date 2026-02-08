#!/usr/bin/env node

import assert from 'node:assert';
import { parseArgs } from 'node:util';
import { parse } from 'csv-parse';
import XlsxPopulate from 'xlsx-populate';

process.on('uncaughtException', function (err) {
  console.error('Error: ' + err.message);
  process.exit(1);
});

const program = {
  'password': {type: 'string'},
  'input-format': {type: 'string'},
  'help': {type: 'boolean', short: 'h'}
};

const { values: options } = parseArgs({options: program});

if (options.help) {
  const usage = `Usage: secure-spreadsheet [options]

Options:
  --password <password>    Password
  --input-format <format>  Input format
  -h, --help               display help for command
`;
  process.stdout.write(usage);
  process.exit(0);
}

assert(options.password, '--password required');

function writeWorkbook(workbook) {
  workbook.outputAsync({password: options.password}).then(data => {
    process.stdout.write(data);
  });
}

if (options['input-format'] == 'xlsx') {
  const readable = process.stdin;
  const chunks = [];

  readable.on('readable', () => {
    let chunk;
    while (null !== (chunk = readable.read())) {
      chunks.push(chunk);
    }
  });

  readable.on('end', () => {
    const str = Buffer.concat(chunks);
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
