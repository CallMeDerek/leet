/*
 * @Author: your name
 * @Date: 2021-11-01 18:09:36
 * @LastEditTime: 2021-11-03 17:41:24
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \www\pages\js\variable.js
 */

// 绘图
var img, canvas2, _bgctx2, canvas_bg2, ctx_bg2,
    container
// 绘制车道
var come_num = 4, leave_num = 3, come_width = 3.5, leave_width = 3.75 //来向&去向车道数量&宽度
median = 6, come_bike = 3, leave_bike = 3//非机动车道/自行车道,中央隔离带
intersection = 0, base_y = 0 //雷达与车道方向夹角,雷达位置
waiting = 20;//等待线距离

