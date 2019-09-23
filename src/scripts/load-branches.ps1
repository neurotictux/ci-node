$BRANCHES = ""
$PROJECT_PATH = $args[0]
Set-Location $PROJECT_PATH
foreach($i in $(git for-each-ref --format='%(refname)'))
{
    $BRANCHES = "$BRANCHES $i"
}

Write-Output $BRANCHES