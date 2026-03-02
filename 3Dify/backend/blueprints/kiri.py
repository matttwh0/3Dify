import requests, time
from fastapi import HTTPException
from flask import Blueprint, request, jsonify 

#base URL : https://api.kiriengine.app/api/

#The API Key format is kiri-<random-string>
#api key : #kiri_VRO7sPXRPfup5gLIMWgTy_cJe5yDTAwvN36S8WaVJKE
kiri_bp = Blueprint("kiri_api", __name__, template_folder="templates")

jobs = {}

@kiri_bp.route("/kiri_api", methods=["POST"])
def generate_model():
    if "videoFile" not in request.files:
        return jsonify({"error": "Missing videoFile"}), 400
    #request video file from UploadVideo.jsx
    video = request.files['videoFile']
    temp_path = 'temp.mp4'
    video.save(temp_path)
    
    api_key = 'kiri_FS-BFxXQ0EigcD1HRyQY7_sbsNDO9whUSx1VMZvEhto'

    url = 'https://api.kiriengine.app/api/v1/open/3dgs/video'  

    headers = {
        'Authorization': f'Bearer {api_key}'
    }

    files = {
        'videoFile': ('video.mp4', open('temp.mp4', 'rb'), 'video/mp4')
    }

    #returns mesh + auto masks object 
    data = {
    'isMesh': '1',
    'isMask': '1',
    # 'videoFile': ('video.mp4', open('/Users/matthewtran/Aztech 3D Modeling App/Aztech/3Dify/backend/temp_videos/integra_demo.mp4'))
    }

    with open(temp_path, "rb") as f:
        files = {"videoFile": ("video.mp4", f, "video/mp4")}
        post = requests.post(url, headers=headers, files=files, data=data)

    time.sleep(2.5)

    print(post.status_code)
    print(post.json())

    id = post.json()['data']['serialize']
    model_url = f'https://api.kiriengine.app/api/v1/open/model/getModelZip?serialize={id}'
    while True:
        resp = requests.get(model_url, headers=headers)

        if resp.status_code == 200 and resp.headers.get("Content-Type") == "application/zip":
            #send update to frontend when it finishes, meanwhile we can label it as 'processing'
            print("Model ready!")
            return {"downloadUrl": model_url}

        else:
            print("Not ready yet:", resp.json())
            time.sleep(5)   # wait 5 seconds and try again
        #raise HTTPException(status_code=404, detail="Model Error")
    
# @kiri_bp.route("/kiri_progress/<job_id>", methods=["GET"])
# def get_progress():
#     return 0

