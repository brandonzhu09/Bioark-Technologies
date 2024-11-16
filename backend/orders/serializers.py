from rest_framework import serializers
from orders.models import *

class CartItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartItem
        fields = ['id', 'product_sku', 'product_name', 'price', 'adjusted_price', 'unit_size', 'quantity', 'discount_code', 'ready_status']

class OrderItemSerializer(serializers.ModelSerializer):
    # TODO: product_link and invoice file
    order_class = serializers.SerializerMethodField()
    order_placed_date = serializers.SerializerMethodField()
    est_work_period = serializers.SerializerMethodField()
    class Meta:
        model = OrderItem
        fields = ['order_class', 'order_id', 'order_placed_date', 'est_work_period', 'product_sku', 'product_name', 'unit_size', 'quantity', 'total_price', 'transaction_status']

    def get_order_class(self, obj):
        obj_class = obj.product_sku[:2]
        if obj_class == 'CA' or obj_class == 'CI' or obj_class == 'CO' or obj_class == 'CN' or obj_class == 'CD' or obj_class == 'CR':
            return 'Cloning-CRISPR'
        elif obj_class == 'EM' or obj_class == 'IM':
            return 'Cloning-Overexpression'
        elif obj_class == 'SH':
            return 'Cloning-RNAi'
        else:
            return 'Virus/Stable Cell Line'

    def get_order_placed_date(self, obj):
        order = Order.objects.get(order_id=obj.order_id)
        return order.order_placed_date

    def get_est_work_period(self, obj):
        delivery_format_code = obj.product_sku[len(obj.product_sku)-1]
        ready_status = obj.ready_status
        work_period = WorkSchedule.objects.get(delivery_format_code=delivery_format_code, ready_status=ready_status).work_period_earliest
        return work_period
