<template>
<!-- 页码 -->
<!-- v-if="showPage" -->
  <div class="pagination_w">
    <div>
      <el-pagination
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :pager-count="pagerCount"
        :current-page.sync="current"
        :page-size="singleDisplay"
        :page-sizes="[15, 30, 50, 100]"
        background
        layout="total, sizes,prev, pager, next, jumper,slot"
        :total="total">
        
      </el-pagination>
    </div>
  </div>
</template>

<script>
  export default {
    name:"pagination",
    data(){
      return {
        current: this.currentPage,
        inputPage:""
      }
    },
    props: {
      total: {// 数据总条数
        type: Number,
        default: 0
      },
      singleDisplay: {// 每页显示条数
        type: Number,
        default: 10
      },
      currentPage: {// 当前页码
        type: Number,
        default: 1
      },
      pagerCount: {// 页码按钮的个数，大于等于 5 且小于等于 21 的奇数
        type: Number,
        default: 7
      }
    },
    watch:{
      currentPage(v){
        this.current=v;
      }
    },
    computed:{
      showPage(){
        return this.total/this.singleDisplay>1?true:false;
      },
      currentSize(){
        var size = this.singleDisplay;
        var page = parseInt(this.total/this.singleDisplay);
        if(this.currentPage>page)size = this.total%this.singleDisplay;
        return size;
      }
    },
    methods: {
      handleCurrentChange(val) {
        this.$emit('pagechange', this.current);
      },
      handleSizeChange(val) {
        this.$emit('sizeChange', val);
      }
    }
  }
</script>

<style lang="scss" scoped>
.pagination_w{
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}

</style>
<style lang="scss">
$height:30px;
.pagination_w{
  .el-pagination.is-background .btn-next, .el-pagination.is-background .btn-prev, .el-pagination.is-background .el-pager li{
    background: none;
    border: 1px solid $borderColor;
    @include theme-search-border;
    height: $height;
    line-height: $height;
    @include theme-content-color;

  }

  .el-pagination__total{
    @include theme-content-color;
  }
  .el-pagination.is-background .el-pager li:not(.disabled):hover{
    background: $themeOrange;
    color: $textWhiteColor;
  }
  .el-pagination.is-background .el-pager li:not(.disabled).active{
    background: $themeOrange;
    color: $textWhiteColor;
  }
  .el-pagination.is-background .btn-next:not([disabled='disabled']):hover,.el-pagination.is-background .btn-prev:not([disabled='disabled']):hover{
    background: $themeOrange;
    @include theme-content-color;
  }
  .el-input__inner{
    @include theme-content-color;
    height: $height;
  }
  .el-select .el-input.is-focus .el-input__inner,.el-select .el-input__inner:focus{
    border-color: $themeOrange;
  }

  span.el-pagination__jump{
    margin-left: 10px;
    @include theme-content-color;
  }
  span.el-pagination__sizes{
    margin: 0;
  }

  .el-pagination{
    .el-input input{
      height: $height;
      background: none !important;
      @include theme-search-border;
    }
  }
  .show_current_size{
    @include theme-content-color;
    font-weight:normal;
    padding-left:10px;
  }
}

</style>
