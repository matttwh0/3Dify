#kiri_VRO7sPXRPfup5gLIMWgTy_cJe5yDTAwvN36S8WaVJKE
#kiri api key
from flask import Blueprint
import requests
import os

post_photoscene_bp = Blueprint("post_photoscene", __name__, template_folder="templates")

# -------------------------------
# 1. GET APS TOKEN
# -------------------------------
def get_token():
    url = "https://developer.api.autodesk.com/authentication/v2/token"

    client_id = "GAjgqsQ2Xk0HmDGljBblQ5oio0jEY5AXI87YNzJJG0iYQnxX"
    client_secret = "jpK99MVLblBZCQ1NSx4exKi49sy5mNZP8D8M30xc4AwflzAUWwnUP8RmTkdYlrot"

    headers = { "Content-Type": "application/x-www-form-urlencoded" }

    data = {
        "grant_type": "client_credentials",
        "scope": "data:read data:write"
    }

    # APS requires BASIC AUTH (client_id, client_secret)
    resp = requests.post(url, headers=headers, data=data, auth=(client_id, client_secret))
    print("\n=== TOKEN RESPONSE ===")
    print(resp.status_code, resp.text)

    resp.raise_for_status()
    return resp.json()["access_token"]


# -------------------------------
# 2. CREATE PHOTOSCENE
# -------------------------------
def create_photoscene(token):
    url = "https://developer.api.autodesk.com/photo-to-3d/v1/photoscene"

    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "application/json"
    }

    data = {
        "scenename": "testphotoscene1",
        "format": "obj",
        "scenetype": "object"
    }

    resp = requests.post(url, headers=headers, data=data)
    print("\n=== CREATE PHOTOSCENE RESPONSE ===")
    print(resp.status_code, resp.text)

    resp.raise_for_status()
    scene = resp.json()
    return scene["Photoscene"]["photosceneid"]


# -------------------------------
# 3. UPLOAD IMAGES
# -------------------------------
def upload_images(token, photosceneid, image_paths):
    url = "https://developer.api.autodesk.com/photo-to-3d/v1/file"

    results = []
    for path in image_paths:
        with open(path, "rb") as f:
            files = {
                "file[]": (os.path.basename(path), f, "image/jpeg")
            }

            data = {
                "photosceneid": photosceneid,
                "type": "image"   # <-- REQUIRED
            }

            headers = {
                "Authorization": f"Bearer {token}"
            }

            resp = requests.post(url, headers=headers, files=files, data=data)

            print("\n=== UPLOAD RESPONSE ===")
            print(resp.status_code, resp.text)

            resp.raise_for_status()
            results.append(resp.json())

    return results




# -------------------------------
# 4. START PROCESSING
# -------------------------------
def start_processing(token, photosceneid):
    url = f"https://developer.api.autodesk.com/photo-to-3d/v1/photoscene/{photosceneid}"

    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/json"
    }

    resp = requests.post(url, headers=headers)

    print("\n=== PROCESS RESPONSE ===")
    print(resp.status_code, resp.text)

    resp.raise_for_status()
    return resp.json()

# -------------------------------
# 5. GET PROGRESS
# -------------------------------
def get_photoscene_progress(token, photosceneid):
    """
    Hit the progress endpoint to see if the job is done.
    Docs: GET photoscene/{photosceneid}/progress
    """
    url = f"https://developer.api.autodesk.com/photo-to-3d/v1/photoscene/{photosceneid}/progress"
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/json"
    }

    resp = requests.get(url, headers=headers)
    print("\n=== PROGRESS RESPONSE ===")
    print(resp.status_code, resp.text)
    resp.raise_for_status()
    return resp.json()

# -------------------------------
# 6. GET RESULT 
# -------------------------------
def get_result_link(token, photosceneid, fmt="obj"):
    """
    Get a time-limited HTTPS link to the output file.
    Docs say GET photoscene/{photosceneid} returns a link to the result. :contentReference[oaicite:0]{index=0}
    """
    url = f"https://developer.api.autodesk.com/photo-to-3d/v1/photoscene/{photosceneid}"
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/json"
    }

    # Some variants use query params like format=rcm.
    # If your output isn’t what you want, you can tweak these.
    params = {
        "format": fmt  # try "rcm", "obj", "fbx", etc depending on what you want
    }

    resp = requests.get(url, headers=headers, params=params)
    print("\n=== RESULT RESPONSE ===")
    print(resp.status_code, resp.text)
    resp.raise_for_status()
    return resp.json()


#start it, grab the photoscene id from the server and then paste commands below using that id
#start: curl -X POST -F "file=@/Users/matthewtran/Downloads/water_bottle360.mp4" http://127.0.0.1:5000/video_request

# status: curl http://127.0.0.1:5000/photoscene/1jGR9Dvwb5pXTkINIfKuyLMEprHR3cnEYUlCKAYF9vM/status

#result: curl http://127.0.0.1:5000/photoscene/1jGR9Dvwb5pXTkINIfKuyLMEprHR3cnEYUlCKAYF9vM/result

