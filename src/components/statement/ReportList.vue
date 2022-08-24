<template>
<!-- 基本统计报表模板页面 -->
  <div class="report-table report-scrollbar" ref="refReportTable">
    <div v-if="currentData.reportList.title && currentData.reportList.title.length>0">
      <!-- 列合并表格（=2行标题） -->
      <el-table v-if="currentData.reportList.titles.middle1 && currentData.reportList.titles.middle1.length>0 && currentData.reportList.titles.middle3.length==0"
        :data="currentData.reportList.info"
        border
        show-overflow-tooltip
        style="width: 100%"
        :default-sort="{prop:'index'}"
        :span-method="objectSpanMethod"
        :max-height="reportHeight">
          <!-- 开始几列 -->
          <el-table-column
            v-for="(item, index) in currentData.reportList.titles.first" :key="'a'+index"
            fixed
            :render-header="renderHeader"
            :prop="'col'+index"
            :label="item"
            align="center"
            width="200">
          </el-table-column>
          <!-- 中间合并列 -->
          <el-table-column
          v-for="(item, index) in currentData.reportList.titles.middle1" :key="'b'+index"
          :render-header="renderHeader"
          :label="item"
          align="center">
            <el-table-column
              v-for="(item2, index2) in currentData.reportList.titles.middle2.slice(index==0 ? 0 : currentData.reportList.titles.middleNum[index-1]+1,currentData.reportList.titles.middleNum[index]+1)" :key="index2"
              :prop="'col'+(index2+currentData.reportList.titles.first.length+(index==0 ? 0 :(currentData.reportList.titles.middleNum[index-1]+1)))"
              :label="item2"
              align="center">
            </el-table-column>
          </el-table-column>
          <!-- 末尾几列 -->
          <el-table-column
            v-for="(item, index) in currentData.reportList.titles.last" :key="'c'+index"
            fixed="right"
            :render-header="renderHeader"
            :prop="'col'+(index+currentData.reportList.titles.first.length+currentData.reportList.titles.middle2.length)"
            :label="item"
            align="center"
            width="200">
          </el-table-column>
      </el-table>
      <!-- 多列合并特殊表格（>2行标题） -->
      <el-table v-else-if="currentData.reportList.titles.middle3 && currentData.reportList.titles.middle3.length>0"
        :data="currentData.reportList.info"
        border
        show-overflow-tooltip
        style="width: 100%"
        :default-sort="{prop:'index'}"
        :span-method="objectSpanMethod"
        :max-height="reportHeight">
          <!-- 开始几列 -->
          <el-table-column
            v-for="(item, index) in currentData.reportList.titles.first" :key="'a'+index"
            fixed
            :render-header="renderHeader"
            :prop="'col'+index"
            :label="item"
            align="center"
            width="200">
          </el-table-column>
          <!-- 中间合并列 -->
          <el-table-column
          v-for="(item3, index3) in currentData.reportList.titles.middle3" :key="'d'+index3"
          :label="item3"
          align="center">
            <el-table-column
            v-for="(item, index) in currentData.reportList.titles.middle1.slice(index3==0 ? 0 : currentData.reportList.titles.middleNum2[index3-1]+1,currentData.reportList.titles.middleNum2[index3]+1)" :key="'b'+index"
            :label="item"
            align="center">
              <el-table-column
                v-for="(item2, index2) in currentData.reportList.titles.middle2.slice(index==0 ? 0 : currentData.reportList.titles.middleNum[index-1]+1,currentData.reportList.titles.middleNum[index]+1)" :key="index2"
                :render-header="renderHeader"
                :prop="'col'+(index2+currentData.reportList.titles.first.length+(index3==0 ? index*currentData.colNum :(currentData.reportList.titles.middleNum2[index3]+index-1)*currentData.colNum))"
                :label="item2"
                align="center">
              </el-table-column>
            </el-table-column>
          </el-table-column>
          <!-- 末尾几列 -->
          <el-table-column
            v-for="(item2, index2) in currentData.reportList.titles.last2" :key="'c2'+index2"
            :label="item2"
            align="center">
              <el-table-column
                v-for="(item, index) in currentData.reportList.titles.last" :key="'c'+index"
                :render-header="renderHeader"
                :prop="'col'+(index+currentData.reportList.titles.first.length+currentData.reportList.titles.middle2.length)"
                :label="item"
                align="center"
                width="200">
              </el-table-column>
          </el-table-column>
      </el-table>
      <!-- 普通表v-else格 -->
      <el-table v-else
        :data="currentData.reportList.info"
        border
        show-overflow-tooltip
        style="width: 100%"
        :default-sort="{prop:'index'}"
        :span-method="objectSpanMethod"
        :max-height="reportHeight">
        <!-- 开始的列 -->
        <el-table-column
          v-for="(item, index) in currentData.reportList.titles.first" :key="'y'+index"
          fixed
          sortable
          :render-header="renderHeader"
          :sort-method="(a,b) => sortMethod(a ,b , 'col'+index)"
          :prop="'col'+index"
          :label="item"
          align="center"
          width="200">
        </el-table-column>
        <el-table-column
          sortable
          :render-header="renderHeader"
          :sort-method="(a,b) => sortMethod(a ,b , 'col'+(index+currentData.reportList.titles.first.length))"
          v-for="(item, index) in currentData.reportList.title.filter((v,i)=>i>currentData.reportList.titles.first.length-1)" :key="'z'+index"
          :prop="'col'+(index+currentData.reportList.titles.first.length)"
          :label="item"
          align="center">
        </el-table-column>
      </el-table>
    </div>
    <!-- <div v-else>
      <base-no-content></base-no-content>
    </div> -->
      <!-- 多个表格 -->
    <div class="table-more" v-if="currentData.reportList.title2 && currentData.reportList.title2.length>0">
      <el-table v-if="currentData.reportList.info2"
        :data="currentData.reportList.info2"
        border
        show-overflow-tooltip
        style="width: 100%"
        :default-sort="{prop:'index'}"
        :span-method="objectSpanMethod"
        :max-height="reportHeight">
        <el-table-column v-if="currentData.reportList.title2"
          fixed
          sortable
          :render-header="renderHeader"
          :sort-method="(a,b) => sortMethod(a ,b , 'col0')"
          prop="col0"
          :label="currentData.reportList.title2[0]"
          align="center"
          width="200">
        </el-table-column>
        <el-table-column
          sortable
          :render-header="renderHeader"
          :sort-method="(a,b) => sortMethod(a ,b , 'col'+(index+1))"
          v-for="(item, index) in currentData.reportList.title2.filter((v,i)=>i>0)" :key="'z'+index"
          :prop="'col'+(index+1)"
          :label="item"
          align="center">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>

