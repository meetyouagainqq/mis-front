import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'
Vue.prototype.$axios = axios
axios.defaults.baseURL='http://localhost:8080';
import qs from 'qs'
Vue.prototype.$qs = qs
Vue.config.productionTip = false
axios.defaults.withCredentials = true;
Vue.use(ElementUI);

//配置响应拦截器 对响应数据做统一处理
axios.interceptors.response.use(function (response) {
    
	if(response.data.code==300){
		console.log(response.data.msg);
		router.push("/login");
	}else if(response.data.code==330){
		router.push("/mypage");
	}
	
    return response;
  }, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  });










new Vue({
  el:'#app',
  router,
  store,
  render: h => h(App)
})
