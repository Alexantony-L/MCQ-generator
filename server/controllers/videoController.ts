import { Request, Response } from 'express';
import { callTranscriptionAPI } from '../utils/callPython';
import { connectToMongo } from '../utils/mongo';
import axios from 'axios';
import { VideoModel } from '../models/Video';
import mongoose from 'mongoose';
import { io } from '../index';
import {AuthenticatedRequest} from '../middleware/authMiddleware'
import { UserPayload } from '../middleware/authMiddleware';
export const handleUpload = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const videoPath = `server\\${req.file?.path}`;
  if (!videoPath) {
    res.status(400).json({ error: 'No video file uploaded' });
    return;
  }

  try {
 
    res.json({ success: true, status: 'uploaded successfully please wait couble of mintues to process' });
     await processVideo(videoPath, req.file?.originalname || 'unknown.mp4', req.user!);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Transcription or MCQ generation failed' });
  }
};


async function processVideo(filePath:string,filename:string, user: UserPayload) {
   const transcript = await callTranscriptionAPI(filePath);

    const results = await Promise.all(
      transcript.transcript.map(async (segment: string) => {
        const response = await axios.post('http://localhost:8000/generate-questions', {
          text: segment,
        });

        return {
          segment,
          questions: response.data.questions,
        };
      })
    );

    await connectToMongo();

    const videoDoc = new VideoModel({
      filename: filename || 'unknown.mp4',
      uploadedAt: new Date(),
      segments: results,
    });

    await videoDoc.save();

  io.to(user.id).emit('processing_done', { transcript, results });
}


export const getAllVideos = async (_req: Request, res: Response) => {
  try {
    await connectToMongo();
    const videos = await VideoModel.find({}, 'filename');
    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
};

export const getVideoById = async (req: Request, res: Response) => {
  try {
    await connectToMongo();

    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid video ID' });
    }

    const video = await VideoModel.findById(id);
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    res.json(video);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch video' });
  }
};
