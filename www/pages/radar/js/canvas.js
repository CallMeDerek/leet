function calculate_size() {
    // clear_canvas()
    if (x_origon < x_min) {
        x_origon = x_min
    } else if (x_origon > x_max) {
        x_origon = x_max
    }
    if (y_origon < y_min) {
        y_origon = y_min
    } else if (y_origon > y_max) {
        y_origon = y_max
    }
    canvas_w = canvas.width - padding * 2; canvas_h = canvas.height - padding * 2; //画布宽画布高
    xs = x_max - x_min; ys = y_max - y_min;//定义坐标轴范围
    w = Math.min((canvas_w) / ys, (canvas_h) / xs)//每单位对应画布尺寸
    x_offset = (canvas_h - w * xs) / 2; y_offset = (canvas_w - w * ys) / 2 //偏移量
    translateX = x_offset + (x_max - x_origon) * w + padding
    translateY = y_offset + (y_max - y_origon) * w + padding
}
//绘制网格
function draw_grid() {
    let offCanvas = document.createElement("canvas");//离屏canvas 通过代码创建出来的
    offCanvas.width = canvas_width;
    offCanvas.height = canvas_height;
    let offContext = offCanvas.getContext("2d");
    //计算  !x纵轴，y横轴（←正向）
    offContext.translate(Math.round(translateY + offX), Math.round(translateX + offY))
    if (angle != 0) {
        offContext.rotate(angle)
    }
    if (imgScale != 1) {
        offContext.scale(imgScale, imgScale)
    }
    let xStart = Math.round((x_origon - x_max) * w), xEnd = Math.round((x_origon - x_min) * w);
    let yStart = Math.round(w * (y_origon - y_max)), yEnd = Math.round(w * (y_origon - y_min));
    offContext.setLineDash([0])
    offContext.beginPath()
    //根据设置原点，画x&y轴，红色
    offContext.fillStyle = "#ff0000", offContext.strokeStyle = "#ff0000";
    offContext.arc(0, 0, DOTRADIUS * 2, 0, 2 * Math.PI)
    offContext.fill()
    offContext.moveTo(0, xEnd)
    offContext.lineTo(0, xStart)
    offContext.fillText(y_origon, 0, xEnd + 20);
    offContext.fillText('x', 0, xStart - 10);
    offContext.moveTo(yEnd, 0)
    offContext.lineTo(yStart, 0)
    offContext.fillText(x_origon, yEnd + 10, 0);
    offContext.fillText('y', yStart - 10, 0);
    offContext.stroke();

    //绘制网格线
    offContext.setLineDash([3]), offContext.strokeStyle = "#000000", offContext.lineWidth = 0.5
    offContext.beginPath()
    for (let i = x_step; i <= x_max - x_origon; i += x_step) {
        offContext.moveTo(yStart, -i * w)
        offContext.lineTo(yEnd, -i * w)
        offContext.fillText(i + x_origon, 5, -i * w + 5)
    }
    for (let i = x_step; i <= x_origon - x_min; i += x_step) {
        offContext.moveTo(yStart, i * w)
        offContext.lineTo(yEnd, i * w)
        offContext.fillText(x_origon - i, 5, i * w + 5)
    }
    for (let i = y_step; i <= y_max - y_origon; i += y_step) {
        offContext.moveTo(-i * w, xStart)
        offContext.lineTo(-i * w, xEnd)
        offContext.fillText(i + y_origon, -i * w - 5, -5)
    }
    for (let i = y_step; i <= y_origon - y_min; i += y_step) {
        offContext.moveTo(i * w, xStart)
        offContext.lineTo(i * w, xEnd)
        offContext.fillText(y_origon - i, i * w - 5, -5)
    }
    offContext.stroke();
    //离屏绘制
    canvas_bg.height = canvas_bg.height
    ctx_bg.drawImage(offCanvas, 0, 0);
    console.log("draw_grid_off done")

}
//绘制车道
function draw_bg() {
    let offCanvas = document.createElement("canvas");//离屏canvas 通过代码创建出来的
    offCanvas.width = canvas_width;
    offCanvas.height = canvas_height;
    let offContext = offCanvas.getContext("2d");

    let heng_come = come_num * come_width + come_bike + median / 2 //来向车道宽度
    let heng_leave = (leave_num * leave_width + leave_bike) + median / 2 //去向车道宽度
    let zong = translateX + w * x_origon
    let lane_length = Math.round(x_max * w)

    offContext.translate(Math.round(translateY + offX), Math.round(translateX + offY)) //坐标系设置原点
    if (angle != 0) {
        offContext.rotate(angle)
    }
    if (imgScale != 1) {
        offContext.scale(imgScale, imgScale)
    }


    offContext.translate(w * y_origon + w * base_y, w * x_origon) //坐标系（0，0），即雷达位置 + 雷达位置与路口中心位置偏移

    offContext.fillStyle = "#72777b"
    offContext.fillRect(-heng_come * w, -lane_length, (heng_come + heng_leave) * w, lane_length)
    offContext.fillStyle = "#ffe600"
    offContext.arc(0, 0, DOTRADIUS * 2, 0, 2 * Math.PI)
    // offContext.fill()
    offContext.fillStyle = "#ffffff"
    offContext.fillRect(-(heng_come - come_bike) * w, -waiting * w, come_num * come_width * w, 10)//等待线
    offContext.fillRect(median / 2 * w, -waiting * w, leave_num * leave_width * w, 10)//等待线
    let zong_length = (x_max - waiting) * w
    if (median > 0) {  //中央隔离带
        offContext.fillStyle = "#ffe600"
        offContext.fillRect(-median / 2 * w, -lane_length, median * w, zong_length)
    }
    if (come_num > 0) {//来向
        let n = (come_num * come_width + median / 2) * w
        offContext.fillStyle = "#007d65"
        offContext.fillRect(-n - come_bike * w, -lane_length, come_bike * w, zong_length)
        offContext.strokeStyle = "#ffffff", offContext.setLineDash([0])
        offContext.beginPath()
        while (n > 0) {
            offContext.moveTo(-n, - lane_length), offContext.lineTo(-n, -waiting * w)
            n -= come_width * w
        }
        offContext.stroke(); offContext.closePath()
    }
    if (leave_num > 0) { //去向
        let n = (leave_num * leave_width + median / 2) * w
        offContext.fillStyle = "#007d65"
        offContext.fillRect(n, -lane_length, leave_bike * w, zong_length)
        offContext.strokeStyle = "#ffffff", offContext.setLineDash([30, 30])
        offContext.beginPath()
        while (n > 0) {
            offContext.moveTo(n, -zong), offContext.lineTo(n, -waiting * w)
            n -= leave_width * w
        }
        offContext.stroke(); offContext.closePath()
    }
    offContext.stroke();
    offContext.closePath();

    offContext.beginPath()
    offContext.fillStyle = "#007d65", offContext.strokeStyle = "#007d65", offContext.setLineDash([0])
    offContext.moveTo(- w * base_y, 0), offContext.lineTo(10 - w * base_y, 30), offContext.lineTo(-10 - w * base_y, 30);//绘制雷达指示
    offContext.closePath()
    offContext.moveTo(- w * base_y, 0), offContext.lineTo(- w * base_y, -lane_length - padding)
    offContext.moveTo(-translateY - w * base_y, 0), offContext.lineTo(canvas_width - translateY - w * base_y, 0)
    offContext.stroke()
    offContext.fill()

    canvas_bg2.height = canvas2.height
    ctx_bg2.drawImage(offCanvas, 0, 0);

    console.log("draw_bg_off done")
}

