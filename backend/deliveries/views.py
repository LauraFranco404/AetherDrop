from django_backend.mongo_connection import db
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json
import pymongo
from datetime import datetime, timedelta
from pymongo import WriteConcern
from pymongo.errors import PyMongoError
from bson import ObjectId
from datetime import datetime, timezone

devices = db["devices"]
deliveries = db["deliveries"]
users = db["users"]
    
@csrf_exempt
def createDelivery(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Método no permitido'}, status=405)

    try:
        data = json.loads(request.body)
        start_id = data.get('start_id')
        end_id = data.get('end_id')

        if not start_id or not end_id:
            return JsonResponse({'error': 'Faltan start_id o end_id'}, status=400)

        data['created_at'] = datetime.now(timezone.utc)
        print(data)
        result = deliveries.insert_one(data)
        print(result)
        return JsonResponse({'message': 'Entrega creada', 'delivery_id': str(result.inserted_id)})

    except json.JSONDecodeError:
        return JsonResponse({'error': 'JSON inválido'}, status=400)
    except PyMongoError as e:
        return JsonResponse({'error': f'Error en la base de datos: {str(e)}'}, status=500)
    


@csrf_exempt
def getAllDeliveries(request):
    if request.method != 'GET':
        return JsonResponse({'error': 'Método no permitido'}, status=405)
    try:
        all_deliveries = list(deliveries.find())
        
        # Convertir ObjectId y datetime a string
        for delivery in all_deliveries:
            delivery['_id'] = str(delivery['_id'])
            if 'created_at' in delivery and isinstance(delivery['created_at'], datetime):
                delivery['created_at'] = delivery['created_at'].isoformat()

        return JsonResponse(all_deliveries, safe=False)

    except PyMongoError as e:
        return JsonResponse({'error': f'Error al leer de la base de datos: {str(e)}'}, status=500)


@csrf_exempt
def getPendingDeliveries(request):
    return _getDeliveriesByState(request, "pending")

@csrf_exempt
def getFinishedDeliveries(request):
    return _getDeliveriesByState(request, "finished")

@csrf_exempt
def getInProgressDeliveries(request):
    return _getDeliveriesByState(request, "inprogress")

def _getDeliveriesByState(request, state_value):
    if request.method != 'GET':
        return JsonResponse({'error': 'Método no permitido'}, status=405)

    try:
        filtered_deliveries = list(deliveries.find({'state': state_value}))

        for delivery in filtered_deliveries:
            delivery['_id'] = str(delivery['_id'])
            if 'created_at' in delivery and isinstance(delivery['created_at'], datetime):
                delivery['created_at'] = delivery['created_at'].isoformat()

        return JsonResponse(filtered_deliveries, safe=False)

    except PyMongoError as e:
        return JsonResponse({'error': f'Error al acceder a la base de datos: {str(e)}'}, status=500)
