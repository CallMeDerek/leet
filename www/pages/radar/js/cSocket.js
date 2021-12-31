$(window).unload(function () {
    closeWS();
    clearTimeout(timer)
});
$(document).ready(function () {
    createSocket("onMsg");
    window.addEventListener("onMsg", msgHandler);

    // $("#radar_version_box").html(`雷达版本<br> MajorRelease: 暂无数据<br> MinorRelease:暂无数据<br> PatchLevel:暂无数据
    // <br>StandardRangeVersion: 暂无数据<br> InternationalVersion: 暂无数据`)
    // $("#radar_state_box").html(`雷达状态<br> ID: 暂无数据<br> OutputType: 暂无数据 <br> MaxDistance: 暂无数据`)

})


function msgHandler(e) {
    let data = e.detail;
    switch (data.id) {
        case "objects":
            objs = data.data
            if (!settingColl && objs.NofObjects > 0) {
                draw_obj(objs.objs)
                draw_obj_alg(objs.objs)
            }
            break;
        case "alg":
            console.log(data)
            if (!settingColl && objs.NofObjects > 0) {
                draw_obj_alg(objs.objs)
            }
            break;
        default: break
    }
}

function draw_obj(list) { //when OutputType==1 && ws receive 'objects'
    if (!canvas) {
        canvas = document.getElementById("canvas_origon");
        ctx = canvas.getContext('2d');
    }
    if (!!list && list.length > 0) {
        canvas.width = canvas.width
        ctx.save()
        ctx.fillStyle = "#0000ff";
        list.forEach(ele => {
            let rect = XYToRect(ele.DistLong, ele.DistLat, ele.Width, ele.Length)
            ctx.fillRect(rect.x, rect.y, rect.width, rect.length);
        });
        ctx.restore()
    } //else {
    //     // restoreGridSurface();
    // }
}

function draw_obj_alg(list) { //when OutputType==1 && ws receive 'objects'
    if (!canvas2) {
        canvas2 = document.getElementById("canvas_origon");
        ctx2 = canvas.getContext('2d');
    }
    if (!!list && list.length > 0) {
        canvas2.width = canvas2.width
        ctx2.save()
        ctx2.fillStyle = "#0000ff";
        ctx2.translate(Math.round(translateY + offX), Math.round(translateX + offY))
        if (angle != 0) {
            ctx2.rotate(angle)
        }
        if (imgScale != 1) {
            ctx2.scale(imgScale, imgScale)
        }
        list.forEach(ele => {
            let coord = XYToWindow(ele.DistLong, ele.DistLat)
            let width = (w * ele.Width).toFixed(2)
            let length = (w * ele.Length).toFixed(2)
            // draw rect
            ctx2.fillRect(coord.y - width / 2, coord.x - length / 2, width, length);
        });
        ctx2.restore()
    } else {
        // restoreBgSurface();
    }
}