function XYToWindow(x, y) {
    //返回元素的大小以及位置
    return {
        x: ((x_origon - x) * w).toFixed(2),
        y: ((y_origon - y) * w).toFixed(2)
    }
}
function XYToWindow_new(x, y) {
    //返回元素的大小以及位置
    let pX = (x_origon - x) * w
    let pY = (y_origon - y) * w
    let cx = Math.round((pY * Math.cos(angle) - pX * Math.sin(angle)) * imgScale + translateY + offX)
    let cy = Math.round((pX * Math.cos(angle) + pY * Math.sin(angle)) * imgScale + translateX + offY)

    return { x: cx, y: cy }
}

function XYToRect(x, y, width, length) {
    let cx = (x_origon - x) * w;
    let cy = (y_origon - y) * w
    let w0 = w * width * imgScale
    let l0 = w * length * imgScale
    let wid = Math.abs(Math.cos(angle) * w0 + Math.sin(angle) * l0)
    let len = Math.abs(Math.cos(angle) * l0 + Math.sin(angle) * w0)
    let rx = Math.round((cy * Math.cos(angle) - cx * Math.sin(angle)) * imgScale - wid / 2 + translateY + offX)
    let ry = Math.round((cx * Math.cos(angle) + cy * Math.sin(angle)) * imgScale - len / 2 + translateX + offY)
    return { x: rx, y: ry, width: wid, length: len }
}


