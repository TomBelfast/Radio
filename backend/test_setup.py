"""
Simple test script to verify backend is working correctly.
Run after setting up .env and initializing database.
"""
import asyncio
import httpx

async def test_backend():
    print("🧪 Testing Radio Traffic & Weather Generator Backend\n")
    
    base_url = "http://localhost:8000"
    
    # Test 1: Health Check
    print("1️⃣  Testing health endpoint...")
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(f"{base_url}/api/health")
            if response.status_code == 200:
                print(f"   ✅ Health check passed: {response.json()}")
            else:
                print(f"   ❌ Health check failed: {response.status_code}")
                return
        except Exception as e:
            print(f"   ❌ Cannot connect to backend: {e}")
            print("   💡 Make sure backend is running: python main.py")
            return
    
    print("\n✨ All tests passed! Backend is ready.")
    print("\n📌 Next steps:")
    print("   1. Start frontend: cd frontend && npm run dev")
    print("   2. Open http://localhost:3000")
    print("   3. Sign in")
    print("   4. Configure settings")

if __name__ == "__main__":
    asyncio.run(test_backend())
