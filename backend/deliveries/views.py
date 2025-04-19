from django_backend.mongo_connection import db
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json
import pymongo
from datetime import datetime, timedelta
from pymongo import WriteConcern
from pymongo.errors import PyMongoError
from bson import ObjectId

devices = db["devices"]
deliveries = db["deliveries"]
users = db["users"]

@csrf_exempt
def getDeliveriesByadminID(request):
    # Check if the request method is GET
    if request.method != 'GET':
        return JsonResponse({"error": "Invalid request method. Only GET is allowed."}, status=405)

    try:
        # Get adminid from query parameters
        admin_id = int(request.GET.get("adminid"))

        # Check if admin_id is provided
        if not admin_id:
            return JsonResponse({"error": "Missing 'adminid' parameter in the URL."}, status=400)

        print(admin_id)
        # Validate if admin exists
        if not users.find_one({"documentid": admin_id}):
            print("not found: ",admin_id)
            return JsonResponse({"error": "admin not found."}, status=404)

        # Fetch deliveries for the given admin ID
        deliveries_data = list(deliveries.find({"adminid": admin_id}))

        # If no deliveries found
        if not deliveries_data:
            return JsonResponse({"message": "No deliveries found for this admin.", "deliveries": []}, status=200)

        # Prepare the response
        response = []
        for delivery in deliveries_data:
            delivery["_id"] = str(delivery["_id"])  # Convert ObjectId to string
            response.append(delivery)

        return JsonResponse({"message": "Deliveries retrieved successfully.", "deliveries": response}, status=200)

    except PyMongoError as e:
        return JsonResponse({"error": "Database error: " + str(e)}, status=500)

    except Exception as e:
        return JsonResponse({"error": "An unexpected error occurred: " + str(e)}, status=500)

    
@csrf_exempt
def createDelivery(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            adminid = data.get("adminid")
            devs = data.get("devices", [])

            if not devs:
                return JsonResponse({"error": "No devices provided"}, status=400)

            if not adminid or not users.find_one({"documentid": adminid}):
                return JsonResponse({"error": "admin not found"}, status=404)

            # Guardar la fecha y hora en formato ISO 8601
            data["delivery_datetime"] = datetime.now().isoformat()

            with db.client.start_session() as session:
                with session.start_transaction(write_concern=WriteConcern("majority")):
                    device_ids = [p["deviceid"] for p in devs]
                    existing_devices = list(devices.find({"deviceid": {"$in": device_ids}}, session=session))
                    existing_device_map = {p["deviceid"]: p for p in existing_devices}

                    updates = []
                    for device in devs:
                        deviceid = device.get("deviceid")
                        amount = device.get("amount", 0)

                        if deviceid is None or amount <= 0:
                            raise ValueError("Invalid device data")

                        existing_device = existing_device_map.get(deviceid)
                        if not existing_device:
                            raise ValueError(f"Device with id {deviceid} not found")
                        if existing_device["amount"] < amount:
                            raise ValueError(f"Insufficient stock for device {deviceid}")

                        updates.append({
                            "filter": {"deviceid": deviceid},
                            "update": {"$inc": {"amount": -amount}}
                        })

                    if updates:
                        devices.bulk_write([
                            pymongo.UpdateOne(update["filter"], update["update"])
                            for update in updates
                        ], session=session)

                    deliveries.insert_one(data, session=session)

            return JsonResponse({"message": "Delivery registered successfully"}, status=200)

        except ValueError as e:
            return JsonResponse({"error": str(e)}, status=400)
        except PyMongoError as e:
            return JsonResponse({"error": "Database error: " + str(e)}, status=500)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Method not allowed"}, status=405)

# 🟢 Consultas por rango de fechas relativo a delivery_datetime
def queryDeliveriesByRelativeDays(days):
    limit_date = datetime.now() - timedelta(days=days)
    return list(deliveries.find({
        "delivery_datetime": {"$gte": limit_date.isoformat()}
    }))

# 🟢 Obtener ventas de las últimas 24 horas
def getDeliveriesToday(request):
    try:
        deliveries_today = queryDeliveriesByRelativeDays(1)
        for delivery in deliveries_today:
            delivery["_id"] = str(delivery["_id"])
        return JsonResponse(deliveries_today, safe=False, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

# 🟢 Obtener ventas de los últimos 7 días
def getDeliveriesThisWeek(request):
    try:
        deliveries_this_week = queryDeliveriesByRelativeDays(7)
        for delivery in deliveries_this_week:
            delivery["_id"] = str(delivery["_id"])
        return JsonResponse(deliveries_this_week, safe=False, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

# 🟢 Obtener ventas del último mes (30 días)
def getDeliveriesThisMonth(request):
    try:
        deliveries_this_month = queryDeliveriesByRelativeDays(30)
        for delivery in deliveries_this_month:
            delivery["_id"] = str(delivery["_id"])
        return JsonResponse(deliveries_this_month, safe=False, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

# 🟢 Obtener todas las ventas
def getAllDeliveries(request):
    try:
        all_deliveries = list(deliveries.find({}))
        for delivery in all_deliveries:
            delivery["_id"] = str(delivery["_id"])
        return JsonResponse(all_deliveries, safe=False, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

# 🟢 Eliminar una venta
@csrf_exempt
def deleteDelivery(request):
    if request.method != "DELETE":
        return JsonResponse({"error": "Method not allowed"}, status=405)
    try:
        data = json.loads(request.body)
        delivery_id = data.get("_id")

        if not delivery_id or not ObjectId.is_valid(delivery_id):
            return JsonResponse({"error": "Invalid or missing delivery ID"}, status=400)

        result = deliveries.delete_one({"_id": ObjectId(delivery_id)})
        if result.deleted_count == 0:
            return JsonResponse({"error": "Delivery not found"}, status=404)

        return JsonResponse({"message": "Delivery deleted successfully"}, status=200)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON format"}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