function windowToXY(x, y) {
    //返回元素的大小以及位置
    let pX = Math.round(y_origon - (x - translateY) / w)
    let pY = Math.round(x_origon - (y - translateX) / w)
    return { x: pX, y: pY }
}



/**
* 坐标转化为canvas坐标
* @param x
* @param y
*/
function windowToCanvas(x, y) {
    //返回元素的大小以及位置
    var bbox = canvas.getBoundingClientRect()
    return {
        x: (x - translateY - offX - bbox.left * (canvas.width / bbox.width)) / imgScale.toFixed(2),
        y: (y - translateX - offY - bbox.top * (canvas.height / bbox.height)) / imgScale.toFixed(2)
    };
}


function updateRubberbandRectangle(x, y) {
    ctx.save();
    ctx.strokeStyle = '#00ff00'; ctx.setLineDash([0]);
    ctx.beginPath();
    ctx.arc(mousedown.x, mousedown.y, DOTRADIUS * 2, 0, 2 * Math.PI)
    ctx.arc(x, y, DOTRADIUS * 2, 0, 2 * Math.PI)
    ctx.fill()
    ctx.moveTo(mousedown.x, mousedown.y);
    ctx.lineTo(mousedown.x, y)
    ctx.lineTo(x, y);
    ctx.lineTo(x, mousedown.y)
    ctx.lineTo(mousedown.x, mousedown.y)
    ctx.stroke();
    ctx.restore();
}

function drawDot(loc) {
    //用来画点
    ctx.beginPath()
    ctx.arc(loc.x, loc.y, DOTRADIUS * 2, 0, 2 * Math.PI);
    ctx.fill()
}

function drawLine(locStart, locEnd) {
    //用来画线
    ctx.beginPath()
    ctx.moveTo(locStart.x, locStart.y);
    ctx.lineTo(locEnd.x, locEnd.y);
    ctx.stroke();
}
function drawPolygonFinal(points) {
    // 画多边形
    let length = points.length
    //单数要多画一个点，双数就是画点和线
    clear_canvas()
    if (points.length > 1) {
        for (let i = 0; i < length - 1; i++) {
            drawLine(points[i], points[i + 1])
        }
        if (points.length > 2) {
            drawLine(points[length - 1], points[0])
        }
    }
}

function drawPolygon(points) {
    // 画多边形
    let length = points.length
    //单数要多画一个点，双数就是画点和线
    for (let i = 0; i < length; i++) {
        drawDot(points[i])
    }
    // saveDrawingSurface()
    if (points.length > 1) {
        for (let i = 0; i < length - 1; i++) {
            drawLine(points[i], points[i + 1])
        }
        if (points.length > 2) {
            drawLine(points[length - 1], points[0])
        }
    }
}