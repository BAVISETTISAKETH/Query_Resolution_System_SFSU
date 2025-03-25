from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class FeedbackBase(BaseModel):
    feedback_text: str

class FeedbackCreate(FeedbackBase):
    query_id: str

class FeedbackResponse(BaseModel):
    response_text: str

class FeedbackInDB(FeedbackBase):
    id: str
    query_id: str
    student_id: str
    faculty_id: Optional[str] = None
    faculty_response: Optional[str] = None
    status: str = "pending"  # pending, addressed
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True
