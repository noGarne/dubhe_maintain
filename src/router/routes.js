
const Header = () => import('@/views/header/NavMenu.vue')
const Home = () => import('@/views/menuNav/Home.vue')
const Login = () => import('@/views/login/Login.vue')

const Error = () => import('@/views/error/Error.vue')



const RunReport = () => import('@/views/statement/RunReport.vue')
const SuccessRate = () => import('@/views/statement/SuccessRate.vue')
const FaultAnaly = () => import('@/views/statement/FaultAnaly.vue')
const AttenDanceReport = () => import('@/views/statement/AttenDanceReport.vue')
const GettingMonitor = () => import('@/views/carGettingMonitor/gettingMonitor.vue')
const DeviationAnaly = () => import('@/views/statement/DeviationAnaly.vue')
const gateWayMonitor = () => import('@/views/carControlIndex/gateWayMonitor.vue')
const policyMonitor = () => import('@/views/carControlIndex/policyMonitor.vue')
const controlMonitor = () => import('@/views/carControlIndex/controlMonitor.vue')
const DataSummary = () => import('@/views/statement/DataSummary.vue')
const EfficiencyAnaly = () => import('@/views/statement/EfficiencyAnaly.vue')
const Dispatch = () => import('@/views/menuNav/Dispatch.vue')
const Statistic = () => import('@/views/menuNav/Statistic.vue')
const WorkMovement = () => import('@/views/menuNav/WorkMovement.vue')
const System = () => import('@/views/menuNav/System.vue')

const LoginDriver = () => import('@/views/data/LoginDriver.vue')
const TruckRunStatus = () => import('@/views/data/TruckRunStatus.vue')
const TruckCurrentStatus = () => import('@/views/data/TruckCurrentStatus.vue')
const DiggerRunStatus = () => import('@/views/data/DiggerRunStatus.vue')
const DiggerCurrentStatus = () => import('@/views/data/DiggerCurrentStatus.vue')
const DumpRunStatus = () => import('@/views/data/DumpRunStatus.vue')
const DumpCurrentStatus = () => import('@/views/data/DumpCurrentStatus.vue')
const BaseReport = () => import('@/views/statement/BaseReport.vue')
const TakeoverChartBox = () => import('@/components/statement/takeoverChartBox.vue')

const TakeRateStatement = () => import('@/views/statement/TakeRateStatement.vue')
const TakeoverReasonEdit = () => import('@/views/statement/TakeoverReasonEdit.vue')
const Empty = () => import('@/views/Empty.vue')

const ShovelMovement = () => import('@/pages/shovelMovement/Index.vue')
const ShovelMovementMap = () => import('@/pages/shovelMovement/components/Map.vue')

const UnloadAeraMovement = () => import('@/pages/unloadAeraMovement/Index.vue')
const UnloadAeraMovementMap = () => import('@/pages/unloadAeraMovement/components/Map.vue')

const DigLoadingArea = () => import('@/pages/digLoadingArea/Index.vue')
const DigLoadingAreaMap = () => import('@/pages/digLoadingArea/components/Map.vue')

const CrushingStation = () => import('@/pages/crushingStation/Index.vue')
const CrushingStationMap = () => import('@/pages/crushingStation/components/Map.vue')

const ParkingLot = () => import('@/pages/parkingLot/Index.vue')
const ParkingLotMap = () => import('@/pages/parkingLot/components/Map.vue')

const ScreenMap = () => import('@/screen/map/Index.vue')

const SportsCardaily = () => import('@/views/dataScreening/sportsCardaily/index.vue')

