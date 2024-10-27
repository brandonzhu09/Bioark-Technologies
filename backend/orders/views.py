from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
import os
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
from paypalserversdk.api_helper import ApiHelper

from .models import Cart, CartItem

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
    order = orders_controller.orders_create(
        {
            "body": OrderRequest(
                intent=CheckoutPaymentIntent.CAPTURE,
                purchase_units=[
                    PurchaseUnitRequest(
                        amount=AmountWithBreakdown(
                            currency_code="USD",
                            value="0.01",
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
    order = orders_controller.orders_capture(
        {"id": order_id, "prefer": "return=representation"}
    )
    return Response(json.loads(ApiHelper.json_serialize(order.body)))


class CartAPI(APIView):
    """
    Single API to handle cart operations
    """
    def get(self, request, format=None):
        cart = Cart(request)

        return Response(
            {"data": list(cart.__iter__()),
             "count": cart.__len__()
            },
            status=status.HTTP_200_OK
            )

    def post(self, request, **kwargs):
        cart = Cart(request)

        if "remove" in request.data:
            product = request.data["product"]
            cart.remove(product)

        elif "clear" in request.data:
            cart.clear()

        else:
            product = request.data
            cart.add(
                    cart_item=product["cart_item"],
                    quantity=product["quantity"],
                    override_quantity=product["override_quantity"] if "override_quantity" in product else False
                )

        return Response(
            {"message": "cart updated"},
            status=status.HTTP_202_ACCEPTED)
