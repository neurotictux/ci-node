#!/bin/bash
PATH_PROJECT=$1
BRANCH_NAME=$2
PUBLISH_FOLDER=$3
LOG_FILE=$4
NOW=$(date '+%A %W %Y %X')

echo $NOW >$LOG_FILE
cd $PATH_PROJECT

git checkout $BRANCH_NAME

if [ $? -eq 0 ]; then
    echo "Atualizando..." >>$LOG_FILE
    git pull
fi
echo "STEP 1" >>$LOG_FILE
if [ $? -eq 0 ]; then
    echo "Publicando branch '$BRANCH_NAME'" >>$LOG_FILE
    dotnet publish -o $PUBLISH_FOLDER >>$LOG_FILE
fi
echo "STEP 2" >>$LOG_FILE

if [ $? -eq 0 ]; then
    echo 'Publicado com sucesso.' >>$LOG_FILE
else
    echo 'Erro na publicação.' >>$LOG_FILE
fi
