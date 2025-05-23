import { Request, Response } from 'express';
import { callTranscriptionAPI } from '../utils/callPython';
import { connectToMongo } from '../utils/mongo';
import axios from 'axios';
import { Video } from '../models/Video';
import { ObjectId } from 'mongodb';

export const handleUpload = async (req: Request, res: Response): Promise<void> => {
  const videoPath = `server\\${req.file?.path}`;
  if (!videoPath) {
    res.status(400).json({ error: 'No video file uploaded' });
    return;
  }

  try {
    const transcript = await callTranscriptionAPI(videoPath);

    const results = await Promise.all(
      transcript.transcript.map(async (segment:string) => {

        const response = await axios.post('http://localhost:8000/generate-questions', {
          text: segment,
        });

        console.log("response ------->", response.data);

        return {
          segment,
          questions: response.data.questions,
        };
      })
    );

    const db = await connectToMongo();
    const collection = db.collection<Video>('videos');

    const videoDoc: Video = {
      filename: req.file?.originalname || 'unknown.mp4',
      uploadedAt: new Date(),
      segments: results,
    };

    const insertResult = await collection.insertOne(videoDoc);

    res.json({ success: true, transcript: results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Transcription or MCQ generation failed' });
  }
};


export const getAllVideos = async (_req: Request, res: Response) => {
  try {
    const db = await connectToMongo();
    const videos = await db.collection<Video>('videos').find({}, { projection: { filename: 1 } }).toArray();
    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
};

export const getVideoById = async (req: Request, res: Response) => {
  try {
    const db = await connectToMongo();
    const video = await db.collection<Video>('videos').findOne({ _id: new ObjectId(req.params.id) });
    res.json(video);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch video' });
  }
};