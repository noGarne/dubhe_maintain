<template>
  <div class="error">
    <p class="error-content">
      {{$t('common.page-error')}}
    </p>
  </div>
</template>
<style lang="scss" scoped>
 .error{
   position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    @include theme-content-bg();
    @include theme-content-color();
    .error-content{
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      font-size: 16px;
    }
 } 
</style>