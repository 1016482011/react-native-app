import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { Root, StyleProvider } from 'native-base'
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper'
import codePush from 'react-native-code-push'
import store from './store/createStore'
import AppNavigator from './Router'
import getTheme from './assets/native-base-theme/components'
import material from './assets/native-base-theme/variables/material'
import navigationService from './helper/navigationService'

// 如果是生产环境，关闭打印功能
if (!__DEV__) {
  global.console = {
    info: () => {},
    log: () => {},
    warn: () => {},
    debug: () => {},
    error: () => {}
  }
}

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#3ba283'
  }
}

let codePushOptions = { checkFrequency: codePush.CheckFrequency.MANUAL }

class App extends Component {
  componentDidMount() {
    if (__DEV__) return
    codePush.sync({
      updateDialog: {
        appendReleaseDescription: true,
        mandatoryUpdateMessage: '检测到一个更新，请及时安装',
        optionalIgnoreButtonLabel: '忽略',
        optionalInstallButtonLabel: '立即安装',
        optionalUpdateMessage: '检测到一个更新，请及时安装',
        title: '通知'
      },
      installMode: codePush.InstallMode.IMMEDIATE
    })
  }
  render() {
    return (
      <Provider store={store}>
        <PaperProvider theme={theme}>
          <StyleProvider style={getTheme(material)}>
            <Root>
              <AppNavigator
                ref={navigatorRef => {
                  navigationService.setTopLevelNavigator(navigatorRef)
                }}
              />
            </Root>
          </StyleProvider>
        </PaperProvider>
      </Provider>
    )
  }
}

export default codePush(codePushOptions)(App)
