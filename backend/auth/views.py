from django_backend.mongo_connection import db
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import bcrypt
import json

users = db["users"]

@csrf_exempt
def login(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            document_id = data.get("documentid")
            password = data.get("password").encode("utf-8")
            user = users.find_one({"documentid": int(document_id)})
            if user and bcrypt.checkpw(password, user["password"].encode("utf-8")):
                response_data = {
                    "success": True,
                    "user": {"documentid": user["documentid"], "name": user["name"], "lastname": user["lastname"], "type": user["type"]}
                }
                return JsonResponse(response_data)
            else:
                return JsonResponse({"success": False, "message": "Invalid credentials"}, status=401)

        except json.JSONDecodeError:
            return JsonResponse({"success": False, "message": "Invalid JSON"}, status=400)
        except Exception as e:
            return JsonResponse({"success": False, "message": str(e)}, status=500)
    else:
        return JsonResponse({"success": False, "message": "Invalid request method"}, status=405)
