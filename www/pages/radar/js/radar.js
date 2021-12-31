$(document).ready(function () {
    on_resize("canvas");
    init_canvas_event();

    // when radar modal show, clearTimeout
    $('#RadarCfg').on('show.bs.modal', function () {
        if (modal_timer) {
            clearTimeout(modal_timer)
        }
    })
    // when filter modal show, clearTimeout && set filter cfg list by OutputType
    $('#FilterCfg').on('show.bs.modal', function () {
        if (modal_timer) {
            clearTimeout(modal_timer)
        }
        if (OutputType == 1) {//object
            document.getElementById('cluster-filter').setAttribute("style", "display:block");
        } else if (OutputType == 2) {//cluster
            document.getElementById('cluster-filter').setAttribute("style", "display:none");
        }
    })

    //define right mouse event
    init_right_menu();

    init_coll_modal()

    $("input[type='color']").change(function (e) {
        $(`#${$(this).attr('name')}`).css({ "background": `${$(this).val()}` });
        $(`#${$(this).attr('name')}`).val($(this).val());
    })
})
//尺寸自適應
function on_resize(name) {
    console.log('on resize')
    canvas_width = Math.floor(window.innerWidth - 20)
    canvas_height = Math.floor(window.innerHeight - 80)

    canvas = document.getElementById(name); ctx = canvas.getContext('2d');
    canvas_bg = document.getElementById(`${name}_bg`); ctx_bg = canvas_bg.getContext('2d');

    if (name == "canvas") {
        canvas_width = Math.floor(window.innerWidth - 20)
        canvas_height = Math.floor(window.innerHeight - 80)
        canvas.width = canvas_width; canvas.height = canvas_height;
        canvas_bg.width = canvas_width; canvas_bg.height = canvas_height;
    }
    calculate_size()
    draw_grid()
}





function clear_canvas() {
    canvas.height = canvas.height
    console.log('clear canvas')
}

/**
 * 基本配置 ，重置，恢复默认设置
 */
function reset_RadarCfg() {
    $('#StoreInNVM').val(0);
    $('#SensorID').val('00');
    $('#OutputType').val('0');
    $("#MaxDistance").val(100);
    $('#RadarPower').val('0');
    $('#SendQuality').val(0);
    $('#SendExtInfo').val('0');
    $('#CtrlRelay').val(0);
    $('#SortIndex').val(0);
    $('#RCS_Threshold').val(0);
}

function init_right_menu() {
    document.oncontextmenu = function (e) {
        console.log("on context menu")
        e = e || window.event;
        if (e && e.preventDefault) { e.preventDefault() } //阻止浏览器默认行为W3C
        $("#box-menu").css({ 'display': 'inline-block', left: e.clientX + 'px', top: e.clientY + 'px' })
    }
    document.addEventListener("click", function () {
        // 在右键菜单之外单击时，将右键菜单隐藏
        $(".box-menu").css({ 'display': 'none' })
    }, false);
    $(".box-menu").click(function (e) {
        $("#box-menu").css({ 'display': 'inline-block' })
        // event.preventDefault();//阻止默认行为
        event.stopPropagation();//停止向上冒泡
    })
    $("#box-menu>.item").click(function (e) {
        $(`#${$(this).attr('name')}`).css({ 'display': 'inline-block', left: e.clientX + 20 + 'px', top: e.clientY + 'px' })
        $(`#${$(this).attr('name')}`).siblings().css({ 'display': 'none' });
    })
    $("#set_coord_div").click(show_coord_modal)
    $("input[name='appendix']").click(function (e) {
        if ($(this).prop("checked")) { $(`#${$(this).val()}`).css({ 'display': 'block' }); }
        else { $(`#${$(this).val()}`).css({ 'display': 'none' }); }
    })
    $("input[name='prop']").click(function (e) {
        prop_info = []
        $("input[name='prop']:checked").each(function () {
            prop_info.push(+$(this).val())
        })
    })
    $("input[name='item']").click(function (e) {
        item_info = []
        $("input[name='item']:checked").each(function () {
            item_info.push($(this).val())
        })
    })
}

