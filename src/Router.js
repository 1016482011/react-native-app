import { createAppContainer, createStackNavigator } from 'react-navigation'
import Login from './pages/Login'
import Home from './pages/home/Index'
import Wait from './pages/Wait'
import SetServer from './pages/SetServer'
import PasswordModify from './pages/home/setting/PasswordModify'
import ProblemDetails from './pages/details/Problem'
import ModelViewDetails from './pages/details/ModelView'
import AddProModelFilter from './pages/addPro/ModelFilter'
import AddProModeSelect from './pages/addPro/ModeSelect'
import AddProInfos from './pages/addPro/InfosFillIn'
import AddProEditPro from './pages/addPro/EditPro'
import TaskNotice from './pages/task/Notice'
import TaskProSelect from './pages/task/ProSelect'
import TaskDetailInfo from './pages/task/DetailInfo'
import TaskMyStartInfo from './pages/task/MyStartInfo'
import TaskNoticeFeedBack from './pages/task/NoticeFeedBack'
import TaskDetailDealPro from './pages/task/DetailDealPro'
import TaskSignForNotice from './pages/task/SignForNotice'
import TaskSignForNoticeFeedBack from './pages/task/SignForNoticeFeedBack'
import VerifyTask from './pages/verify/Task'
import VerifyTaskFeedback from './pages/verify/TaskFeedback'
import VerifyTaskProblem from './pages/verify/Problem'

const AppNavigator = createStackNavigator(
  {
    // 登录页
    Wait,
    // 登录页
    Login,
    // 首页
    Home,
    // 设置服务器地址
    SetServer,
    // 密码修改
    PasswordModify,
    // 模型详情
    ModelViewDetails,
    // 问题详情
    ProblemDetails,
    // 添加问题-模型筛选
    AddProModelFilter,
    // 添加问题-模型选择
    AddProModeSelect,
    // 添加问题-问题录入
    AddProInfos,
    // 修改问题
    AddProEditPro,
    // 监理通知单-选择问题
    TaskProSelect,
    // 监理通知单-提交
    TaskNotice,
    // 监理通知单-保存查看
    TaskDetailInfo,
    // 监理通知单-查看我发起的
    TaskMyStartInfo,
    // 任务-监理通知回复单审批
    TaskNoticeFeedBack,
    // 任务-施工单位任务详情
    TaskDetailDealPro,
    // 任务-签收监理通知单
    TaskSignForNotice,
    // 任务-签收监理通知回复单
    TaskSignForNoticeFeedBack,
    // 任务-任务审核
    VerifyTask,
    // 任务-问题详情
    VerifyTaskFeedback,
    // 任务-问题详情并审核
    VerifyTaskProblem
  },
  {
    initialRouteName: 'Wait',
    defaultNavigationOptions: {
      header: null
    }
  }
)

export default createAppContainer(AppNavigator)
