#!/bin/bash

echo "Content-type: text/html"
echo

if [ x"$REQUEST_METHOD" = x"POST" ];then
    data=`cat`
fi

#echo "11" > file.log
pid=$(pidof csae53demo)
if [ -n "$pid" ]; then
    kill -9 $pid
fi
/usr/bin/lswxapp.sh
sleep 0.5
#echo "12" >> file.log

pid=$(pidof csae53demo)
if [ -n "$pid" ]; then
	echo "ok" >> file.log
	echo -n "ok"
else
	echo "false" >> file.log
	echo -n "failed"
fi
#echo -n "ok"

#echo "13" >> file.log
