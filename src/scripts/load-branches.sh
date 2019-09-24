BRANCHES=''
PROJECT_PATH=$1
cd $PROJECT_PATH
git fetch -a -p
for branch in $(git for-each-ref --format='%(refname)'); do
    BRANCHES="$BRANCHES $branch"
done
echo $BRANCHES
