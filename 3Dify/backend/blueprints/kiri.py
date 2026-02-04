import os
import time
import requests
from flask import Blueprint, jsonify, make_response

kiri_bp = Blueprint("kiri_api", __name__, template_folder="templates")

from flask import Blueprint, jsonify, make_response

@kiri_bp.route("/kiri_api", methods=["POST"])
def generate_model():
    api_key = 'kiri_FM00YuopRoktzzu-6tWIcX5T_e8lHKcvzi-ZlGiuM3M'

    upload_url = 'https://api.kiriengine.app/api/v1/open/photo/video'
    headers = {
        'Authorization': f'Bearer {api_key}'
    }

    # Path to your hardcoded demo video
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    video_path = os.path.join(base_dir, "temp_videos", "integra_demo.mp4")

    files = {
        'videoFile': ('video.mp4', open(video_path, 'rb'), 'video/mp4')
    }

    data = {
        'modelQuality': '3',
        'textureQuality': '3',
        'fileFormat': 'OBJ',
        'isMask': '1',
        'textureSmoothing': '1'
    }

    # STEP 1: send video to Kiri
    post = requests.post(upload_url, headers=headers, files=files, data=data)
    print("KIRI UPLOAD STATUS:", post.status_code)
    upload_json = post.json()
    print("UPLOAD RESPONSE JSON:", upload_json)

    serialize_id = upload_json['data']['serialize']

    # STEP 2: poll Kiri for model readiness
    poll_url = (
        f'https://api.kiriengine.app/api/v1/open/model/getModelZip'
        f'?serialize={serialize_id}'
    )

    while True:
        resp = requests.get(poll_url, headers=headers)
        print("Polling...", resp.status_code, resp.headers.get("Content-Type"))

        # Kiri always returns JSON here
        try:
            j = resp.json()
            print("Polling JSON:", j)
        except Exception:
            j = None

        # ✅ MODEL READY: code 200 + data.modelUrl present
        if (
            j
            and j.get("code") == 200
            and j.get("data", {}).get("modelUrl")
        ):
            final_url = j["data"]["modelUrl"]
            print("Model ready! Returning:", final_url)
            return jsonify({"downloadUrl": final_url})

        # Still processing
        time.sleep(5)
