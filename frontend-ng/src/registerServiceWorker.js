/* eslint-disable no-console */
import { Notification, MessageBox } from 'element-ui'
import { register } from 'register-service-worker'

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready() {
      console.log(
        'App is being served from cache by a service worker.\n' +
        'For more details, visit https://goo.gl/AFskqB'
      )
    },
    registered() {
      console.log('Service worker has been registered.')
    },
    cached() {
      console.log('Content has been cached for offline use.')
    },
    updatefound() {
      console.log('New content is downloading.')
      Notification({
        title: '找到更新',
        message: '正在更新App，成功后提示刷新享受新版App。',
        type: 'info',
        duration: 0
      })
    },
    updated() {
      console.log('App 已经更新')
      MessageBox('是否刷新以体验新版？', 'App 已经更新', {
        confirmButtonText: '确定',
        type: 'info'
      }).then(() => {
        window.location.reload()
      })
    },
    offline() {
      console.log('No internet connection found. App is running in offline mode.')
    },
    error(error) {
      console.error('Error during service worker registration:', error)
    }
  })
}
