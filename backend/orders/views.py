from datetime import datetime, date, timedelta
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
import os
from dotenv import load_dotenv
import logging
import json

# PayPal SDK
from paypalserversdk.http.auth.o_auth_2 import ClientCredentialsAuthCredentials
from paypalserversdk.logging.configuration.api_logging_configuration import (
    LoggingConfiguration,
    RequestLoggingConfiguration,
    ResponseLoggingConfiguration,
)
from paypalserversdk.paypalserversdk_client import PaypalserversdkClient
from paypalserversdk.controllers.orders_controller import OrdersController
from paypalserversdk.controllers.payments_controller import PaymentsController
from paypalserversdk.models.amount_with_breakdown import AmountWithBreakdown
from paypalserversdk.models.checkout_payment_intent import CheckoutPaymentIntent
from paypalserversdk.models.order_request import OrderRequest
from paypalserversdk.models.capture_request import CaptureRequest
from paypalserversdk.models.money import Money
from paypalserversdk.models.shipping_details import ShippingDetails
from paypalserversdk.models.shipping_option import ShippingOption
from paypalserversdk.models.shipping_type import ShippingType
from paypalserversdk.models.purchase_unit_request import PurchaseUnitRequest
from paypalserversdk.models.payment_source import PaymentSource
from paypalserversdk.models.card_request import CardRequest
from paypalserversdk.models.card_attributes import CardAttributes
from paypalserversdk.models.card_verification import CardVerification
from paypalserversdk.models.card_verification_method import CardVerificationMethod
from paypalserversdk.models.item import Item
from paypalserversdk.api_helper import ApiHelper

from .models import *
from users.models import Address
from .serializers import OrderItemSerializer

load_dotenv()

paypal_client: PaypalserversdkClient = PaypalserversdkClient(
    client_credentials_auth_credentials=ClientCredentialsAuthCredentials(
        o_auth_client_id=os.getenv("PAYPAL_CLIENT_ID"),
        o_auth_client_secret=os.getenv("PAYPAL_CLIENT_SECRET"),
    ),
    # logging_configuration=LoggingConfiguration(
    #     log_level=logging.INFO,
    #     # Disable masking of sensitive headers for Sandbox testing.
    #     # This should be set to True (the default if unset)in production.
    #     mask_sensitive_headers=False,
    #     request_logging_config=RequestLoggingConfiguration(
    #         log_headers=True, log_body=True
    #     ),
    #     response_logging_config=ResponseLoggingConfiguration(
    #         log_headers=True, log_body=True
    #     ),
    # ),
)

orders_controller: OrdersController = paypal_client.orders
payments_controller: PaymentsController = paypal_client.payments

@api_view(['POST'])
def create_order(request):
    # use the cart information passed from the front-end to calculate the order amount details
    # cart = request.GET["cart"]
    data = json.loads(request.body)
    total_price = data.get("total_price")
    order = orders_controller.orders_create(
        {
            "body": OrderRequest(
                intent=CheckoutPaymentIntent.CAPTURE,
                purchase_units=[
                    PurchaseUnitRequest(
                        amount=AmountWithBreakdown(
                            currency_code="USD",
                            value=total_price,
                        ),

                    )
                ],

            )
        }
    )
    return Response(json.loads(ApiHelper.json_serialize(order.body)))
    # return Response(ApiHelper.json_serialize(order.body), content_type="application/json")

