import requests, time, threading, uuid
from fastapi import HTTPException
from flask import Blueprint, request, jsonify 

#base URL : https://api.kiriengine.app/api/

#The API Key format is kiri-<random-string>
#api key : #kiri_VRO7sPXRPfup5gLIMWgTy_cJe5yDTAwvN36S8WaVJKE
kiri_bp = Blueprint("kiri_api", __name__, template_folder="templates")

jobs = {}
MOCK_MODE = True  #set to false to use actual API

def poll_model_mock(job_id):
    """Simulates Kiri's queue → processing → done stages"""
    # Stage 1: in queue (10 seconds)
    time.sleep(10)
    jobs[job_id]["kiri_status"] = "processing"
    print(f"Mock job {job_id}: now processing")

    # Stage 2: processing (15 more seconds)
    time.sleep(15)

    # Stage 3: done — mimic exact Kiri success response
    fake_download_url = "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-zip-file.zip"
    jobs[job_id] = {
        "status": "done",
        "downloadUrl": fake_download_url,
        "kiri_response": {
            "code": 0,
            "msg": "success",
            "data": {
                "modelUrl": fake_download_url,
                "serialize": job_id,
            },
            "ok": True
        }
    }
    print(f"Mock job {job_id} complete!")

    
def poll_model(job_id, serialize, headers):
    model_url = f'https://api.kiriengine.app/api/v1/open/model/getModelZip?serialize={serialize}'
    while True:
        resp = requests.get(model_url, headers=headers)
        body = resp.json()
        print(f"Full response: {body}")
        if body and body.get("code") == 200 and body.get("data") and body["data"].get("modelUrl"):
            download_url = body["data"]["modelUrl"]
            jobs[job_id] = {"status": "done", "downloadUrl": download_url}
            print(f"Job {job_id} complete! URL: {download_url}")
            return
        else:
            print(f"Job {job_id} not ready:", body)
            time.sleep(45)
            
@kiri_bp.route("/kiri_api", methods=["POST"])
def generate_model():
    if "videoFile" not in request.files:
        return jsonify({"error": "Missing videoFile"}), 400

    if MOCK_MODE:
        fake_serialize = uuid.uuid4().hex

        # Mimic exact Kiri POST response format
        jobs[fake_serialize] = {
            "status": "processing",
            "downloadUrl": None,
            "kiri_status": "queued",
            "kiri_response": {
                "code": 0,
                "msg": "success",
                "data": {
                    "serialize": fake_serialize
                },
                "ok": True
            }
        }

        thread = threading.Thread(target=poll_model_mock, args=(fake_serialize,))
        thread.daemon = True
        thread.start()

        print(f"Mock job started: {fake_serialize}")
        # Return same format as real Kiri POST response
        return jsonify({
            "jobId": fake_serialize,
            "kiri_response": {
                "code": 0,
                "msg": "success",
                "data": {"serialize": fake_serialize},
                "ok": True
            }
        })
    video = request.files['videoFile']
    temp_path = 'temp.mp4'
    video.save(temp_path)

    api_key = 'kiri_FS-BFxXQ0EigcD1HRyQY7_sbsNDO9whUSx1VMZvEhto'
    headers = {'Authorization': f'Bearer {api_key}'}

    url = 'https://api.kiriengine.app/api/v1/open/3dgs/video'
    data = {'isMesh': '1', 'isMask': '1'}

    with open(temp_path, "rb") as f:
        files = {"videoFile": ("video.mp4", f, "video/mp4")}
        post = requests.post(url, headers=headers, files=files, data=data)

    if not post.ok:
        return jsonify({"error": "Kiri API failed"}), 500

    serialize = post.json()['data']['serialize']
    job_id = serialize  # use serialize as the job ID

    jobs[job_id] = {"status": "processing", "downloadUrl": None}

    # Kick off background polling thread — don't block the response
    thread = threading.Thread(target=poll_model, args=(job_id, serialize, headers))
    thread.daemon = True
    thread.start()

    return jsonify({"jobId": job_id})  # return immediately

@kiri_bp.route("/kiri_progress/<job_id>", methods=["GET"])
def get_progress(job_id):
    job = jobs.get(job_id)
    if not job:
        return jsonify({"error": "Job not found"}), 404
    return jsonify(job)

