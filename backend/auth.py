"""
# Middleware for Token authentication.
# Currently a placeholder. In production, this should verify the JWT token from the Auth Provider (Stack Auth).

from fastapi import HTTPException, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
import os

security = HTTPBearer()

async def verify_token(credentials: HTTPAuthorizationCredentials):
    """
    Verify JWT token.
    Note: For production, you should verify the signature using the Auth Provider's JWKS.
    """
    token = credentials.credentials
    try:
        # Placeholder for token verification logic
        # In a real app, you would decode and verify the JWT here
        # For now, we'll just return a mock user ID or extract 'sub' if possible without verification
        # decoded = jwt.decode(token, options={"verify_signature": False})
        
        # For development/demo, we can just pass through or decode without verification
        # In production, use proper JWT verification with public keys
        
        return "user_placeholder" # decoded.get("sub")
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

# Usage in routers:
# from auth import security, verify_token
# @router.get("/protected")
# async def protected_route(credentials: HTTPAuthorizationCredentials = Security(security)):
#     user_id = await verify_token(credentials)
#     return {"user_id": user_id}
"""
