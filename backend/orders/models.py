from django.db import models
from datetime import datetime
from django.conf import settings
from products.models import Product
from products.serializers import ProductSerializer
from users.models import User, Address

from decimal import Decimal

class Quote(models.Model):
    request_date = models.DateTimeField()
    quote_number = models.CharField()
    quote_file = models.FileField(upload_to='quote_files/')
    description = models.TextField()
    shelf_status = models.BooleanField()
    quantity = models.IntegerField()
    amount = models.CharField()
    user = models.ForeignKey(User, on_delete=models.PROTECT)
    unit_price = models.DecimalField(decimal_places=2, max_digits=10)
    total_price = models.DecimalField(decimal_places=2, max_digits=10)
    work_period_days = models.IntegerField()

    class Meta:
        db_table = 'quotes'

class Invoice(models.Model):
    order_placed_date = models.DateTimeField(default=datetime.now)
    order_number = models.CharField()
    order_status = models.CharField(default='Effective')
    user = models.ForeignKey(User, on_delete=models.PROTECT)
    service_finished = models.BooleanField(default=False)
    invoice_sent = models.BooleanField(default=False)
    delivery_date = models.DateField(null=True, blank=True)
    billing_date = models.DateField(null=True, blank=True) 
    invoice_number = models.CharField(blank=True, null=True)
    invoice_due = models.DecimalField(decimal_places=2, max_digits=10, null=True, blank=True)
    po_file = models.FileField(upload_to='po_files/', blank=True, null=True)
    po_number = models.CharField(blank=True, null=True)
    po_address = models.ForeignKey(Address, on_delete=models.CASCADE, related_name="po_invoices")
    billing_address = models.ForeignKey(Address, on_delete=models.CASCADE, null=True, blank=True, related_name="billing_invoices")
    shipping_address = models.ForeignKey(Address, on_delete=models.CASCADE, related_name="shipping_invoices")
    # credit billing
    is_paid = models.BooleanField(default=False)
    receipt_number = models.CharField(blank=True, null=True)
    invoice_payment = models.DecimalField(decimal_places=2, max_digits=10, null=True, blank=True)

    class Meta:
        db_table = 'invoices'


class Order(models.Model):
    order_id = models.AutoField(primary_key=True)
    payment_token = models.CharField()
    subtotal = models.DecimalField(max_digits=8, decimal_places=2)
    shipping_amount = models.DecimalField(max_digits=8, decimal_places=2)
    tax_amount = models.DecimalField(max_digits=8, decimal_places=2)
    total_price = models.DecimalField(max_digits=8, decimal_places=2)
    total_paid = models.DecimalField(max_digits=8, decimal_places=2)
    minimum_payment = models.DecimalField(max_digits=8, decimal_places=2)
    payment_source = models.CharField()
    last_digits = models.DecimalField(max_digits=4, decimal_places=0, blank=True, null=True)
    quantity = models.IntegerField()
    discount_code = models.CharField(null=True, blank=True)
    order_placed_date = models.DateTimeField(default=datetime.now)
    order_process_date = models.DateTimeField(blank=True, null=True)
    delivery_date = models.DateField(null=True, blank=True)
    billing_date = models.DateField(null=True, blank=True)
    shipping_address = models.ForeignKey(Address, on_delete=models.CASCADE, related_name="shipping_orders")
    billing_address = models.ForeignKey(Address, on_delete=models.CASCADE, related_name="billing_orders")
    transaction_status = models.CharField(null=True, blank=True)
    fulfilled = models.BooleanField(default=False)
    refunded = models.BooleanField(default=False)
    paid = models.BooleanField(default=True)
    notes = models.CharField(blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.PROTECT)
    # PO billing information
    invoice = models.ForeignKey(Invoice, on_delete=models.PROTECT, blank=True, null=True)
    invoice_number = models.CharField(blank=True, null=True)
    invoice_amount = models.DecimalField(decimal_places=2, max_digits=10, null=True, blank=True)
    invoice_maximum_amount = models.DecimalField(decimal_places=2, max_digits=10, null=True, blank=True)
    po_file = models.FileField(upload_to='po_files/', blank=True, null=True)
    po_number = models.CharField(blank=True, null=True)
    po_address = models.ForeignKey(Address, on_delete=models.CASCADE, related_name="po_orders", blank=True, null=True)
    receipt_number = models.CharField(blank=True, null=True)

    class Meta:
        db_table = 'orders'


class OrderItem(models.Model):
    STATUS_CHOICES = [
        ('in_progress', 'In Progress'),
        ('ready_for_delivery', 'Ready For Delivery'),
        ('arrived', 'Arrived'),
    ]
    order_item_id = models.AutoField(primary_key=True)
    order_class = models.CharField()
    work_period = models.CharField(blank=True, null=True)
    est_delivery_date = models.DateField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='in_progress')
    order_placed_date = models.DateTimeField(default=datetime.now)
    order_process_date = models.DateTimeField(blank=True, null=True)
    shipping_date = models.DateField(null=True, blank=True)
    delivery_date = models.DateField(null=True, blank=True)
    billing_date = models.DateField(null=True, blank=True)
    transaction_status = models.CharField(blank=True)
    ready_status = models.CharField()
    fulfilled = models.BooleanField(default=False)
    refunded = models.BooleanField(default=False)
    paid = models.BooleanField(default=True)
    product_sku = models.CharField(max_length=30)
    product_name = models.CharField(default="Product Name")
    unit_price = models.DecimalField(decimal_places=2, max_digits=10)
    total_price = models.DecimalField(decimal_places=2, max_digits=10)
    adjusted_price = models.DecimalField(decimal_places=2, max_digits=10, null=True, blank=True)
    unit_size = models.CharField()
    quantity = models.IntegerField(default=0)
    discount_code = models.CharField(blank=True, max_length=20)
    url = models.CharField()
    # attribute names
    function_type_name = models.CharField(blank=True, null=True)
    structure_type_name = models.CharField(blank=True, null=True)
    promoter_name = models.CharField(blank=True, null=True)
    protein_tag_name = models.CharField(blank=True, null=True)
    fluorescene_marker_name = models.CharField(blank=True, null=True)
    selection_marker_name = models.CharField(blank=True, null=True)
    bacterial_marker_name = models.CharField(blank=True, null=True)
    target_sequence = models.CharField(blank=True, null=True)
    delivery_format_name = models.CharField(blank=True, null=True)
    order = models.ForeignKey(Order, on_delete=models.PROTECT)

    class Meta:
        db_table = 'order_item'


