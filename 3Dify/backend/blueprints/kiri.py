import requests, time, threading
from fastapi import HTTPException
from flask import Blueprint, request, jsonify 

#base URL : https://api.kiriengine.app/api/

#The API Key format is kiri-<random-string>
#api key : #kiri_VRO7sPXRPfup5gLIMWgTy_cJe5yDTAwvN36S8WaVJKE
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
            
@kiri_bp.route("/kiri_api", methods=["POST"])
def generate_model():
    if "videoFile" not in request.files:
        return jsonify({"error": "Missing videoFile"}), 400

    if MOCK_MODE:
        job_id = "mock-job-123"
        jobs[job_id] = {"status": "processing", "downloadUrl": None}
        thread = threading.Thread(target=poll_model_mock, args=(job_id,))
        thread.daemon = True
        thread.start()
        print("Mock mode: skipping Kiri API call")
        return jsonify({"jobId": job_id})
    
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

