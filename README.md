# typescript-checker

### Run:

```
npm install @v4fire/typescript-check
npx @v4fire/typescript-check
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
        run: npx @v4fire/typescript-check
```

### Setting up a CLI logger

```
npx @v4fire/typescript-check --logger cli
```

### Setting up errors threshold

```
npx @v4fire/typescript-check --max-errors 70
```
