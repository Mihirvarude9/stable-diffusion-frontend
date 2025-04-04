'use client';

import { useState } from 'react';
import { generateImage, GenerateImageRequest } from '@/lib/api';

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [numSteps, setNumSteps] = useState(60);
  const [guidanceScale, setGuidanceScale] = useState(7.0);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setGeneratedImage(null);
    
    try {
      const request: GenerateImageRequest = {
        prompt,
        num_steps: numSteps,
        guidance_scale: guidanceScale,
      };
      
      console.log('Sending request:', request);
      const response = await generateImage(request);
      console.log('Received response:', {
        type: typeof response,
        keys: Object.keys(response),
        imageType: typeof response.image,
        imageLength: response.image?.length
      });
      
      if (!response.image) {
        throw new Error('No image data received from the server');
      }

      // Verify the base64 string is valid
      if (typeof response.image !== 'string' || response.image.trim() === '') {
        throw new Error('Invalid image data received');
      }

      // Remove any potential "data:image" prefix if it exists
      const base64Data = response.image.includes('base64,') 
        ? response.image.split('base64,')[1] 
        : response.image;

      setGeneratedImage(base64Data);
      console.log('Image data length:', base64Data.length);
    } catch (err: any) {
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      setError(err.message || 'Failed to generate image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Stable Diffusion Image Generator</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
            Prompt
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            rows={3}
            placeholder="Describe the image you want to generate..."
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="numSteps" className="block text-sm font-medium text-gray-700 mb-2">
              Number of Steps: {numSteps}
            </label>
            <input
              type="range"
              id="numSteps"
              min="20"
              max="100"
              value={numSteps}
              onChange={(e) => setNumSteps(Number(e.target.value))}
              className="w-full"
            />
          </div>
          
          <div>
            <label htmlFor="guidanceScale" className="block text-sm font-medium text-gray-700 mb-2">
              Guidance Scale: {guidanceScale}
            </label>
            <input
              type="range"
              id="guidanceScale"
              min="1"
              max="20"
              step="0.5"
              value={guidanceScale}
              onChange={(e) => setGuidanceScale(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
        
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Generate Image'}
          </button>
        </div>
      </form>
      
      {error && (
        <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {generatedImage && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Generated Image</h2>
          <div className="flex justify-center">
            <img
              src={`data:image/png;base64,${generatedImage}`}
              alt="Generated image"
              className="max-w-full rounded-lg shadow-lg"
              onError={(e) => {
                console.error('Image failed to load');
                setError('Failed to display the generated image. The image data may be invalid.');
                setGeneratedImage(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Debug info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-4 bg-gray-100 rounded-md">
          <h3 className="font-semibold mb-2">Debug Info:</h3>
          <pre className="text-sm overflow-auto">
            {JSON.stringify({
              backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
              hasApiKey: !!process.env.NEXT_PUBLIC_API_KEY,
              imageDataLength: generatedImage?.length || 0,
            }, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
} 