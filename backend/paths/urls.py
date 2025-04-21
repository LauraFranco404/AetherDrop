from django.urls import path
from . import views

urlpatterns = [
    path('updaterobotpaths/', views.updateRobotPaths, name='updaterobotpaths'),
    path('updatedronepaths/', views.updateDronePaths, name='updatedronepaths'),
    path('getpaths/', views.getPaths, name='getpaths'),
]