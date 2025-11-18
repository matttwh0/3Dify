#TODO: rename file to something broader, change blueprint names and routes for each function 
from flask import Flask, Blueprint
import base64
from urllib.parse import urlencode
import requests
post_photoscene_bp = Blueprint('post_photoscene', __name__, template_folder='templates')

#generate token from client secrets 
@post_photoscene_bp.route('/photoscene', methods=['POST'])

def get_token(): #call this method in photoscene function
    token_URL = 'https://developer.api.autodesk.com/authentication/v2/token'
    client_ID = 'GAjgqsQ2Xk0HmDGljBblQ5oio0jEY5AXI87YNzJJG0iYQnxX'
    client_secret = 'jpK99MVLblBZCQ1NSx4exKi49sy5mNZP8D8M30xc4AwflzAUWwnUP8RmTkdYlrot'

    raw = f'{client_ID}:{client_secret}' # combine client id and secret for format

    #encode client secret per API requirements 
    encoded = base64.b64encode(raw.encode()).decode()

    #'address and other info on front of envelope'
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded', 
        'Accept': 'application/json',
        'Authorization': f'Basic {encoded}',
    }

    #'contents within envelope'
    body = urlencode({
        'grant_type': 'client_credentials',
        'scope': 'data:read data:write'  
    })

    #post request to API
    response = requests.post(token_URL, headers=headers,data=body)

    token  = response.json()
    return token['access_token']

#<---------------------------------POST_PHOTOSCENE------------------------------------->

@post_photoscene_bp.route('/create_photoscene', methods=['POST'])

def post_photoscene():

    token_URL = 'https://developer.api.autodesk.com/photo-to-3d/v1/photoscene'
    token = get_token()

    headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': f'Bearer {token}',
      'Accept': 'application/json'
    }

    #request data
    body = urlencode({
      'scenename': 'testphotoscene1',
      format: 'rcm',
      'scenetype': 'object'
    })

    #post request to API 
    response = requests.post(token_URL, headers=headers,data=body)
    photoscene = response.json()
    return photoscene.get('Photoscene','error generating photoscene, refer to post_photoscene.py')

#cleaner output
# photoscene = response.json()
# photoscene_id = photoscene["Photoscene"]["photosceneid"]
# return {"photosceneid": photoscene_id}


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
