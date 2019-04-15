# ethgc: ethereum gift card

**[ethgc.com](ethgc.com)**

To learn more about redeeming or creating cards, see [ethgc.com/docs](ethgc.com/docs).

## Development environment

If you'd like to contribute to the project, awesome - thanks!

New to `git`?  Check out this [contribution guide](https://github.com/MarcDiethelm/contributing) for the steps involved (note we are not using a *develop* branch).

```
git clone --recurse-submodules <github_repo>
cd ethgc

npm i
```

*this uses `postinstall` to install all packages in the monorepo*

Now you can jump into the specific project of interest as described below.  We use [Zenhub](https://app.zenhub.com/workspaces/ethgc-5c8dd086d76ef51f6b0fd246/board?filterLogic=any&repos=176020934&showPRs=false&showClosed=false&showPipelineDescriptions=false) to manage the backlog, but you are welcome to make any change and open a PR for discussion.

### Website

```
cd website
npm run dev
```

This will open a tab with the ethgc website running locally.  Any changes you make should auto-refresh the page.

*Note that this will not include the website /docs*

### Documentation

```
cd docs\website
npm run dev
```

This will open a tab with the docs website running locally.  Any changes you make should auto-refresh the page.

### Contract

```
cd docs\contract
npm run dev
```

This will compile contracts and run the test suite.  Run this anytime you change a contract, the library, or one of the tests.

### Library

At the moment, the library does not have any tests of its own.  If you change the library, you can test using the contract tests or by interacting with the website.


## Build Process

When changes are submitted, the following steps are performed:

- auto-lint

  CI will lint the files. If `--fix` was able to make corrections, it will commit the changes and restart the build.  If there's a lint error which can't be auto-fixed then the build fails.

- Test

  All contract tests, which implicitly test the library as well, must pass or the build fails.

  *At the moment the only tests we have are the contract tests.*

- Delpoy contracts

  CI will deploy the contract to all testnets and update the `artifacts` branch which is used by the Library to get the contract ABI and its addresses.

- Build website

  CI will build the website for production - both the main ethgc site as well as the docs site.

- Push changes

  CI will push the latest website and artifacts if all the other steps complete successfully on the master branch.

The website and docs are static files after they are built.  Hosted by [Github Pages](https://pages.github.com/) with [Cloudflare CDN](https://www.cloudflare.com/) fronting requests.  All the data / network requests use the [Infura APIs](https://infura.io/).

Additionally we are using the following Github bots:
 - [Mergify](https://mergify.io/): a configurable bot to automatically merge PRs
 - [Dependabot](https://dependabot.com/): creates a PR anytime a dependency updates
 - [imgBot](https://imgbot.net/): creates a PR anytime an image can be losslessly compressed
 - [WIP](https://github.com/marketplace/wip): add "WIP" to the title of a PR to block it from being merged
