## React native

##### 创建项目

首先全局执行 `npm install -g react-native-cli`，在全局安装 rn-cli 工具

然后执行 `react-native init yourPrjectName`，创键一个项目

##### script 全局指令

```json
// 运行安卓开发环境
"android": "react-native run-android",
// 打包apk
"build": "cd android && gradlew assembleRelease",
```

##### 生成签名并打包

生成签名和打包配置，[请移步此处](https://reactnative.cn/docs/signed-apk-android/)

针对不同平台打包对应 apk[请移步此处](https://reactnative.cn/docs/signed-apk-android/#%E9%92%88%E5%AF%B9%E4%B8%8D%E5%90%8C%E7%9A%84-cpu-%E6%9E%B6%E6%9E%84%E7%94%9F%E6%88%90-apk-%E4%BB%A5%E5%87%8F%E5%B0%8F-apk-%E6%96%87%E4%BB%B6%E7%9A%84%E5%A4%A7%E5%B0%8F)

#### appcenter

ioskey: 6ebd0fe9-b2e3-4cf4-bd27-1ad574ce67b9

#### code push 推送

key: Yk9eKurH8EjJModEhAk-9sm-M9DdHksytjVzV

appcenter codepush release-react -a 2956957982-qq.com/snaker -d Production

#### jpush

appkey 43123b882280297043acc8da

## 账号

1.2 版本的几个账号 zjlgcs-zly-jsdwdbtj-zly-sgxmjl-zyjlgcstj
jsdwdbaz

## 组件库 link

[字体图标库](https://github.com/oblador/react-native-vector-icons#ios)

`react-native link react-native-vector-icons`

[启动页](https://github.com/crazycodeboy/react-native-splash-screen)

`react-native link react-native-splash-screen`

[拍照](https://github.com/react-native-community/react-native-image-picker)

[添加许可](https://github.com/react-native-community/react-native-image-picker/blob/master/docs/Install.md)

`react-native link react-native-image-picker`

[手势功能](https://kmagiera.github.io/react-native-gesture-handler/docs/getting-started.html)

`react-native link react-native-gesture-handler`

[代码推送](https://github.com/Microsoft/react-native-code-push/blob/master/docs/setup-ios.md)

`react-native link react-native-code-push`

[消息推送](https://github.com/jpush/jpush-react-native)
