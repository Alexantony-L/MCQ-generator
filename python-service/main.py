from fastapi import FastAPI, Request
from transcriber import transcribe_audio, generate_mcqs

app = FastAPI()

@app.post("/transcribe")
async def transcribe(request: Request):
    data = await request.json()
    video_path = data.get("videoPath")
    transcript = transcribe_audio(video_path)
    return {"transcript": transcript}

@app.post("/generate-questions")
async def questions(request: Request):
    data = await request.json()
    segment = data.get("text")
    mcqs = generate_mcqs(segment)
    return {"questions": mcqs}