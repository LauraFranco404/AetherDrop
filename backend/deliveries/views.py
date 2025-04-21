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
def createDelivery(request):
    pass