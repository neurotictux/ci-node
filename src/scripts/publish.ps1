$path = "C:\Users\gabriel.rosa\git\WebApiTeste"
$fileName = "log.txt"
$pathCI = "pach_ci"

function GetString {
  return (($args[0]) | Out-String) -replace "`n|`r"
}

function Pack {
  param ([string]$pathProject, [string]$projectName, [string]$branchName)

  $pathHash = "$pathCI\hashes\hash-$projectName.txt"

  if(-Not (Test-Path -Path $pathHash))
  {
    echo "" > $pathHash
  }

  cd $pathProject
  $currentBranchName = GetString(git rev-parse --abbrev-ref HEAD)
  if($currentBranchName -ne $branchName)
  {
    git fetch -a -p
    git checkout $branchName
    if($LastExitCode -eq 1)
    {
      "Branch '$branchName' nao encontrado" | Out-File -FilePath $logPath\log-$projectName.txt
    }
  }

  git pull origin $branchName
  $prevHashCommit = GetString(Get-Content -Path $pathHash)
  $hashCommit = (git rev-parse HEAD)

  if($prevHashCommit -ne $hashCommit)
  {
    "Gerando pacote $branchName..." | Out-File -FilePath $logPath\log-$projectName.txt
    dotnet publish -c Test -o "$publishPath\$projectName" | Out-File -FilePath "$path\$fileName" -Append

    if($LastExitCode -eq 1)
    {
      return
    }
  }
}

echo lock >> ci.lock
echo (Get-Date) > "$logPath\log-geral.txt"

$ambiente = $args[0]
$branch = $args[1]

switch($ambiente)
{
  ambiente2
  {
    Pack $pathSite site $branch
  }
  default
  {
    echo "Ambiente nao existe"
  }
}

del ci.lock