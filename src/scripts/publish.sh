#!/bin/bash
PATH_PROJECT=$1
BRANCH_NAME=$2
PUBLISH_FOLDER=$3
NOW=$(date '+%A %W %Y %X')

echo $NOW
cd $PATH_PROJECT
git checkout $BRANCH_NAME 2>&1
LAST_ERROR=$?
# echo $ERRO
echo $LAST_ERROR
if [ $LAST_ERROR -eq 0 ]; then
    echo "Updating ..."
    git pull origin $BRANCH_NAME 2>&1
    LAST_ERROR=$?
fi
echo $LAST_ERROR
if [ $LAST_ERROR -eq 0 ]; then
    echo "Publishing branch '$BRANCH_NAME'"
    dotnet publish -o $PUBLISH_FOLDER
    LAST_ERROR=$?
fi
echo $LAST_ERROR
if [ $LAST_ERROR -eq 0 ]; then
    echo 'Successfully published.'
else
    echo 'Errors in publishing.'
fi