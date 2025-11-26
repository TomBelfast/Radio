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

export const getUserSettings = async (clerkUserId: string) => {
    const response = await api.get('/user/settings', { params: { clerk_user_id: clerkUserId } });
    return response.data;
};

export const updateUserSettings = async (settings: any) => {
    const response = await api.put('/user/settings', settings);
    return response.data;
};

export default api;
