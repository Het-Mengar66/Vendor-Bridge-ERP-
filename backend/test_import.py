import sys
import traceback

try:
    from app.main import app
    print("FastAPI app imported successfully! No syntax or import errors.")
except Exception as e:
    print("Error importing FastAPI app:")
    traceback.print_exc()
    sys.exit(1)
