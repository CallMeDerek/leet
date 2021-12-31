$(document).ready(function () {
    init_right_menu()
    on_resize();
    init_canvas_event();


    $('#CoordCfg').on('show.bs.modal', function () { settingColl = true })
    $('#CoordCfg').on('hidden.bs.modal', function () { settingColl = false; })
    $('#laneCfg').on('show.bs.modal', function () { settingColl = true })
    $('#laneCfg').on('hidden.bs.modal', function () { settingColl = false; })
})

//尺寸自適應
function on_resize() {
    console.log('on resize')
    canvas_width = Math.floor((window.innerWidth - 90) / 2)
    canvas_height = Math.floor(window.innerHeight - 80)

    canvas = document.getElementById('canvas_origon'); ctx = canvas.getContext('2d');
    canvas2 = document.getElementById('canvas_handle'); ctx2 = canvas2.getContext('2d');
    canvas_bg = document.getElementById('canvas_bg'); ctx_bg = canvas_bg.getContext('2d');
    canvas_bg2 = document.getElementById('canvas_bg2'); ctx_bg2 = canvas_bg2.getContext('2d');

    canvas.width = canvas_width; canvas.height = canvas_height;
    canvas2.width = canvas_width; canvas2.height = canvas_height;
    canvas_bg.width = canvas_width; canvas_bg.height = canvas_height;
    canvas_bg2.width = canvas_width; canvas_bg2.height = canvas_height;

    calculate_size()
    draw_grid()
    draw_bg()
}


function init_right_menu() {
    document.oncontextmenu = function (e) {
        e = e || window.event;
        if (e && e.preventDefault) { e.preventDefault() } //阻止浏览器默认行为W3C
        $("#box-menu").css({ 'display': 'inline-block', left: e.clientX + 'px', top: e.clientY + 'px' })
    }
    document.addEventListener("click", function () {
        // 在右键菜单之外单击时，将右键菜单隐藏
        $(".box-menu").css({ 'display': 'none' })
    }, false);

    $("#set_lane_div").click(show_lane_modal)
    $("#set_coord_div").click(show_coord_modal)
    function show_lane_modal() {
        $(".box-menu").css("cssText", "display:none !important;")
        $("#intersection").val(intersection); $("#base_y").val(base_y)
        $("#come_num").val(come_num); $("#come_width").val(come_width); $("#come_bike").val(come_bike)
        $("#leave_num").val(leave_num); $("#leave_width").val(leave_width); $("#leave_bike").val(leave_bike)
        $("#median").val(median); $("#waiting").val(waiting);
        $("#laneCfg").modal({});
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
    draw_bg()
    console.log('set_coord grid')
}
function set_lane() {
    $('#laneCfg').modal('hide')
    intersection = +$("#intersection").val(); base_y = +$("#base_y").val()
    come_num = +$("#come_num").val(); come_width = +$("#come_width").val(); come_bike = +$("#come_bike").val()
    leave_num = +$("#leave_num").val(); leave_width = +$("#leave_width").val(); leave_bike = +$("#leave_bike").val()
    median = +$("#median").val(); waiting = + $("#waiting").val();
    draw_bg()
    settingColl = true
    console.log('set_lane')
}

function init_canvas_event() {
    container = document.getElementById('main-container')
    canvas.addEventListener("mousedown", startDragging);
    canvas.addEventListener("mousemove", onDragging);
    canvas.addEventListener("mouseup", stopDragging);
    container.addEventListener('mousewheel', handlerMouseWheel);
    container.addEventListener('DOMMouseScroll', handlerMouseWheel);//firefox78
}
function startDragging(e) {
    if (e.which == 1) { //左键
        isDragging = false;
        p_start = { x: e.clientX, y: e.clientY }
        dragTimmer = setTimeout(setDragTrue, 200)
    }
    function setDragTrue() {
        isDragging = true
        settingColl = true
    }
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
        offX += Math.round((loc.x - p_start.x))
        offY += Math.round((loc.y - p_start.y))
        draw_grid()
        draw_bg()
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
        if (imgScale < 0.7) {
            alert("已缩放至最小")
            return
        } else {
            imgScale -= SCALE;
        }
    }
    setTimeout(function () {
        draw_grid()
        draw_bg()
    }, 200)
}

function rotate_left() {
    angle -= Math.PI / 2
    draw_grid()
    draw_bg()
}

function rotate_right() {
    angle += Math.PI / 2
    draw_grid()
    draw_bg()
}

