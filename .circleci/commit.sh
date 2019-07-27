#!/bin/sh
# Based on https://github.com/eldarlabs/ghpages-deploy-script/blob/master/scripts/deploy-ghpages.sh

# abort the script if there is a non-zero error
set -e

remote=$(git config remote.origin.url)

# now lets setup a new repo so we can update the branch
git config --global user.email "$GH_EMAIL" > /dev/null 2>&1
git config --global user.name "$GH_NAME" > /dev/null 2>&1

# stage any changes and new files
git add -A
if ! git diff-index --quiet origin/$CIRCLE_BRANCH --; then
  # now commit
  git commit -m "auto-lint"
  # and push
  git push --set-upstream origin $CIRCLE_BRANCH 
fi
