from ai.prompts import build_debug_prompt
from ai.provider import generate_ai_response


def process_debug(data: dict):

    prompt = build_debug_prompt(data)

    ai_response = generate_ai_response(prompt)

    return ai_response