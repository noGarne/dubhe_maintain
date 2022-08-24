<template>
<!-- 右边划出详情 -->
<transition name="right-slide" >
  <div class="resource" :class="{'topHeight':topHeight}">
    <header>
      <slot name="header"></slot>
    </header>
    <slot name="close"></slot>
    <div class="tabel_content">
    <slot></slot>
    </div>
  </div>
</transition>
</template>

<script>
  
export default {
  name: 'Subarea',
  props:{
    topHeight:{
      type:Boolean,
      default:false
    }
  }
}
</script>
<style lang="scss" scoped>
.topHeight{
    top: 0;
}
</style>