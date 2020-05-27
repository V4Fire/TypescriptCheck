# typescript-checker

### Run:

```
npm install @v4fire/typescript-check
node ./node_modules/@v4fire/typescript-check/index.js
```

Usage with github actions:

```
npm install @v4fire/typescript-check
```

typescript.yml

```yml
name: Typescript Error Reporter

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [14.1]

    steps:
      - uses: actions/checkout@v1

      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v1
        with:
          node-version: ${{ matrix.node-version }}

      - name: Install dependencies
        run: npm ci

      - name: build tsconfig
        run: npx gulp build:tsconfig

      - name: Typecheck
        run: node node_modules/@v4fire/typescript-check/index.js
```

### Setting up a CLI logger

```
node ./node_modules/@v4fire/typescript-check/index.js --logger cli
```