from django.urls import path
from . import views

urlpatterns = [
    path('addmanager/', views.addmanager, name='addmanager'),
    path('deletemanager/', views.deletemanager, name='deletemanager'),
    path('updatemanager/', views.updatemanager, name='updatemanager'),
    path('getallmanagers/', views.getAllmanagers, name='getallmanagers'),
    path('getmanagerbyid/', views.getmanagerById, name='getmanager'),
]