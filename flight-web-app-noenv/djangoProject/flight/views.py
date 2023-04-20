from amadeus import Client, ResponseError, Location
from django.http import JsonResponse
from django.shortcuts import render


# Create your views here.


def home(request):
    return render(request, 'index.html')


def select_destination(request, param):
    if request.method == "GET":
        try:
            response = amadeus.reference_data.locations.get(keyword=param, subType=Location.ANY)
            context = {
                "data": response.data
            }
            return JsonResponse(context)
        except ResponseError as error:
            print(error)
    else:
        return JsonResponse({"error:" "Invalid request method"})


def search_offers_both(request):
    if request.method == "GET":
        try:
            or_code = request.GET["originCode"]
            dest_code = request.GET["destinationCode"]
            dep_date = request.GET["departureDate"]
            ret_date = request.GET["returnDate"]
            response = amadeus.shopping.flight_offers_search.get(
                originLocationCode=or_code,
                destinationLocationCode=dest_code,
                departureDate=dep_date,
                returnDate=ret_date,
                adults=1
            )
            context = {
                "data": response.data
            }
            return JsonResponse(context)
        except ResponseError as error:
            print(error + "tutaj")
    else:
        return JsonResponse({"error": "Invalid request method"})


def search_offers(request):
    if request.method == "GET":
        try:
            or_code = request.GET["originCode"]
            dest_code = request.GET["destinationCode"]
            dep_date = request.GET["departureDate"]
            response = amadeus.shopping.flight_offers_search.get(
                originLocationCode=or_code,
                destinationLocationCode=dest_code,
                departureDate=dep_date,
                adults=1
            )
            context = {
                "data": response.data
            }
            return JsonResponse(context)
        except ResponseError as error:
            print(error + "tutaj")
    else:
        return JsonResponse({"error": "Invalid request method"})


amadeus = Client(
    client_id='l8ZesYhh2MJgEJgzPyWx8I769Ls0M9V4',
    client_secret='HMR5CtgXyAXDTvCb'
)
