import datetime
import json
from django.contrib.auth import login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm
from django.core import serializers
from django.forms.models import model_to_dict
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import get_object_or_404, redirect, render
from django.urls import reverse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_http_methods
from main.forms import ProductForm
from main.models import Product
import requests
from django.views.decorators.csrf import csrf_exempt

# Create your views here.

def _serialize_product(product, *, include_owner=False, current_user=None):
    """Convert Product model instance into JSON-serialisable dict."""
    data = model_to_dict(
        product,
        fields=["id", "name", "price", "description", "stock", "thumbnail", "category", "is_featured"],
    )
    data["id"] = str(product.id)
    data["category_label"] = dict(Product.category_choices).get(product.category, product.category)
    data["owner"] = product.user.username if product.user else None
    if include_owner and current_user is not None:
        data["is_owner"] = product.user_id == current_user.id
    return data


@login_required(login_url="/login")
@ensure_csrf_cookie
def show_main(request):
    context = {
        "last_login": request.COOKIES.get("last_login", "Never"),
    }
    return render(request, "main.html", context)


@login_required(login_url="/login")
@ensure_csrf_cookie
@require_http_methods(["GET", "POST"])
def product_collection(request):
    if request.method == "GET":
        filter_type = request.GET.get("filter", "all")
        product_list = Product.objects.all()

        if filter_type == "my":
            product_list = product_list.filter(user=request.user)

        category = request.GET.get("category")
        valid_categories = dict(Product.category_choices).keys()
        if category in valid_categories:
            product_list = product_list.filter(category=category)

        products = [_serialize_product(product, include_owner=True, current_user=request.user) for product in product_list]
        return JsonResponse({"success": True, "data": products})

    try:
        payload = json.loads(request.body or "{}")
    except json.JSONDecodeError:
        return JsonResponse({"success": False, "message": "Invalid JSON payload."}, status=400)

    form = ProductForm(payload)
    if form.is_valid():
        product_entry = form.save(commit=False)
        product_entry.user = request.user
        product_entry.save()
        response = JsonResponse(
            {
                "success": True,
                "message": "Product created successfully.",
                "data": _serialize_product(product_entry, include_owner=True, current_user=request.user),
            },
            status=201,
        )
        return response

    return JsonResponse({"success": False, "errors": form.errors}, status=400)


@login_required(login_url="/login")
@ensure_csrf_cookie
@require_http_methods(["GET", "PUT", "PATCH", "DELETE"])
def product_detail(request, id):
    product = get_object_or_404(Product, pk=id)

    if request.method == "GET":
        return JsonResponse(
            {"success": True, "data": _serialize_product(product, include_owner=True, current_user=request.user)}
        )

    if product.user != request.user:
        return JsonResponse({"success": False, "message": "You do not have permission to modify this product."}, status=403)

    if request.method in ["PUT", "PATCH"]:
        try:
            payload = json.loads(request.body or "{}")
        except json.JSONDecodeError:
            return JsonResponse({"success": False, "message": "Invalid JSON payload."}, status=400)

        form = ProductForm(payload, instance=product)
        if form.is_valid():
            updated_product = form.save()
            return JsonResponse(
                {
                    "success": True,
                    "message": "Product updated successfully.",
                    "data": _serialize_product(updated_product, include_owner=True, current_user=request.user),
                }
            )

        return JsonResponse({"success": False, "errors": form.errors}, status=400)

    product.delete()
    return JsonResponse({"success": True, "message": "Product deleted successfully."})


@login_required(login_url="/login")
def show_product(request, id):
    product = get_object_or_404(Product, pk=id)

    context = {
        "product": product,
    }

    return render(request, "product_detail.html", context)


def show_xml(request):
    product_list = Product.objects.all()
    xml_data = serializers.serialize("xml", product_list)
    return HttpResponse(xml_data, content_type="application/xml")


def show_json(request):
    product_list = Product.objects.all()
    json_data = serializers.serialize("json", product_list)
    return HttpResponse(json_data, content_type="application/json")


def show_xml_by_id(request, product_id):
    try:
        product = Product.objects.filter(pk=product_id)
        xml_data = serializers.serialize("xml", product)
        return HttpResponse(xml_data, content_type="application/xml")
    except Product.DoesNotExist:
        return HttpResponse(status=404)


