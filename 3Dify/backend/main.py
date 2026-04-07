from flask import Flask, Blueprint, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, storage, firestore
import os

#from blueprints.video_submit import video_submit_bp 
#from blueprints.post_photoscene import post_photoscene_bp
from blueprints.kiri import kiri_bp


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SERVICE_ACCOUNT_PATH = os.path.join(BASE_DIR, "serviceAccountKey.json")

app = Flask(__name__)
CORS(app, origins=[
    "http://localhost:5173",
    "http://127.0.0.1:5173"
])

cred = credentials.Certificate(SERVICE_ACCOUNT_PATH)

firebase_admin.initialize_app(cred, {
    "storageBucket": "dify-86229.firebasestorage.app"
})

db = firestore.client()
bucket = storage.bucket()



#register blueprints 
app.register_blueprint(kiri_bp)
#app.register_blueprint(video_submit_bp)
#app.register_blueprint(post_photoscene_bp)



@app.route("/")
def helloWorld():
    return "hello world"

@app.route("/test-cors", methods=["GET", "OPTIONS"])
def test_cors():
    return {
        "ok": True,
        "message": "CORS is working"
    }

@app.route("/test-storage")
def test_storage():
    try:
        blobs = list(bucket.list_blobs(max_results=1))
        return {
            "ok": True,
            "message": "Connected to Firebase Storage",
            "sample_found": len(blobs)
        }
    except Exception as e:
        return {
            "ok": False,
            "error": str(e)
        }

if __name__ == "__main__":
    app.run(debug=True)
    print(app.url_map)

    #curl -X POST http://127.0.0.1:5000/kiri_api
