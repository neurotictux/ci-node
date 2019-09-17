#!/bin/bash
PATH_PROJECT=$1
BRANCH_NAME=$2
NOW=`date '+%A %W %Y %X'`
NAME=$(hostname)
now=`date +"%T"`
FILE_LOG="log.txt"
PATH_CI="pach_ci"
echo $NOW > $FILE_LOG

if [ "$1" = "" ]
then
    echo "Projeto '$1' inválido"
    return
fi

if [ "$2" = "" ]
then
    echo "Branch '$2' inválido"
    return
fi

# echo "Inicio do script" > log.txt
# { date '+%A %W %Y %X' } > log.txt
# echo $PATH_CI

echo "Current time : $now"
for i in 1 2 3 4 5
do
    echo $i
done
echo $1
if [ "$1" = "gabriel" ]
then
    echo "Nome correto"
else
    echo "Inválido"
fi
echo $NAME