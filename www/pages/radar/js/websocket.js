$(window).unload(function () {
    closeWS();
    clearTimeout(timer)
});
$(document).ready(function () {
    console.log("！！！ websocket.js ready")
    createSocket("onMsg");
    window.addEventListener("onMsg", msgHandler);

    if (OutputType == 1) { $("#noOfObj_box").html(`目标数量：暂无数据`) }
    if (OutputType == 2) { $("#noOfObj_box").html(`近距离目标数量：暂无数据<br>远距离目标数量：暂无数据`) }
    $("#radar_version_box").html(`雷达版本<br> MajorRelease: 暂无数据<br> MinorRelease:暂无数据<br> PatchLevel:暂无数据
    <br>StandardRangeVersion: 暂无数据<br> InternationalVersion: 暂无数据`)
    $("#radar_state_box").html(`雷达状态<br> ID: 暂无数据<br> OutputType: 暂无数据 <br> MaxDistance: 暂无数据`)

})
function msgHandler(e) {
    let data = e.detail;
    switch (data.id) {
        case "state": //state = data.data;
            if (OutputType != data.OutputType) {
                FilterCfg_n = -1
                OutputType = data.OutputType;//全局使用
                if (OutputType == 1) { //object
                    $("#cluster-info").css({ 'pointer-events': 'none', 'opacity': '0.4' })
                    $("#a-coll-det").css({ 'opacity': '1' })
                }
                else if (OutputType == 2) { //cluster
                    $("#object-info").css({ 'pointer-events': 'none', 'opacity': '0.4' })
                    $("#a-coll-det").css({ 'opacity': '0.4' })
                } else { //none
                    $("#cluster-info").css({ 'pointer-events': 'none', 'opacity': '0.4' })
                    $("#object-info").css({ 'pointer-events': 'none', 'opacity': '0.4' })
                    $("#a-coll-det").css({ 'opacity': '0.4' })
                }
            }
            $("#radar_version_box").html(`雷达版本<br> MajorRelease: ${data.MajorRelease}<br> MinorRelease:  ${data.MinorRelease}<br> PatchLevel: ${data.PatchLevel}
            <br>StandardRangeVersion: ${EXTENDED_RANGE[data.ExtendedRange]}<br> InternationalVersion: ${COUNTRY_CODE[data.CountryCode]}`)
            $("#radar_state_box").html(`雷达状态<br> ID: ${data.SensorID}<br> OutputType: ${OUTPUT_TYPE[data.OutputType]} <br> MaxDistance: ${data.MaxDistance}m`)
            if (radar_waiting) {
                for (let key in data) {
                    if (key != "id") {
                        $(`#${key}`).val(data[key])
                    }
                }
                radar_waiting = false; clearTimeout(modal_timer)
                if ($("#RadarCfg").css('display') == "none") {
                    $("#RadarCfg").modal({})
                }
                $('#RadarCfg_msg').html(`雷达基本配置加载成功`)
                $('#RadarCfg_msg').removeClass("alert-warning").addClass("alert-success")
            }
            break;
        case "objects":
            objs = data.data
            $("#noOfObj_box").html(`目标数量：${objs.NofObjects}`)
            if (download_flag && objs.objs.length > 0) {
                if (download_data.length == 0) {
                    download_data.push(Object.keys(objs.objs[0]) + "\n")
                }
                objs.objs.forEach(obj => {
                    download_data.push(Object.values(obj) + "\n")
                })
            }
            if (!settingColl) {
                draw_obj(objs.objs)
            }
            break;
        case "clusters":
            objs = data.data
            $("#noOfObj_box").html(`近距离目标数量：${objs.NofClustersNear}<br>远距离目标数量：${objs.NofClustersFar}`)
            if (!settingColl) { draw_cluster(objs.clus) }
            break;
        case "filter_state":
            let state = data.data;
            $("#FilterCfg").find(`tr[name='${state.Index}']`).find("[type='checkbox']").prop("checked", !!state.Active);
            $("#FilterCfg").find(`tr[name='${state.Index}']`).find("[name='min']").val(state.Min_X)
            $("#FilterCfg").find(`tr[name='${state.Index}']`).find("[name='max']").val(state.Max_X)
            if (filter_waiting) {
                ++FilterCfg_n
                if ((FilterCfg_n == 5 && OutputType == 2) || (FilterCfg_n == 15 && OutputType == 1)) {
                    filter_waiting = false
                    clearTimeout(modal_timer)
                    if ($("#FilterCfg").css('display') == "none") {
                        $("#FilterCfg").modal({})
                    }
                    $('#FilterCfg_msg').html(`请求过滤器配置成功`)
                    $('#FilterCfg_msg').removeClass("alert-warning").addClass("alert-success")
                }
            }
            break;
        case "cd_state":
            cd_state = data.data;
            if (cd_waiting || settingColl) { //wait to show cd modal ||   cd modal is shown
                cd_waiting = false
                clearTimeout(modal_timer)
                if ($("#collReg").css('display') == "none") {
                    $("#collReg").modal({})
                }
                $("#cd_state_Activation").html(`配置是否使能：${ACTIVATION[cd_state.Activation]}`)
                $("#cd_state_NofRegions").html(`已配置区域数量：${cd_state.NofRegions} 个`)
                $("#cd_state_MinDetectTime").html(`最短探测时间：${cd_state.MinDetectTime} s`)
                $("#MinTime").val(cd_state.MinDetectTime)
                $("#Activation").prop("checked", !!cd_state.Activation)
                $('#collReg_msg').html(`收到碰撞检测消息`).removeClass("alert-warning").addClass("alert-success")
                //select
                if (!!cd_state.regions && cd_state.regions.length > 0) {
                    var region = cd_state.regions.filter(ele => {
                        return ele.RegionID == +$("#RegionID").val()
                    })
                    if (!!region && region.length > 0) {
                        $("#Activation_reg").prop("checked", true)
                        if (!$("#Coordinates_valid").is(":checked")) {
                            clear_canvas()
                            let re = {
                                x1: (+region[0].Point1X).toFixed(4), y1: (+region[0].Point1Y).toFixed(4),
                                x2: (+region[0].Point2X).toFixed(4), y2: (+region[0].Point2Y).toFixed(4)
                            }
                            $("#Point1X").val(re.x1)
                            $("#Point2X").val(re.x2)
                            $("#Point1Y").val(re.y1)
                            $("#Point2Y").val(re.y2)
                            let coord1 = XYToWindow_new(re.x1, re.y1)
                            let coord2 = XYToWindow_new(re.x2, re.y2)
                            ctx.strokeStyle = '#0f0'; ctx.setLineDash([0]); ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(coord1.x, coord1.y);
                            ctx.lineTo(coord1.x, coord2.y);
                            ctx.lineTo(coord2.x, coord2.y);
                            ctx.lineTo(coord2.x, coord1.y);
                            ctx.closePath();
                            ctx.stroke();

                        }
                    }
                }
            }
            break;
        default: break
    }
}

