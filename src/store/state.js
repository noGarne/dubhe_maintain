export default {
    currentUser:null,//当前用户

    currentUserDetails:null,//当前用户详细信息

    refreshTokenQueue:[],

    forceFullscreen:null,
    allowedDashboardIds:[],
    // 矿产资源列表
    assetsList:[],
    // 默认第一个矿产
    defaultAssets:null,
    // 是否在加载
    loaderCurrent:false,
    // 是否有权限访问
    isLimit:false,
    // 分区id
    subareaId:'',
    // 分区sn
    subareaSn:sessionStorage.getItem('subareaSn') || '',
    // 分区名称
    subareaName:'',
    // 是否禁用智能调度编辑权限
    disabledDispatchEdit:false,
    // 存储要取消的axios
    cancelToken:[],
    // 左边菜单展开
    leftMenuOpen:false,
    // 左边菜单远程启停页面控制
    leftMenuRemoteOperation:true,
    // 版本信息
    versionInfo:'',
    currMoniDeviceId: '', // 集成监视页面的当前设备id，左侧列表、地图、搜索框、详情页面使用
    // 监视监视告警弹框显示情况，默认不显示弹框，点击报警按钮才显示
    monitorAlarmDialogShow:false
  }