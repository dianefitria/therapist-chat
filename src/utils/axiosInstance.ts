import axios from 'axios'

const headers = {
  'x-ms-sk-completion-key': import.meta.env.VITE_OPEN_AI_KEY,
  'x-ms-sk-completion-model': 'gpt-3.5-turbo',
  'x-ms-sk-completion-endpoint': '',
  'x-ms-sk-completion-backend': '1'
};

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:7071/api/',
  headers: headers
})