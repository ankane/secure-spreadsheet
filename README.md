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
secure-spreadsheet --password secret < input.csv > output.xlsx
```

Protect an existing XLSX

```sh
secure-spreadsheet --password secret --input-format xlsx < input.xlsx > output.xlsx
```

## Languages

You can use the CLI to create encrypted spreadsheets in other languages.

- [PHP](#php)
- [Python](#python)
- [Ruby](#ruby)

Pull requests are welcome for more languages.

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

### Python

```python
import subprocess

csv_str = b'awesome,csv'

result = subprocess.check_output(['secure-spreadsheet', '--password', 'secret'], input=csv_str)

with open('output.xlsx', 'wb') as f:
    f.write(result)
```

### Ruby

```ruby
require "open3"

csv_str = "awesome,csv"

result, status = Open3.capture2("secure-spreadsheet", "--password", "secret", stdin_data: csv_str)
raise "Command failed" unless status.success?

File.write("output.xlsx", result)
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
