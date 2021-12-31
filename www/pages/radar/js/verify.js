// 雷达配置

function MaxDistance_verify(obj) {//有效范围[0,2046],分辨率2
    if (obj.value < 0 || !obj.value) { obj.value = 0 }
    else if (obj.value > 2046) { obj.value = 2046 }
    else { obj.value = obj.value.replace(/[^\d]/g, ""); }
}

// 滤波器配置
function check_range_0_128(obj) {//[0,128.9925],step=0.0315
    if (obj.value < 0 || !obj.value) { obj.value = 0 }
    else if (+(obj.value) > 128.9925) { obj.value = 128.9925 }
}
function check_range_0_4095(obj) {//[0,4095],step=1
    if (obj.value < 0 || !obj.value) { obj.value = 0 }
    else if (obj.value > 4095) { obj.value = 4095 }
    else { obj.value = obj.value.replace(/[^\d]/g, ""); }
}
function check_range_0_409p5(obj) {//[0,409.5],step=0.1
    if (obj.value < 0 || !obj.value) { obj.value = 0 }
    else if (+(obj.value) > 409.5) { obj.value = 409.5 }
    else { obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d).*$/, '$1$2.$3'); }
}
function check_range_50_52(obj) {//[-50,52.375],step=0.025
    if (obj.value < -50) { obj.value = -50 }
    else if (+(obj.value) > 52.375) { obj.value = 52.375 }
    // else if (!obj.value) { obj.value = 0 }
}
function check_range_0_102(obj) {//[0,102.375],step=0.025
    if (obj.value < 0 || !obj.value) { obj.value = 0 }
    else if (+(obj.value) > 102.375) { obj.value = 102.375 }
}
function check_range_Y(obj) {//[-409.5,409.5],step=0.2
    if (obj.value < -409.5) { obj.value = -409.5 }
    else if (+(obj.value) > 409.5) { obj.value = 409.5 }
    // else if (!obj.value ) { obj.value = 0 }
}
function check_range_X(obj) {//[-500,1138.2],step=0.2
    if (obj.value < -500) { obj.value = -500 }
    else if (+(obj.value) > 1138.2) { obj.value = 1138.2 }
    // else if (!obj.value) { obj.value = 0 }
}

function check_step_0315(obj) {//0.0315
    if (+obj.value / 0.0315 % 1) {
        obj.value = (0.0315 * Math.floor(obj.value / 0.0315)).toFixed(4)
    }
}

function check_step_025(obj) {//0.025
    if (!obj.value) { obj.value = 0 }
    else if (obj.value * 40 % 1) {
        obj.value = Math.floor(obj.value * 40) / 40
    }
}
function check_step_2(obj) {
    if (obj.value % 2 != 0) { obj.value = Math.floor(obj.value / 2) * 2 }
}
function check_step_02(obj) {//0.2
    if (!obj.value) { obj.value = 0.1 }
    else if (obj.value * 5 % 1 == 0) {
        console.log(obj.value)
        obj.value = Math.floor(obj.value * 10 + 1) / 10
        console.log(obj.value)
    }
}

function check_range_0_25p5(obj) {//[0,25.5],step=0.1
    if (obj.value < 0 || !obj.value) { obj.value = 0 }
    else if (+(obj.value) > 25.5) { obj.value = 25.5 }
    else { obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d).*$/, '$1$2.$3'); }
}