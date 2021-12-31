

/**建立连接 */
function createSocket(onMsg) {
    $("#ws_state").html("websocket：连接中...")
    if ('WebSocket' in window) {
        console.log("浏览器支持WebSocket,建立websocket连接 ");
        socket = new WebSocket(WS_URL);
        socket.onopen = onopenWS;
        socket.onmessage = function (event) {
            // console.log(event.data);
            window.dispatchEvent(new CustomEvent(onMsg, {
                detail: JSON.parse(event.data),
            }))
        };
        socket.onopen = onopenWS; socket.onerror = onerrorWS; socket.onclose = oncloseWS;
    } else {
        console.log("浏览器不支持WebSocket ");
    }

}
/**打开WS */
function onopenWS(event) {
    $("#ws_state").html("websocket：连接成功 ")
    clearTimeout(timer)
    console.log("onopen" + new Date());
}
/**连接失败 */
function onerrorWS(event) {
    $("#ws_state").html("websocket：连接错误，请检查网络情况")
    console.log("onerror");
}
/**关闭WS */
function oncloseWS(event) {
    if (flag) {
        if (!!socket) {
            socket.close()
        }
        socket = null
        $("#ws_state").html("websocket：连接失败，3s后重连")
        timer = setTimeout("createSocket('onMsg')", 2000)//重连
        console.log("onclose" + timer);
    }
}
function closeWS() {
    console.log("handle close");
    flag = false
    if (!!socket) {
        socket.close()
    }
    socket = null
    $("#ws_state").html("websocket：连接断开" + new Date())
}

/**
       * ws发送信息
       */
function ws_send(msg) {
    console.log(msg)
    socket.send(JSON.stringify(msg));
}
function close_ws() {
    socket = null
}