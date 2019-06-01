from django.db import models
from django.contrib.auth.models import User
from datetime import date
from uuid import uuid4
from phone_field import PhoneField
import jsonfield

def generateUUID():
    return str(uuid4())

class Member(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone_number = models.CharField(max_length=30)
    about = models.TextField()

    billing_first_name = models.CharField(max_length=300,blank=True, null=True)
    billing_last_name = models.CharField(max_length=300,blank=True, null=True)
    street_address = models.CharField(max_length=300,blank=True, null=True)
    city = models.CharField(max_length=300,blank=True, null=True)
    state = models.CharField(max_length=300,blank=True, null=True)
    country = models.CharField(max_length=300,blank=True, null=True)
    postal_code = models.CharField(max_length=300,blank=True, null=True)
    phone = PhoneField(blank=True, help_text='Contact phone number')
    additional_info = models.CharField(max_length=300,blank=True, null=True)
    billing_email = models.CharField(max_length=300,blank=True, null=True)

    def __str__(self):
        return 'username={0}'.format(self.user.username)

class Product_Category(models.Model):
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name

class Product(models.Model):
    category = models.ForeignKey(Product_Category,on_delete=models.CASCADE,related_name='pro_category',blank=True, null=True)
    name = models.CharField(max_length=200)
    content = models.TextField()
    excerpt = models.TextField()
    price = models.DecimalField(max_digits=20, decimal_places=2)
    status = models.IntegerField(default=0)
    date = models.DateTimeField(auto_now_add=True)
    quantity = models.PositiveIntegerField()
    author = models.PositiveIntegerField()
    featured_image = models.CharField(max_length=300)

    def __str__(self):
        return 'Product={0},Category={1}'.format(self.name,self.category)

class Image(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    image = models.ImageField()

    def __str__(self):
        return 'Product={0}'.format(self.product.name)

############# Count User's Cart Items Manager ###############
class User_cartManager(models.Manager):
    def items_count(self, user_id):
        return self.filter(user=user_id).count()
############# ENDS ########################

class User_cart(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE,related_name="product_cart")
    user = models.ForeignKey(User, on_delete=models.CASCADE,related_name="user_cart")
    product_quantity = models.PositiveIntegerField()
    total_price =  models.DecimalField(max_digits=20, decimal_places=2)
    created_at = models.DateField(default=date.today)
    objects = models.Manager()
    cart_obj = User_cartManager()

    def __str__(self):
        return 'Product={0},User={1}'.format(self.product.name,self.user.username)

class Product_orders(models.Model):
    order_id = models.UUIDField(default=generateUUID, editable=False, unique=True)
    user = models.ForeignKey(User,on_delete=models.CASCADE,related_name='member_order')
    product =models.ManyToManyField(Product,related_name='products_order')
    total_amount = models.DecimalField(max_digits=20, decimal_places=2,default=0) 
    prods_qty = jsonfield.JSONField()
    order_status = models.BooleanField(default=False)

    def get_products(self):
        return "|---|".join([p.name for p in self.product.all()])
    
    def __str__(self):
        return 'User={0}'.format(self.user.username)