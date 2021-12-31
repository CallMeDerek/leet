#!/bin/bash

echo "Content-type: text/html"
echo

#echo "QUERY_STRING: $QUERY_STRING" > $file
#echo "CONTENT_LENGT: $CONTENT_LENGTH" >> $file
if [ x"$REQUEST_METHOD" = x"POST" ];then
    data=`cat`
fi

ret="success"
function set_param
{
    key=$(echo "$1" | sed -r "s/^\"(.*)\":\"(.*)\"$/\1/g")
    value=$(echo "$1" | sed -r "s/^\"(.*)\":\"(.*)\"$/\2/g")

    #echo "key:$key, value:$value" >> file.log
    if [ "$key" = "ip" ]; then
        #echo "metadata -s ip -- \"$value\"" >> file.log
        metadata -s ip -- "$value"
    elif [ "$key" = "gateway" ]; then
        #echo "metadata -s gateway -- $value" >> file.log
        metadata -s gw -- "$value"
    elif [ "$key" = "dns" ]; then
        #echo "metadata -s dns -- $value" >> file.log
        metadata -s dns -- "$value"
    fi
    if [ $? -ne 0 ]; then
        ret="failed"
    fi
}

#data='{"ip":"192.168.40.211 24","gateway":"192.168.40.1","dns":"8.8.8.8"}'
#echo "1, $data" > file.log
d=${data:1:0-1}

old_IFS=$IFS
IFS=','
d=($d)

for dd in ${d[@]}
do
    set_param $dd
done

IFS=$old_IFS

echo -n $ret
