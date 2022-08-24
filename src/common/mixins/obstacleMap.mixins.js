
import workingServer from "../../pages/common/js/working.server";
import mapServer from '../../api/map.server';

export default {
  data () {
    return {
        obstacleLayer:null
    }
  },
  mounted() {
      
  },
  methods: {
    async getObstacleMap(){//判断获取障碍区地图
      let _this = this;
      try{
        var isObstacleHasLayer = await workingServer.obstacleHasLayer();
        if(isObstacleHasLayer){
          this.getObstacleWms();
        }
      }catch(e){
        _this.messages.error(e.message);
      }
    },
    getObstacleWms(){//加载障碍物地图
      this.map = this.$refs.map?this.$refs.map.mapObject:null;
      if(!this.map)return;
      // 接口
      var layerUrl = mapServer.wmsTileLayerLine();
      // 图层组参数
      var geoLayerGroup = mapServer.geoLayerGroup();
      var layers = geoLayerGroup.geoObstacle;
      
      var maxZoom = 22;
      var minZoom = 1;
      var format = 'image/png';

      this.obstacleLayer = L.tileLayer.wms(layerUrl, {
        format: format,
        version: '1.1.1',  
        transparent:true,
        styles:geoLayerGroup.geoObstacleStyle,
        maxZoom: maxZoom,
        minZoom: minZoom,
        layers: layers,
        exceptions: 'application/vnd.ogc.se_inimage',
        MathRandom:Math.ceil(Math.random()*10000)
      }).addTo(this.map);
    },
    // 清除地图图层
    clearObstacleLayer(){
        if(this.obstacleLayer){
        this.obstacleLayer.remove();
        this.obstacleLayer=null;
        }
    },


  }
};