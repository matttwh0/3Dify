import os
import zipfile
import tempfile
from firebase_admin import firestore

def extract_and_upload_assets(bucket, scan_ref, uid, scan_id, zip_blob_path):
    zip_blob = bucket.blob(zip_blob_path)

    with tempfile.TemporaryDirectory() as tmpdir:
        local_zip = os.path.join(tmpdir, "model.zip")
        extract_dir = os.path.join(tmpdir, "extracted")

        os.makedirs(extract_dir, exist_ok=True)
        zip_blob.download_to_filename(local_zip)

        with zipfile.ZipFile(local_zip, "r") as zf:
            zf.extractall(extract_dir)

        obj_path = None
        mtl_path = None
        texture_paths = []
        ply_path = None
        cameras_path = None

        for root, _, files in os.walk(extract_dir):
            for name in files:
                local_file = os.path.join(root, name)
                rel_path = os.path.relpath(local_file, extract_dir).replace("\\", "/")
                storage_path = f"models/{uid}/{scan_id}/extracted/{rel_path}"

                blob = bucket.blob(storage_path)
                blob.upload_from_filename(local_file)

                lower = name.lower()
                if lower.endswith(".obj"):
                    obj_path = storage_path
                elif lower.endswith(".mtl"):
                    mtl_path = storage_path
                elif lower.endswith(".jpg") or lower.endswith(".jpeg") or lower.endswith(".png"):
                    texture_paths.append(storage_path)
                elif lower.endswith(".ply"):
                    ply_path = storage_path
                elif lower == "cameras.json":
                    cameras_path = storage_path

        if not obj_path:
            raise ValueError("No OBJ file found in extracted model")

        scan_ref.update({
            "viewer": {
                "format": "obj",
                "objPath": obj_path,
                "mtlPath": mtl_path,
                "texturePaths": texture_paths,
                "plyPath": ply_path,
                "camerasPath": cameras_path,
            },
            "updatedAt": firestore.SERVER_TIMESTAMP,
        })