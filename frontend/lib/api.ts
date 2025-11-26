import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add interceptor for Clerk token if needed later
// api.interceptors.request.use(async (config) => {
//   const token = await window.Clerk?.session?.getToken();
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

export const generateTraffic = async (city: string, promptStyle?: string) => {
    const response = await api.post('/generate/traffic', { city, prompt_style: promptStyle });
    return response.data;
};

export const generateWeather = async (city: string, timeframe: string, promptStyle?: string) => {
    const response = await api.post('/generate/weather', { city, timeframe, prompt_style: promptStyle });
    return response.data;
};

export const synthesizeAudio = async (text: string, voiceId: string) => {
    const response = await api.post('/synthesis', { text, voice_id: voiceId }, { responseType: 'blob' });
    return response.data;
};

export const getUserSettings = async (userId: string) => {
    const response = await api.get('/user/settings', { params: { user_id: userId } });
    return response.data;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateUserSettings = async (userId: string, settings: any) => {
    const payload = { ...settings, user_id: userId };
    const response = await api.put('/user/settings', payload);
    return response.data;
};

export default api;
