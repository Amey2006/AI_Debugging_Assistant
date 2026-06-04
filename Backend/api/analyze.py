# 
from fastapi import APIRouter
from schemas.debug import DebugRequest
from analyzers.classifier import classify_error
from ai.prompts import build_debug_prompt
from ai.provider import generate_ai_response
router = APIRouter()


@router.post("/analyze-error")
def analyze(request: DebugRequest):

    classification = classify_error(request.error_message)

    payload = {
        "error_type": classification["error_type"],
        "error_message": request.error_message,
        "language": "python",
        "code_context": request.code
    }

    prompt = build_debug_prompt(payload)

    ai_response = generate_ai_response(prompt)

    return {
    "error_type": classification["error_type"],
    "category": classification["category"],
    "ai_response": ai_response
    }