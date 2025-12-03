import requests, time
from fastapi import HTTPException
from flask import Blueprint 
#base URL : https://api.kiriengine.app/api/

#The API Key format is kiri-<random-string>
#api key : #kiri_VRO7sPXRPfup5gLIMWgTy_cJe5yDTAwvN36S8WaVJKE
kiri_bp = Blueprint("kiri_api", __name__, template_folder="templates")

jobs = {}

@kiri_bp.route("/kiri_api", methods=["POST"])
def generate_model():
    
    api_key = 'kiri_VRO7sPXRPfup5gLIMWgTy_cJe5yDTAwvN36S8WaVJKE'

    url = 'https://api.kiriengine.app/api/v1/open/photo/video' 

    headers = {
        'Authorization': f'Bearer {api_key}'
    }

    files = {
        'videoFile': ('video.mp4', open('/Users/matthewtran/Downloads/integra_demo.mp4', 'rb'), 'video/mp4')
    }

    data = {
    'modelQuality': '3',
    'textureQuality': '3',
    'fileFormat': 'OBJ',
    'isMask': '1',
    'textureSmoothing': '1'

    }

    post = requests.post(url, headers=headers, files=files, data=data)

    time.sleep(2.5)

    print(post.status_code)
    print(post.json())

    id = post.json()['data']['serialize']
    model_url = f'https://api.kiriengine.app/api/v1/open/model/getModelZip?serialize={id}'
    while True:
        resp = requests.get(model_url, headers=headers)

        if resp.status_code == 200 and resp.headers.get("Content-Type") == "application/zip":
            print("Model ready!")
            return {"downloadUrl": model_url}

        else:
            print("Not ready yet:", resp.json())
            time.sleep(5)   # wait 5 seconds and try again
        #raise HTTPException(status_code=404, detail="Model Error")
    
# @kiri_bp.route("/kiri_progress/<job_id>", methods=["GET"])
# def get_progress():
#     return 0

