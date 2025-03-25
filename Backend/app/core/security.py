from fastapi import Depends, HTTPException, status, Header, Cookie
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from supabase import Client
from app.db.supabase import get_supabase_client
from typing import Optional

# Setup security scheme
security = HTTPBearer()

async def get_current_user(
    authorization: Optional[str] = Header(None),
    supabase_auth_token: Optional[str] = Cookie(None),
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    supabase: Client = Depends(get_supabase_client)
):
    """Get the current user from either the authorization header or cookie"""
    
    # Try to get token from different sources
    token = None
    
    # 1. From Authorization header
    if authorization:
        try:
            token = authorization.split(" ")[1]
        except (IndexError, AttributeError):
            pass
    
    # 2. From bearer token
    if credentials:
        token = credentials.credentials
        
    # 3. From cookie
    if not token and supabase_auth_token:
        token = supabase_auth_token
    
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    try:
        # Use Supabase to verify token and get user
        user = supabase.auth.get_user(token)
        return user.user
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication credentials: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )

async def get_faculty_user(current_user = Depends(get_current_user)):
    """Verify the user is a faculty member"""
    if current_user.user_metadata.get("role") != "faculty":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This endpoint requires faculty privileges"
        )
    return current_user
