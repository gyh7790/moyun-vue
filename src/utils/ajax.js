import axios from 'axios'
import iView from 'iview'
import cookie from 'js-cookie'
import router from '@/router/router'

axios.defaults.baseURL = 'http://127.0.0.1:8083'
// axios.defaults.withCredentials = true
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

let token = cookie.get('token')
if (token === undefined) {
  token = ''
}

let axiosObj = axios.create({
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
    'Acces-Control-Max-Age': 0,
    'token': token,
    'Access-Control-Allow-Headers': 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild'
  },
  timeout: 60000 * 2
})

axiosObj.defaults.transformRequest = (data) => {
  return JSON.stringify(data)
}

axiosObj.interceptors.response.use(res => {
  if (res.data.code >= 200 && res.data.code <= 300) {
    return res.data
  } else if (res.data.code === 401) {
    console.log('401将要跳转')
    iView.Message.error(res.data.msg)
    router.push({ name: 'login' })
  } else {
    iView.Message.error(res.data.msg)
    return Promise.reject(res.data)
  }
}, (error) => {
  if (error.response.status === 403) {
    // console.log(error.response)
    iView.Message.error(error.response.data.msg)
  } else {
    iView.Message.error('未知异常')
  }
  return Promise.reject(error)
})

export let ajax = axiosObj
