BRANCHES=''
PROJECT_NAME=$1
PROJECT_PATH=$2
OUTPUT_PATH=$3
cd $PROJECT_PATH
git fetch -a -p
for branch in $(git for-each-ref --format='%(refname)'); do
    BRANCHES="$BRANCHES $branch"
done
echo $BRANCHES > "$OUTPUT_PATH"