class CloningCRISPRItem(OrderItem):
    class Meta:
        proxy = True
        verbose_name = 'Cloning CRISPR Order Item'


class CloningOverexpressionItem(OrderItem):
    class Meta:
        proxy = True
        verbose_name = 'Cloning Overexpression Order Item'


class CloningRNAiItem(OrderItem):
    class Meta:
        proxy = True
        verbose_name = 'Cloning RNAi Order Item'


class CartItem(models.Model):
    session_key = models.CharField(max_length=40, null=True, blank=True)
    ready_status = models.CharField()
    product_sku = models.CharField(max_length=30)
    product_name = models.CharField(default="Product Name")
    price = models.DecimalField(decimal_places=2, max_digits=10)
    adjusted_price = models.DecimalField(decimal_places=2, max_digits=10, null=True)
    unit_size = models.CharField()
    quantity = models.IntegerField(default=0)
    discount_code = models.CharField(max_length=20)
    url = models.CharField()
    # attribute names
    function_type_name = models.CharField()
    structure_type_name = models.CharField()
    promoter_name = models.CharField()
    protein_tag_name = models.CharField()
    fluorescene_marker_name = models.CharField()
    selection_marker_name = models.CharField()
    bacterial_marker_name = models.CharField()
    target_sequence = models.CharField()
    delivery_format_name = models.CharField()

    def get_total_price(self):
        return self.product.price * self.quantity

class Cart(object):
    def __init__(self, request):
        """
        Initialize the cart
        """
        self.session = request.session
        cart = self.session.get(settings.CART_SESSION_ID)
        if not cart:
            # save an empty cart in session
            cart = self.session[settings.CART_SESSION_ID] = []
        self.cart = cart

    def save(self):
        self.session.modified = True

    def add(self, cart_item=None, quantity=1, override_quantity=False):
        """
        Add product to the cart or update its quantity
        """
        cart_item, created = CartItem.objects.get_or_create(session_key=self.session.session_key, product_sku=cart_item['product_sku'], product_name=cart_item['product_name'],
                                                            price=cart_item['price'], adjusted_price=cart_item['adjusted_price'], unit_size=cart_item['unit_size'], url=cart_item['url'], ready_status=cart_item['ready_status'],
                                                            function_type_name=cart_item['function_type_name'], structure_type_name=cart_item['structure_type_name'],
                                                            promoter_name=cart_item['promoter_name'], protein_tag_name=cart_item['protein_tag_name'],
                                                            fluorescene_marker_name=cart_item['fluorescene_marker_name'], selection_marker_name=cart_item['selection_marker_name'],
                                                            bacterial_marker_name=cart_item['bacterial_marker_name'], target_sequence=cart_item['target_sequence'],
                                                            delivery_format_name=cart_item['delivery_format_name'])
        if created:
            self.cart.append(cart_item.id)
        
        if override_quantity:
            cart_item.quantity = quantity
        else:
            cart_item.quantity += quantity
        
        cart_item.save()
        self.save()

    def remove(self, product_id):
        """
        Remove a product from the cart
        """
        if product_id in self.cart:
            self.cart.remove(product_id)
            self.save()
    
    def updateQuantity(self, product_id, quantity):
        """
        Remove a product from the cart
        """
        if product_id in self.cart:
            cart_item = CartItem.objects.get(id=product_id)
            cart_item.quantity = quantity
            cart_item.save()
            self.save()

    def __iter__(self):
        """
        Loop through cart items and fetch the products from the database
        """
        from orders.serializers import CartItemSerializer
        cart_items = CartItem.objects.filter(id__in=self.cart).order_by('-id')
        serializer = CartItemSerializer(cart_items, many=True)
        
        return serializer.data

    def __len__(self):
        """
        Count all items in the cart
        """
        return sum(CartItem.objects.get(id=item_id).quantity for item_id in self.cart)

    def get_total_price(self):
        return sum(CartItem.objects.get(id=item_id).price * CartItem.objects.get(id=item_id).quantity for item_id in self.cart)

    def clear(self):
        # remove cart from session
        del self.session[settings.CART_SESSION_ID]
        self.save()

class WorkSchedule(models.Model):
    structure_type_code = models.CharField()
    delivery_format_code = models.CharField()
    ready_status = models.CharField()
    work_period_earliest = models.IntegerField() # estimate time of arrival in days
    work_period_latest = models.IntegerField(blank=True, null=True)
    shipping_temp = models.CharField()
    storage_temp = models.CharField()
    stability_period = models.CharField()

    class Meta:
        db_table = 'work_schedule'
