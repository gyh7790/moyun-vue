import axios from 'axios'
import iView from 'iview'

axios.defaults.baseURL = 'http://localhost:8083'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

let axiosObj = axios.create({
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  },
  timeout: 60000 * 2
})

axiosObj.defaults.transformRequest = (data) => {
  return JSON.stringify(data)
}

axiosObj.interceptors.response.use(res => {
  if (res.data.code === 200) {
    return res.data
  } else {
    iView.Message.error(res.data.msg)
    return Promise.reject(res.data)
  }
}, (error) => {
  iView.Message.error('未知异常')
  return Promise.reject(error)
})

export let ajax = axiosObj
