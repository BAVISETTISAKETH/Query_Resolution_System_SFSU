from fastapi import APIRouter, Depends, HTTPException, status
from app.models.feedback import FeedbackCreate, FeedbackResponse, FeedbackInDB
from app.core.security import get_current_user, get_faculty_user
from app.services.feedback_service import FeedbackService
from typing import List, Dict, Any

router = APIRouter()

# Initialize services
feedback_service = FeedbackService()

@router.post("/flag-response", response_model=Dict[str, Any])
async def flag_response(feedback: FeedbackCreate, current_user = Depends(get_current_user)):
    """Flag a query response as incorrect and provide feedback"""
    result = await feedback_service.flag_response(
        feedback.query_id,
        current_user.id, 
        feedback.feedback_text
    )
    return result

@router.get("/pending", response_model=List[Dict[str, Any]])
async def get_pending_feedback(current_user = Depends(get_faculty_user)):
    """Get all pending feedback that needs faculty response (faculty only)"""
    feedback_items = await feedback_service.get_pending_feedback()
    return feedback_items

@router.post("/{feedback_id}/respond", response_model=Dict[str, bool])
async def respond_to_feedback(
    feedback_id: str,
    response: FeedbackResponse, 
    current_user = Depends(get_faculty_user)
):
    """Respond to a student's feedback (faculty only)"""
    result = await feedback_service.respond_to_feedback(
        feedback_id,
        current_user.id,
        response.response_text
    )
    return {"success": result}