function draw_obj(list) { //when OutputType==1 && ws receive 'objects'
    if (!canvas) {
        canvas = document.getElementById("canvas");
        ctx = canvas.getContext('2d');
    }

    if (!!list && list.length > 0 && prop_info.length > 0) {
        canvas.width = canvas.width
        ctx.save()
        ctx.fillStyle = obj_color;
        list.forEach(ele => {//draw img
            let rect = XYToRect(ele.DistLong, ele.DistLat, ele.Width, ele.Length)
            ctx.fillRect(rect.x, rect.y, rect.width, rect.length);
        });
        ctx.fillStyle = obj_text_color;
        ctx.font = "12px 宋体";
        list.forEach(ele => {// draw text
            if (prop_info.indexOf(ele.DynProp) < 0) {
                return
            } else {
                if (item_info.length > 0) {
                    item_info.forEach((key, i) => {
                        let content = ""
                        if (key == "DynProp") {
                            content = `动态特性:${DYN_PROP[ele[key]]} `
                        } else if (key == "Class") {
                            content = `类型:${OBJ_CLASS[ele[key]]} `
                        } else if (key == "MeasState") {
                            content = `类型:${MEAS_STATE[ele[key]]} `
                        }
                        else if (key == "ProbOfExist") {
                            content = `${key}:${ele[key]}%`;
                        }
                        else {
                            content = `${key}:${ele[key]}`;
                        }
                        let rect = XYToRect(ele.DistLong, ele.DistLat, ele.Width, ele.Length)
                        ctx.fillText(content, rect.x, rect.y - 5 - i * 10);
                    })
                }
            }
        });
        ctx.restore()
    } //else {
    ;
    // }
}
function draw_cluster(list) {
    if (!canvas) {
        canvas = document.getElementById("canvas");
        ctx = canvas.getContext('2d');
    }
    if (!!list && list.length > 0 && prop_info.length > 0) {
        canvas.width = canvas.width
        ctx.save()
        ctx.fillStyle = clus_color;
        list.forEach(ele => {// draw rect
            let coord = XYToWindow_new(ele.DistLong, ele.DistLat)
            ctx.fillRect(coord.x - 2, coord.y - 2, 4, 4);

        });
        ctx.fillStyle = clus_text_color;
        ctx.font = "12px 宋体";
        list.forEach(ele => { //draw text
            if (prop_info.indexOf(ele.DynProp) < 0) {
                return
            } else {
                if (item_info.length > 0) {
                    item_info.forEach((key, i) => {
                        let content = ""
                        if (key == "DynProp") {
                            content = `动态特性:${DYN_PROP[ele[key]]} `
                        } else {
                            content = `${key}:${ele[key]}`;
                        }
                        let coord = XYToWindow_new(ele.DistLong, ele.DistLat)
                        ctx.fillText(content, coord.x, coord.y - 5 - i * 10);
                    })
                }
            }
        });
    }
}

