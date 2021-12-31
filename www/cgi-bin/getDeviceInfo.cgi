#!/bin/sh

str=$QUERY_STRING

echo 'Content-type: text/html'
echo

num=$(ps | grep csae53demo | grep -v grep | wc -l)
if [ $num -eq 0 ]; then
    app_status="DOWN"
    num=$(ps | grep kinematics-sample-client | grep -v grep | wc -l)
    if [ $num -eq 1 ]; then
        app_status="Waiting GPS..."
    fi
else
    app_status="UP"
fi

sn=$(metadata -g sn)
version=$(cat /etc/info/version)
timestamp=$(cat /etc/info/timestamp)

echo -n "
{
  \"sn\": \"$sn\",
  \"version\": \"$version\",
  \"versionDate\": \"$timestamp\",
  \"app_status\": \"$app_status\"

}
"
