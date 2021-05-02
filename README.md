# Secure Spreadsheet

:fire: Secure your data exports - encrypt and password protect sensitive CSV and XLSX files

The [Office Open XML format](https://en.wikipedia.org/wiki/Office_Open_XML) provides a standard for encryption and password protection

Works with Excel, Numbers, and LibreOffice Calc

[![Build Status](https://github.com/ankane/secure-spreadsheet/workflows/build/badge.svg?branch=master)](https://github.com/ankane/secure-spreadsheet/actions)

## Getting Started

Install the CLI

```sh
npm install -g secure-spreadsheet
```

Convert a CSV into password-protected, AES-256 encrypted XLSX

```sh
cat input.csv | secure-spreadsheet --password secret > output.xlsx
```

Protect an existing XLSX

```sh
cat input.xlsx | secure-spreadsheet --password secret --input-format xlsx > output.xlsx
```

## Languages

Many languages don’t have libraries to create encrypted spreadsheets. Luckily, we can use the CLI.

- [Ruby](#ruby)
- [PHP](#php)

### Ruby

```ruby
require "csv"

csv_str = CSV.generate do |csv|
  csv << ["awesome", "csv"]
end

result = IO.popen(["secure-spreadsheet", "--password", "secret"], "r+") do |io|
  io.write(csv_str)
  io.close_write
  io.read
end

File.open("output.xlsx", "w") { |f| f.write(result) }
```

### PHP

```php
<?php

$csv_str = "awesome,csv";

$descriptorspec = array(
  0 => array("pipe", "r"),
  1 => array("pipe", "w")
);

$process = proc_open(["secure-spreadsheet", "--password", "secret"], $descriptorspec, $pipes);

if (!is_resource($process)) {
  die("Command failed");
}

fwrite($pipes[0], $csv_str);
fclose($pipes[0]);

$result = stream_get_contents($pipes[1]);
fclose($pipes[1]);

if (proc_close($process) != 0) {
  die("Command failed");
}

file_put_contents("output.xlsx", $result);
```

## Other Approaches

An alternative approach to secure your data is to create a password-protected ZIP archive. However, this leaves the data exposed after it’s unzipped.

## Notes

The content type for XLSX is `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`.

## Credits

Thanks to [xlsx-populate](https://github.com/dtjohnson/xlsx-populate) for providing the encryption and password protection.

## History

View the [changelog](https://github.com/ankane/secure-spreadsheet/blob/master/CHANGELOG.md)

## Contributing

Everyone is encouraged to help improve this project. Here are a few ways you can help:

- [Report bugs](https://github.com/ankane/secure-spreadsheet/issues)
- Fix bugs and [submit pull requests](https://github.com/ankane/secure-spreadsheet/pulls)
- Write, clarify, or fix documentation
- Suggest or add new features

To get started with development:

```sh
git clone https://github.com/ankane/secure-spreadsheet.git
cd secure-spreadsheet
npm install
```
