from django_backend.mongo_connection import db

from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.shortcuts import render

import json

devices = db["devices"]

# product data structure {"productid": 1, "name": "p1", "amount": 0, "unitprice": 0}

@csrf_exempt
def createProduct(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            if devices.find_one({"productid": data.get("productid")}) is None:
                devices.insert_one(data)
                return JsonResponse({"message": "Product created"}, status=200)
            else:
                return JsonResponse({"error": "Product has already been added"}, status=409)
        except Exception as e:
            print(e)
            return JsonResponse({"error": str(e)}, status=500)
    return JsonResponse({"error": "Method not allowed"}, status=405)

@csrf_exempt
def removeProduct(request):
    if request.method == "DELETE":
        try:
            data = json.loads(request.body)
            result = devices.delete_one({"productid": data.get("productid")})
            if result.deleted_count > 0:
                return JsonResponse({"message": "Product removed"}, status=200)
            else:
                return JsonResponse({"error": "Product not found"}, status=404)
        except Exception as e:
            print(e)
            return JsonResponse({"error": str(e)}, status=500)
    return JsonResponse({"error": "Method not allowed"}, status=405)

@csrf_exempt
def updateProduct(request):
    if request.method == "PUT":
        try:
            data = json.loads(request.body)
            result = devices.update_one({"productid": data.get("productid")}, {"$set": data})
            if result.matched_count > 0:
                return JsonResponse({"message": "Product updated"}, status=200)
            else:
                return JsonResponse({"error": "Product not found"}, status=404)
        except Exception as e:
            print(e)
            return JsonResponse({"error": str(e)}, status=500)
    return JsonResponse({"error": "Method not allowed"}, status=405)

@csrf_exempt
def increaseProductByOne(request):
    if request.method == "PATCH":
        try:
            data = json.loads(request.body)
            result = devices.update_one({"productid": data.get("productid")}, {"$inc": {"amount": 1}})
            if result.matched_count > 0:
                return JsonResponse({"message": "Product amount increased by 1"}, status=200)
            else:
                return JsonResponse({"error": "Product not found"}, status=404)
        except Exception as e:
            print(e)
            return JsonResponse({"error": str(e)}, status=500)
    return JsonResponse({"error": "Method not allowed"}, status=405)

@csrf_exempt
def decreaseProductByOne(request):
    if request.method == "PATCH":
        try:
            data = json.loads(request.body)
            product = devices.find_one({"productid": data.get("productid")})
            if product:
                if product.get("amount", 0) > 0:
                    devices.update_one({"productid": data.get("productid")}, {"$inc": {"amount": -1}})
                    return JsonResponse({"message": "Product amount decreased by 1"}, status=200)
                else:
                    return JsonResponse({"error": "Insufficient product amount"}, status=409)
            else:
                return JsonResponse({"error": "Product not found"}, status=404)
        except Exception as e:
            print(e)
            return JsonResponse({"error": str(e)}, status=500)
    return JsonResponse({"error": "Method not allowed"}, status=405)

@csrf_exempt
def getAllProducts(request):
    if request.method == "GET":
        try:
            products = list(devices.find({}, {"_id": 0}))
            return JsonResponse({"products": products}, status=200)
        except Exception as e:
            print(e)
            return JsonResponse({"error": str(e)}, status=500)
    return JsonResponse({"error": "Method not allowed"}, status=405)

@csrf_exempt
def getProductByID(request):
    if request.method == "GET":
        try:
            productid = request.GET.get("productid")
            product = devices.find_one({"productid": int(productid)}, {"_id": 0})
            if product:
                return JsonResponse({"product": product}, status=200)
            else:
                return JsonResponse({"error": "Product not found"}, status=404)
        except Exception as e:
            print(e)
            return JsonResponse({"error": str(e)}, status=500)
    return JsonResponse({"error": "Method not allowed"}, status=405)

