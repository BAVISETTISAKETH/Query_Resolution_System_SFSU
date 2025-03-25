from app.db.supabase import get_supabase_client, serialize_supabase_response
from datetime import datetime
from typing import Dict, Any, List, Optional

class FeedbackService:
    def __init__(self):
        self.supabase = get_supabase_client()
    
    async def flag_response(self, query_id: str, student_id: str, feedback_text: str) -> Dict[str, Any]:
        """
        Flag a query response as incorrect and provide feedback
        
        Args:
            query_id: The ID of the query to flag
            student_id: The ID of the student providing feedback
            feedback_text: The feedback text explaining the issue
            
        Returns:
            The created feedback record
        """
        now = datetime.now().isoformat()
        
        # Update query status
        self.supabase.table("queries").update({
            "status": "flagged", 
            "updated_at": now
        }).eq("id", query_id).execute()
        
        # Create feedback entry
        feedback_data = {
            "query_id": query_id,
            "student_id": student_id,
            "feedback_text": feedback_text,
            "status": "pending",
            "created_at": now
        }
        
        result = self.supabase.table("feedback").insert(feedback_data).execute()
        
        # Format for frontend consumption
        if result.data and len(result.data) > 0:
            feedback = result.data[0]
            return {
                "id": feedback.get("id"),
                "query_id": feedback.get("query_id"),
                "feedback_text": feedback.get("feedback_text"),
                "status": feedback.get("status"),
                "created_at": feedback.get("created_at")
            }
        
        return {}
    
    async def get_pending_feedback(self) -> List[Dict[str, Any]]:
        """Get all pending feedback that needs faculty response"""
        # Get feedback with associated query information
        result = self.supabase.table("feedback").select(
            "*, queries!inner(*)"
        ).eq("status", "pending").execute()
        
        # Format for frontend consumption
        feedback_items = []
        for item in result.data or []:
            # Extract query info from the nested structure
            query_data = {}
            for key in item:
                if key == "queries" and item[key]:
                    query_data = item[key]
            
            # Format the feedback item
            formatted_item = {
                "id": item.get("id"),
                "query_id": item.get("query_id"),
                "student_id": item.get("student_id"),
                "feedback_text": item.get("feedback_text"),
                "status": item.get("status"),
                "created_at": item.get("created_at"),
                "query": {
                    "query_text": query_data.get("query_text", ""),
                    "response_text": query_data.get("response_text", ""),
                    "status": query_data.get("status", "")
                }
            }
            feedback_items.append(formatted_item)
        
        return feedback_items
    
    async def respond_to_feedback(
        self, 
        feedback_id: str, 
        faculty_id: str, 
        response_text: str
    ) -> Dict[str, Any]:
        """
        Respond to a student's feedback
        
        Args:
            feedback_id: The ID of the feedback to respond to
            faculty_id: The ID of the faculty member responding
            response_text: The response text
            
        Returns:
            The updated feedback information
        """
        now = datetime.now().isoformat()
        
        # Update feedback with faculty response
        update_data = {
            "faculty_id": faculty_id,
            "faculty_response": response_text,
            "status": "addressed",
            "updated_at": now
        }
        
        self.supabase.table("feedback").update(update_data).eq("id", feedback_id).execute()
        
        # Get the updated feedback
        feedback = self.supabase.table("feedback").select("*").eq("id", feedback_id).single().execute()
        
        if not feedback.data:
            return {"success": True}
            
        # Get the query to update its status
        query_id = feedback.data.get("query_id")
        
        # Update the original query's updated_at time
        self.supabase.table("queries").update({
            "updated_at": now
        }).eq("id", query_id).execute()
        
        # Format for frontend consumption
        return {
            "id": feedback.data.get("id"),
            "query_id": feedback.data.get("query_id"),
            "student_id": feedback.data.get("student_id"),
            "faculty_id": feedback.data.get("faculty_id"),
            "feedback_text": feedback.data.get("feedback_text"),
            "faculty_response": feedback.data.get("faculty_response"),
            "status": feedback.data.get("status"),
            "created_at": feedback.data.get("created_at"),
            "updated_at": feedback.data.get("updated_at")
        }
