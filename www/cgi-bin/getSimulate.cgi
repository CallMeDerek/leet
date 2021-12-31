#!/bin/sh

str=$QUERY_STRING

echo 'Content-type: text/html'
echo

mqtt_ip=$(jq -r .simulate.connect.mqtt[0].host /etc/rsu_simulate.json)
mqtt_port=$(jq -r .simulate.connect.mqtt[0].port /etc/rsu_simulate.json)

echo -n "
{
  \"mqtt_ip\": \"$mqtt_ip\",
  \"mqtt_port\": \"$mqtt_port\"

}
"
