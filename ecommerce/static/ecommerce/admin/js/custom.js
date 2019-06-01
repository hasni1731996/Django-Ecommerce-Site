$(document).ready(function(){
    // function for invoke create order function & get values from Card Inputs..
    var flag = 0;

    $('#btn_payment').click(function() 
    {
        flag = 1;

        if (flag == 1)
        {
            //alert("Clicked");
            data={
                credit_no : $('#credit_no').val(),
                ccv : $('#ccv').val(),
                exp : $('#exp').val(),
                price : $('#price').val()
            }
            console.log('data.....',data)
            $.ajax({
                    type: "POST",
                    url : "/ecommerce/user/product/payment/",
                    data:JSON.stringify(data),
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    success: function(response)
                    {
                        console.log(response)
                        if(response.status == 1)
                        {
                            if(response.message)
                            {
                                Lobibox.notify('success', {msg: response.message, size: 'mini', sound: true});
                                create_order();
                                setTimeout(function(){window.location.href = '/ecommerce/products/'}, 3000);
                            }
                        }
                        else
                        {
                            Lobibox.notify('error', {msg: response.message, size: 'mini', sound: true});
                        }
                    }
                        
                });
            $('#modalLoginForm').modal('hide');
        }
        else
        {
            alert("Not clicked");
        }
    });

    //// ends /////////

///// function for displying modal upon online payment 
$("#pay_btn").click(function(e)
    { 
        var radioValue = $("input[name='payment_gateway']:checked").val();
        if(radioValue == 'delivery')
        {
           // alert("Your are on delivery ");
            create_order();
            setTimeout(function(){window.location.href = '/ecommerce/products/'}, 3000);
        }
        else
        {
            $('#modalLoginForm').modal('show');
            e.preventDefault();       
        }
    
    });


////// Ends/////


    ///// Function creating Orders after payment success ////
    function create_order() 
    {  
        prods_id=[];
        prods_qty = [];
        $.each($('input'),function(i,val){
            if($(this).attr("name")=="prod_id"){
                prods_id.push($(this).val());
            }
            if($(this).attr("name")=="prod_qty"){
                prods_qty.push($(this).val());
            }
        });
        console.log('ids...',prods_id,prods_qty);
        data = 
        {
            billing_first_name : $('#billing_first_name').val(),
            billing_last_name :$('#billing_last_name').val(),
            billing_stret_1 : $('#billing_stret_1').val() + $('#billing_stret_2').val(),
            billing_city : $('#billing_city').val(),
            billing_state : $('#billing_state').val(),
            billing_country : $('#billing_country').val(),
            billing_zip : $('#billing_zip').val(),
            billing_phone : $('#billing_phone').val(),
            email : $('#billing_email').val(),
            billing_notes : $('#billing_notes').val(),
            products : prods_id,
            prods_qty :prods_qty,
            cart_total : $('#cart_total').val(),
            }
            console.log('dataaaa.',data)
            $.ajax({
                type: "POST",
                url : "/ecommerce/order_create/",
                data:JSON.stringify(data),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success: function(response)
                {
                    console.log(response)
                    if(response.status == 1)
                    {
                        if(response.message)
                        {
							Lobibox.notify('success', {msg: response.message, size: 'mini', sound: true});
						}
                    }
                    else
                    {
                        Lobibox.notify('error', {msg: response.message, size: 'mini', sound: true});
                    }
                }
                
            });
    }
    //// ends 

// Orders Update From Admin

$('.order_btn').click(function() {
   //alert('clicked');
    data = {
       order_id: $(this).prev('input[name="order_id"]').val()
    }
    console.log(data);
    $.ajax({
        type: "POST",
        url : "/ecommerce/admin_login/orders/",
        data:JSON.stringify(data),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function(response)
        {
            console.log(response)
            if(response.message)
            {
                Lobibox.notify('success', {msg: response.message, size: 'mini'});
            
            }
            setTimeout(function(){window.location.href = '/ecommerce/admin_login/orders/'}, 3000);
        }
        
    });

  })
// Ends
    
    /// Data Table Initialization

    $('#table_order').DataTable();

      //// Ends Here ///////
});