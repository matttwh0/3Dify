from flask import Blueprint, jsonify, request
from werkzeug.utils import secure_filename
from blueprints.post_photoscene import (
    get_token,
    create_photoscene,
    upload_images,
    start_processing,
    get_photoscene_progress,
    get_result_link
)

import os
import cv2

video_submit_bp = Blueprint("video_submit", __name__, template_folder="templates")

# Folder to save extracted JPGs
FRAMES_DIR = os.path.join(os.path.dirname(__file__), "..", "temp_frames")
os.makedirs(FRAMES_DIR, exist_ok=True)

# Folder to save uploaded videos
TEMP_VIDEO_DIR = os.path.join(os.path.dirname(__file__), "..", "temp_videos")
os.makedirs(TEMP_VIDEO_DIR, exist_ok=True)


@video_submit_bp.route("/video_request", methods=["POST"])
def video_request():
    d = {}

    try:
        # 1. Receive video from frontend
        file = request.files["file"]
        filename = secure_filename(file.filename)
        print(f"\n=== RECEIVED VIDEO: {filename} ===")

        video_path = os.path.join(TEMP_VIDEO_DIR, filename)
        file.save(video_path)

        # 2. Extract frames into JPGs
        frame_paths = extract_frames(video_path, num_frames=20)
        print(f"Extracted {len(frame_paths)} frames")

        # 3. Get APS OAuth token
        token = get_token()
        print("Got APS OAuth token")

        # 4. Create photoscene
        photosceneid = create_photoscene(token)
        print(f"Created Photoscene: {photosceneid}")

        # 5. Upload extracted JPG frames
        upload_results = upload_images(token, photosceneid, frame_paths)
        print(f"Uploaded {len(upload_results)} images to Photoscene {photosceneid}")

        # 6. Start RC processing
        processing_result = start_processing(token, photosceneid)
        print("Started processing job.")

        # 7. Return success to frontend
        d["status"] = 1
        d["photosceneid"] = photosceneid
        d["frames_uploaded"] = len(upload_results)
        d["processing"] = processing_result

    except Exception as e:
        print(f"\nERROR in /video_request: {e}\n")
        d["status"] = 0
        d["error"] = str(e)

    return jsonify(d)


def extract_frames(video_path, num_frames=20):
    cap = cv2.VideoCapture(video_path)
    
    if not cap.isOpened():
        raise RuntimeError(f"Could not open video file: {video_path}")

    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    if total_frames == 0:
        raise RuntimeError("Video has 0 frames")

    step = max(total_frames // num_frames, 1)
    saved_paths = []

    # Evenly spaced frame numbers
    frame_indices = [i * step for i in range(num_frames)]

    for idx, frame_no in enumerate(frame_indices):
        if frame_no >= total_frames:
            break

        cap.set(cv2.CAP_PROP_POS_FRAMES, frame_no)
        success, frame = cap.read()

        if not success:
            continue

        frame_filename = f"frame_{idx:04d}.jpg"
        frame_path = os.path.join(FRAMES_DIR, frame_filename)

        cv2.imwrite(frame_path, frame)
        saved_paths.append(frame_path)

    cap.release()
    return saved_paths

# GET /photoscene/<id>/status
@video_submit_bp.route("/photoscene/<photosceneid>/status", methods=["GET"])
def photoscene_status(photosceneid):
    try:
        token = get_token()
        progress = get_photoscene_progress(token, photosceneid)
        return jsonify({"status": 1, "photosceneid": photosceneid, "progress": progress})
    except Exception as e:
        print(f"Status error: {e}")
        return jsonify({"status": 0, "error": str(e)}), 500

# GET /photoscene/<id>/result?format=rcm
@video_submit_bp.route("/photoscene/<photosceneid>/result", methods=["GET"])
def photoscene_result(photosceneid):
    fmt = request.args.get("format", "rcm")  # default to rcm
    try:
        token = get_token()
        result = get_result_link(token, photosceneid, fmt=fmt)
        return jsonify({"status": 1, "photosceneid": photosceneid, "result": result})
    except Exception as e:
        print(f"Result error: {e}")
        return jsonify({"status": 0, "error": str(e)}), 500
