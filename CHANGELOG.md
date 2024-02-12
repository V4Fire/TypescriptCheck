Changelog
=========

> **Tags:**
> - :boom:       [Breaking Change]
> - :rocket:     [New Feature]
> - :bug:        [Bug Fix]
> - :memo:       [Documentation]
> - :house:      [Internal]
> - :nail_care:  [Polish]

_Note: Gaps between patch versions are faulty, broken or test releases._

## v1.4.3 (2024-02-12)

#### :bug: Bug Fix

* Added `d.file != null` check to fix `TypeError: Cannot read properties of undefined (reading 'fileName')`

## v1.4.1 (2021-12-13)

#### :house: Internal

* Moved `typescript` to peerDependencies

## v1.4.0 (2021-09-27)

#### :rocket: New Feature

* Added the log message with the used version of the Typescript package

## v1.3.4 (2021-09-23)

#### :bug: Bug Fix

* Fixed bug with new Typescript 4.4

## v1.3.3 (2021-03-06)

#### :rocket: New Feature

* Added ability to specify a custom typescript config filename

## v1.3.2 (2021-03-02)

#### :rocket: New Feature

* Improved information about found errors

## v1.3.1 (2020-11-06)

#### :house: Internal

* Updated dependencies: `typescript@4.1.1-rc`, `upath@2`

## v1.3.0 (2020-09-11)

#### :rocket: New Feature

* Simplified running the checker:

```bash
npx @v4fire/typescript-check
```

instead of

```bash
node ./node_modules/@v4fire/typescript-check/index.js
```

## v1.2.0 (2020-08-28)

#### :rocket: New Feature

* Added the ability to set the number of allowed errors
