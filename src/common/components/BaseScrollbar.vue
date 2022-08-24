<template>
<!-- 滚动 -->
<div ref="listLocation">
  <el-scrollbar :style="{height:thisHeight}">
    <slot></slot>
  </el-scrollbar>
</div>
</template>

<script>
  
export default {
  name: 'Subarea',
  props:{
    minus:{
      type:Number,
      default:76
    }
  },
  data(){
    return {
      thisHeight:"auto"
    }
  },
  mounted () {
    this.setHeight();
    var _this=this;
    
    window.addEventListener('resize', this.setHeight,false);
  },
  methods:{
    setHeight(){//获取div高度超过显示滚动条
      if(this.$refs.listLocation){
        var top=this.$refs.listLocation.getBoundingClientRect().top;
        var windowH=window.innerHeight;
        var minus = this.minus;
        this.thisHeight=(windowH-top-minus)+'px';
      }
    },
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.setHeight,false);
  }
}
</script>
<style lang="scss" scoped>

</style>