#!/bin/sh

str=$QUERY_STRING

echo 'Content-type: text/html'
echo

sn=$(metadata -g sn)
version=$(cat /etc/info/version)
timestamp=$(cat /etc/info/timestamp)
ip=$(metadata -g ip | sed -e "s/,/ /g" | awk '{print $1}')
mask=$(metadata -g ip | sed -e "s/,/ /g" | awk '{print $2}')
gateway=$(metadata -g gw)
dns=$(metadata -g dns)

#_mask=$(metadata -g ip | sed -e "s/,/ /g" | awk '{print $2}')
#_mask=$1
#if [ $_mask -lt 8 ]; then
#    prefix=$((255>>(8-$_mask)<<(8-$_mask)))
#    mask="${prefix}.0.0.0"
#elif [ $_mask -lt 16 ]; then
#    _mask=$(($_mask - 8))
#    prefix=$((255>>(8-$_mask)<<(8-$_mask)))
#    mask="255.${prefix}.0.0"
#elif [ $_mask -lt 24 ]; then
#    _mask=$(($_mask - 16))
#    prefix=$((255>>(8-$_mask)<<(8-$_mask)))
#    mask="255.255.${prefix}.0"
#else
#    _mask=$(($_mask - 24))
#    prefix=$((255>>(8-$_mask)<<(8-$_mask)))
#    mask="255.255.255.${prefix}"
#fi
#echo "mask:$mask"

echo -n "
{
  \"sn\": \"$sn\",
  \"version\": \"$version\",
  \"versionDate\": \"$timestamp\",
  \"ip\": \"$ip\",
  \"mask\": \"$mask\",
  \"gateway\": \"$gateway\",
  \"dns\": \"$dns\"

}
"
