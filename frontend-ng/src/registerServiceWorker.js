/* eslint-disable no-console */
import { Notification } from "element-ui";
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
        title: '消息',
        message: '这是一条消息的提示消息',
        type: 'info'
      })
    },
    updated() {
      console.log('App 已经更新')
      var r = confirm("App 已经更新，是否刷新以体验新版？");
      if (r == true) {
        window.location.reload()
      }
    },
    offline() {
      console.log('No internet connection found. App is running in offline mode.')
    },
    error(error) {
      console.error('Error during service worker registration:', error)
    }
  })
}
