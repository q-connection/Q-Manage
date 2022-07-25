import axios from 'axios';
import app from '@/main'

const $http = axios.create({
    baseURL: process.env.VUE_APP_API_ENDPOINT || 'http://localhost/api/v1'
})

$http.interceptors.request.use(function (config) {
    app.$Progress.start()
    config.headers.Authorization = 'Bearer ' + localStorage.getItem('access_token')

    return config;
  }, function (error) {
    app.$Progress.fail()
    return Promise.reject(error);
  });

// Add a response interceptor
$http.interceptors.response.use(function (response) {
    app.$Progress.finish()
    return response;
  }, function (error) {
    app.$Progress.fail()
    return Promise.reject(error);
  });

export default $http