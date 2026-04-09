import requests, time, threading, uuid
from datetime import timedelta
from flask import Blueprint, request, jsonify
from firebase_admin import firestore
import os
import google.oauth2.service_account
from firebase_admin import storage
from flask_cors import cross_origin
from flask_cors import CORS
from .services.model_processing import extract_and_upload_assets

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SERVICE_ACCOUNT_PATH = os.path.join(BASE_DIR, "serviceAccountKey.json")


#base URL : https://api.kiriengine.app/api/

#The API Key format is kiri-<random-string>
kiri_bp = Blueprint("kiri_api", __name__, template_folder="templates")

jobs = {}
MOCK_MODE = True #set to false to use actual API

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

    
def poll_model(scan_id,job_id, serialize, headers):
    db = firestore.client()
    bucket = storage.bucket()
    scan_ref = db.collection("scans").document(scan_id)
    model_url = f'https://api.kiriengine.app/api/v1/open/model/getModelZip?serialize={serialize}'
    try:
        while True:
            resp = requests.get(model_url, headers=headers, timeout=60)
            body = resp.json()

            print(f"Polling scan {scan_id}: {body}")

            code = body.get("code")
            data = body.get("data") or {}
            download_url = data.get("modelUrl")

            if body.get("ok") and download_url:
                print(f"Job {job_id} complete, downloading zip from KIRI...")

                # Get scan info so we know where to store the result
                scan_snap = scan_ref.get()
                if not scan_snap.exists:
                    print(f"Scan doc {scan_id} not found")
                    return

                scan_data = scan_snap.to_dict()
                uid = scan_data.get("uid")
                if not uid:
                    scan_ref.update({
                        "status": "failed",
                        "error": "Missing uid on scan document",
                        "updatedAt": firestore.SERVER_TIMESTAMP,
                    })
                    return

                result_path = f"models/{uid}/{scan_id}/model.zip"
                blob = bucket.blob(result_path)

                # Stream the KIRI zip directly into Firebase Storage

                with requests.get(download_url, stream=True, timeout=120) as r:
                    r.raise_for_status()
                    blob.upload_from_file(r.raw, content_type="application/zip")

                extract_and_upload_assets(bucket, scan_ref, uid, scan_id, result_path)

                # Generate a signed download URL (valid 24 hours)
                sa_creds = google.oauth2.service_account.Credentials.from_service_account_file(
                    SERVICE_ACCOUNT_PATH,
                    scopes=["https://www.googleapis.com/auth/cloud-platform"]
                )
                signed_url = blob.generate_signed_url(
                    expiration=timedelta(hours=24),
                    method="GET",
                    version="v4",
                    credentials=sa_creds,
                )

                # Then mark done
                scan_ref.update({
                    "status": "done",
                    "resultPath": result_path,
                    "updatedAt": firestore.SERVER_TIMESTAMP,
                })

                jobs[job_id] = {
                    "status": "done",
                    "resultPath": result_path,
                    "downloadUrl": signed_url,
                }

                print(f"Saved model for scan {scan_id} to {result_path}")
                return

            elif code in (2000, 2008):
                # still processing or queued
                scan_ref.update({
                    "status": "processing",
                    "updatedAt": firestore.SERVER_TIMESTAMP,
                })

                jobs[job_id] = {
                    "status": "processing",
                    "resultPath": None,
                    "scanId": scan_id,
                }
                time.sleep(5)

            else:
                error_msg = f"Unexpected KIRI response: {body}"
                print(error_msg)

                scan_ref.update({
                    "status": "failed",
                    "kiriStatusCode": code,
                    "kiriResponse": body,
                    "error": error_msg,
                    "updatedAt": firestore.SERVER_TIMESTAMP,
                })

                jobs[job_id] = {
                    "status": "failed",
                    "error": error_msg,
                }
                return

    except requests.exceptions.ReadTimeout:
        print(f"Polling timeout for {scan_id}, retrying...")
        scan_ref.update({
            "status": "processing",
            "updatedAt": firestore.SERVER_TIMESTAMP,
        })

        jobs[job_id] = {
            "status": "processing",
            "resultPath": None,
            "scanId": scan_id,
        }

        time.sleep(10)

    except Exception as e:
        print(f"Polling error for {scan_id}: {e}")

        scan_ref.update({
            "status": "failed",
            "error": str(e),
            "updatedAt": firestore.SERVER_TIMESTAMP,
        })

        jobs[job_id] = {
            "status": "failed",
            "error": str(e),
            "scanId": scan_id,
        }

            
