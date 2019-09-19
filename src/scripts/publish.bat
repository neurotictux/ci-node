@echo off
SET projectPath=%1
SET branchName=%2
SET publishFolder=%3

echo %date% %time%
cd %projectPath%

git checkout %branchName% 2>&1

if ERRORLEVEL 1 goto EXIT_WITH_ERRORS

echo "Updating ..."

git pull origin %branchName% 2>&1

if ERRORLEVEL 1 goto EXIT_WITH_ERRORS

echo Publishing branch %branchName%
dotnet publish -o %publishFolder%
if ERRORLEVEL 1 goto EXIT_WITH_ERRORS

GOTO EXIT_SUCCESSFULLY

:EXIT_WITH_ERRORS
echo Errors in publishing.
GOTO EXIT_NOW

:EXIT_SUCCESSFULLY
echo 'Successfully published.'

:EXIT_NOW