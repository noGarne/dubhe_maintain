<template>
<!-- 设备位置绑定场地 -->
  <div class="edit_devices_info">
    <base-dialog 
      ref="baseDialog"
      :title='(detailsInfo.deviceName || detailsInfo.dumpName || detailsInfo.shovelName)+" - "+$t("dispatch.location")'
      @closeDialog="closeDialog"
      @submitForm="submitform">
        <div class="paddingLR">
            <!-- 场地 -->
          <div class="name_input_common">
            <p>{{$t('dispatch.location')}}</p>
            <el-select clearable filterable v-model="currentPosition">
              <el-option
                v-for="(item,index) in positionList"
                :key="index"
                :label="item.equipmentName"
                :value="item.id.id">
              </el-option>
            </el-select>
          </div>
        </div>
    </base-dialog>
  </div>
</template>

<script>

import devicesServer from "../../api/devices.server"

export default {
    name: 'PlaceSet',
    data(){
        return {
            currentPosition:'',
            positionList:[],
            detailsInfo:{},
            siteType:1,
            oldPositionId:null
        }
    },
    methods: {
        dialogToggle(){
          this.$refs.baseDialog.toggleDialog();
        },
        closeDialog(){
            this.currentPosition='';
        },
        getDetials(data,type){
          this.detailsInfo = data;
          if(type == 'shovel'){
            // 采装设备-采装区
            this.oldPositionId = data.place && data.place.id.id;
            this.siteType = this.vars.baseSite.subType[2].id;
          } else if(type == 'dump'){
            // 卸点-破碎站
            this.oldPositionId = data.place && data.place.id.id;
            this.siteType = this.vars.baseSite.subType[3].id;
          } else if(type == 'assist'){
            // 推土机-所有场地
            this.oldPositionId = data.placeId;
            this.siteType = this.vars.baseSite.subType.map(v=>v.id).join(',');
          } 

          this.currentPosition = this.oldPositionId;

          this.dialogToggle();
          this.getList();
        },
        async getList(){
            try {
                let args = {
                    pageSize: this.vars.pageData.pageSize,
                    pageIndex: this.vars.pageData.pageIndex,
                    subShowTypeSn: this.siteType,
                    isForbidden:false,
                    subareaSn:this.detailsInfo.subareaSn,
                };
                let result = await devicesServer.devicesList(args);
                this.positionList = result.content || [];

                // this.currentPosition = this.detailsInfo.place && this.detailsInfo.place.id.id;
            } catch (e) {
                this.messages.error(e.message);
            }
        },
        async submitform (ev) {
          ev.target.disabled=true;
          if(this.oldPositionId===this.currentPosition){
            this.messages.success(this.$t('action.operate-success'));
            this.dialogToggle();
            return;
          }
          try{
              var info = {
                deviceIds:this.detailsInfo.uniqueId,
                placeId:this.currentPosition,
                operator:'device'
              };
              var result = await devicesServer.setDevicePlace(info);

              this.$emit('updatePosition',result)
              this.dialogToggle();
              this.messages.success(this.$t('action.operate-success'));
          }catch(e){
              ev.target.disabled=false;
              this.messages.error(e.message)
          }
        },
    }
}
</script>


<style lang="scss" scoped>

</style>
