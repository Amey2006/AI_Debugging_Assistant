from pydantic import BaseModel


class AIRequest(BaseModel):
    error_type: str
    error_message: str
    language: str
    code_context: str