@api_view(['POST'])
def capture_order(request, order_id):
    body = request.data
    address = body.get("address")
    cart = body.get("cart")
    quantity = body.get("quantity")
    discount_code = body.get("discount_code")

    order = orders_controller.orders_capture(
        {"id": order_id, "prefer": "return=representation"}
    )
    data = json.loads(ApiHelper.json_serialize(order.body))
    payment_token = data["id"]
    total_price = data["purchase_units"][0]["amount"]["value"]
    # TODO: calculate delivery date and billing date
    delivery_date = datetime.now()
    billing_date = datetime.now()

    address_obj, created = Address.objects.get_or_create(address_line_1=address["address_line_1"],
                                                         city=address["city"],
                                                         state=address["state"],
                                                         zipcode=address["zipcode"])

    order_obj = Order.objects.create(payment_token=payment_token,
                                     total_price=total_price,
                                     quantity=quantity,
                                     discount_code=discount_code,
                                     delivery_date=delivery_date,
                                     billing_date=billing_date,
                                     shipping_address=address_obj,
                                     user=request.user)
    
    for item in cart:
        # TODO: calculate shipping date, delivery date, billing date
        shipping_date = datetime.now()
        delivery_date = datetime.now()
        billing_date = datetime.now()

        OrderItem.objects.create(product_sku=item['product_sku'],
                                 order_class=get_order_class(item['product_sku']),
                                product_name=item['product_name'],
                                ready_status=item['ready_status'],
                                unit_price=item['price'],
                                total_price=float(item['price']) * item['quantity'],
                                unit_size=item['unit_size'],
                                quantity=item['quantity'],
                                discount_code=item['discount_code'],
                                order=order_obj,
                                work_period_date=get_work_period_date(item['product_sku'], item['ready_status']),
                                shipping_date=shipping_date,
                                delivery_date=delivery_date,
                                billing_date=billing_date,
                                function_type_name=item['function_type_name'],
                                structure_type_name=item['structure_type_name'],
                                promoter_name=item['promoter_name'],
                                protein_tag_name=item['protein_tag_name'],
                                fluorescene_marker_name=item['fluorescene_marker_name'],
                                selection_marker_name=item['selection_marker_name'],
                                bacterial_marker_name=item['bacterial_marker_name'],
                                target_sequence=item['target_sequence'],
                                delivery_format_name=item['delivery_format_name'])

    return Response(json.loads(ApiHelper.json_serialize(order.body)))


class CartAPI(APIView):
    """
    Single API to handle cart operations
    """
    def get(self, request, format=None):
        cart = Cart(request)

        return Response(
            {"data": list(cart.__iter__()),
             "count": cart.__len__(),
             "total_price": cart.get_total_price()
            },
            status=status.HTTP_200_OK
            )

    def post(self, request, **kwargs):
        cart = Cart(request)

        if "remove" in request.data:
            product_id = request.data["product_id"]
            cart.remove(product_id)

        elif "clear" in request.data:
            cart.clear()
        
        elif "updateQuantity" in request.data:
            product_id = request.data["product_id"]
            quantity = request.data["quantity"]
            cart.updateQuantity(product_id, quantity)

        else:
            product = request.data
            cart.add(
                    cart_item=product["cart_item"],
                    quantity=product["quantity"],
                    override_quantity=product["override_quantity"] if "override_quantity" in product else False
                )

        data = {
            "message": "Cart updated successfully.",
            "data": list(cart.__iter__()),
            "count": cart.__len__(),
            "total_price": cart.get_total_price()
        }
        return Response(data, status=status.HTTP_202_ACCEPTED)


# Helper methods
def get_order_class(product_sku):
    obj_class = product_sku[:2]
    if obj_class == 'CA' or obj_class == 'CI' or obj_class == 'CO' or obj_class == 'CN' or obj_class == 'CD' or obj_class == 'CR':
        return 'Cloning-CRISPR'
    elif obj_class == 'EM' or obj_class == 'IM':
        return 'Cloning-Overexpression'
    elif obj_class == 'SH':
        return 'Cloning-RNAi'
    else:
        return 'Virus/Stable Cell Line'

def get_work_period_date(product_sku, ready_status):
    delivery_format_code = product_sku[len(product_sku)-1]
    ready_status = ready_status
    work_period_days = WorkSchedule.objects.get(delivery_format_code=delivery_format_code, ready_status=ready_status).work_period_earliest
    
    current_date = date.today()
    delta = timedelta(days=work_period_days)
    work_period_date = current_date + delta
    
    return work_period_date
