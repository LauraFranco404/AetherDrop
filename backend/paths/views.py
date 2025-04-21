from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from django_backend.mongo_connection import db

@csrf_exempt
def updateRobotPaths(request):
    if request.method == 'POST':
        try:
            body = json.loads(request.body)
            nodes = body.get('nodes', [])
            robot_connections = body.get('robot_connections', [])

            maps_collection = db.paths

            # Buscar documento con nombre 'routes'
            maps_collection.update_one(
                {'name': 'routes'},
                {
                    '$set': {
                        'nodes': nodes,
                        'robot_connections': robot_connections
                    },
                    '$setOnInsert': {
                        'drone_connections': []
                    }
                },
                upsert=True
            )

            return JsonResponse({'message': 'Map updated successfully'}, status=200)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Invalid HTTP method'}, status=405)

@csrf_exempt
def updateDronePaths(request):
    print("heree 1")
    if request.method == 'POST':
        print("heree 2")
        try:
            print("heree 3")
            body = json.loads(request.body)
            nodes = body.get('nodes', [])
            drone_connections = body.get('drone_connections', [])
            print("hereeeee", drone_connections)
            maps_collection = db.paths

            maps_collection.update_one(
                {'name': 'routes'},
                {
                    '$set': {
                        'nodes': nodes,
                        'drone_connections': drone_connections
                    },
                    '$setOnInsert': {
                        'robot_connections': []
                    }
                },
                upsert=True
            )
                

            return JsonResponse({'message': 'Map updated successfully'}, status=200)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Invalid HTTP method'}, status=405)

@csrf_exempt
def getPaths(request):
    if request.method == 'GET':
        try:
            maps_collection = db.paths
            existing_map = maps_collection.find_one({'name': 'routes'})

            if existing_map:
                response_data = {
                    'nodes': existing_map.get('nodes', []),
                    'robot_connections': existing_map.get('robot_connections', []),
                    'drone_connections': existing_map.get('drone_connections', [])
                }
                return JsonResponse(response_data, status=200)
            else:
                return JsonResponse({'error': 'Map not found'}, status=404)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Invalid HTTP method'}, status=405)