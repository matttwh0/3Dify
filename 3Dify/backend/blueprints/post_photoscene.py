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
        "format": "rcm",
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
    url = f"https://developer.api.autodesk.com/photo-to-3d/v1/file"

    results = []

    for path in image_paths:
        with open(path, "rb") as f:
            files = {
                "file[]": (os.path.basename(path), f, "image/jpeg")
            }

            data = {
                "photosceneid": photosceneid   # REQUIRED
            }

            headers = { 
                "Authorization": f"Bearer {token}"
            }

            resp = requests.post(url, headers=headers, files=files, data=data)

            print("\n=== UPLOAD RESPONSE ===")
            print("FILE:", os.path.basename(path))
            print("STATUS:", resp.status_code)
            print("BODY:", resp.text)

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