var routes=[
  {
    path: '/',
    name: 'Home',
    // redirect:'/dispatch',
    meta: {
        title: 'route.home',//首页
        requiresAuth: true,
        header:"home"
    },
    components: {
      default: Home,
      // header: Header
    }
  },



  {
    path: '/statistic',
    name: 'Statistic',
    meta: {
        title: 'route.statement-status',//设备状态统计
        requiresAuth: true,
        header:"statement"
    },
    components: {
		default: Statistic,
		header: Header
    },
    redirect:'/runReport',
    children: [
		{
			path: '/runReport',
			name: 'RunReport',
			meta: {
				title: 'route.statement-output',//接管分析
				requiresAuth: true,
				header:"statement"
			},
			components: {
				default: RunReport,
				header: Header
			},
		},
		{
			path: '/takeoverChart',
			name: 'TakeoverChartBox',
			meta: {
				title: 'route.statement-all',//接管汇总
				requiresAuth: true,
				header:"statement"
			},
			components: {
				default: TakeoverChartBox,
				header: Header
			},
		},
		{
			path: '/successRate',
			name: 'SuccessRate',
			meta: {
				title: 'route.nozzle-analysis',//指点成功率
				requiresAuth: true,
				header:"statement"
			},
			components: {
				default: SuccessRate,
				header: Header
			},
		},
		{
			path: '/faultAnaly',
			name: 'FaultAnaly',
			meta: {
				title: 'route.faultAnaly',//故障分析
				requiresAuth: true,
				header:"statement",
			},
			components: {
				default: FaultAnaly,
				header: Header
			},
		},
		{
			path: '/attenDanceReport',
			name: 'AttenDanceReport',
			meta: {
				title: 'route.statement-status',//出勤分析
				requiresAuth: true,
				header:"statement"
			},
			components: {
				default: AttenDanceReport,
				header: Header
			},
		},
		{
			path: '/deviationAnaly',
			name: 'DeviationAnaly',
			meta: {
				title: 'route.deviationAnaly',//偏差分析
				requiresAuth: true,
				header:"statement"
			},
			components: {
				default: DeviationAnaly,
				header: Header
			},
		},
		{
			path: '/dataSummary',
			name: 'DataSummary',
			meta: {
				title: 'route.statement-data',//数据汇总
				requiresAuth: true,
				header:"statement"
			},
			components: {
				default: DataSummary,
				header: Header
			},
		},
		{
			path: '/takeoverReasonEdit',
			name: 'TakeoverReasonEdit',
			meta: {
				title: 'route.takeover-reason-edit',//接管原因配置
				requiresAuth: true,
				header:"statement"
			},
			components: {
				default: TakeoverReasonEdit,
				header: Header
			},
		},
		{
			path: '/efficiencyAnaly',
			name: 'EfficiencyAnaly',
			meta: {
				title: 'route.efficiencyAnaly',//数据汇总
				requiresAuth: true,
				header:"statement"
			},
			components: {
				default: EfficiencyAnaly,
				header: Header
			},
		},
     
    ],
  },

	{
	  path: '/gateWayMonitor',
	  name: 'gateWayMonitor',
	  meta: {
	      title: 'route.getawayMonitor',//网关监控
	      requiresAuth: false,
		   header:"toolbox"
		  
	  },
	 components: {
	   default: gateWayMonitor,
	   header: Header
	 },
	},	
	{
	  path: '/gettingMonitor',
	  name: 'gettingMonitor',
	  meta: {
	      title: 'route.gettingMonitor',//下车指标监控
	      requiresAuth: false,
		   header:"toolbox"
		  
	  },
	 components: {
	   default: GettingMonitor,
	   header: Header
	 },
	},
	{
		path: '/sportsCardaily',
		name: 'sportsCardaily',
		meta: {
	      title: 'route.sports-cardaily', //跑车日报
	      requiresAuth: true,
	      header:"statement"
	  },
		components: {
			default: SportsCardaily,
			header: Header
	  },
	},
	{
	  path: '/policyMonitor',
	  name: 'policyMonitor',
	  meta: {
	      title: 'route.policyMonitor',//决策监控
	      requiresAuth: false,
		  header:"toolbox"
	  },
	  components: {
	    default: policyMonitor,
	    header: Header
	  },
	},
	{
	  path: '/controlMonitor',
	  name: 'controlMonitor',
	  meta: {
	      title: 'route.controlMonitor',//控制监控
	      requiresAuth: false,
		  header:"toolbox"
	  },
	  components: {
	    default: controlMonitor,
	    header: Header
	  },
	},
	
  {
    path: '/login',
    name: 'Login',
    meta: {
        title: 'route.login',//登录
        requiresAuth: false
    },
    component: Login
  },

  {
    path: '/error',
    name: 'Error',
    meta: {
        title: 'route.error',//错误页面
        requiresAuth: false,
        header:'nolimit'
    },
    component: Error
  },
  {
    path: '/screenMap/:id?',
    name: 'ScreenMap',
    meta: {
        title: 'route.screen-map',//大屏显示监控中心
        requiresAuth: false,
        header:'nolimit'
    },
    component: ScreenMap
  },

]
export default routes;