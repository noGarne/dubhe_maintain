<template>
<!-- 采装设备位置 -->
  <div class="edit_devices_info">
    <base-dialog 
      ref="baseDialog"
      :title='detailsInfo.shovelName+" - "+$t("dispatch.location")'
      @closeDialog="closeDialog"
      @submitForm="submitform">
        <div class="paddingLR">
            <!-- 采装设备位置 -->
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
    name: 'DiggerPosition',
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
            this.currentPosition=''
        },
        getDetials(data){
          this.oldPositionId=data.placeId;
          this.detailsInfo = data;
          this.dialogToggle();
          this.getList();
        },
        async getList(){
            try {
                // var result =await devicesServer.getPosition(this.siteType);
                // 装载区
                let args = {
                  pageSize: this.vars.pageData.pageSize,
                  pageIndex: this.vars.pageData.pageIndex,
                  subShowTypeSn: this.vars.baseSite.subType[2].id
                };
                let result = await devicesServer.devicesList(args);
                this.positionList = result.content || [];

                this.currentPosition = this.detailsInfo.placeId;
            } catch (e) {
                this.messages.error(e.message);
            }
        },
        async submitform (ev) {
          ev.target.disabled=true;
          if(this.oldPositionId===this.currentPosition){
            this.dialogToggle();
            return;
          }
          try{
              // var info = {
              //   equipmentSn:this.detailsInfo.shovelSn,
              //   equipmentType:this.detailsInfo.equipmentTypeSn,
              //   siteType:this.siteType,
              //   siteSn:this.currentPosition
              // };
              // var result = await devicesServer.setPostion(info);
              // result.equipmentTypeSn=this.detailsInfo.equipmentTypeSn;

              var info = {
                deviceIds:this.detailsInfo.deviceId,
                placeId:this.currentPosition
              };
              var result = await devicesServer.setDevicePlace(info);
              console.log(result);

              this.$emit('updateDiggerPosition',result,this.detailsInfo.index)
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
