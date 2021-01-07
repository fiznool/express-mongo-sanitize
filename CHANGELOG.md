# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [2.0.2] - 2021-01-07
### Fixed
- Fixed a prototype pollution security vulnerability. #34

### Updated
- Update dependencies.

## [2.0.1] - 2020-12-02
### Updated
- Update dependencies and test against node 14.

### Changed
- Use ESLint instead of JSHint for code linting.
- Use GitHub Actions for CI instead of Travis.

## [2.0.0] - 2020-03-25
### Added / Breaking
- Support sanitization of headers. #5

Note that if you weren't previously expecting headers to be sanitized, this is considered a breaking change.

### Breaking
- Drop support for node versions < 10.

## [1.3.2] - 2017-01-12
### Fixed
- Fixed an issue when using the sanitizer in the node REPL. #3

## [1.3.1] - 2017-01-12
### Fixed
- Fixed an issue with objects containing prohibited keys nested inside other objects with prohibited keys. #2
- Added a more robust check for plain objects.

## [1.3.0] - 2016-01-15
### Added
- A new function `has`, which checks whether a passed object/array contains any keys with prohibited characters.

## [1.2.0] - 2016-01-13
### Added
- A new option `replaceWith` which can be used to replace offending characters in a key. This is an alternative to removing the data from the payload.

## [1.1.0] - 2016-01-13
### Added
- The middleware also now sanitizes keys with a `.`. This is in line with Mongo's reserved operators.

## 1.0.0 - 2015-11-11

Initial Release.

[2.0.2]: https://github.com/fiznool/express-mongo-sanitize/compare/v2.0.1...v2.0.2
[2.0.1]: https://github.com/fiznool/express-mongo-sanitize/compare/v2.0.0...v2.0.1
[2.0.0]: https://github.com/fiznool/express-mongo-sanitize/compare/v1.3.2...v2.0.0
[1.3.2]: https://github.com/fiznool/express-mongo-sanitize/compare/v1.3.1...v1.3.2
[1.3.1]: https://github.com/fiznool/express-mongo-sanitize/compare/v1.3.0...v1.3.1
[1.3.0]: https://github.com/fiznool/express-mongo-sanitize/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/fiznool/express-mongo-sanitize/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/fiznool/express-mongo-sanitize/compare/v1.0.0...v1.1.0
