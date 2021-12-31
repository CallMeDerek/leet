/*
 * @Author: your name
 * @Date: 2021-11-01 18:09:36
 * @LastEditTime: 2021-11-03 17:41:24
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \www\pages\js\variable.js
 */
// websocket
const WS_URL = `ws://${window.location.hostname}:8000`// `ws://192.168.60.161:8000`//  192.168.60.161
var state, cd_state, objs;
var timer, socket, flag = true;
// 主绘图
var canvas, ctx, canvas_bg, ctx_bg, imgScale = 1, angle = 0;
//坐标系参数
var xs, ys, x_step = 10, y_step = 10, x_origon = 20, y_origon = 0,
    x_min = -20, x_max = 80, y_min = -40, y_max = 40, translateX = 0, translateY = 0;
var canvas_w, canvas_h, w_max, h_max, x_offset, y_offset,
    canvas_width, canvas_height, w;
const padding = 50;
var scaleX = 0, scaleY = 0, offX = 0, offY = 0
//定时器
var n = 0
//鼠标事件
var p_start = { x: 0, y: 0 }, loc, dragTimmer = null, isDragging = false
// 碰撞区域绘图
var drawingSurfaceImageData, mousedown = {}, rubberbandRect = {}, dragging = false,
    settingColl = false; //设置碰撞区域时，不画点
//渠化绘图
var lanes = {}, points = [], pointsXY = [], isDrawing = false, isPointAdd = false, laneIndex = 0
//显示设置
var item_info = ['id'], prop_info = [0, 1, 2, 3, 4, 5, 6, 7];//目标信息,目标属性
var obj_color = "#0000ff", obj_text_color = "#ff0000",
    clus_color = "#0000ff", clus_text_color = "#ff0000";//绘制颜色
// 全局
var OutputType = 0;//1:object,2:cluster
var download_flag = false, download_data = [];
//对话框设置
var radar_waiting = false, filter_waiting = false, cd_waiting = false, FilterCfg_n = -1, modal_timer = null;
var tim = 0
// 常量
const ACTIVATION = { 0: '关闭', 1: '使能' };
const EXTENDED_RANGE = { 0: '标准距离', 1: '扩展距离' };
const COUNTRY_CODE = { 0: '国际版本', 1: '日韩版本' };
const OUTPUT_TYPE = { 0: 'None', 1: 'Object', 2: "Cluster" }
const DYN_PROP = { 0: "运动的", 1: "静止的", 2: "来向的", 3: "静止候选的", 4: "未知的", 5: "横穿静止的", 6: "横穿运动的", 7: "停止的" }
const OBJ_CLASS = { 0: "点目标", 1: "小汽车", 2: "卡车/客车", 3: "行人", 4: "摩托车/电动车", 5: "自行车", 6: "宽大目标", 7: "保留" }
const MEAS_STATE = { 0: "已删除", 1: "新创建的", 2: "测量的", 3: "预测的", 4: "已删除以进行合并聚类", 5: "从合并聚类中新创建的", }
const DOTRADIUS = 2
const SCALE = 0.06
