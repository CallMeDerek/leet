#!/bin/sh

str=$QUERY_STRING

echo 'Content-type: text/html'
echo

ip=$(metadata -g ip | sed -e "s/,/ /g" | awk '{print $1}')
mask=$(metadata -g ip | sed -e "s/,/ /g" | awk '{print $2}')
gateway=$(metadata -g gw)
dns=$(metadata -g dns)

echo -n "
{
  \"ip\": \"$ip\",
  \"mask\": \"$mask\",
  \"gateway\": \"$gateway\",
  \"dns\": \"$dns\"
}
"
