from django.urls import path
from . import views

urlpatterns = [
    path('createDelivery/', views.createDelivery, name='selldevices'),
    path('getalldeliveries/', views.getAllDeliveries, name='getalldeliveries'),
    path('getdeliveriestoday/', views.getDeliveriesToday, name='getdeliveriestoday'),
    path('getdeliveriesthisweek/', views.getDeliveriesThisWeek, name='getdeliveriesthisweek'),
    path('getdeliveriesthismonth/', views.getDeliveriesThisMonth, name='getdeliveriesthismonth'),
    path('deletedelivery/', views.deleteDelivery, name='deletedelivery'),
    path('getdeliveriesbyadminid/', views.getDeliveriesByadminID, name='getdeliveriesbyadminid')
]