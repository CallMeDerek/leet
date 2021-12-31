#!/bin/bash

echo "Content-type: text/html"
echo

#echo "QUERY_STRING: $QUERY_STRING" > $file
#echo "CONTENT_LENGT: $CONTENT_LENGTH" >> $file
if [ x"$REQUEST_METHOD" = x"POST" ];then
    data=`cat`
fi
#data='{"mqtt_ip":"192.168.40.102","mqtt_port":"1884"}'

ret="success"

#echo "data:$data" > file.log
mqtt_ip=$(echo $data | jq -r .mqtt_ip)
mqtt_port=$(echo $data | jq -r .mqtt_port)
#echo "mqtt_port: $mqtt_ip : $mqtt_port" >> file.log

sed -i "s/\"host.*/\"host\": \"${mqtt_ip}\",/g" /etc/rsu_simulate.json
if [ $? -ne 0 ];then
    ret="fail"
fi

sed -i "s/\"port.*/\"port\": ${mqtt_port},/g" /etc/rsu_simulate.json
if [ $? -ne 0 ];then
    ret="fail"
fi

echo -n $ret
