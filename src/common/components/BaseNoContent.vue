<template>
<!-- 没有数据 -->
<div class="no_content" :style="{'height':showHeight+'px'}">
    <div class="no_content_w">
        <div><i class="iconfont" :class="iconClass" :style="{'font-size':fontSize +'px'}"></i></div>
        <p>{{text}}</p>
    </div>
</div>
</template>

<script>
export default {

  name: 'BaseNoContent',
  props:{
    // imgUrl:{
    //   type:String,
    //   default:img
    // },
    text:{
      type:String,
      default:'暂无数据'
    },
    showHeight:{
      type:Number,
      default:400
    },
    fontSize:{
      type:Number,
      default:100
    },
    iconClass:{
      type:String,
      default:"icon-shuju1"
    }
  }
}
</script>
<style lang="scss" scoped>
.no_content{
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .no_content_w{
        &>div{
          text-align: center;
          i{
            color: $textGrayColor;
          }
        }
        img{
            height: 150px;
            width: auto;
        }
        p{
            text-align: center;
            color: $textGrayColor;
            font-size: 16px;
            padding-top: 20px;

        }
    }

}
</style>