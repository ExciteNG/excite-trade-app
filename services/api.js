/** @format */
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { url } from '../url';

const api = axios.create({ baseURL: url });

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
