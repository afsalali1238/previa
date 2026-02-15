import firebase_admin
from firebase_admin import credentials, firestore, storage
import os
from dotenv import load_dotenv

load_dotenv()

# Initialize Firebase Admin SDK
cred_path = os.getenv("FIREBASE_SERVICE_ACCOUNT_KEY")

if not firebase_admin._apps:
    if cred_path and os.path.exists(cred_path):
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred, {
            'storageBucket': os.getenv("FIREBASE_STORAGE_BUCKET")
        })
    else:
        # Fallback for local development if no key provided yet
        print("Warning: Firebase Service Account Key not found. Running with default credentials or mock mode.")
        if not firebase_admin._apps:
             # This might fail in production without explicit credentials or environment setup
            firebase_admin.initialize_app() 

db = firestore.client()
bucket = storage.bucket()
