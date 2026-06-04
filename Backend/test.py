import google.generativeai as genai

# Make sure your API key is configured
# genai.configure(api_key="YOUR_API_KEY")

for model in genai.list_models():
    if 'generateContent' in model.supported_generation_methods:
        print(model.name)