function send_CollDetCfg() {
    let CollDetConfig = {
        WarningReset: +$("#WarningReset").is(":checked"), MinTime_valid: +$("#MinTime_valid").is(":checked"), Activation: +$("#Activation").is(":checked"),
        ClearRegions: +$("#ClearRegions").is(":checked"), MinTime: +$("#MinTime").val()
    }
    ws_send({ "id": "cd", "data": CollDetConfig })
}
function send_CollDetRegCfg() { //ws send cd_region
    let CollDetConfig = {
        Activation: +$("#Activation_reg").is(":checked"), Coordinates_valid: +$("#Coordinates_valid").is(":checked"),
        RegionID: +$("#RegionID").val(),
        Point1X: +$("#Point1X").val(), Point1Y: +$("#Point1Y").val(),
        Point2X: +$("#Point2X").val(), Point2Y: +$("#Point2Y").val()
    }
    ws_send({ "id": "cd_region", "data": CollDetConfig })
    // after send cd_region
    $("#Coordinates_valid").prop("checked", false)
    $("#region_div").css({ "opacity": "0.4" })
    $(".input-canvas").attr("disabled", true)
    clear_canvas()
    remove_draw_byHand()

}
function warning_alert(msg) {
    alert(msg)
}

function send_FilterCfg(Index, tar) {
    if (+$(tar).parents("tr").find("[name='min']").val() > +$(tar).parents("tr").find("[name='max']").val()) {
        warning_alert('警告！参数设置不合理'); $(tar).parents("tr").find("[name='min']").focus(); return
    } else {
        var FilterCfg = {
            Valid: 1, Index: Index, Type: OutputType,
            Active: +$(tar).parents("tr").find("[type='checkbox']").is(":checked"),
            Min_X: +$(tar).parents("tr").find("[name='min']").val(),
            Max_X: +$(tar).parents("tr").find("[name='max']").val(),
        }
        ws_send({ "id": "filter", "data": FilterCfg })
    }
}
function query_FilterCfg(Index, tar) {
    if (+$(tar).parents("tr").find("[name='min']").val() > +$(tar).parents("tr").find("[name='max']").val()) {
        warning_alert('警告！参数设置不合理'); $(tar).parents("tr").find("[name='min']").focus(); return
    } else {
        var FilterCfg = {
            Valid: 0, Index: Index, Type: OutputType % 2,
            Active: +$(tar).parents("tr").find("[type='checkbox']").is(":checked"),
            Min_X: +$(tar).parents("tr").find("[name='min']").val(),
            Max_X: +$(tar).parents("tr").find("[name='max']").val(),
        }
        ws_send({ "id": "filter", "data": FilterCfg })
    }
}
/**
    * 基本配置，发送配置
    */
