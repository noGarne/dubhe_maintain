<template>
  <div class="load-container" :key="pageKey">

    <!-- 搜索回到原点 -->
    <base-map-control-bar
      :zoom="zoom"
      :maxZoom="maxZoom"
      :minZoom="minZoom"
      @getBounds="getBounds"
      @setZoom="setZoom"  
    >
    </base-map-control-bar>

    <div class="map-info">
      <div class="map-title" v-if="id&&id!=0">
          采装设备推进方向：
          <el-radio-group size="small" class="radio-group" v-model="shovelInfo.currentDirection" @change="updateDirection">
            <el-radio-button v-for="(item,index) in directionInfo" :key="index" :label="item.id"></el-radio-button>
          </el-radio-group>
      </div>
      <div class="map-button" v-if="id&&id!=0">
        <!-- 导入 -->
        <label class="upload-label">
            <input type="file" name="file" @input="importFile" hidden>
            <span class="btnGray el-button upload-btn">导入</span>
        </label>
        <!-- 绘制 -->
        <el-button class="btnGray" @click.once="drawPath">绘制</el-button>
        <!-- 规则设置 -->
        <el-button class="btnGray" @click="setRule">规则设置</el-button>
        <!-- 生成预览 -->
        <el-button class="btnGray" @click="moveShovel">设置位置</el-button>
        <!-- 保存 -->
        <el-button class="btnGray" @click="saveClick">保存</el-button>
        <!-- 发布 -->
        <el-button class="btnGray" @click="publishClick">发布</el-button>
      </div>
    </div>
    
    <l-map class="map" ref="map" :zoom="zoom" :center="center" :options="options" :style="{cursor:drawStyle}">
    </l-map>
    <rule-set ref="ruleSet"></rule-set>
  </div>
</template>

<script>
import shovelMovementServer from "../js/shovelMovement.server";

const RuleSet=()=>import('./RuleSet')

import {
  LMap,
  LTileLayer,
  LPolyline,
  LPolygon
} from "vue2-leaflet";
import "leaflet/dist/leaflet.css";
import "../css/leaflet.toolbar.css";
import "../js/leaflet.toolbar";
import "../css/leaflet.distortableimage.css";
import "../js/leaflet.distortableimage";
import FreeDraw, { CREATE, EDIT } from "leaflet-freedraw";
import shoveImg from "../images/shovel.png";
import lineUtils from  '../js/lineUtils'
import  '../js/leaflet.polylineDecorator';

