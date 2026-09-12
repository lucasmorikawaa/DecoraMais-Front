import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// IMPORTANTE: Altere para a URL / IP do seu servidor Spring Boot
// Para emulador Android use: 'http://10.0.2.2:8080'
// Para iOS / Expo Go no dispositivo físico use o IP local do seu PC: 'http://192.168.x.x:8080'
export const api = axios.create({
  baseURL: 'http://10.0.2.2:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Adiciona o Token JWT em todas as requisições autenticadas
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('@DecoraPlus:token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);