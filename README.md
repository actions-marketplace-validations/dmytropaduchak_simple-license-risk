# simple-license-risk

Scans lockfiles for copyleft licenses (GPL, AGPL, LGPL, SSPL) and reports matches on the pull request. Helps catch license risk before it lands on `main`.

## What it checks

- `GPL` / `GPL-2.0` / `GPL-3.0`
- `AGPL`
- `LGPL`
- `SSPL`

Supported files include `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`, and other common lockfiles that embed license fields.

## Usage

```yaml
name: License risk
on:
  pull_request:

permissions:
  contents: read
  pull-requests: write

jobs:
  simple-license-risk:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: dmytropaduchak/simple-license-risk@v0.1.0
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

## Inputs

| Input | Default | Description |
| --- | --- | --- |
| `github-token` | `${{ github.token }}` | Post sticky PR comments |
| `fail-on` | `none` | `none` / `medium` / `high` |

## Develop

```bash
npm install && npm run build
```