@cross_origin(origins=["http://localhost:5173", "http://127.0.0.1:5173"])
@kiri_bp.route("/kiri_api", methods=["POST", "OPTIONS"])
def generate_model():
    if request.method == "OPTIONS":
        return "", 200

    db = firestore.client()
    bucket = storage.bucket()
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
    temp_path = None
    scan_id = None

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

        api_key = "kiri_fugZOREefvt60h0gUPbVLx0v0qRJWYXeo0v6R0ArY-Q"
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
            db.collection("scans").document(scan_id).update({
                "status": "failed",
                "error": post.text,
                "updatedAt": firestore.SERVER_TIMESTAMP,
            })
            return jsonify({
                "error": "Kiri API failed",
                "status_code": post.status_code,
                "details": post.text
            }), 500

        body = post.json()
        print("Parsed KIRI body:", body)

        serialize = body.get("data", {}).get("serialize")
        if not serialize:
            db.collection("scans").document(scan_id).update({
                "status": "failed",
                "error": "Missing serialize in KIRI response",
                "kiriResponse": body,
                "updatedAt": firestore.SERVER_TIMESTAMP,
            })
            return jsonify({
                "error": "Missing serialize in KIRI response",
                "details": body
            }), 500
        job_id = serialize

        db.collection("scans").document(scan_id).update({
            "status": "processing",
            "kiriSerialize": serialize,
            "kiriStatusCode": body.get("code"),
            "updatedAt": firestore.SERVER_TIMESTAMP,
        })

        print("Saved KIRI serialize to Firestore:", serialize)

        jobs[job_id] = {"status": "processing", "resultPath": None, "scanId": scan_id}

        thread = threading.Thread(target=poll_model, args=(scan_id, job_id, serialize, headers))
        thread.daemon = True
        thread.start()

        return jsonify({"jobId": job_id, "serialize": serialize})

    except Exception as e:
        print("ERROR in /kiri_api:", repr(e))
        if scan_id:
            try:
                db.collection("scans").document(scan_id).update({
                    "status": "failed",
                    "error": str(e),
                    "updatedAt": firestore.SERVER_TIMESTAMP,
                })
            except Exception:
                pass
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


@kiri_bp.route("/resume_kiri/<scan_id>", methods=["POST"])
def resume_kiri(scan_id):
    db = firestore.client()
    scan_ref = db.collection("scans").document(scan_id)
    scan_snap = scan_ref.get()

    if not scan_snap.exists:
        return jsonify({"error": "Scan not found"}), 404

    scan_data = scan_snap.to_dict()
    serialize = scan_data.get("kiriSerialize")

    if not serialize:
        return jsonify({"error": "No kiriSerialize found for this scan"}), 400

    api_key = ""
    headers = {"Authorization": f"Bearer {api_key}"}

    job_id = serialize

    jobs[job_id] = {
        "status": "processing",
        "resultPath": scan_data.get("resultPath"),
        "scanId": scan_id,
    }

    thread = threading.Thread(
        target=poll_model,
        args=(scan_id, job_id, serialize, headers),
    )
    thread.daemon = True
    thread.start()

    return jsonify({
        "message": "Polling resumed",
        "scanId": scan_id,
        "jobId": job_id,
        "serialize": serialize,
    }), 200


@kiri_bp.route("/test_process_existing_zip", methods=["POST"])
def test_process_existing_zip():
    db = firestore.client()
    bucket = storage.bucket()

    try:
        data = request.get_json()
        scan_id = data.get("scanId")
        uid = data.get("uid")
        local_zip_path = data.get("localZipPath")

        if not scan_id or not uid or not local_zip_path:
            return jsonify({"error": "Missing scanId, uid, or localZipPath"}), 400

        scan_ref = db.collection("scans").document(scan_id)

        result_path = f"models/{uid}/{scan_id}/model.zip"
        blob = bucket.blob(result_path)
        blob.upload_from_filename(local_zip_path, content_type="application/zip")

        extract_and_upload_assets(bucket, scan_ref, uid, scan_id, result_path)

        scan_ref.update({
            "status": "done",
            "resultPath": result_path,
            "updatedAt": firestore.SERVER_TIMESTAMP,
        })

        return jsonify({
            "message": "Test zip processed successfully",
            "resultPath": result_path,
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500