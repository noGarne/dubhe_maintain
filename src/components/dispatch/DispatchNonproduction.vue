<template>
  <!-- 非生产调度任务 -->
  <div class="dispatch-table">
    <el-table 
      :data="list" 
      style="width: 100%" 
      class="no_border task-table">
      <!-- 卡车名称 -->
      <el-table-column 
        prop="truckName" 
        :label="$t('dispatch-set.truck-name')"
        show-overflow-tooltip>
      </el-table-column>
        <!-- 起点 -->
      <el-table-column 
        prop="fromIdName" 
        :label="$t('dispatch.from')"
        show-overflow-tooltip>
      </el-table-column>
      <!-- 终点 -->
      <el-table-column 
        prop="toIdName" 
        :label="$t('dispatch.to')"
        show-overflow-tooltip>
      </el-table-column>
      <!-- 状态 -->
      <el-table-column 
        width="200" 
        :label="$t('dispatch.status')"
        show-overflow-tooltip>
          <template scope="scope">
            <p>{{utils.getObjValByKey(vars.dispatchTaskStatus,scope.row.taskStatus,'value','text')}}</p>
          </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import dispatchMixin from '../../common/mixins/dispatch.mixins';
export default {
  mixins:[dispatchMixin],
  props:['list'],
  data() {
    return {
      
    };
  },
  mounted(){

  },
  methods: {
    filterStatus(value, row) {
      return row.taskStatus === value;
    },
  },
};
</script>

<style lang="scss" scoped>
.dispatch-table{
  max-height: 440px;
  overflow: auto;
}
</style>