function show_coord_modal() {
    $(".box-menu").css("cssText", "display:none !important;")
    $("#x_origon").val(x_origon); $("#y_origon").val(y_origon);
    $("#x_min").val(x_min); $("#x_max").val(x_max); $("#x_step").val(x_step)
    $("#y_min").val(y_min); $("#y_max").val(y_max); $("#y_step").val(y_step)
    $("#obj_color").val(obj_color); $("#obj_text_color").val(obj_text_color);
    $("[name=obj_color]").val(obj_color); $("[name=obj_text_color]").val(obj_text_color);
    $("[name=clus_color]").val(clus_color); $("[name=clus_text_color]").val(clus_text_color);
    $("#clus_color").val(clus_color); $("#clus_text_color").val(clus_text_color);
    $("#CoordCfg").modal({});
}
function set_coord() {
    $('#CoordCfg').modal('hide')
    x_origon = +$("#x_origon").val(); y_origon = +$("#y_origon").val();
    x_min = +$("#x_min").val(); x_max = +$("#x_max").val(); x_step = +$("#x_step").val()
    y_min = +$("#y_min").val(); y_max = + $("#y_max").val(); y_step = +$("#y_step").val()
    obj_color = $("#obj_color").val(); obj_text_color = $("#obj_text_color").val();
    clus_color = $("#clus_color").val(); clus_text_color = $("#clus_text_color").val();
    canvas.height = canvas.height;
    calculate_size()

    draw_grid()
    console.log('set_coord grid')
}


function init_coll_modal() {
    $("#region_div").css({ "opacity": "0.4" })
    $(".input-canvas").attr("disabled", true)
    $("#RegionID").change(function () {//改变碰撞区域ID时
        remove_draw_byHand();
        clear_canvas()
        $("#region_div").css({ "opacity": "0.4" }); $(".input-canvas").attr("disabled", true)
        $("#Coordinates_valid").prop("checked", false)
        $(" .input-canvas").each(function () {
            $(this).val(0)
        })
        $("#Activation_reg").prop("checked", false)
    })
    $("#Coordinates_valid").change(function () {
        if ($(this).is(':checked')) {

            $("#region_div").css({ "opacity": "1" })
            $(".input-canvas").removeAttr("disabled")
            clear_canvas()
            draw_rect_byHand()
        } else {

            $("#region_div").css({ "opacity": "0.4" })
            $(".input-canvas").attr("disabled", true)
            remove_draw_byHand()
        }
    })
    // when coll modal show, settingColl==true && change canvas to coll, redraw 
    $('#LaneSet').on('show.bs.modal', function () {
        on_resize("canvas_lane");
        ctx.setLineDash([0]), ctx.strokeStyle = "#007d65", ctx.lineWidth = 1
        canvas.addEventListener("mousedown", on_mousedown_polygon)
        canvas.addEventListener("dblclick", on_dbclick_polygon)
        // canvas.addEventListener("mousedown", startDragging);
        // canvas.addEventListener("mousemove", onDragging);
        // canvas.addEventListener("mouseup", stopDragging);
        canvas.addEventListener('mousewheel', handlerMouseWheel);
        canvas.addEventListener('DOMMouseScroll', handlerMouseWheel);//firefox78
        // settingColl = false
    })
    $('#LaneSet').on('hidden.bs.modal', function () {
        console.log("Lane Set on hidden")
        remove_polygon_byHand();
        clear_canvas();
        on_resize("canvas");
        settingColl = false;
    })
    // when coll modal show, settingColl==true && change canvas to coll, redraw 
    $('#collReg').on('show.bs.modal', function () { init_collReg(); settingColl = true })
    // when coll modal hide, settingColl==false && change canvas to base,redraw 
    $('#collReg').on('hidden.bs.modal', function () {
        console.log("coll reg on hidden")
        remove_draw_byHand();
        clear_canvas()
        on_resize("canvas");
        $("#region_div").css({ "opacity": "0.4" }); $(".input-canvas").attr("disabled", true)
        $("#Coordinates_valid").prop("checked", false)
        settingColl = false;
    })
}

