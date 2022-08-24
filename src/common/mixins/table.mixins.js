export default {
  data () {
    return {
        getIndex:null,
        tableHeight:'500',
        searchHeight:50,
		option:{
			disabledDate:(time)=> {
			return time.getTime() > Date.now()
			}
		},
    }
  },
  mounted() {
    // table高度
    this.setTableHeight();
    window.addEventListener('resize', this.setTableHeight,false);
  },
  methods: {
    tableRowClassName ({row, rowIndex}) {
      row.index = rowIndex;
      if ((this.getIndex) === rowIndex ) {
        return "current-row"
      };
    },
    setRow(num){
      this.getIndex=num
    },
	endTimeNoThirty(v){
		if(!v) return;
		if (!this.search.start_time){
			this.search.end_time = this.utils.formatDate(v)
			 return
			}
		if (v <= new Date(this.search.start_time)) {
			this.messages.error('结束时间需大于开始时间');
			this.search.end_time = '';
			return false;
		} else {
			
			this.search.end_time = this.utils.formatDate(v)
		}
	},
	getYesterEve() {
		var day1 = new Date();
		day1.setTime(day1.getTime() - 24 * 60 * 60 * 1000);
		var s1 = day1.getFullYear() + "-" + (day1.getMonth() + 1 < 10 ? '0' + (day1.getMonth() + 1) : day1
			.getMonth() + 1) + "-" + (day1.getDate() < 10 ? '0' + day1.getDate() : day1.getDate());
		return s1;
	},
	endTimeChange(v) {
		if(!v) return;
		if (!this.search.start_time){
			this.search.end_time = this.utils.formatDate(v)
			 return
			}
		if (v <= new Date(this.search.start_time)) {
			this.messages.error('结束时间需大于开始时间');
			this.search.end_time = '';
			return false;
		} else {
			if(new Date(this.search.end_time) - new Date(this.search.start_time) > 1800000){
				this.messages.error('最多选择30分钟以内');
				this.search.end_time = this.utils.formatDate(new Date(this.search.start_time).getTime() + 1800000);
				return
			}
			this.search.end_time = this.utils.formatDate(v)
		}
	},
	startTimeNoThirty(v) {
		if(!v) return;
		if (!this.search.end_time){
			this.search.start_time = this.utils.formatDate(v)
			 return
			}
		if (v >= new Date(this.search.end_time)) {
			this.messages.error('结束时间需大于开始时间');
			this.search.start_time = '';
			return false;
		} else {
			
			this.search.start_time = this.utils.formatDate(v)
		}
	},
	startTimeChange(v) {
		if(!v) return;
		if (!this.search.end_time){
			this.search.start_time = this.utils.formatDate(v)
			this.search.end_time = this.utils.formatDate(new Date(v).getTime()+1800000);
			 return
			}
		if (v >= new Date(this.search.end_time)) {
			this.messages.error('结束时间需大于开始时间');
			this.search.start_time = '';
			return false;
		} else {
			if(new Date(this.search.end_time) - new Date(this.search.start_time) > 1800000){
				this.messages.error('最多选择30分钟以内');
				this.search.end_time = ''
				return
			}
			this.search.start_time = this.utils.formatDate(v)	
		}
	},
	//select全选功能 需引用组件的allSeleValue方法
	selectAllChange(val){
	        const oldVal = this.oldSeleValue.length === 1 ? this.oldSeleValue[0] : [];
			console.log(val)
			console.log(oldVal)
	        if (val.includes('selectAll') && val.length < this.equipmentList.length +1) {
	            this.search.truckId = Object.assign([],this.allSeleValue);
				console.log('111')
	        }else if(val.length > oldVal.length && val.includes('selectAll') && val.length - oldVal.length == 1){
				this.search.truckId = [];
				console.log(5555)
			}
	        if (oldVal.includes('selectAll') && !val.includes('selectAll')) this.search.truckId = [];
	        if (oldVal.includes('selectAll') && val.includes('selectAll')) {
	            const index = val.indexOf('selectAll');
	            val.splice(index, 1); // 排除全选选项
	            this.search.truckId = val
	        }
	        this.oldSeleValue[0] = this.search.truckId;
			console.log(this.search.truckId)
	    },
    // 设置table高度
    setTableHeight(){
      var _this = this;
      this.$nextTick(() => {
        var top = 240;
        var bottom = 70;
        if(_this.$refs.tableWraper){
          if(_this.$refs.tableWraper.length>0){
            top=_this.$refs.tableWraper[0].getBoundingClientRect().top;
          }else{
            top=_this.$refs.tableWraper.getBoundingClientRect().top;
          }
        }
        var windowH=window.innerHeight;
        _this.tableHeight=windowH-top-bottom;
      })
    },
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.setTableHeight,false);
  }
};