export default {
  name: "ShovelMovementMap",
  components: {
    LMap,
    LTileLayer,
    LPolyline,
    LPolygon,
    RuleSet
  },
  data() {
    return {
      pageKey: "",
      map: null,
      drawArea: null,
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      zoom: 16,
      center: [41.80327413, 109.9870751],
      options:{
        attributionControl: false,
        zoomControl:false,
      },
      polylineOld: {
        latlngs: [],
        color: "#0f0"
      },
      polylineNew: {
        latlngs: [],
        color: "#f00"
      },
      polylineArea: {
        latlngs: [],
        color: "#3388ff"
      },
      id: "",
      shovelInfo:{
        img: null,
        radius: 10,
        position: [],
        angle: 0,
        direction: 0,
        currentDirection:'',
        odd: 0,
        arrow: null,
        path: null,
        oldPath:null,
        drawPath:null
      },
      diggingAreaDetails:{},
      directionInfo:[{
        name:"0",
        id:"← 左边"
      },{
        name:"1",
        id:"右边 →"
      }],
      drawStyle:'default',
      isShowBtn:{
        save:false,
        publish:false,
        upload:false
      }
    };
  },
  watch: {
    $route(to, from) {
      this.id = to.params.id;
      if(to != from){
        this.pageKey = this.id;
      }
    console.log(333,this.id);
      if (this.id != 0) {
    console.log(444,this.id);
        this.clearShovelInfo();
        this.getDetail();
      }else{
    console.log(555,this.id);
        this.clearAll();
      }
    }
  },
  created() {
    this.id = this.$route.params.id;
    if(this.id != 0){
      this.getDetail();
    }
  },
  methods: {
    async getDetail() {
      //采装设备移动规划详情
      try {
        let result = await shovelMovementServer.getBoundaryDetail(this.id);
        if (result) {
          this.diggingAreaDetails = result;
          this.polylineOld.latlngs = [];
          this.polylineNew.latlngs = [];
          this.polylineArea.latlngs = [];
          let uploadBoundary = result.uploadBoundary;
          let drawBoundary = result.drawBoundary;
          let digPath = result.digPath;
          let startDirection = result.startDirection || 0;
          this.shovelInfo.angle = startDirection;
          if(uploadBoundary && (!digPath || this.isShowBtn.upload)){
            this.polylineOld.latlngs = shovelMovementServer.getPolygonData(uploadBoundary);
            this.isShowBtn.upload = false;
          }
          if(drawBoundary) {
            this.polylineArea.latlngs = shovelMovementServer.getPolygonData(drawBoundary);
            this.drawArea = shovelMovementServer.getPolygonArray(drawBoundary);
            if(!result.publish){
              this.isShowBtn.publish = true;
            }
          } else{
            this.isShowBtn.publish = false;
          }
          if (digPath) {
            this.polylineNew.latlngs = shovelMovementServer.getPolygonData(digPath);
          }
          // 初始化地图
          this.$nextTick(()=>{
            this.initMap();
          });
        }
      } catch (e) {
        this.messages.error(e.message);
      }
    },
    clearAll(){
      this.polylineOld.latlngs = [];
      this.polylineNew.latlngs = [];
      this.polylineArea.latlngs = [];
    },
    async importFile(ev) {
      //导入
      try {
        var objFile=ev.target.files[0];
        if(!objFile){
          this.messages.error('请上传文件');
          return;
        }
        let size200M = objFile.size / 1024 / 1024 < 200;
        if (!size200M) {
          this.messages.error('上传文件大小不能超过 200MB!');
          return;
        }
        let formData = new FormData();
        formData.append('file',objFile);
        formData.append('digAreaId',this.id);
        let res = await shovelMovementServer.uploadPath(formData,function(uploadPercent,uploadEvent){
            // _this.percent=uploadPercent;
            // _this.$parent.appendApp(_this.percent);
        },function(cancelEvent){
            // _this.percent=0;
        });
        this.isShowBtn.upload = true;
        this.getDetail();
        this.messages.success(this.$t('action.operate-success'));
      } catch (e) {
        this.messages.error(e.message);
      }
    },
    drawPath() {
      //绘制
      if(this.shovelInfo.drawPath){
        this.shovelInfo.drawPath.remove();
        this.shovelInfo.drawPath = null;
      }
      let _this = this;
      let freeDraw = null;
      if(this.polylineArea.latlngs.length > 0){
        freeDraw = new FreeDraw({
          mode: EDIT,
          maximumPolygons: 1
        });
        this.map.addLayer(freeDraw);
        freeDraw.create(this.drawArea[0]);
      } else {
        this.drawStyle = "crosshair";
        freeDraw = new FreeDraw({
          mode: CREATE | EDIT,
          maximumPolygons: 1
        });
        this.map.addLayer(freeDraw);
      }
      this.map.on("mousedown", function(e) {
        if (freeDraw.size() > 0) {
          freeDraw.cancel();
          _this.map.dragging.enable();
        }
        // console.log(freeDraw);
      });
      freeDraw.on("markers", function(e){
        // console.log(e, freeDraw,e.latLngs);
        _this.drawArea = e.latLngs;
        _this.drawStyle = "default";
        _this.setPreview();
      });
    },
    setRule() {
      //规则设置
      this.$refs.ruleSet.getInfo(this.diggingAreaDetails);
    },
    updateDetails(data){
      // 设置规则更新规则
      this.diggingAreaDetails = data;
      // 可移动的采装设备
      // this.moveShovel();
      // 规则
      if(data.digWay == 'TYPE_TWO'){
        this.shovelInfo.odd = 1;
      }
      // 半径
      let radius = data.digRadius * data.percentage / 100.00;
      this.shovelInfo.radius = radius;
    },
    setPreview() {
      //生成预览
      if(this.shovelInfo.path){
        this.shovelInfo.path.remove();
        this.shovelInfo.path = null;
      }
      if(this.shovelInfo.arrow){
        this.shovelInfo.arrow.remove();
        this.shovelInfo.arrow = null;
      }
      if(!this.drawArea){
        // this.messages.error('请先绘制区域');
        return;
      }
      let drawAreaPoints = this.drawArea[0].map(v=>{
        return [v.lat,v.lng];
      });
      if(!this.diggingAreaDetails.shovelSn){
        // this.messages.error('请先设置采装设备规则');
        return;
      }
      if(!this.shovelInfo.img){
        // this.messages.error('请先设置采装设备位置');
        return;
      }
      let angle = 360 - this.shovelInfo.angle;
      //生成路径
      this.createPath(drawAreaPoints, this.shovelInfo.radius, this.shovelInfo.position, angle, this.shovelInfo.direction, this.shovelInfo.odd);
    },
    saveClick() {
      //保存
      if(!this.drawArea){
        this.messages.error('请先绘制区域');
        return;
      }
      if(!this.diggingAreaDetails.shovelSn){
        this.messages.error('请先设置采装设备规则');
        return;
      }
      if(!this.shovelInfo.img){
        this.messages.error('请先设置采装设备位置');
        return;
      }
      if(!this.shovelInfo.path){
        this.messages.error('请先移动采装设备生成规划路径');
        return;
      }
      let _this = this;
      let drawBoundary = this.drawArea[0];
      let digPath = this.shovelInfo.path._latlngs;
      let drawBoundaryStr = shovelMovementServer.getPolygonString(drawBoundary);
      let digPathStr = shovelMovementServer.getPolygonString(digPath);
      let startPostiton = this.shovelInfo.position;
      let startDirections = this.shovelInfo.angle;
      let shovelSn = this.diggingAreaDetails.shovelSn;
      let digWay = this.diggingAreaDetails.digWay;
      let digWayDesc = this.diggingAreaDetails.digWayDesc;
      let corners = this.diggingAreaDetails.corners;

      this.$messageConfirm.showConfirm({
        content:this.$t('pages.confim-save-tips'),
        // detail:'提示详情'
      },async ()=>{
        // 确定操作
        try {
          let info={
            drawBoundary:drawBoundaryStr,
            shovelSn:shovelSn,
            digWay:digWay,
            digWayDesc:digWayDesc,
            digPath:digPathStr,
            startLatitude:startPostiton[0],
            startLongitude:startPostiton[1],
            startDirection:startDirections,
            corners:corners
          };
          let res = await shovelMovementServer.savePath(_this.id,info);
          _this.isShowBtn.save = false;
          _this.initShovelInfo();
          _this.getDetail();
          _this.messages.success(this.$t("action.operate-success"));
        } catch (err) {
          _this.messages.error(err.message);
        }
      });
    },
    publishClick() {
      //发布，先保存
      if(!this.drawArea){
        this.messages.error('请先绘制区域');
        return;
      }
      if(!this.diggingAreaDetails.shovelSn){
        this.messages.error('请先设置采装设备规则');
        return;
      }
      if(!this.shovelInfo.img){
        this.messages.error('请先设置采装设备位置');
        return;
      }
      if(!this.shovelInfo.path){
        this.messages.error('请先移动采装设备生成规划路径');
        return;
      }
      let _this = this;
      let drawBoundary = this.drawArea[0];
      let digPath = this.shovelInfo.path._latlngs;
      let drawBoundaryStr = shovelMovementServer.getPolygonString(drawBoundary);
      let digPathStr = shovelMovementServer.getPolygonString(digPath);
      let startPostiton = this.shovelInfo.position;
      let startDirections = this.shovelInfo.angle;
      let shovelSn = this.diggingAreaDetails.shovelSn;
      let digWay = this.diggingAreaDetails.digWay;
      let digWayDesc = this.diggingAreaDetails.digWayDesc;
      let corners =this.diggingAreaDetails.corners;

      this.$messageConfirm.showConfirm({
        content:this.$t('pages.confim-publish-tips'),
        // detail:'提示详情'
      },async ()=>{
        // 确定操作
        try {
          let info={
            drawBoundary:drawBoundaryStr,
            shovelSn:shovelSn,
            digWay:digWay,
            digWayDesc:digWayDesc,
            digPath:digPathStr,
            startLatitude:startPostiton[0],
            startLongitude:startPostiton[1],
            startDirection:startDirections,
            corners:corners
          };
          let res = await shovelMovementServer.savePath(_this.id,info);
          // 发布
          let res2 = await shovelMovementServer.publishPath(_this.id);
          _this.isShowBtn.save = false;
          _this.isShowBtn.publish = false;
          _this.initShovelInfo();
          _this.getDetail();
          _this.messages.success(this.$t("action.operate-success"));
        } catch (err) {
          _this.messages.error(err.message);
        }
      });
    },
    initMap() {
      // 初始化地图
      if(!this.$refs.map){
        return;
      }
      this.map = this.$refs.map?this.$refs.map.mapObject:null;
      if(!this.map)return;
 
      // 显示路径
      if(this.polylineOld.latlngs.length > 0){
        // 导入的路径
        this.shovelInfo.oldPath = L.polyline(this.polylineOld.latlngs, {color: this.polylineOld.color,dashArray:'10'}).addTo(this.map);//this.$refs.oldPath.mapObject;
        this.$nextTick(()=>{
          this.map.fitBounds(this.shovelInfo.oldPath.getBounds(),{padding:[200,200]});
        });
      }
      if(this.polylineNew.latlngs.length > 0){
        // 规划的路径
        this.shovelInfo.path = L.polyline(this.polylineNew.latlngs, {color: this.polylineNew.color}).addTo(this.map);//this.$refs.newPath.mapObject;
        this.$nextTick(()=>{
          this.map.fitBounds(this.shovelInfo.path.getBounds(),{padding:[200,200]});
        });
        this.moveShovel();
        this.setArrow();
      }
      if(this.polylineArea.latlngs.length > 0){
        // 绘制的路径
        this.shovelInfo.drawPath = L.polyline(this.polylineArea.latlngs, {color: this.polylineArea.color}).addTo(this.map);//this.$refs.newPath.mapObject;
      }

      // 初始化采装设备推进方向为左边
      if(this.shovelInfo){
        this.shovelInfo.currentDirection = this.directionInfo[0].id;
        this.shovelInfo.direction = this.directionInfo[0].name;
      }

      // end初始化地图
    },
    moveShovel(){
      // 移动采装设备
      let _this = this;
      this.map.doubleClickLabels.disable();
      this.map.doubleClickZoom.disable();

      let img = this.shovelInfo.img;
      if(img){
        img.remove();
        img = null;
      }
      let obj = L.distortableImageOverlay(shoveImg, {
        actions: [L.DragAction, L.RotateAction],
        mode: "rotate",
        suppressToolbar: true,
        rotation: {
          deg: _this.diggingAreaDetails.startDirection
        },
        corners:JSON.parse(_this.diggingAreaDetails.corners)
      })
      img = obj.addTo(this.map);
      this.shovelInfo.img = img;

      // 移动事件
      L.DomEvent.on(
        img._image,
        "load",
        function() {
          // 初始位置
          let imgBounds = img._bounds;
          let imgNorth = imgBounds.getNorthEast();
          let imgCenter = imgBounds.getCenter();
          _this.shovelInfo.position = [imgNorth.lat,imgCenter.lng];

          img.on('update', function (e) {
            // 移动、旋转事件
            // console.log('update', e)
            let obj = e.target;
            let mode = obj.editing._mode;
            let centers = obj.getCenter();
            let rotationAngle = obj.rotation;
            _this.shovelInfo.angle = rotationAngle + (_this.diggingAreaDetails.startDirection || 0);
            let rotation = 360 - _this.shovelInfo.angle;

            // 移动后的坐标
            let corners = obj.getCorners();
            let bounds = obj.getBounds();
            let northPoint = bounds.getNorthEast();
            let centerPoint = bounds.getCenter();
            let arrowPoint = [northPoint.lat,centerPoint.lng];
            let arrowPointNew =  lineUtils.rotatePoint(_this.map,arrowPoint,rotation,centers);
            _this.shovelInfo.position = [arrowPointNew.lat,arrowPointNew.lng];
            _this.diggingAreaDetails.corners = JSON.stringify(corners);
            // console.log(arrowPoint,arrowPointNew);
            _this.setPreview();
          }, img);
        },
        img
      );

    },
    updateDirection(v){
      // 修改采装设备推进方向
      this.shovelInfo.direction = this.utils.getObjValByKey(this.directionInfo,v);
      this.setPreview();
    },
    createPath(lineArea, startDistance, startPoint, startAngle, startDirection, odd){
      // 生成路径
      let crossObject = lineUtils.getPath(this.map, lineArea, startDistance, startPoint, startAngle, startDirection);
      if(!crossObject){
        // this.messages.error('暂无有效路径规划，请将采装设备移动到区域外合适位置并指定方向');
        return;
      }
      let cross = crossObject.cross;
      let crossLine = crossObject.line;
      let crossLength = crossLine.length;

      // 生成奇数平行线
      if(odd == 1 && crossLength > 1 && crossLength % 2 == 0){
        // 间隔距离缩短，多生成一条线，保证是奇数线
        let minDistance = startDistance - (startDistance * 0.1 * 10) / crossLength;
        crossObject = lineUtils.getPath(this.map, lineArea, minDistance, startPoint, startAngle, startDirection);
        cross = crossObject.cross;
      }
      // console.log(cross,crossLength);
      this.shovelInfo.path = L.polyline(cross, {color: '#f00'}).addTo(this.map);
      this.isShowBtn.save = true;

      this.setArrow();
    
      // end生成路径
    },
    setArrow(){
      if(this.shovelInfo.path){
        // 方向箭头
        this.shovelInfo.arrow = L.polylineDecorator(this.shovelInfo.path, {
            patterns: [
                {offset: 30, repeat: '99%', symbol: L.Symbol.arrowHead({pixelSize: 10, polygon: false, pathOptions: {stroke: true,color: '#f00'}})}
            ]
        }).addTo(this.map);
     }
    },
    initShovelInfo(){
      let img = this.shovelInfo.img;
      if(img){
        img.remove();
      }
      if(this.shovelInfo.oldPath){
        this.shovelInfo.oldPath.remove();
        this.shovelInfo.oldPath = null;
      }
      if(this.shovelInfo.path){
        this.shovelInfo.path.remove();
        this.shovelInfo.path = null;
      }
      if(this.shovelInfo.arrow){
        this.shovelInfo.arrow.remove();
        this.shovelInfo.arrow = null;
      }
    },
    clearShovelInfo(){
      this.shovelInfo = {
        img: null,
        radius: 10,
        position: [],
        angle: 0,
        direction: 0,
        currentDirection:'',
        odd: 0,
        arrow: null,
        path: null,
        oldPath:null,
        drawPath:null
      };
      this.drawArea = null;
    }
  }
};
</script>

