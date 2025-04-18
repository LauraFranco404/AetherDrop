from django.urls import path
from . import views

urlpatterns = [
    path('createproduct/', views.createProduct, name='addproduct'),
    path('removeproduct/', views.removeProduct, name='removeproduct'),
    path('updateproduct/', views.updateProduct, name='updateproduct'),
    path('increaseproductbyone/', views.increaseProductByOne, name='increaseproductbyOne'),
    path('decreaseproductbyone/', views.decreaseProductByOne, name='decreaseproductbyOne'),
    path('getallproducts/', views.getAllProducts, name='getallproducts'),
    path('getproductbyid/', views.getProductByID, name='getproductbyiD'),
]