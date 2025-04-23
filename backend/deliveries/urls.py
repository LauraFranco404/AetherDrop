from django.urls import path
from . import views

urlpatterns = [
    path('createdelivery/', views.createDelivery, name='createdelivery'),
    path('getalldeliveries/', views.getAllDeliveries, name='getalldeliveries'),
    path('getpendingdeliveries/', views.getPendingDeliveries, name='getpendingdeliveries'),
    path('getfinisheddeliveries/', views.getFinishedDeliveries, name='getfinisheddeliveries'),
    path('getinprogressdeliveries/', views.getInProgressDeliveries, name='getinprogressdeliveries'),
]