import axios from 'axios';

const $http = axios.create({
    baseURL: process.env.VUE_APP_API_ENDPOINT || 'http://localhost/api/v1'
})

$http.interceptors.request.use(function (config) {
    config.headers.Authorization = 'Bearer ' + localStorage.getItem('access_token')

    return config;
  }, function (error) {
    return Promise.reject(error);
  });

// Add a response interceptor
$http.interceptors.response.use(function (response) {
    return response;
  }, function (error) {
    return Promise.reject(error);
  });

export default $http