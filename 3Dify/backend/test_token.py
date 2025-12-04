import requests

CLIENT_ID = "GAjgqsQ2Xk0HmDGljBblQ5oio0jEY5AXI87YNzJJG0iYQnxX"
CLIENT_SECRET = "jpK99MVLblBZCQ1NSx4exKi49sy5mNZP8D8M30xc4AwflzAUWwnUP8RmTkdYlrot"

url = "https://developer.api.autodesk.com/authentication/v2/token"

headers = {
    "Content-Type": "application/x-www-form-urlencoded"
}

data = {
    "grant_type": "client_credentials",
    "scope": "data:read data:write"
}

resp = requests.post(url, headers=headers, data=data, auth=(CLIENT_ID, CLIENT_SECRET))

print("STATUS:", resp.status_code)
print("BODY:", resp.text)
