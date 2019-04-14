#!/bin/sh
# ideas used from https://gist.github.com/motemen/8595451

# Based on https://github.com/eldarlabs/ghpages-deploy-script/blob/master/scripts/deploy-ghpages.sh
# Used with their MIT license https://github.com/eldarlabs/ghpages-deploy-script/blob/master/LICENSE

# abort the script if there is a non-zero error
# set -e

# show where we are on the machine
pwd
remote=$(git config remote.origin.url)

mkdir artifacts
cd artifacts

# now lets setup a new repo so we can update the branch
git config --global user.email "$GH_EMAIL" > /dev/null 2>&1
git config --global user.name "$GH_NAME" > /dev/null 2>&1
git init
git remote add --fetch origin "$remote"

cd library/artifacts

# switch into the the artifacts branch
if git rev-parse --verify origin/artifacts > /dev/null 2>&1
then
    git checkout artifacts
    # delete any old site as we are going to replace it
    # Note: this explodes if there aren't any, so moving it here for now
    git rm -rf .
else
    git checkout --orphan artifacts
fi

cp -a -R ~/repo/library/artifacts/ethgc.json ./ethgc.json

# stage any changes and new files
git add -A
# now commit, ignoring branch doesn't seem to work, so trying skip
git commit --allow-empty -m "artifacts [ci skip]"
# and push, but send any output to /dev/null to hide anything sensitive
git push --force --quiet origin artifacts
# go back to where we started and remove the git repo we made and used
# for deployment
cd ..
rm -rf artifacts

cd ~/repo/library/artifacts
git remote add --fetch origin "$remote"
git checkout --force -B artifacts origin/artifacts

cd ..

# now commit
git submodule update --init --recursive "artifacts"
if ! git diff-index --quiet HEAD --; then
    git commit -am "library update"
    # and push, but send any output to /dev/null to hide anything sensitive
    BRANCH="library-$(date +%Y%m%d-%H%M%S)"
    git checkout -B $BRANCH
    git push -u $GH_NAME --force origin $BRANCH

    echo "Open pull request"
    PR_TITLE="Library update [auto-pr]"
    curl --fail -u $GH_NAME -H "Content-Type:application/json" -X POST -d "{\"title\":\"$PR_TITLE\",\"base\":\"master\",\"head\":\"$BRANCH\"}" https://api.github.com/repos/hardlydifficult/ethgc/pulls
fi

echo "Pushed change"