<style lang="scss" scoped>
.load-container {
  position: relative;
  // position: absolute;
  // top: 0;
  // bottom: 0;
  // left: 230px;
  // right: 0;
  height: 100%;
  width: 100%;
  .map {
    height: calc(100% - 50px);
    width: 100%;
    z-index: 1;
    .map-icon {
      font-size: 28px;
      padding-left: 3px;
      cursor: pointer;
    }
  }
  .map-info {
    position: absolute;
    top: 5px;
    left: 20px;
    height: 40px;
    z-index: 2;
    display: flex;
    // justify-content: space-between;
    align-items: center;
    width: calc(100% - 100px);
    .map-title {
      font-size: 14px;
      color: $textGrayColor;
      height: 40px;
      line-height: 40px;
      padding-right: 30px;
    }
    .el-button {
      // width: 90px;
      padding: 4px 15px;
      height: 32px;
      i{
        font-size: 14px;
      }
    }
    .upload-label{
      vertical-align: top;
      .upload-btn{
        margin-right: 10px;
        line-height: 22px;
      }
    }
  }
  .draw-cursor-style{
    cursor: crosshair;
  }
  .default-cursor-style{
    cursor: default;
  }
}
</style>
<style lang="scss">
  .load-container{
    .leaflet-marker-icon{
      width:18px !important;
      height: 18px !important;
    }
  }
</style>