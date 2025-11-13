from flask import Flask, Blueprint

post_photoscene_bp = Blueprint("post_photoscene", __name__, template_folder="templates")

#generate token from client secrets 
@post_photoscene_bp.route("/photoscene", methods=["POST"])

class video_process():
    def __init__(self, token, photoscene_id):
        self.token = token
        self.photosceneid = photoscene_id

def get_token(self, token): #call this class in photoscene class
    getTokenURI = "https://developer.api.autodesk.com/authentication/v2/token";
    originalString = "GAjgqsQ2Xk0HmDGljBblQ5oio0jEY5AXI87YNzJJG0iYQnxX:jpK99MVLblBZCQ1NSx4exKi49sy5mNZP8D8M30xc4AwflzAUWwnUP8RmTkdYlrot";

    return 0

def post_photoscene():
    return 0

"""
Instance variables are owned by instances of the class. This means that for each object
 or instance of a class, the instance variables are different

instance variables are defined within methods. 

class Shark:
    def __init__(self, name, age):
        self.name = name
        self.age = age

new_shark = Shark("Sammy", 5)

"""