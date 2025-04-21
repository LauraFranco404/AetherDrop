from django.urls import path
from . import views

urlpatterns = [
    path('createdevice/', views.createDevice, name='adddevice'),
    path('removedevice/', views.removeDevice, name='removedevice'),
    path('updatedevice/', views.updateDevice, name='updatedevice'),
    path('getalldevices/', views.getAllDevices, name='getalldevices'),
    path('getdevicebyid/', views.getDeviceByID, name='getdevicebyiD'),
]