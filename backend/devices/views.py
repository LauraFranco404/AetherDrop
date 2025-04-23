from django_backend.mongo_connection import db

from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.shortcuts import render


import json

devices = db["devices"]

# device data structure {"deviceid": 1, "name": "p1", "amount": 0, "unitprice": 0}

@csrf_exempt
def createDevice(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            if devices.find_one({"deviceid": data.get("deviceid")}) is None:
                devices.insert_one(data)
                return JsonResponse({"message": "Device created"}, status=200)
            else:
                return JsonResponse({"error": "Device has already been added"}, status=409)
        except Exception as e:
            print(e)
            return JsonResponse({"error": str(e)}, status=500)
    return JsonResponse({"error": "Method not allowed"}, status=405)

@csrf_exempt
def removeDevice(request):
    if request.method == "DELETE":
        try:
            data = json.loads(request.body)
            result = devices.delete_one({"deviceid": data.get("deviceid")})
            if result.deleted_count > 0:
                return JsonResponse({"message": "Device removed"}, status=200)
            else:
                return JsonResponse({"error": "Device not found"}, status=404)
        except Exception as e:
            print(e)
            return JsonResponse({"error": str(e)}, status=500)
    return JsonResponse({"error": "Method not allowed"}, status=405)

@csrf_exempt
def updateDevice(request):
    if request.method == "PUT":
        try:
            data = json.loads(request.body)
            result = devices.update_one({"deviceid": data.get("deviceid")}, {"$set": data})
            if result.matched_count > 0:
                return JsonResponse({"message": "Device updated"}, status=200)
            else:
                return JsonResponse({"error": "Device not found"}, status=404)
        except Exception as e:
            print(e)
            return JsonResponse({"error": str(e)}, status=500)
    return JsonResponse({"error": "Method not allowed"}, status=405)

@csrf_exempt
def getAllDevices(request):
    if request.method == "GET":
        try:
            all = list(devices.find({}, {"_id": 0}))
            return JsonResponse({"devices": all}, status=200)
        except Exception as e:
            print(e)
            return JsonResponse({"error": str(e)}, status=500)
    return JsonResponse({"error": "Method not allowed"}, status=405)

@csrf_exempt
def getDeviceByID(request):
    if request.method == "GET":
        try:
            deviceid = request.GET.get("deviceid")
            device = devices.find_one({"deviceid": int(deviceid)}, {"_id": 0})
            if device:
                return JsonResponse({"device": device}, status=200)
            else:
                return JsonResponse({"error": "Device not found"}, status=404)
        except Exception as e:
            print(e)
            return JsonResponse({"error": str(e)}, status=500)
    return JsonResponse({"error": "Method not allowed"}, status=405)