function init_collReg() {
    on_resize("canvas_coll");
    $("#Coordinates_valid").prop("checked", false)
    $(".input-canvas").each(function () {
        $(this).val(0)
    })
}

function remove_polygon_byHand() {
    canvas.removeEventListener("mousedown", on_mousedown_polygon)
    canvas.removeEventListener("dblclick", on_dbclick_polygon)
}

function on_mousedown_polygon(e) {
    let loc = windowToCanvas(e.clientX, e.clientY)
    points.push(loc)
    let coord = windowToXY(e.offsetX, e.offsetY)
    pointsXY.push(coord);//`{'x':${coord.x},'y':${coord.y}}`)
    clear_canvas()
    drawPolygon(points)
    isDrawing = true
    isPointAdd = true
}

function on_dbclick_polygon(e) {
    if (isDrawing) {
        drawPolygonFinal(points)
        saveDrawingSurface()
        if (++laneIndex > 1) {
            var $li1 = $(`<p>
            <label>渠化${laneIndex}</label>
            <input id="lane${laneIndex}" class="input-lane" type="textarea">
        </p>`);
            $("#lane_container").append($li1);
        }
        pointsXY.pop()
        $(`#lane${laneIndex}`).val(JSON.stringify(pointsXY))
        points = [], pointsXY = [], isDrawing = false
    }
}


function remove_draw_byHand() {
    canvas.removeEventListener("mousedown", on_mousedown)
    canvas.removeEventListener("mousemove", on_mousemove)
    canvas.removeEventListener("mouseup", on_mouseup)
}
function draw_rect_byHand() {
    canvas.addEventListener("mousedown", on_mousedown)
    canvas.addEventListener("mousemove", on_mousemove)
    canvas.addEventListener("mouseup", on_mouseup)//(拖拽完成后)当鼠标松开时，重新获取本点坐标，清除之前的"跟随鼠标移动的线"，更新连线，取消拖拽状态
}

function on_mousedown(e) {
    clear_canvas()
    // var loc = windowToCanvas(e.clientX, e.clientY)
    e.preventDefault();

    mousedown = { x: Math.round(e.offsetX), y: Math.round(e.offsetY) };

    let coord = windowToXY(e.offsetX, e.offsetY)
    $('#Point1X').val(coord.y)
    $('#Point1Y').val(coord.x)
    dragging = true;
}
function on_mousemove(e) {
    // var loc;
    if (dragging) {
        e.preventDefault();
        // loc = windowToCanvas(e.clientX, e.clientY);
        ;

        // loc = { x: e.clientX, y: e.clientY }
        canvas.width = canvas.width
        let x = Math.round(e.offsetX)
        let y = Math.round(e.offsetY)
        ctx.setLineDash([5, 5]), ctx.strokeStyle = "#0000ff"
        ctx.save()
        ctx.beginPath()
        ctx.arc(x, y, DOTRADIUS * 2, 0, 2 * Math.PI)
        ctx.fill()
        ctx.moveTo(0, y); ctx.lineTo(canvas.width, y);
        ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height);
        ctx.stroke()
        ctx.restore()

        updateRubberbandRectangle(x, y);
    }
};
function on_mouseup(e) {
    loc = windowToCanvas(e.clientX, e.clientY);
    let coord = windowToXY(e.offsetX, e.offsetY)
    $('#Point2X').val(coord.y); $('#Point2Y').val(coord.x)
    dragging = false;
};
/**
   * 画辅助线，并设置属性
   * @param x
   * @param y
   */
// function drawGuidewires(x, y) {
//     ctx.save();
//     ctx.strokeStyle = 'rgba(0,0,230,1)';
//     ctx.lineWidth = 0.5;
//     drawVerticalLine((x));
//     drawHorizontalLine((y));
//     ctx.restore();
// }
/**
 * 画水平辅助线，占整个canvas宽度
 * @param y
 */