def show_json_by_id(request, product_id):
    try:
        product = Product.objects.filter(pk=product_id)
        json_data = serializers.serialize("json", product)
        return HttpResponse(json_data, content_type="application/json")
    except Product.DoesNotExist:
        return HttpResponse(status=404)


@ensure_csrf_cookie
def register(request):
    if request.method == "POST":
        try:
            payload = json.loads(request.body or "{}")
        except json.JSONDecodeError:
            return JsonResponse({"success": False, "message": "Invalid JSON payload."}, status=400)

        form = UserCreationForm(payload)
        if form.is_valid():
            form.save()
            return JsonResponse(
                {"success": True, "message": "Account created successfully.", "redirect": reverse("main:login")}, status=201
            )

        return JsonResponse({"success": False, "errors": form.errors}, status=400)

    form = UserCreationForm()
    context = {"form": form}
    return render(request, "register.html", context)


@ensure_csrf_cookie
def login_user(request):
    if request.user.is_authenticated:
        return redirect("main:show_main")

    if request.method == "POST":
        try:
            payload = json.loads(request.body or "{}")
        except json.JSONDecodeError:
            return JsonResponse({"success": False, "message": "Invalid JSON payload."}, status=400)

        form = AuthenticationForm(request, data=payload)

        if form.is_valid():
            user = form.get_user()
            login(request, user)
            response = JsonResponse(
                {"success": True, "message": "Login successful.", "redirect": reverse("main:show_main")}
            )
            response.set_cookie("last_login", str(datetime.datetime.now()))
            return response

        return JsonResponse({"success": False, "errors": form.errors}, status=400)

    form = AuthenticationForm()
    context = {"form": form}
    return render(request, "login.html", context)


@login_required(login_url="/login")
@require_http_methods(["POST"])
def logout_user(request):
    logout(request)
    response = JsonResponse({"success": True, "message": "Logged out successfully.", "redirect": reverse("main:login")})
    response.delete_cookie("last_login")
    return response



@login_required(login_url="/login")
def create_product(request):
    form = ProductForm(request.POST or None)

    if form.is_valid() and request.method == "POST":
        product_entry = form.save(commit=False)
        product_entry.user = request.user
        product_entry.save()
        return redirect("main:show_main")

    context = {"form": form}
    return render(request, "create_product.html", context)


@login_required(login_url="/login")
def edit_product(request, id):
    product = get_object_or_404(Product, pk=id)
    form = ProductForm(request.POST or None, instance=product)
    if form.is_valid() and request.method == "POST":
        form.save()
        return redirect("main:show_main")

    context = {
        "form": form,
    }

    return render(request, "edit_product.html", context)


@login_required(login_url="/login")
def delete_product(request, id):
    product = get_object_or_404(Product, pk=id)
    product.delete()
    return HttpResponseRedirect(reverse("main:show_main"))

def proxy_image(request):
    image_url = request.GET.get('url')
    if not image_url:
        return HttpResponse('No URL provided', status=400)
    
    try:
        # Fetch image from external source
        response = requests.get(image_url, timeout=10)
        response.raise_for_status()
        
        # Return the image with proper content type
        return HttpResponse(
            response.content,
            content_type=response.headers.get('Content-Type', 'image/jpeg')
        )
    except requests.RequestException as e:
        return HttpResponse(f'Error fetching image: {str(e)}', status=500)
    
@csrf_exempt
def create_product_flutter(request):
    if request.method == 'POST':
        if not request.user.is_authenticated:
            return JsonResponse({"status": "error", "message": "Login diperlukan."}, status=401)

        try:
            data = json.loads(request.body)

            new_product = Product(
                name=strip_tags(data.get("name", "")),
                price=int(data.get("price", 0)),
                description=strip_tags(data.get("description", "")),
                stock=int(data.get("stock", 0)),
                category=data.get("category", "Merchandise"),
                thumbnail=data.get("thumbnail", ""),
                is_featured=data.get("is_featured", False),
                user=request.user
            )
            new_product.save()

            return JsonResponse({"status": "success"}, status=200)

        except Exception as e:
             return JsonResponse({"status": "error", "message": f"Data tidak valid: {str(e)}"}, status=400)

    else:
        return JsonResponse({"status": "error", "message": "Invalid request method."}, status=405)