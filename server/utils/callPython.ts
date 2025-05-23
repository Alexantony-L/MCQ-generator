import axios from 'axios';
import path from 'path';

export const callTranscriptionAPI = async (videoPath: string) => {
  const absPath = path.resolve(__dirname, '..', 'uploads', path.basename(videoPath));
  
  const response = await axios.post('http://localhost:8000/transcribe', {
    videoPath: absPath,
  });

  return response.data;
};
