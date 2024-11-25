from rest_framework import serializers
from orders.models import *

class CartItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartItem
        fields = '__all__'

class OrderItemSerializer(serializers.ModelSerializer):
    # TODO: product_link and invoice file
    order_placed_date = serializers.SerializerMethodField()
    est_work_period = serializers.SerializerMethodField()
    class Meta:
        model = OrderItem
        fields = ['order_class', 'order_id', 'order_placed_date', 'est_work_period', 'product_sku', 'product_name', 'unit_size', 'quantity', 'total_price', 'transaction_status', 'function_type_name', 'structure_type_name', 'promoter_name', 'protein_tag_name', 'fluorescene_marker_name', 'selection_marker_name', 'bacterial_marker_name', 'target_sequence', 'delivery_format_name']

    def get_order_placed_date(self, obj):
        order = Order.objects.get(order_id=obj.order_id)
        return order.order_placed_date.date()

    def get_est_work_period(self, obj):
        delivery_format_code = obj.product_sku[len(obj.product_sku)-1]
        ready_status = obj.ready_status
        work_period = WorkSchedule.objects.get(delivery_format_code=delivery_format_code, ready_status=ready_status).work_period_earliest
        return work_period
