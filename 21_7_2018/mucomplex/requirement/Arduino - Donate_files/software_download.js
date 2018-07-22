/*
 *  js for the Donate Page (http://arduino.cc/en/Main/Donate) and Thank You Page (http://arduino.cc/en/Main/Thank You)
 *  last updated: 2016-12-02
 *  Stefania - Ádám
 */

$(function() {

  var currencySymbol = '$';

  $('.donate-open-button').on('click', function(event) {
    var donationValue = $(event.target).closest('.donate-open-button').attr('value');
    
    $('#donationModal').find('#donationValue').val(donationValue);

    //if(donationValue == '' || !donationValue) {
    $('#donateErrorMsg').hide();
    $('.donate-modal').foundation('reveal', 'open');
    // } else {
    //   $('#stripe-button').click();  
    // }
  });

  $('#donationModal').find('#currencyValue').on('change', function(){
    var element = $('#donationModal').find('#donationValue');
    var value = element.val();

    var currency = $('#donationModal').find('#currencyValue');
    
    if(currency.val() === 'EUR') {
      currencySymbol = '\u20AC';
    } else {
      currencySymbol = '$';
    }
    var newString = value.replace(value.substring(0, 1), currencySymbol);
    element.val(newString);
  });

  $('#donationModal').find('#donationValue').on('input propertychange paste', throttle(function (event) {
      var element = $('#donationModal').find('#donationValue');
      var value = element.val();
      var reg = new RegExp('^\\$?[0-9]+\\.?[0-9]?[0-9]?$');
      if(!reg.test(value)){
        element.val("");
      } else {
        if(value.substring(0, 1) !== currencySymbol)
          element.val(currencySymbol+value);
      }
  }, 1000));

  $('.download-page-content a:not(".windows-app")').on('click', function() {
    localStorage.removeItem('redirect_url');
  });

  $('.download-page-content a.windows-app').on('click', function() {
    localStorage.setItem('redirect_url', 'https://www.microsoft.com/store/apps/9nblggh4rsd8?ocid=badge');
  });

  function throttle(fn, threshhold, scope) {
    threshhold || (threshhold = 250);
    var last,
        deferTimer;
    return function () {
      var context = scope || this;

      var now = +new Date,
          args = arguments;
      if (last && now < last + threshhold) {
        // hold on to it
        clearTimeout(deferTimer);
        deferTimer = setTimeout(function () {
          last = now;
          fn.apply(context, args);
        }, threshhold);
      } else {
        last = now;
        fn.apply(context, args);
      }
    };
  }

  var stripeResponseHandler = function(response) {
      
      var amount = $('#donationValue').val();
      var amountCents = parseFloat(amount.substring(1)).toFixed(2)*100;

      var currency = $('#currencyValue').val();

      var redirect_url = localStorage.getItem('redirect_url') ? localStorage.getItem('redirect_url') : '/en/Main/ThankYou';
      localStorage.removeItem('redirect_url');

      $.ajax({
      type: "POST",
      url: "https://api.arduino.cc/stripe/charge",
      contentType:"application/json; charset=utf-8",
      timeout: 10000,
      data: JSON.stringify({
        token: response.id, 
        amount: amountCents,
        currency: 'USD',
        donator: response.card.name,
        email: response.email
      }),
      success: function(data){
        console.log('Payment success')
        //console.log(data);
        //redirect to thank you page
        window.location.replace(redirect_url);
      },
      error: function(x, t, m) {
        if(!x.responseJSON || x.responseJSON.status !== 'succeeded') {
          if(x.responseJSON && x.responseJSON.error) {
            $('#donateErrorMsg').text(JSON.parse(x.responseJSON.error).message + ' Please retry.')
          } else {
            $('#donateErrorMsg').text('Server unavailable or unexpected error, please retry.');
          }           
          
          $('#donateErrorMsg').show();
          $('.donate-modal').foundation('reveal', 'open');
        } else {
          console.log('Payment success')
          //console.log(data);
          //redirect to thank you page
          window.location.replace(redirect_url); 
        }
      }
    });

  };

  var stripeCheckoutHandler = StripeCheckout.configure({
      key: 'pk_live_rZXIoQXJuh9awHHfmSAUf8zT',
      image: '../pub/skins/arduinoWide/img/ArduinoLogo_loop-01.svg', 
      billingAddress:  'true',
      token: stripeResponseHandler,
      bitcoin: true
    });

  $('#stripe-button').on('click', function(e) {
      $('#donateErrorMsg').hide();
      var amount = $(e.target).parents().find('#donationValue').val();
      var amount_valid = !(parseInt(amount.substring(1)) === 0 || amount.substring(1) === '' || !amount.substring(1));

      var currency = $(e.target).parents().find('#currencyValue').val();

      if(amount_valid) {

        $('.donate-modal').foundation('reveal', 'close');
        
        var amountCents = parseFloat(amount.substring(1)).toFixed(2)*100;

        // Open Checkout with further options
        stripeCheckoutHandler.open({
          name: 'Arduino',
          description: amount,
          amount: amountCents,
          currency: currency
        });
        e.preventDefault();
      } else {
        $('#donateErrorMsg').text('Please enter a valid amount.'); 
        $('#donateErrorMsg').show();
      }

    });

  $('#pay-pal').on('click', function(e){
    var amount = $(e.target).parents().find('#donationValue').val();
    var amount_valid = !(parseInt(amount.substring(1)) === 0 || amount.substring(1) === '' || !amount.substring(1));

    if(amount_valid) {
      // $(e.target).find('.paypal-button').find('[name="amount"]').val(amount);
      // $(e.target).find('.paypal-button').click();
      $.ajax({
        url : '/download_handler.php?paypal='+amount
        ,dataType : 'json'
        ,cache : false
        ,success : function(data) {
          console.log(data);
          //redirect to paypal
          if("SUCCESS" === data["ACK"].toUpperCase() || "SUCCESSWITHWARNING" === data["ACK"].toUpperCase()) {
            window.location.replace('https://www.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token='+encodeURIComponent(data['TOKEN'])+'&useraction=commit');  
          } else {
            $('#donateErrorMsg').text('An error occurred, please retry.'); 
            $('#donateErrorMsg').show(); 
          }

        },
        error: function(x, t, m) {
          console.debug(x, t, m);
          $('#donateErrorMsg').text('An error occurred, please retry.'); 
          $('#donateErrorMsg').show();
        }});
    } else {
      $('#donateErrorMsg').text('Please enter a valid amount.'); 
      $('#donateErrorMsg').show();
    }

  });

  // Close Checkout on page navigation
  $(window).on('popstate', function() {
      stripeCheckoutHandler.close();
      $('.donate-modal').foundation('reveal', 'close');
    });

  // Update download counter if it exists on page
  if( $('#download-counter').length ) {
    function pad(number) {
      var padArr = ['00000000', '0000000', '000000', '00000', '0000', '000', '00', '0', ''];
      numStr = number.toString();
      if (numStr.length < 8) numStr = padArr[numStr.length] + numStr;
      return numStr;
    }
    $.ajax({
      url : '/download_handler.php?getCount&json'
      ,dataType : 'json'
      ,cache : false
      ,success : function(data) {
        var counter = "SO MANY";
        if (data !== 0) counter = data;
        else counter = pad(Math.floor((Math.random() * 100000) + 1));
        $('#download-counter').html(counter);
      }
    });
  }

  /* Donate Page scripts */

  var openSocialPopup = function(url, name) {
      var width  = 575,
          height = 400,
          left   = ($(window).width()  - width)  / 2,
          top    = ($(window).height() - height) / 2,
          opts   = 'status=1' +
                   ',width='  + width  +
                   ',height=' + height +
                   ',top='    + top    +
                   ',left='   + left;
      
      window.open(url, name, opts);
   
      return false; 
    }

  $('#thankyou-twitter-button').on('click', function(event) {
    var currentUrl = document.location.origin;
      var url = "https://twitter.com/share?text=I%20supported%20the%20Arduino%20Software%20with%20a%20contribution!%20Check%20out&url="+currentUrl;
      openSocialPopup(url, "twitter")  
    });


  $('#thankyou-facebook-button').on('click', function(event) {

    FB.ui({
        method: 'feed',
        link: document.location.origin,
        caption: '',
        name: 'Arduino - Contribution',
        display: 'popup',
        description: 'I supported the Arduino Software with a contribution!',
        picture: 'https://www.arduino.cc/en/uploads/Main/ThankYou.png'
      }, function(response){});

  });

  window.fbAsyncInit = function() {
    FB.init({
      appId      : '1438254093131479',
      xfbml      : true,
      version    : 'v2.1'
    });
  };

  (function(d, s, id){
       var js, fjs = d.getElementsByTagName(s)[0];
       if (d.getElementById(id)) {return;}
       js = d.createElement(s); js.id = id;
       js.src = "//connect.facebook.net/en_US/sdk.js";
       fjs.parentNode.insertBefore(js, fjs);
     }(document, 'script', 'facebook-jssdk'));

});
