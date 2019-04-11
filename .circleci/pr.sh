#!/bin/sh
# ideas used from https://gist.github.com/motemen/8595451

# Based on https://github.com/eldarlabs/ghpages-deploy-script/blob/master/scripts/deploy-ghpages.sh
# Used with their MIT license https://github.com/eldarlabs/ghpages-deploy-script/blob/master/LICENSE

# abort the script if there is a non-zero error
# set -e

# show where we are on the machine
pwd
remote=$(git config remote.origin.url)

# now lets setup a new repo so we can update the branch
git config --global user.email "$GH_EMAIL" > /dev/null 2>&1
git config --global user.name "$GH_NAME" > /dev/null 2>&1

# stage any changes and new files
git add -A
# now commit
git commit -m "library update"
# and push, but send any output to /dev/null to hide anything sensitive
BRANCH="production-$(date +%Y%m%d-%H%M%S)"
git push --force --quiet origin $BRANCH

echo "Pushed change"
