@echo off
SET projectPath=%1
SET branchName=%2
SET publishFolder=%3

echo %date% %time%
cd %projectPath%

git checkout $branchName

if ERRORLEVEL 1 echo Error

if($LastExitCode -ne 0)
{
  echo "Errors in publishing. ERROR $LastExitCode"
  exit 1
}

echo "Updating ..."

git pull origin $branchName 2>&1

if($LastExitCode -ne 0)
{
  echo 'Errors in publishing.'
  exit 1
}

echo "Publishing branch '$branchName'"
dotnet publish -o $publishFolder

if($LastExitCode -ne 0)
{
  echo 'Errors in publishing.'
  exit 1
}

echo 'Successfully published.'
