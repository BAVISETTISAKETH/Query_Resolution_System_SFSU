from supabase import create_client, Client
from app.core.config import settings
import json
from datetime import datetime

class CustomJSONEncoder(json.JSONEncoder):
    """Handle datetime serialization for JSON responses"""
    def default(self, obj):
        if isinstance(obj, datetime):
            return obj.isoformat()
        return super().default(obj)

supabase: Client = None

def get_supabase_client() -> Client:
    global supabase
    if supabase is None:
        supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
    return supabase

def serialize_supabase_response(data):
    """Convert Supabase response to frontend-friendly format"""
    if not data:
        return None
    
    # Handle both lists and single objects
    if isinstance(data, list):
        return json.loads(json.dumps(data, cls=CustomJSONEncoder))
    else:
        return json.loads(json.dumps(data, cls=CustomJSONEncoder))
