from django.urls import path
from . import views

urlpatterns = [
    path('addadmin/', views.addadmin, name='addadmin'),
    path('deleteadmin/', views.deleteadmin, name='deleteadmin'),
    path('updateadmin/', views.updateadmin, name='updateadmin'),
    path('getalladmins/', views.getAlladmins, name='getalladmins'),
    path('getadminbyid/', views.getadminById, name='getadmin'),
]