function drawHorizontalLine(y) {
    ctx.rotate(-angle)
    ctx.beginPath();
    ctx.moveTo(-translateY, y + 0.5); ctx.lineTo(canvas.width - translateY, y + 0.5);
    ctx.stroke();
    ctx.rotate(angle)
}

/**
 * 画垂直辅助线，占整个canvas高度
 * @param x
 */
function drawVerticalLine(x) {
    ctx.rotate(-angle)
    ctx.beginPath();
    ctx.moveTo(x + 0.5, - translateX); ctx.lineTo(x + 0.5, canvas.height - translateX);
    ctx.stroke();
    ctx.rotate(angle)
}


function show_download_modal() {
    if (download_flag) {
        download_flag = false
        download()
        $("#set_download_div").html("开始存储")
    } else {
        $("#DownloadCfg").modal({})
    }

}
function set_download() {
    $("#set_download_div").html("结束存储")
    download_flag = true
}
function download() {
    var blob = new Blob(download_data, { type: "text/csv,charset=UTF-8" })
    var csvUrl = URL.createObjectURL(blob)
    var aEle = document.createElement("a")
    aEle.download = `${$("#fileName").val()}.${$("#fileType").val()}` //文件名随意
    aEle.href = csvUrl
    aEle.click()
    download_data = []
}

function init_canvas_event() {
    canvas.addEventListener("mousedown", startDragging);
    canvas.addEventListener("mousemove", onDragging);
    canvas.addEventListener("mouseup", stopDragging);
    canvas.addEventListener('mousewheel', handlerMouseWheel);
    canvas.addEventListener('DOMMouseScroll', handlerMouseWheel);//firefox78
}

function startDragging(e) {
    if (e.which == 1) { //左键
        isDragging = false;
        p_start = { x: e.clientX, y: e.clientY }
        dragTimmer = setTimeout(setDragTrue, 200)
    }
}
function setDragTrue() {
    isDragging = true
    settingColl = true
}
function onDragging(e) {
    if (isDragging) {
        e.preventDefault();
        loc = { x: e.clientX, y: e.clientY }
        canvas.width = canvas.width
        let x = Math.round(e.offsetX)
        let y = Math.round(e.offsetY)
        ctx.save()
        ctx.beginPath()
        ctx.arc(x, y, DOTRADIUS * 2, 0, 2 * Math.PI)
        ctx.fill()
        ctx.moveTo(0, y); ctx.lineTo(canvas_width, y);
        ctx.moveTo(x, 0); ctx.lineTo(x, canvas_height);
        ctx.stroke()
        ctx.restore()
    }
}
function stopDragging(e) {
    if (isDragging) {
        offX += Math.round(loc.x - p_start.x)
        offY += Math.round(loc.y - p_start.y)
        draw_grid()
        p_start = null
        isDragging = false
        settingColl = false
    } else {
        clearTimeout(dragTimmer)
    }
}
function handlerMouseWheel(event) {
    let wheel = event.wheelDelta || (-event.detail)
    scaleX = event.layerX || event.offsetX, scaleX = event.layerY || event.offsetY
    if (wheel > 0) { //放大
        if (imgScale > 3) {
            alert("已缩放至最大")
            return
        } else {
            imgScale += SCALE;
        }
    } else { //缩小
        if (imgScale < 0.6) {
            alert("已缩放至最小")
            return
        } else {
            imgScale -= SCALE;
        }
    }
    setTimeout(function () {
        draw_grid()
    }, 200)
}
function reset() {
    angle = 0, imgScale = 1, scaleX = 0, scaleY = 0, offX = 0, offY = 0
    calculate_size()
    draw_grid()
    console.log('reset')
}

function rotate_left() {
    angle -= Math.PI / 2
    draw_grid();
}

function rotate_right() {
    angle += Math.PI / 2
    draw_grid();
}