export default {
  name:'ReportList',
  props:['info'],
  data(){
    return {
      reportHeight:'',
      setRows:[],
      setRows2:[],
      currentData:{
        tableNum:1,//表格数，默认1=普通1个表格；>2=多个表格
        headerNum:1,//表头有几行，默认1=普通表格；>2=多行表头
        firstNum:1,//多行表头中未合并的开始列有几列，默认1， 或者 普通单行表头中要合并行的列数，默认不合并
        lastNum:0,////多行表头中未合并的最后列有几列，默认0
        colNum:2,//多行表头有几列合并为1列，列个数固定，默认2
        reportList:{
          title:[],
          titles:{
            first:[],
            last:[],
            middle1:[],
            middle2:[],
            middleNum:[],
            middle3:[],
            last2:[],
            middleNum2:[],
          },
          info:[]
        },
      },
    }
  },
  mounted(){
    this.$nextTick(()=>{
      this.reportHeight=this.$refs.refReportTable.clientHeight;
      var _this=this;
      window.addEventListener('resize',this.refReportTableF);
    });
    this.getReport();
  },
  watch:{
    info:{
      handler(){
        this.getReport();
      },
      deep:true
    }
  },
  methods: {
    refReportTableF(){
      var _this = this;
      this.$nextTick(()=>{
        if(_this.$refs.refReportTable){
        _this.reportHeight=_this.$refs.refReportTable.clientHeight;
      }
      });
    },
    async getReport(){
      try{
        //初始化数据
        this.currentData.tableNum=this.info.tableNum || 1;
        this.currentData.headerNum=this.info.headerNum || 1;
        this.currentData.firstNum=this.info.firstNum || 1;
        this.currentData.lastNum=this.info.lastNum || 0;
        this.currentData.colNum=this.info.colNum || 2;
        //加载报表
        //报表文件url
        //let html = await statementServer.getHtml(this.currentData.reportName+'.html',this.getParams());
        let html=this.info.html.replace(/<td>\n<\/td>/gi,'');
        let list={
          title:[],
          titles:{
            first:[],
            last:[],
            middle1:[],
            middle2:[],
            middleNum:[],
            middle3:[],//多行title中第一行title
            last2:[],//多行title中最后合并列的title
            middleNum2:[],//多行title
          },
          info:[],
          title2:[],
          info2:[]
        };
        //处理表格数据
        var doc = new DOMParser().parseFromString(html, 'text/html');
        if(doc.getElementsByClassName('jrPage').length <= 0){
          return;
        }
        var rows = doc.getElementsByClassName('jrPage')[0].rows;
        let titleRowspan = '';
        let titleRowspan2 = '';
        let tableLine = 0;
        let firstLineCount=0;//第一行数据的列数
        for (let i = 0; i < rows.length; i++) {
          let row = rows[i];
          let cells=row.cells;
          let cellCount=cells.length;
          if(this.currentData.headerNum==1){
            //普通表格
            if(i==0){
              //第一行，空行，标注了有多少列
              continue;
            } else if(i==1){
              //第2行，表头
              for (let j = 0; j < cells.length; j++) {
                let cell = cells[j].innerText;
                if(this.currentData.tableNum>1){
                  if(cell.trim() != ''){
                    list.title.push(cell);
                  }
                } else{
                  list.title.push(cell);
                }
                //添加固定列的标题
                if(this.currentData.firstNum<=1 && j==0){
                  //默认第1列冻结
                  list.titles.first.push(cell);
                }
                if(this.currentData.firstNum>1 && j<this.currentData.firstNum){
                  //合并列冻结
                  list.titles.first.push(cell);
                }
              }
            } else{
              //>=3行，表格数据
              if(this.currentData.tableNum>1 && cellCount != rows[i-1].cells.length){
                //>=3行，多个表格数据，表头
                tableLine = i;
                for (let j = 0; j < cells.length; j++) {
                  let cell = cells[j].innerText;
                  if((cell+"").trim()) list.title2.push(cell);
                }
              } else{
                if(this.currentData.tableNum==1){
                  //>=3行，普通1个表格数据
                  let cellInfo={};
                  if(i==this.currentData.headerNum+1){
                    //第1行数据
                    firstLineCount=cellCount;
                  }
                  if(this.currentData.firstNum<=1){
                    //普通数据，没有合并行
                    for (let j = 0; j < cells.length; j++) {
                      let cell = cells[j].innerText;
                      cellInfo['col'+j] = cell;
                    }
                  } else{
                    //合并多行的数据
                    let isRowspan=false;
                    let isRowspan2=false;
                    for (let j = 0; j < cells.length; j++) {
                      let cellHtml=cells[j];
                      let cell = cellHtml.innerText;
                      if(cellHtml.hasAttribute('rowspan')){
                        let rowspan=cellHtml.getAttribute('rowspan');
                        if(titleRowspan2 && !cells[j+1].hasAttribute('rowspan')){
                          if(j>0 && cells[j-1].hasAttribute('rowspan')){
                            cellInfo['col'+j] = cell;
                            titleRowspan2 = cell;
                          } else{
                            cellInfo['col'+j] = titleRowspan;
                            cellInfo['col'+(j+1)] = cell;
                            isRowspan2=true;
                            titleRowspan2 = cell;
                          }
                        } else{
                          cellInfo['col'+j] = cell;
                          if(j==0){
                            isRowspan=true;
                            titleRowspan = cell;
                          } else{
                            isRowspan2=true;
                            titleRowspan2 = cell;
                          }
                        }
                      } else{
                        //
                        if(isRowspan || cellCount==firstLineCount){
                          cellInfo['col'+j] = cell;
                        } else{
                          if(j==0){
                            if(cellHtml.hasAttribute('colspan')){
                              //合并行
                              let colspan=parseInt(cellHtml.getAttribute('colspan'));
                              if(titleRowspan && i!=rows.length-1){
                                cellInfo['col'+j] = titleRowspan;
                                for (let k = 0; k < colspan; k++) {
                                  cellInfo['col'+(j+k+1)] = cell;
                                }
                              } else{
                                for (let k = 0; k < colspan; k++) {
                                  cellInfo['col'+(j+k)] = cell;
                                }
                              }
                            } else{
                              //普通行
                              cellInfo['col'+j] = titleRowspan;
                              if(titleRowspan2){
                                cellInfo['col'+(j+1)] = titleRowspan2;
                                cellInfo['col'+(j+this.currentData.firstNum-1)] = cell;
                              } else{
                                cellInfo['col'+(j+this.currentData.firstNum-1)] = cell;
                              }
                            }
                          } else{
                            if(titleRowspan2 && !isRowspan2){
                              cellInfo['col'+(j+2)] = cell;
                            } else{
                              cellInfo['col'+(j+1)] = cell;
                            }
                          }
                        }
                      }
                    }
                    //end合并多行的数据
                  }
                  list.info.push(cellInfo);
                } else{
                  //>=3行，多个表格数据
                  if(tableLine > 0 && i>=tableLine){
                    //后部分表格
                    let cellInfo={};
                    for (let j = 0; j < cells.length; j++) {
                      let cell = cells[j].innerText;
                      cellInfo['col'+j] = cell;
                    }
                    list.info2.push(cellInfo);
                  } else{
                    //前部分表格
                    let cellInfo={};
                    for (let j = 0; j < cells.length; j++) {
                      let cell = cells[j].innerText;
                      cellInfo['col'+j] = cell;
                    }
                    list.info.push(cellInfo);
                  }
                }
              }
            }
            //end普通表格
          } else if(this.currentData.headerNum>=2){
            //列合并表格
            if(i==0){
              //第一行，空行，标注了有多少列
              continue;
            } else if(i>=1 && i<=this.currentData.headerNum){
              //有headerNum个表头
              //合并的行
              if(this.currentData.headerNum==2){
                //普通2行
                for (let j = 0; j < cells.length; j++) {
                  let cellHtml=cells[j];
                  let cell = cellHtml.innerText;
                  if(cellHtml.hasAttribute('rowspan') && j<=this.currentData.firstNum-1){
                    //合并列之前的开始几列
                    list.title.push(cell);
                    list.titles.first.push(cell);
                  }
                  if(cellHtml.hasAttribute('rowspan') && j>=cells.length-this.currentData.lastNum){
                    //合并列之后的最后几列
                    list.title.push(cell);
                    list.titles.last.push(cell);
                  }
                  if(cellHtml.hasAttribute('colspan')){
                    //合并的列
                    list.titles.middle1.push(cell);
                  }
                  if(!cellHtml.hasAttribute('colspan') && i==this.currentData.headerNum){
                    //普通列
                    list.title.push(cell);
                    list.titles.middle2.push(cell);
                  }
                }
              } else if(this.currentData.headerNum==4){
                //>2行
                for (let j = 0; j < cells.length; j++) {
                  let cellHtml=cells[j];
                  let cell = cellHtml.innerText;
                  if(cellHtml.hasAttribute('rowspan') && j<=this.currentData.firstNum-1 && i==1){
                    //合并列之前的开始几列
                    list.title.push(cell);
                    list.titles.first.push(cell);
                  }
                  if(cellHtml.hasAttribute('rowspan') && j>=cells.length-this.currentData.lastNum+1 && i==1){
                    //合并列之后的最后几列
                    list.title.push(cell);
                    list.titles.last2.push(cell);
                  }
                  if(cellHtml.hasAttribute('colspan')){
                    //合并的列
                    if(i==1){
                      if(j<cells.length-this.currentData.lastNum+1){
                        list.titles.middle3.push(cell);
                      }
                    } else if(i==2){
                      list.titles.middle1.push(cell);
                    }
                  }
                  if(cellHtml.hasAttribute('rowspan') && i==3){
                    list.titles.last.push(cell);
                  }
                  if(!cellHtml.hasAttribute('colspan') && i==this.currentData.headerNum){
                    //普通列
                    list.title.push(cell);
                    list.titles.middle2.push(cell);
                  }
                }
              }
              //end合并的列
            } else{
              //>headerNum+1行，表格数据
              let cellInfo={};
              if(this.currentData.firstNum<=1){
                //普通数据，没有合并行
                for (let j = 0; j < cells.length; j++) {
                  let cell = cells[j].innerText;
                  cellInfo['col'+j] = cell;
                }
              } else{
                  //合并多行的数据
                  let isRowspan=false;
                  let isRowspan2=false;
                  if(i==this.currentData.headerNum+1){
                    //第1行数据
                    firstLineCount=cellCount;
                  }
                  for (let j = 0; j < cells.length; j++) {
                    let cellHtml=cells[j];
                    let cell = cellHtml.innerText;
                    if(cellHtml.hasAttribute('rowspan')){
                      let rowspan=cellHtml.getAttribute('rowspan');
                      if(titleRowspan2 && !cells[j+1].hasAttribute('rowspan')){
                        if(j>0 && cells[j-1].hasAttribute('rowspan')){
                          cellInfo['col'+j] = cell;
                          titleRowspan2 = cell;
                        } else{
                          cellInfo['col'+j] = titleRowspan;
                          cellInfo['col'+(j+1)] = cell;
                          isRowspan2=true;
                          titleRowspan2 = cell;
                        }
                      } else{
                        cellInfo['col'+j] = cell;
                        if(j==0){
                          isRowspan=true;
                          titleRowspan = cell;
                        } else{
                          isRowspan2=true;
                          titleRowspan2 = cell;
                        }
                      }
                    } else{
                      //
                      if(isRowspan || cellCount==firstLineCount){
                        cellInfo['col'+j] = cell;
                      } else{
                        if(j==0){
                          if(cellHtml.hasAttribute('colspan')){
                            //合并行
                            let colspan=parseInt(cellHtml.getAttribute('colspan'));
                            if(titleRowspan && i!=rows.length-1){
                              cellInfo['col'+j] = titleRowspan;
                              for (let k = 0; k < colspan; k++) {
                                cellInfo['col'+(j+k+1)] = cell;
                              }
                            } else{
                              for (let k = 0; k < colspan; k++) {
                                cellInfo['col'+(j+k)] = cell;
                              }
                            }
                          } else{
                            //普通行
                            cellInfo['col'+j] = titleRowspan;
                            if(titleRowspan2){
                              cellInfo['col'+(j+1)] = titleRowspan2;
                              cellInfo['col'+(j+this.currentData.firstNum-1)] = cell;
                            } else{
                              cellInfo['col'+(j+this.currentData.firstNum-1)] = cell;
                            }
                          }
                        } else{
                          if(titleRowspan2 && !isRowspan2){
                            cellInfo['col'+(j+2)] = cell;
                          } else{
                            cellInfo['col'+(j+1)] = cell;
                          }
                        }
                      }
                    }
                  }
                  //end合并多行的数据
              }
              list.info.push(cellInfo);
              //end表格数据
            }
            //end列合并表格
          }
        }
        //临时方式：找到所有的 合计 所在的位置，没有合计按照指定的列数分隔
        //待优化：解析计算出各合并字段的列数
        let middelNum = [];
        list.titles.middle2.forEach((v,i)=>{
          if(v.indexOf('合计')>-1 || v.indexOf('小计')>-1){
            middelNum.push(i);
          }
        });
        if(list.titles.middle1.length>0 && middelNum.length<=0) {
          list.titles.middle1.forEach((v,i)=>{
            middelNum.push((i+1)*this.currentData.colNum-1);
          });
        }
        list.titles.middleNum=middelNum;
        //多列
        let middelNum2 = [];
        list.titles.middle1.forEach((v,i)=>{
          if(v.indexOf('合计')>-1 || v.indexOf('小计')>-1){
            middelNum2.push(i);
          }
        });
        if(list.titles.middle3.length>0 && middelNum2.length<=0) {
          list.titles.middle3.forEach((v,i)=>{
            middelNum2.push((i+1)*this.currentData.colNum-1);
          });
        }
        list.titles.middleNum2=middelNum2;
        // console.log(list);
        if(list.titles.first.length>1){
          this.getRows(list.info);
        }
        this.currentData.reportList=list;
      }catch(e){
        this.messages.error(e.message)
      }
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      //当前行row、当前列column、当前行号rowIndex、当前列号columnIndex
      let arr=["合计","小计"]
      //列合并
      if(this.currentData.firstNum==2){
        //最后一列如果有多个 合计 就合并
        if(rowIndex == this.currentData.reportList.info.length-1 &&row.col0.trim()==arr[0] && row.col1.trim()==arr[0]){
          if (columnIndex == 0) {
            return [1, 2];
          } else if (columnIndex == 1) {
            return [0, 0];
          }
        }
      } else if(this.currentData.firstNum==3){
        //最后一列如果有多个 合计 就合并
        if(rowIndex == this.currentData.reportList.info.length-1 && row.col0.trim()==arr[0] && row.col1.trim()==arr[0] && row.col2.trim()=="合计"){
          if (columnIndex == 0) {
            return [1, 3];
          } else if (columnIndex == 1 || columnIndex == 2) {
            return [0, 0];
          }
        }
        //第2-3列合并
        if(row.col2 && ((row.col1.trim()==arr[0] && row.col2.trim()==arr[0]) || (row.col1.trim()==arr[1] && row.col2.trim()==arr[1]))){
          if (columnIndex == 1) {
            return [1, 2];
          } else if (columnIndex == 2) {
            return [0, 0];
          }
        }
      }
      
      //行合并
      if(this.currentData.firstNum>1){
        if(columnIndex==0){
          const _row = this.setRows[rowIndex];
          const _col = _row>0?1:0;
          return [_row,_col];
        }
        //第2列的行合并
        if(columnIndex==1 && this.currentData.firstNum==3){
          const _row = this.setRows2[rowIndex];
          const _col = _row>0?1:0;
          return [_row,_col];
        }
      }
    },
    getRows(data){
      this.setRows = [];
      this.setRows2 = [];
      if(data==null){
        return;
      }
      for(var i=0;i<data.length;i++){
        if(i==0){
          this.setRows.push(1);
          this.pos = 0;
          this.setRows2.push(1);
          this.pos2 = 0;
        }else{
          if(data[i].col0==data[i-1].col0){
            this.setRows[this.pos]+=1;
            this.setRows.push(0);
          }else{
            this.setRows.push(1);
            this.pos = i;
          }
          if(data[i].col1==data[i-1].col1){
            this.setRows2[this.pos2]+=1;
            this.setRows2.push(0);
          }else{
            this.setRows2.push(1);
            this.pos2 = i;
          }
        }
      }
    },
    sortMethod(obj1, obj2, column) {
      let a = obj1[column]
      let b = obj2[column]
      //数值比较
      if(!isNaN(a) && !isNaN(b)){
        return a-b;
      }
      //时间字符串比较
      if(!isNaN(Date.parse(a)) && !isNaN(Date.parse(b)) && (a.indexOf('-')>-1 || (a.indexOf(':')>-1))){
        return Date.parse(a)-Date.parse(b);
      } else{
        let a2=a.split(':');
        let b2=b.split(':');
        if(a2.length==b2.length && a2.length == 3){
          return (parseInt(a2[0])*3600+parseInt(a2[1])*60+parseInt(a2[2]))-(parseInt(b2[0])*3600+parseInt(b2[1])*60+parseInt(b2[2]));
        }
      }
      //普通字符串比较
      return a.localeCompare(b);
    },
    renderHeader(h, { column, $index }) {
        let str = column.label
        let l = str.length
        let f = 16
        column.minWidth = f * (l + 3)
        if(str.indexOf('时间') > -1){
          column.minWidth = f * (l + 6)
        }
        return h('div', { class: 'table-head', style: { width: '100%' } }, [column.label])
      },
  },
  beforeDestroy(){
      window.removeEventListener('resize',this.refReportTableF);
  }
}
</script>
<style lang="scss">
.report-table{
  padding: 0 20px;
  .table-more{
    margin-top: 20px;
  }
  .el-table{
    @include theme-content-bg;
    .cell {
      padding-left:0 !important;
    }
    th{
      .cell{
        font-weight: 800;
      }
    }
    th,.el-table__header-wrapper tr, .el-table__header-wrapper tr th {
      @include table-line-bg(!important);
    }
    th,td{
      // border-color: $borderBlack !important;
      @include theme-border-color(!important);
      @include theme-content-color(!important);
    }

    .table-head {
      line-height: inherit;
      display: inline !important;
      padding:0!important;
    }
    .tr td .cell{
      padding:5px 2px !important;
    }
    .cell,.th div,.el-table--border td:first-child .cell,.el-table--border th:first-child .cell{
      padding-left:0 !important;
    }

  }
  .el-table--border,.el-table--fit {
    border:1px solid $borderBlack;
    @include theme-border-color;
  }
  .el-table--border::after, .el-table--group::after, .el-table::before{
    @include theme-content-bg;
  }
  .el-table--border td, .el-table--border th, .el-table__body-wrapper .el-table--border.is-scrolling-left~.el-table__fixed{
    // border-color:$borderBlack !important;
    @include theme-border-color(!important);
  }
  &.report-scrollbar{
    position: absolute;
    top: 90px;
    right: 0;
    left: 0;
    bottom: 20px;
    overflow: auto;
    scrollbar-width: thin;
  }
}

</style>