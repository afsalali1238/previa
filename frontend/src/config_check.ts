
console.log("--- FIREBASE CONFIG CHECK ---");
console.log("API Key exists:", !!import.meta.env.VITE_FIREBASE_API_KEY);
console.log("Auth Domain:", import.meta.env.VITE_FIREBASE_AUTH_DOMAIN);
console.log("Project ID:", import.meta.env.VITE_FIREBASE_PROJECT_ID);
console.log("Storage Bucket:", import.meta.env.VITE_FIREBASE_STORAGE_BUCKET);
console.log("App ID exists:", !!import.meta.env.VITE_FIREBASE_APP_ID);
console.log("-----------------------------");
