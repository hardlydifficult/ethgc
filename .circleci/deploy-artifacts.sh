#!/bin/sh

# set -e

cd library/artifacts
# now lets setup a new repo so we can update the artifacts branch
git config --global user.email "$GH_EMAIL" > /dev/null 2>&1
git config --global user.name "$GH_NAME" > /dev/null 2>&1

# stage any changes and new files
git add -A
# now commit, ignoring branch artifacts doesn't seem to work, so trying skip
git commit --allow-empty -m "Deploy to artifacts [ci skip]"
# and push, but send any output to /dev/null to hide anything sensitive
git push --force --quiet --set-upstream origin artifacts
# go back to where we started and remove the artifacts git repo we made and used
# for deployment
cd ../..

echo "Complete"
