import requests, time, threading
from fastapi import HTTPException
from flask import Blueprint, request, jsonify 
from firebase_admin import firestore
import os
from firebase_admin import storage
from flask_cors import cross_origin
from flask_cors import CORS





#base URL : https://api.kiriengine.app/api/

#The API Key format is kiri-<random-string>
kiri_bp = Blueprint("kiri_api", __name__, template_folder="templates")

jobs = {}
MOCK_MODE = False #set to false to use actual API

def poll_model_mock(job_id):
    """Simulates a 20 second processing delay then marks job done"""
    time.sleep(20)
    jobs[job_id] = {
        "status": "done",
        "downloadUrl": "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-zip-file.zip"  # fake zip
    }
    print(f"Mock job {job_id} complete!")
    
def poll_model(job_id, serialize, headers):
    model_url = f'https://api.kiriengine.app/api/v1/open/model/getModelZip?serialize={serialize}'
    while True:
        resp = requests.get(model_url, headers=headers)
        body = resp.json()

        if body.get("code") == 0 and body.get("data", {}).get("modelUrl"):
            download_url = body["data"]["modelUrl"]
            jobs[job_id] = {"status": "done", "downloadUrl": download_url}
            print(f"Job {job_id} complete! URL: {download_url}")
            return
        else:
            print(f"Job {job_id} not ready:", body)
            time.sleep(5)

            
@cross_origin(origins=["http://localhost:5173", "http://127.0.0.1:5173"])
@kiri_bp.route("/kiri_api", methods=["POST", "OPTIONS"])
def generate_model():
    if request.method == "OPTIONS":
        return "", 200

    db = firestore.client()
    bucket = storage.bucket()

    temp_path = None

    try:
        data = request.get_json()
        print("Incoming JSON:", data)

        scan_id = data.get("scanId")
        storage_path = data.get("storagePath")

        if not scan_id or not storage_path:
            return jsonify({"error": "Missing scanId or storagePath"}), 400

        temp_path = f"/tmp/{scan_id}.mp4"

        blob = bucket.blob(storage_path)
        blob.download_to_filename(temp_path)
        print(f"Downloaded {storage_path} to {temp_path}")

        api_key = ""
        headers = {"Authorization": f"Bearer {api_key}"}

        url = "https://api.kiriengine.app/api/v1/open/3dgs/video"
        form_data = {"isMesh": "1", "isMask": "1"}

        print("Sending file to KIRI...")
        with open(temp_path, "rb") as f:
            files = {"videoFile": ("video.mp4", f, "video/mp4")}
            post = requests.post(url, headers=headers, files=files, data=form_data)

        print("KIRI status code:", post.status_code)
        print("KIRI raw response:", post.text)

        if not post.ok:
            return jsonify({
                "error": "Kiri API failed",
                "status_code": post.status_code,
                "details": post.text
            }), 500

        body = post.json()
        print("Parsed KIRI body:", body)

        serialize = body["data"]["serialize"]
        job_id = serialize

        db.collection("scans").document(scan_id).update({
            "status": "processing",
            "kiriSerialize": serialize,
            "kiriStatusCode": body.get("code"),
        })

        print("Saved KIRI serialize to Firestore:", serialize)

        jobs[job_id] = {"status": "processing", "downloadUrl": None}

        thread = threading.Thread(target=poll_model, args=(job_id, serialize, headers))
        thread.daemon = True
        thread.start()

        return jsonify({"jobId": job_id, "serialize": serialize})

    except Exception as e:
        print("ERROR in /kiri_api:", repr(e))
        return jsonify({"error": str(e)}), 500

    finally:
        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)
            print(f"Deleted temp file {temp_path}")
    

@kiri_bp.route("/kiri_progress/<job_id>", methods=["GET"])
def get_progress(job_id):
    job = jobs.get(job_id)
    if not job:
        return jsonify({"error": "Job not found"}), 404
    return jsonify(job)

