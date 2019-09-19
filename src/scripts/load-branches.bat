@echo off
cd %1
git fetch -a -p
git show-ref --abbrev