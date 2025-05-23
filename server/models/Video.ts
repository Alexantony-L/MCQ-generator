export interface MCQ {
  question: string;
  options: string[];
  answer: string;
}

export interface TranscriptSegment {
  segment: string;
  questions: MCQ[];
}

export interface Video {
  filename: string;
  uploadedAt: Date;
  segments: TranscriptSegment[];
}
