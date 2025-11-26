"""
Middleware for Clerk authentication.
Uncomment and use if you want to enforce auth on backend endpoints.
"""
from fastapi import Request, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
import os

security = HTTPBearer()

async def verify_clerk_token(credentials: HTTPAuthorizationCredentials):
    """
    Verify Clerk JWT token.
    Note: For production, you should verify the signature using Clerk's JWKS.
    """
    token = credentials.credentials
    
    try:
        # Basic decode without verification (for development)
        # In production, use proper JWT verification with Clerk's public keys
        decoded = jwt.decode(token, options={"verify_signature": False})
        return decoded.get("sub")  # Clerk user ID
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

# Example usage in router:
# from auth import security, verify_clerk_token
# 
# @router.get("/protected")
# async def protected_route(credentials: HTTPAuthorizationCredentials = Depends(security)):
#     user_id = await verify_clerk_token(credentials)
#     return {"user_id": user_id}
