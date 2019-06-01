import datetime
from django import template
from ecommerce.models import *
register = template.Library()

############# Query From User's Cart Model To Count Items #########
@register.simple_tag
def patients_objs(user_id):
    return User_cart.cart_obj.items_count(user_id)
############ ENDS ########################