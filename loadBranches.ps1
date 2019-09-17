$PROJECT_PATH = $args[0]
$OUTPUT_PATH = $args[1]
$BRANCHES = ""
Set-Location $PROJECT_PATH
foreach($i in $(git for-each-ref --format='%(refname)'))
{
    $BRANCHES = "$BRANCHES $i"
}
$BRANCHES | Out-File -FilePath $OUTPUT_PATH