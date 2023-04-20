from django.urls import path
from . import views

urlpatterns = [
    path('select_destination/<str:param>', views.select_destination, name="select_destination"),
    path('search_offers/', views.search_offers, name="search_offers"),
    path('search_offers_both/', views.search_offers_both, name="search_offers_both")
]
