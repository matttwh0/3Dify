from flask import Flask, Blueprint

post_photoscene_bp = Blueprint("post_photoscene", __name__, template_folder="templates")

#generate token from client secrets 
@post_photoscene_bp.route("/photoscene", methods=["POST"])
def get_token():
    return 0

def photoscene():
    return 0