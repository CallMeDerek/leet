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


function aaa
{
CONTENT_LENGTH=0
QUERY_STRING=
REQUEST_URI=/test_env.cgi/123/123
REDIRECT_STATUS=200
SCRIPT_NAME=/test_env.cgi
PATH_INFO=/123/123
PATH_TRANSLATED=/var/www/123/123
SCRIPT_FILENAME=/var/www/test_env.cgi
DOCUMENT_ROOT=/var/www
REQUEST_METHOD=GET
SERVER_PROTOCOL=HTTP/1.1
SERVER_SOFTWARE=lighttpd/1.4.45
GATEWAY_INTERFACE=CGI/1.1
SERVER_PORT=801
SERVER_ADDR=127.0.0.1
SERVER_NAME=localhost
REMOTE_ADDR=127.0.0.1
REMOTE_PORT=55394
HTTP_HOST=localhost:801
HTTP_CONNECTION=keep-alive
HTTP_UPGRADE_INSECURE_REQUESTS=1
HTTP_USER_AGENT="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
HTTP_ACCEPT=text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
HTTP_ACCEPT_ENCODING=gzip, deflate, sdch, br
HTTP_ACCEPT_LANGUAGE=zh-CN,zh;q=0.8,en-US;q=0.6,en;q=0.4
}
