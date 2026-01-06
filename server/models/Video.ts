// models/Video.ts

import mongoose, { Schema, Document } from 'mongoose';

export interface MCQ {
  question: string;
  options: string[];
  answer: string;
}

export interface TranscriptSegment {
  segment: string;
  questions: MCQ[];
}

export interface IVideo extends Document {
  filename: string;
  uploadedAt: Date;
  segments: TranscriptSegment[];
}

// MCQ Schema
const MCQSchema = new Schema<MCQ>({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  answer: { type: String, required: true },
}, { _id: false });

// Segment Schema
const SegmentSchema = new Schema<TranscriptSegment>({
  segment: { type: String, required: true },
  questions: [MCQSchema],
}, { _id: false });

// Video Schema
const VideoSchema = new Schema<IVideo>({
  filename: { type: String, required: true },
  uploadedAt: { type: Date, required: true },
  segments: [SegmentSchema],
});

export const VideoModel = mongoose.model<IVideo>('Video', VideoSchema);
