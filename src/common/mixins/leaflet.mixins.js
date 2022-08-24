import mapServer from '../../api/map.server';

export default {
  data () {
    return {
      zoom: 2,
      center: [0,0],
      map:null,
      minZoom: 2,
      maxZoom: 21,
      url: '',
      // url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      imperial:false,
      allBounds:null,
      bounds: L.latLngBounds(),
      activeShow:true,//离线设备是否显示
      options:{
        attributionControl: false,
        zoomControl:false,
      }
    }
  },
  mounted(){
    this.$nextTick(() => {
      this.setMarkerSize();
      if(this.$route.name!='DispatchHistory'
        && this.$route.name!='DigLoadingAreaMap'
        && this.$route.name!='UnloadAeraMovementMap'
        && this.$route.name!='CrushingStationMap'
        && this.$route.name!='ParkingLotMap'){
        this.getBounds();
      }

    })
  },
  computed: {
    sizeClass(){
      var zoom = this.zoom;
      var data = {};
      data['zoom'+zoom]=true;
      data['devices_v'+ConfigData.deviceSize]=true;
      return data;
    },
  },
  methods: {
    setActiveShow(v){
      this.activeShow = v;
    },
    wmsLayer(){//获取wms图层卫星图
      this.map = this.$refs.map?this.$refs.map.mapObject:null;
      if(!this.map)return;
      var layerUrl = mapServer.wmsTileLayer();
      var geoLayerGroup = mapServer.geoLayerGroup();
      this.districtLayer = L.tileLayer.wms(layerUrl, {
          layers: geoLayerGroup.satelliteTiles,
          tiled: true,
          format: 'image/png',
          transparent: true,
          maxZoom: 22,
          minZoom: 12,
          continuousWorld: true
      })
      this.districtLayer.addTo(this.map);
    },
    setZoom(type,z){
      var zoom = this.zoom;
      var maxZoom = this.maxZoom;
      var minZoom = this.minZoom;
      var map = this.map;
      var setZoomValue = zoom;
      if(type=='zoom'){
        setZoomValue = z;
      }else if(type=='add'){
        if(zoom<maxZoom){
          setZoomValue = zoom+1;
        }
      }else if(type=='increase'){
        if(zoom>minZoom){
          setZoomValue = zoom-1;
        }
      }
      map.setZoom(setZoomValue);
      this.zoom = setZoomValue;
    },
    async getBounds(e){//获取边界
        e?e.stopPropagation():"";
        var _this = this;
        var allBounds = this.allBounds;
        if(allBounds){
          allBounds = [{lat:allBounds[0].lat,lng:allBounds[0].lng+0.00000001},{lat:allBounds[1].lat,lng:allBounds[1].lng}];
          this.allBounds = allBounds;
          const bounds = L.latLngBounds(allBounds.map((o) => o));
          _this.bounds = bounds;
          return false;
        }

        try{
          //geoserver获取边界
          let resultMap = await mapServer.getMapBounds(mapServer.geoLayerGroup().geoPolygon);
          let mapBounds = null;
          if(resultMap && resultMap.bbox && resultMap.bbox.length>0){
              mapBounds = resultMap.bbox;
          }
          if(!mapBounds || mapBounds.length < 4){
              mapBounds = [109.975447,41.791716,109.9946218,41.8039413];
          }
          let result = mapBounds;
          if(result && result.length == 4){
            var arr = [L.latLng(result[1],result[0]),L.latLng(result[3],result[2])];
            if(arr.length){
              _this.allBounds = arr;
              _this.bounds = L.latLngBounds(arr);
            }
          }

        }catch(e){
          _this.messages.error(e.message)
        }
    },
    setMarkerSize(){//设置小车大小
      var _this = this;
      var map = this.$refs.map?this.$refs.map.mapObject:null;
      for(let i in map){
        if(i=='_zoom'){
          _this.zoom = map[i];
        }
      }
      if(!map)return;
      map.on('zoomstart zoom zoomen', function(ev){
        var zoom = map.getZoom();
        _this.zoom = zoom;
      })
    },
    getCenter(points = []) {
      let center = {
          lat: 0,
          lng: 0
      };
      let len = points.length;
      if (len) {
        let lat = 0,
          lng = 0;

        points.forEach(point => {
            lat += point[0];
            lng += point[1];
        });

        center.lat = lat / len;
        center.lng = lng / len;
      }

      return [center.lat,center.lng];
    },
  }
};