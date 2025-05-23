import whisper

from dotenv import load_dotenv
import os
from openai import OpenAI
load_dotenv() 
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

os.environ["PATH"] += os.pathsep + r"E:\ffmpeg\bin"
model = whisper.load_model("base")
def transcribe_audio(file_path):
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Video file not found: {file_path}")

    result = model.transcribe(file_path, verbose=False)

    grouped_segments = []
    current_group = []
    current_time = 0

    for segment in result["segments"]:
        start = segment["start"]
        text = segment["text"]

        if start >= current_time + 300:
            grouped_segments.append(" ".join(current_group))
            current_group = []
            current_time += 300

        current_group.append(text)

    if current_group:
        grouped_segments.append(" ".join(current_group))
    print("grouped_segments==>",grouped_segments)
    return grouped_segments


def generate_mcqs(segment_text):
    prompt = f"""
You are an expert teacher. Generate 2 multiple-choice questions from the following text. 
Each question must have 4 options and one correct answer. Output format:

[
  {{
    "question": "Your question here?",
    "options": ["A", "B", "C", "D"],
    "answer": "A"
  }},
  ...
]

Text:
\"\"\"
{segment_text}
\"\"\"
"""

    response = client.chat.completions.create(
        model="gpt-3.5-turbo", 
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7
    )

    reply = response.choices[0].message.content

    try:
        import json
        return json.loads(reply)
    except Exception as e:
        print("Failed to parse MCQ response:", e)
        return []