function send_RadarCfg() {
    let RadarCfg = {
        MaxDistance_valid: +$('#MaxDistance_valid').is(':checked'), MaxDistance: +$("#MaxDistance").val(),
        SensorID_valid: +$('#SensorID_valid').is(':checked'), SensorID: +$("#SensorID").val(),
        RadarPower_valid: +$('#RadarPower_valid').is(':checked'), RadarPower: +$("#RadarPower").val(),
        OutputType_valid: +$('#OutputType_valid').is(':checked'), OutputType: +$("#OutputType").val(),
        SendQuality_valid: +$('#SendQuality_valid').is(':checked'), SendQuality: +$("#SendQuality").val(),
        SendExtInfo_valid: +$('#SendExtInfo_valid').is(':checked'), SendExtInfo: +$("#SendExtInfo").val(),
        SortIndex_valid: +$('#SortIndex_valid').is(':checked'), SortIndex: + $("#SortIndex").val(),
        StoreInNVM_valid: +$('#StoreInNVM_valid').is(':checked'), StoreInNVM: +$("#StoreInNVM").val(),
        CtrlRelay_valid: +$('#CtrlRelay_valid').is(':checked'), CtrlRelay: +$("#CtrlRelay").val(),
        RCS_Threshold_valid: +$('#RCS_Threshold_valid').is(':checked'), RCS_Threshold: +$("#RCS_Threshold").val(),
    }
    ws_send({ "id": "cfg", "data": RadarCfg })
}
function open_RadarCfg() {
    if (modal_timer) {
        clearTimeout(modal_timer)
    }
    radar_waiting = true
    modal_timer = setTimeout(function () {
        if ($('#RadarCfg').css('display') == "none") {
            $("#RadarCfg").modal({})
            clearTimeout(modal_timer)
            reset_RadarCfg()
            $('#RadarCfg_msg').removeClass("alert-success").addClass("alert-warning")
            $('#RadarCfg_msg').html(`请求过滤器配置失败，页面显示为默认配置`)
        }
    }, 1200)

}
function open_FilterCfg() {
    if (modal_timer) {
        clearTimeout(modal_timer)
    }
    if (FilterCfg_n < 0) {

        filter_waiting = true; FilterCfg_n = 0;
        modal_timer = setTimeout(function () {
            if ($('#FilterCfg').css('display') == "none") {
                $("#FilterCfg").modal({})
                clearTimeout(modal_timer)
                $('#FilterCfg_msg').html(`请求过滤器配置失败，页面显示为默认配置`)
                $('#FilterCfg_msg').addClass("alert alert-warning")
                FilterCfg_n = -1
            }
        }, 2000)
        ws_send({ "id": "filter", "data": { "ALL": 1, "type": OutputType % 2 } })// 用于请求所有过滤器配置
    } else {
        $("#FilterCfg").modal({})
        $('#FilterCfg_msg').html(`页面显示为缓存过滤器配置`)
    }

}

function open_coll_det() {
    if (OutputType == 1) {
        if (modal_timer) {
            clearTimeout(modal_timer)
        }
        cd_waiting = true;
        modal_timer = setTimeout(function () {
            if ($("#collReg").css('display') == "none") {
                $("#collReg").modal({})
                clearTimeout(modal_timer)
                $('#collReg_msg').removeClass("alert-success").addClass(" alert-warning")
                $('#collReg_msg').html(`未收到碰撞检测消息`)
                $("#cd_state_Activation").html(`配置是否使能：未知`)
                $("#cd_state_NofRegions").html(`已配置区域数量：未知`)
                $("#cd_state_MinDetectTime").html(`最短探测时间：未知`)
            }
        }, 1200)
    } else {
        alert("碰撞检测仅作用于Object目标")
        return false
    }
}

function open_lane_set() {
    if ($("#LaneSet").css('display') == "none") {
        $("#LaneSet").modal({})
    }
}
function set_lane() {
    let list = $("#lane_container input[type='textarea']").toArray()
    let polys = []
    list.forEach(ele => {
        polys.push({ "points": JSON.parse(ele.value) })
    })
    lanes = {
        "enable": $("#lane_container input[type='checkbox']").is(":checked"),
        "polygons": polys
    }
    ws_send({ "id": "req", "type": "les_app", "data": lanes })
}