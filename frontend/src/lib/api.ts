import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

console.log('API Configuration:', {
  baseURL: API_URL,
  hasApiKey: !!API_KEY,
  keyLength: API_KEY?.length
});

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY || ''}`,
  },
  withCredentials: false,
});

// Add request interceptor for debugging
api.interceptors.request.use(request => {
  // Ensure OPTIONS requests don't include Authorization header
  if (request.method?.toUpperCase() === 'OPTIONS') {
    delete request.headers['Authorization'];
  }
  console.log('Request Method:', request.method);
  console.log('Request Headers:', request.headers);
  return request;
});

// Add response interceptor for debugging
api.interceptors.response.use(
  response => {
    console.log('Response Status:', response.status);
    console.log('Response Headers:', response.headers);
    return response;
  },
  error => {
    console.error('API Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers
    });
    return Promise.reject(error);
  }
);

export interface GenerateImageRequest {
  prompt: string;
  num_steps: number;
  guidance_scale: number;
}

export interface GenerateImageResponse {
  image: string;
  status: string;
}

export async function generateImage(request: GenerateImageRequest): Promise<GenerateImageResponse> {
  try {
    console.log('Making request to:', `${API_URL}/api/generate`);
    const response = await api.post<GenerateImageResponse>('/api/generate', request);
    console.log('Response data:', {
      type: typeof response.data,
      hasImage: 'image' in response.data,
      imageType: typeof response.data.image,
      imageLength: response.data.image?.length
    });
    return response.data;
  } catch (error: any) {
    console.error('Generate Image Error:', {
      message: error.message,
      response: error.response?.data
    });
    throw error;
  }
}

export const checkHealth = async (): Promise<{ status: string; model_loaded: boolean }> => {
  try {
    const response = await api.get('/api/health');
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    throw error;
  }
}; 