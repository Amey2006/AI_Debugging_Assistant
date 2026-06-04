from pydantic import BaseModel
from typing import Optional


class ErrorAnalysisRequest(BaseModel):
    code: str
    error_message: str


class ErrorAnalysisResponse(BaseModel):
    error_type: str
    category: str
    explanation: str
    suggestion: str
    line_number: Optional[int] = None