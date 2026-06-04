import os
from google import genai

# Initialize the modern client. 
# It automatically reads the GEMINI_API_KEY environment variable.
client = genai.Client()

def generate_ai_response(prompt: str) -> str:
    try:
        # Use a modern, stable model name (e.g., 'gemini-2.5-flash' or 'gemini-2.5-pro')
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
        )
        return response.text
    except Exception as e:
        # Proper error logging for your assistant backend
        print(f"Error calling Gemini API: {e}")
        raise e