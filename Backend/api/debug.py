from fastapi import APIRouter
from ai.schemas import AIRequest
from services.debug_service import process_debug

router = APIRouter()


@router.post("/explain")
def explain_error(request: AIRequest):

    response = process_debug(request.dict())

    return {
        "response": response
    }