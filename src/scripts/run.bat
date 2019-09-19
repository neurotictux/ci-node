@echo off
SET projectPath=%1
SET fileName=%2
echo %projectPath%
echo %fileName%
cd %projectPath%
dotnet %fileName%