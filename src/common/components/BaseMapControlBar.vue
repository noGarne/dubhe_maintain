<template>
<div class="barControl">
    <div class="barControl_l">
      
    </div> 
    <div class="barControl_r">
        <div class="edit_icon cspt" :class="{'disabled':!(zoom<maxZoom)}" @click="setZoom('add')">
        <i class="iconfont icon-fangda" :title="$t('monitoring.zoomout')"></i>
    </div>
        <div class="edit_icon edit_icon_l cspt" :class="{'disabled':!(zoom>minZoom)}" @click="setZoom('increase')">
        <i class="iconfont icon-suoxiao" :title="$t('monitoring.zoomin')"></i>
    </div>
        <div class="edit_icon show_all_map cspt" @click="getBounds">
        <i class="iconfont icon-huidaozhongxin" :title="$t('monitoring.go-center')"></i>
    </div>
    </div>
</div>
</template>
<script>


export default {
  name: "ControlBar",
  mixins:[],
  props:{
    zoom:{
        type:Number,
        default:2
    },
    maxZoom:{
        type:Number,
        default:2
    },
    minZoom:{
        type:Number,
        default:21
    },
  },
  data() {
    return {
        
    };
  },
  watch: {
    
  },
  methods: {
    setZoom(type){
        this.$emit('setZoom',type)
    },
    getBounds(){
        this.$emit('getBounds')
    }
  }
};
</script>

<style lang="scss" scoped>

.barControl{
  height: 50px;
  @include theme-content-bg;
  display: flex;
  justify-content:space-between;
  border-bottom: 1px solid $borderBlack;
  @include theme-border-color;
  .barControl_l{
    padding-left: 20px;
  }
  .barControl_r{
    padding-right: 20px;
    display: flex;
    align-items:center;
    .edit_icon{
      padding-left:30px;
      &.edit_icon_l{
        padding-left: 15px;
      }
      &.disabled{
        opacity: 0.5;
        pointer-events: none;
      }
      i{
        font-size: 18px;
        color: $textGrayColor;
        font-weight: normal;
      }
      &:not(.disabled):hover{
        i{
          color: $themeContentColor;
        }
      }
    }
  }
}
</style>