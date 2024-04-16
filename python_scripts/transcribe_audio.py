import sys
import whisper

def transcribe_audio(audio_path):
    model = whisper.load_model("base")  # You can choose different models like 'small', 'medium', 'large', or 'tiny'.
    result = model.transcribe(audio_path)
    return result['text']

if __name__ == "__main__":
    audio_path = sys.argv[1]
    transcription = transcribe_audio(audio_path)
    print(transcription)