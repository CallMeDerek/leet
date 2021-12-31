#!/bin/sh

str=$QUERY_STRING

echo 'Content-type: text/html'
echo

num=$(ps | grep csae53demo | grep -v grep | wc -l)
if [ $num -eq 0 ]; then
    app_state="DOWN"
    num=$(ps | grep kinematics-sample-client | grep -v grep | wc -l)
    if [ $num -eq 0 ]; then
        app_state="Waiting GPS..."
    fi
else
    app_state="UP"
fi

sn=$(metadata -g sn)
version=$(cat /etc/info/version)
timestamp=$(cat /etc/info/timestamp)
ip=$(metadata -g ip | sed -e "s/,/ /g" | awk '{print $1}')
mask=$(metadata -g ip | sed -e "s/,/ /g" | awk '{print $2}')
gateway=$(metadata -g gw)
dns=$(metadata -g dns)

echo -n "
{
  \"sn\": \"$sn\",
  \"version\": \"$version\",
  \"versionDate\": \"$timestamp\",
  \"ip\": \"$ip\",
  \"mask\": \"$mask\",
  \"gateway\": \"$gateway\",
  \"dns\": \"$dns\",
  \"app_state\": \"$app_state\"

}
"
