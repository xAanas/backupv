/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var myLastZoom = null;

function add_events_display_message(typeMsg, text) {
    var message_add_events = '';
    var div_main_content_add_event_msg = jQuery("#main-content-add_event-msg");
    if (typeof div_main_content_add_event_msg !== 'undefined') {
        jQuery("#main-content-add_event-msg").remove();
    }

    var data = {
        "testToTradius": text
    };
    data = jQuery(this).serialize() + "&" + jQuery.param(data);
    jQuery.ajax({
        type: "POST",
        dataType: "json",
        url: "?q=api/traduis/js/message",
        data: data,
        enctype: "multipart/form-data",
        uploadMultiple: true,
        success: function (data) {
            console.log(data);
            var Tradiuced_text = data.txt_tradiuced;
            console.log(Tradiuced_text);
            if (typeMsg.toString() === 'error') {
                message_add_events = "<div class=\"alert alert-block alert-danger\" id=\'main-content-add_event-msg\'><a class=\"close\" data-dismiss=\"alert\" href=\"#\">×</a><h4 class=\"element-invisible\">Error message</h4><em class=\"placeholder\">" + Tradiuced_text + "</em></div>";
                jQuery("#main-content").append(message_add_events);
            } else if (typeMsg.toString() === 'warning') {
                message_add_events = "<div class=\"alert alert-block alert-warning\" id=\'main-content-add_event-msg\'><a class=\"close\" data-dismiss=\"alert\" href=\"#\">×</a><h4 class=\"element-invisible\">Warning message</h4>" + Tradiuced_text + "</div>";
                jQuery("#main-content").append(message_add_events);
            } else {
                message_add_events = "<div class=\'alert alert-block alert-success\' id=\'main-content-add_event-msg\'><a class=\'close\' data-dismiss=\'alert\' href=\'#\'>×</a><h4 class=\'element-invisible\'>Message d état</h4>" + Tradiuced_text + "</div> ";
                jQuery("#main-content").append(message_add_events);
            }
        }
    });

}


jQuery(function () {
    jQuery('#editor').wysiwyg();
    jQuery('#editor').cleanHtml();

    jQuery(function () {
        jQuery('.mycolor').colorpicker();
    });

    
    
    
    jQuery('#startdate').datetimepicker({
        format: 'DD-MM-YYYY HH:mm',
        icons: {
            time: "fa fa-clock-o",
            date: "fa fa-calendar",
            up: "fa fa-arrow-up",
            down: "fa fa-arrow-down"
        }
    });

    jQuery('#enddate').datetimepicker({
        format: 'DD-MM-YYYY HH:mm',
        icons: {
            time: "fa fa-clock-o",
            date: "fa fa-calendar",
            up: "fa fa-arrow-up",
            down: "fa fa-arrow-down"
        }
    });
    
	
    jQuery('#datetimepicker').datetimepicker({
        format: 'DD-MM-YYYY HH:mm',
        icons: {
            time: "fa fa-clock-o",
            date: "fa fa-calendar",
            up: "fa fa-arrow-up",
            down: "fa fa-arrow-down"
        }
    });

    jQuery('#datetimepicker1').datetimepicker({
        format: 'DD-MM-YYYY HH:mm',
        icons: {
            time: "fa fa-clock-o",
            date: "fa fa-calendar",
            up: "fa fa-arrow-up",
            down: "fa fa-arrow-down"
        }
    });
	
	
	
    jQuery('#start_date').datetimepicker({
        format: 'DD-MM-YYYY HH:mm',
        icons: {
            time: "fa fa-clock-o",
            date: "fa fa-calendar",
            up: "fa fa-arrow-up",
            down: "fa fa-arrow-down"
        }
    });

    jQuery('#end_date').datetimepicker({
        format: 'DD-MM-YYYY HH:mm',
        icons: {
            time: "fa fa-clock-o",
            date: "fa fa-calendar",
            up: "fa fa-arrow-up",
            down: "fa fa-arrow-down"
        }
    });


    jQuery('input:radio[name="lieuradio"]').change(
            function () {
                // checks that the clicked radio button is the one of value 'Yes'
                // the value of the element is the one that's checked (as noted by @shef in comments)
                if (jQuery(this).val() == 'address') {
                    // jQuery("#myadd").show();
                    jQuery('#addressname').prop('disabled', false);
                    jQuery('#addressbutton').prop('disabled', false);

                }
                else {

                    // if it's the 'No' button removes the 'appended' element.
                    //jQuery("#myadd").hide();
                    jQuery('#addressname').prop('disabled', true);
                    jQuery('#addressbutton').prop('disabled', true);

                }
            });


    jQuery('#addressname').autocomplete({
        serviceUrl: 'http://photon.komoot.de/api/',
        paramName: 'q',
        onSelect: function (suggestion) {
            if (typeof connected_user_is_attendee !== "undefined") {
                var cp = suggestion.obj.postcode.split(";");
                var cp_val = cp[0];
            } else {
                cp_val = null;
            }
            console.log (suggestion.obj);
            jQuery("#street").val(suggestion.value);
            jQuery("#placename").val(suggestion.obj.name);
            jQuery("#codepostal").val(suggestion.obj.postcode);
            jQuery("#city").val(suggestion.obj.city);
            jQuery("#country").val(suggestion.obj.country);
            jQuery("#long").val(suggestion.geo.coordinates[0]);
            jQuery("#lat").val(suggestion.geo.coordinates[1]);
            var mlong = suggestion.geo.coordinates[0];
            var mlat = suggestion.geo.coordinates[1];
            setMapTag(mlong, mlat, suggestion.obj.osm_value);
        },
        transformResult: function (response) {
            var data = JSON.parse(response);
            var myreturn = [];
            var items = [];
            var strietm = "";
            var myobj;
            //showLoadingMask(false);
            if (response.success === false) {
                // Hide the list, there was some error
                console.log('transformResult:false');
                return false;

            }


            jQuery.each(data.features, function (key, value) {
                console.log('transformResult:items');
                var cps;
                items = [];
                strietm = "";
                out = {};
                myobj = value.properties;
                mygeo = value.geometry;
                if (myobj.name) {

                    if (strietm.length > 0) {
                        if (myobj.osm_value) {
                            if (myobj.osm_value.length > 0) {
                                strietm = strietm + myobj.name + "(" + myobj.osm_value + ") ";
                            }
                        } else {
                            strietm = strietm + myobj.name + " ";
                        }
                    } else {
                        if (myobj.osm_value) {
                            if (myobj.osm_value.length > 0) {
                                strietm = myobj.name + "(" + myobj.osm_value + ") ";
                            }
                        } else {
                            strietm = myobj.name;
                        }
                    }
                }

                if (myobj.housenumber) {
                    if (strietm.length > 0) {
                        strietm = strietm + myobj.housenumber + " ";
                    } else {
                        strietm = myobj.housenumber;
                    }
                }
                if (myobj.street) {

                    if (strietm.length > 0) {
                        strietm = strietm + " " + myobj.street + " ";
                    } else {
                        strietm = myobj.street;
                    }
                }
                if (myobj.postcode) {
                    var ccp = myobj.postcode.split(";");
                    if (strietm.length > 0) {
                        strietm = strietm + "," + ccp[0];
                    } else {
                        strietm = ccp[0];
                    }
                }
                if (myobj.city) {
                    if (strietm.length > 0) {
                        strietm = strietm + "," + myobj.city;
                    } else {
                        strietm = myobj.city;
                    }
                }
                if (myobj.country) {
                    if (strietm.length > 0) {
                        strietm = strietm + " " + myobj.country;
                    } else {
                        strietm = myobj.country;
                    }
                }
                jQuery.each(value.properties, function (k, v) {
                    if (v) {
                        items.push(v);
                    }

                });
                myreturn.push({value: strietm, obj: myobj, geo: mygeo});

            });
      
            console.log({suggestions: myreturn});

            return {suggestions: myreturn};
        }
    });
    
    
   
    
    /*
     var valid=false;
     jQuery('form').on('submit', function(e){
     // validation code here
     e.preventDefault();
     
     if(!valid) {
     
     }
     });
     */

   // jQuery('#eventform').validator();




    
    jQuery('#eventofficeform #eventsubmit_validate_email').on('click', function (e) {
    	if (jQuery('#eventsubmit_validate_email').attr('rel') == 'submit') jQuery('form#eventofficeform').submit(); 
    	else {
    	console.log(document.getElementById("eventofficeform").checkValidity());
    	if (document.getElementById("eventofficeform").checkValidity() == false) {
    		
    		console.log('false email validation');
    		var t = Drupal.t('Not a valid email');
    		alert (t);
    		
    		
    		
    	
    
    		
    	}
    	else {
    	 	if (jQuery('#eventsubmit_validate_email').attr('rel') == 'submit') jQuery('form#eventofficeform').submit(); 
    		if (jQuery('#passwordevent').val() != '' && (jQuery('#eventsubmit_validate_email').attr('rel') != 'submit')) {
    		
    			var urltest = "/apiDrupal/logincheck/"+jQuery("#event_email").val();
    	    	jQuery.ajax({
    	    		  method: "POST",
    	    		  url: urltest,
    	    		  data: {password: jQuery('#passwordevent').val()}
    	    		
    	    		})
    	    		  .done(function( msg ) {
    	    		
    	    			 
    	    			  console.log(urltest);
    	    			  if (msg > 0) {
    	    				  var connected_message = Drupal.t('Your are now connected! Your event is being submitted ... ');
    	    				  
    	    				  
    	    				  jQuery('span.resultpass').html('<div class="connecteduserok">'+connected_message+'</div>');
    	    				  jQuery('#connected_uid_direct').val(msg);
    	    				  if (jQuery('#connected_uid_direct').val() > 0) {
    	    					  jQuery('#eventsubmit_validate_email').attr('rel', 'submit');
    	    					  jQuery('#eventsubmit_validate_email').addClass('connectednow');
    	    					  jQuery('#eventsubmit_validate_email').unbind();
    	    					  jQuery('#eventsubmit_validate_email').attr('id', 'eventsubmit_validate_email-3');
    	    					  jQuery('form#eventofficeform').unbind();
    	    						  jQuery('form#eventofficeform').submit(); 
    	    			
    	    					
    	    					
    	    					  
    	    					 
    	    				  }
    	    			
    	    			  }
    	    			  else {
    	    				  var connected_message = Drupal.t('Your password doesn\'t match! Try again');
    	    				  jQuery('span.resultpass').html('<div class="connecteduserok">'+connected_message+'</div>');
    	    				  //jQuery('#profile_values').removeClass('hidden');
    	    			  }
    	    			  
    	    		    
    	    		  });
    			
    			
    			
    		}
    		else if (jQuery('#eventsubmit_validate_email').attr('rel') != 'submit') {
    			
    			
    	var urltest = "/apiDrupal/emailcheck/"+jQuery("#event_email").val();
    	jQuery.ajax({
    		  method: "GET",
    		  url: urltest,
    		  password: jQuery('#passwordevent').val()
    		
    		})
    		  .done(function( msg ) {
    		
    			  console.log(msg);
    			  console.log(urltest);
    			  if (msg > 0) {
    				  jQuery('span.usedmail').removeClass('hidden');
    				  jQuery('.passwordcontainer').removeClass('hidden');
    				  jQuery('.passwordevent').removeClass('hidden');
    				  
    				  
    			  }
    			  else {
    				  jQuery('#profile_values').removeClass('hidden');
    				  
    				  jQuery('#eventsubmit_validate_email').attr('rel', 'createandsubmit');
					  jQuery('#eventsubmit_validate_email').addClass('newaccountnow');
					  jQuery('#eventsubmit_validate_email').unbind();
					  jQuery('.newaccountnow').click(function(){ 
					  jQuery('form#eventofficeform').unbind();
						  jQuery('form#eventofficeform').submit(); 
				  });
					  jQuery('#eventsubmit_validate_email').attr('id', 'eventsubmit_validate_email-5');
    				  
    				  
    			  }
    			  
    		    
    		  });
    	}
    	}
    	}
    });
    
    
    
    jQuery('#groupofficeform #eventsubmit_step2').click(function(){
    	jQuery(this).removeAttr('disabled');
    	jQuery('#groupofficeform').unbind();
    });
    
 
    

    
    
    jQuery('#groupofficeform #eventsubmit_validate_email').on('click', function (e) {
    	if (jQuery('#eventsubmit_validate_email').attr('rel') == 'submit') {
    		jQuery('form#groupofficeform').unbind();
    		jQuery('form#groupofficeform').submit();
    	}
    	else {
    	console.log(document.getElementById("groupofficeform").checkValidity());
    	if (document.getElementById("groupofficeform").checkValidity() == false) {
    		
    		console.log('false email validation');
    		var t = Drupal.t('Not a valid email');
    		alert (t);
    		
    		
    		
    	
    
    		
    	}
    	else {
    	 	if (jQuery('#eventsubmit_validate_email').attr('rel') == 'submit') jQuery('form#groupofficeform').submit(); 
    		if (jQuery('#passwordevent').val() != '' && (jQuery('#eventsubmit_validate_email').attr('rel') != 'submit')) {
    		
    			var urltest = "/apiDrupal/logincheck/"+jQuery("#event_email").val();
    	    	jQuery.ajax({
    	    		  method: "POST",
    	    		  url: urltest,
    	    		  data: {password: jQuery('#passwordevent').val()}
    	    		
    	    		})
    	    		  .done(function( msg ) {
    	    		
    	    			 
    	    			  console.log(urltest);
    	    			  if (msg > 0) {
    	    				  var connected_message = Drupal.t('Your are now connected! Your group is now being submitted');
    	    				  
    	    				  
    	    				  jQuery('span.resultpass').html('<div class="connecteduserok">'+connected_message+'</div>');
    	    				  jQuery('#connected_uid_direct').val(msg);
    	    				  if (jQuery('#connected_uid_direct').val() > 0) {
    	    					  jQuery('#eventsubmit_validate_email').attr('rel', 'submit');
    	    					  
    	    					  
    	    					  jQuery('#eventsubmit_validate_email').addClass('connectednow');
    	    					  jQuery('#eventsubmit_validate_email').unbind();
    	    					  jQuery('form#groupofficeform').submit(); 
    	    					  jQuery('#eventsubmit_validate_email').attr('id', 'eventsubmit_validate_email-3');
    	    						  jQuery('form#groupofficeform').unbind();
    	    						  jQuery('form#groupofficeform').submit(); 
    	    						 
    	    			
    	    					  
    	    					
    	    					  
    	    					  console.log(jQuery('#connected_uid_direct').val());
    	    				  }
    	    			
    	    			  }
    	    			  else {
    	    				  var connected_message = Drupal.t('Your password doesn\'t match! Try again');
    	    				  jQuery('span.resultpass').html('<div class="connecteduserok">'+connected_message+'</div>');
    	    				  //jQuery('#profile_values').removeClass('hidden');
    	    			  }
    	    			  
    	    		    
    	    		  });
    			
    			
    			
    		}
    		else if (jQuery('#eventsubmit_validate_email').attr('rel') != 'submit') {
    			
    			
    	var urltest = "/apiDrupal/emailcheck/"+jQuery("#event_email").val();
    	jQuery.ajax({
    		  method: "GET",
    		  url: urltest,
    		  password: jQuery('#passwordevent').val()
    		
    		})
    		  .done(function( msg ) {
    		
    			  console.log(msg);
    			  console.log(urltest);
    			  if (msg > 0) {
    				  jQuery('span.usedmail').removeClass('hidden');
    				  jQuery('.passwordcontainer').removeClass('hidden');
    				  jQuery('.passwordevent').removeClass('hidden');
    				  
    				  
    			  }
    			  else {
    				  jQuery('#profile_values').removeClass('hidden');
    				  
    				  jQuery('#eventsubmit_validate_email').attr('rel', 'createandsubmit');
					  jQuery('#eventsubmit_validate_email').addClass('newaccountnow');
					  jQuery('#eventsubmit_validate_email').unbind();
					  jQuery('.newaccountnow').click(function(){ 
					  jQuery('form#groupofficeform').unbind();
						  jQuery('form#groupofficeform').submit(); 
				  });
					  jQuery('#eventsubmit_validate_email').attr('id', 'eventsubmit_validate_email-5');
    				  
    				  
    			  }
    			  
    		    
    		  });
    	}
    	}
    	}
    });
    
    
    
    

    
    jQuery('#logintopost').on('click', function (e) {
    	jQuery('.passwordcontainer').removeClass('hidden');
    	jQuery('.passwordcontainer input').removeClass('hidden');
    });
    
    jQuery('.logitopostconfirm').on('click', function (e) {
 
    });
    
    jQuery('.loginevent').on('click', function (e) {
    	console.log('login plz');
    });
    
    jQuery('fieldset#profile_values .fa-sort-down').on('click', function (e) {
    	jQuery('fieldset#profile_values select').click();
    });
    
 
 
    
    
    jQuery('.groupsubmit_step1').on('click', function (e) {
    	   var oevent_office_val_titre = jQuery("#eventTitle").val();
           var oevent_office_val_description = jQuery("#meditor").val();
           var oevent_office_val_type = jQuery("#group_type").val();
           
           console.log(oevent_office_val_titre + " " + oevent_office_val_description + " " + oevent_office_val_type);
           
           if (oevent_office_val_titre.toString() !== '' && oevent_office_val_description.toString() !== '' && oevent_office_val_type.toString() !== '') {
            	jQuery('.tabs.tab1').removeClass('active');
            	jQuery('.tabs.tab1').addClass('unactive'); 
            	jQuery('.tabs.tab2').removeClass('unactive');
            	jQuery('.tabs.tab2').removeClass('locked');
            	jQuery('.tabs.tab2').addClass('active'); 
            	
            	jQuery('.tabs-header .tab2').addClass('tabred2');
            	jQuery('.tabs-header .tab2').removeClass('tabgray');
            	jQuery('.tabs-header .tab1').addClass('tabgray2');
            	jQuery('.tabs-header .tab1').removeClass('tabred');                       	
            	jQuery('form#groupofficeform').removeAttr('data-toggle');
           }
           else {
        	   jQuery(window).scrollTop(0);
               //add_events_display_message('error', 'Is public');
               add_events_display_message('error', Drupal.t('Fields: Title, Description, Type are required'));
               return false;
           }
    });
    
    
    
    /*** admin interface add initiative on next step button ***/
    jQuery('.eventsubmit_step1').on('click', function (e) {
        var baseUrl = jQuery('#baseUrl').val();
        
        
        var oevent_office_val_titre = jQuery("#eventTitle").val();
        var oevent_office_val_description = jQuery("#editor").html();
        var oevent_office_val_description = jQuery("#meditor").val();
        var oevent_office_val_addressname = jQuery("#addressname").val();
        var oevent_office_val_start_date = jQuery("#start_date").val();
        var oevent_office_val_event_type = jQuery("#event_type").val();
    
        var oevent_val_event_lang = jQuery("#long").val();
        var oevent_val_event_lat = jQuery("#lat").val();
        var defaultAdress = false;


        if (oevent_val_event_lang != '' && oevent_val_event_lat != '') {
            if (oevent_office_val_titre.toString() !== '' && oevent_office_val_description.toString() !== '' && oevent_office_val_addressname.toString() !== '' && oevent_office_val_start_date.toString() !== '' && oevent_office_val_event_type.toString() !== '') {
                if (oevent_val_event_lat == '48.866577999228674' && oevent_val_event_lang == '2.364656925201416') {
                    if (confirm("êtes vous sur que c'est la bonne adresse ?")) {
                        defaultAdress = true;
                    }
                } else {
                    defaultAdress = true;
                }
                 
                if (defaultAdress == true) {
                    if (e.isDefaultPrevented()) {
                        //console.log('error');
                    } else {
                        e.preventDefault();
                        var data = myvalidatorOffice();
                        if (data.success) {
                       
                          /** Skip to next step **/
                        	jQuery('.tabs.tab1').removeClass('active');
                        	jQuery('.tabs.tab1').addClass('unactive'); 
                        	jQuery('.tabs.tab2').removeClass('unactive');
                        	jQuery('.tabs.tab2').removeClass('locked');
                        	jQuery('.tabs.tab2').addClass('active'); 
                        	
                        	jQuery('.tabs-header .tab2').addClass('tabred2');
                        	jQuery('.tabs-header .tab2').removeClass('tabgray');
                        	jQuery('.tabs-header .tab1').addClass('tabgray2');
                        	jQuery('.tabs-header .tab1').removeClass('tabred');                       	
                        	jQuery('form#eventofficeform').removeAttr('data-toggle');
                        }
                        else
                        {
                            return false;
                        }
                        return false;
                    }
                } else {
                    return false;
                }
            } else {
                jQuery(window).scrollTop(0);
                //add_events_display_message('error', 'Is public');
                add_events_display_message('error', Drupal.t('Fields: Title, Description, Type, Address,Start Date are required'));
                return false;
            }
        } else {
            jQuery(window).scrollTop(0);
            add_events_display_message('warning', "Thank you to move the pointer on the map as we did not detect the coordinates");
            return false;
        }
    });
    
    
    jQuery('#groupofficeform').on('submit', function (e) {
    	console.log('submitted');
    	return true;
    });
    
    
    
    
    /*** admin interface add initiative ***/
    jQuery('#eventofficeform').on('submit', function (e) {
    	
    	if (jQuery('#eventsubmit_validate_email').attr('rel') == 'submit') {
    		return true;
    		
    	}
  
    	
   
    	else {
        var baseUrl = jQuery('#baseUrl').val();
        var oevent_office_val_titre = jQuery("#eventTitle").val();
        var oevent_office_val_description = jQuery("#editor").html();
	var oevent_office_val_description = jQuery("#meditor").val();
        var oevent_office_val_addressname = jQuery("#addressname").val();
        var oevent_office_val_start_date = jQuery("#start_date").val();
        var oevent_office_val_event_type = jQuery("#event_type").val();
        var oevent_office_val_event_email = jQuery("#event_email").val();
        var oevent_val_event_lang = jQuery("#long").val();
        var oevent_val_event_lat = jQuery("#lat").val();
        var defaultAdress = false;


        if (oevent_val_event_lang != '' && oevent_val_event_lat != '') {
            if (oevent_office_val_titre.toString() !== '' && oevent_office_val_description.toString() !== '' && oevent_office_val_addressname.toString() !== '' && oevent_office_val_start_date.toString() !== '' && oevent_office_val_event_type.toString() !== '' && oevent_office_val_event_email.toString() !== '') {
                if (oevent_val_event_lat == '48.866577999228674' && oevent_val_event_lang == '2.364656925201416') {
                    if (confirm("êtes vous sur que c'est la bonne adresse ?")) {
                        defaultAdress = true;
                    }
                } else {
                    defaultAdress = true;
                }
                 
                if (defaultAdress == true) {
                    if (e.isDefaultPrevented()) {
                        //console.log('error');
                    } else {
                        e.preventDefault();
                        var data = myvalidatorOffice();
                        if (data.success) {
                            jQuery.ajax({
                                method: "POST",
                                url: "?q=Events/save/office",
                                data: data                                
                            }).done(function (msg) {                                
                                var myid = parseInt(msg);
                                if (myid > 0) {
                                    document.location.href = baseUrl + "/?q=Events/view/&id=" + msg + "&is_newsaved=1";
                                } else {
                                    add_events_display_message('error', 'Error, please check form');
                                }
                            }); 
                        }
                        else
                        {
                            return false;
                        }
                        return false;
                    }
                } else {
                    return false;
                }
            } else {
                jQuery(window).scrollTop(0);
                //add_events_display_message('error', 'Is public');
                add_events_display_message('error', 'Fields: Title, Description, Type, Address,Start Date and Email are required');
                return false;
            }
        } else {
            jQuery(window).scrollTop(0);
            add_events_display_message('warning', "Thank you to move the pointer on the map as we did not detect the coordinates");
            return false;
        }
    	}
    });

    function myvalidator()
    {
        var data = {};
        data.success = true;

        data.title = jQuery("#eventTitle").val();


        data.description = jQuery('#editor').cleanHtml();
	//data.description = jQuery('#meditor').val();
        data.event_type = jQuery("#event_type").val();
        data.orientation = jQuery("#orientation").val();
        data.destination = jQuery("#destination").val();
        data.lieuradio = "";

        data.addressname = {
            "street": jQuery("#street").val(),
            "placename": jQuery("#placename").val(),
            "codepostal": jQuery("#codepostal").val(),
            "city": jQuery("#city").val(),
            "country": jQuery("#country").val(),
            "long": jQuery("#long").val(),
            "lat": jQuery("#lat").val()
        };
        data.start_date = jQuery("#start_date").val();
        data.end_date = jQuery("#end_date").val();
        data.allday = jQuery("#allday").val();
        data.mycolor = jQuery("#mycolor").val();
        data.individual = jQuery("#asindividual:checked").val();
        //if (typeof jQuery("#id_event").val() !== "undefined") { // To Update Event
        data.id_event = jQuery("#id_event").val();
        //}
        var matches = [];
        jQuery(".clsorg:checked").each(function () {
            matches.push(this.value);
        });


        data.org = matches;
        return data;
    }


    function myvalidatorOffice()
    {
        var data = {};
        data.success = true;

        data.title = jQuery("#eventTitle").val();
        data.event_type = jQuery("#event_type").val();
        data.description = jQuery('#editor').cleanHtml();
        data.description = jQuery('#meditor').val();
	data.lieuradio = "";

        data.addressname = {
            "street": jQuery("#street").val(),
            "placename": jQuery("#placename").val(),
            "codepostal": jQuery("#codepostal").val(),
            "city": jQuery("#city").val(),
            "country": jQuery("#country").val(),
            "long": jQuery("#long").val(),
            "lat": jQuery("#lat").val()
        };
        data.start_date = jQuery("#start_date").val();
        data.end_date = jQuery("#end_date").val();
        data.allday = jQuery("#allday").val();
        //data.individual = jQuery("#asindividual:checked").val();
        data.autocompleteOrg_id = jQuery("#autocompleteOrg_id").val();
        //if (typeof jQuery("#id_event").val() !== "undefined") { // To Update Event
        data.id_event = jQuery("#id_event").val();
        //}
        data.event_url = jQuery("#event_url").val();
        data.event_email = jQuery("#event_email").val();
        var matches = [];
        jQuery(".clsorg:checked").each(function () {
            matches.push(this.value);
        });


        data.org = matches;
        return data;
    }



    function showinMap(lat, long, zoom) {
        //openMap
        var lat = lat;
        var lon = long;
        var zoom = zoom;

        var fromProjection = new OpenLayers.Projection("EPSG:4326");   // Transform from WGS 1984
        var toProjection = new OpenLayers.Projection("EPSG:900913"); // to Spherical Mercator Projection
        var position = new OpenLayers.LonLat(lon, lat).transform(fromProjection, toProjection);

        map = new OpenLayers.Map("Map");
        var mapnik = new OpenLayers.Layer.OSM();
        map.addLayer(mapnik);

        var markers = new OpenLayers.Layer.Markers("Markers");
        map.addLayer(markers);
        markers.addMarker(new OpenLayers.Marker(position));

        map.setCenter(position, zoom);


    }

    function initmap() {
    	
    	console.log('initiate map');
        OpenLayers.ProxyHost = "/proxy/?url=";
        map = new OpenLayers.Map('Map');
        layer = new OpenLayers.Layer.WMS("OpenLayers WMS",
                "http://vmap0.tiles.osgeo.org/wms/vmap0", {layers: 'basic'});

        map.addLayer(layer);
        map.setCenter(new OpenLayers.LonLat(0, 0), 0);

        var newl = new OpenLayers.Layer.Text("text", {location: "./textfile.txt"});
        map.addLayer(newl);

        var markers = new OpenLayers.Layer.Markers("Markers");
        map.addLayer(markers);

        var size = new OpenLayers.Size(21, 25);
        var offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);
        var icon = new OpenLayers.Icon('http://www.openlayers.org/dev/img/marker.png', size, offset);
        markers.addMarker(new OpenLayers.Marker(new OpenLayers.LonLat(0, 0), icon));

        var halfIcon = icon.clone();
        markers.addMarker(new OpenLayers.Marker(new OpenLayers.LonLat(0, 45), halfIcon));

        marker = new OpenLayers.Marker(new OpenLayers.LonLat(90, 10), icon.clone());
        marker.setOpacity(0.2);
        marker.events.register('mousedown', marker, function (evt) {
            alert(this.icon.url);
            OpenLayers.Event.stop(evt);
        });
        markers.addMarker(marker);
        map.addControl(new OpenLayers.Control.LayerSwitcher());
        map.zoomToMaxExtent();

        halfIcon.setOpacity(0.5);
    }

    var mlong, mlat, mzoom;
    mlong = jQuery("#showlong").val();
    mlat = jQuery("#showlat").val();
    mzoom = jQuery("#showzoom").val();

    showinMap(mlat, mlong, mzoom);

    jQuery('.mytogle').bootstrapToggle({on: 'Accepted', off: 'Waiting'});


    jQuery('.mytogle').on('change', function () {
        var event_id = jQuery("#event_id").val();
        var data = {"event_id": event_id};
        var myval, arval;
        myval = this.value;
        data.action = jQuery(this).prop('checked');
        data.participant_id = myval;
        data = jQuery(this).serialize() + "&" + jQuery.param(data);
        jQuery.ajax({
            method: "POST",
            url: "?q=Events/responcecoorg",
            data: data,
            success: function (data) {
                console.log(data);
            }
        });
    });

    jQuery('.mytogle1').bootstrapToggle({on: 'Yes', off: 'No'});

    jQuery('.mytogle1').on('change', function () {
        var event_id = jQuery("#event_id").val();
        var data = {"event_id": event_id};
        var myval, arval;
        myval = this.value;
        data.action = jQuery(this).prop('checked');
        data.participant_id = myval;
        data = jQuery(this).serialize() + "&" + jQuery.param(data);
        jQuery.ajax({
            method: "POST",
            dataType: "json",
            url: "?q=Events/requestcoorg",
            data: data,
            success: function (data) {
                console.log(data);
                if (data.is_error.toString() === 'no') {
                    add_events_display_message('status', "Votre demande est en attente de modération, il ne sera pas accepté dans l'immédiat");
                }
            }
        });
    });

    jQuery('input[type="checkbox"]').checkbox();

    /*   
     jQuery("#mycsv").on("paste",function(data){
     console.log("pasted");
     console.log(data);
     jQuery('#example').dataTable();
     });
     */

    //sms counter
    jQuery('#sms').keyup(function () {
        var myvalue = "";
        var max = 140;
        var len = jQuery(this).val().length;
        if (len >= max) {
            jQuery('#charNum').text(' you have reached the limit');
            myvalue = jQuery(this).val();
            myvalue = myvalue.substring(0, max);
            jQuery(this).val(myvalue);
            console.log(myvalue);
            //jQuery(this).value =  jQuery(this).value.substring(0, max);

        } else {
            var char = max - len;
            jQuery('#charNum').text(char + ' characters left');
        }
    });

    jQuery('#invitetab a').click(function (e) {
        e.preventDefault();
        jQuery(this).tab('show');
    });

    jQuery("#inviteadd").on('click', function () {
        Papa.parse(jQuery("#mycsv").val(), {
            headr: true,
            complete: function (results) {
                console.log(results);
            }
        });

    });

    /*
     var eventid = jQuery('#myeventid').val();
     console.log(eventid);
     
     jQuery('#mytable').dataTable( {
     "processing": true,
     serverSide: true,
     ajax: '/?q=Events/getInvited&id='+eventid
     } );
     */

    jQuery("#calendar").fullCalendar({
        header: {
            left: "prev,next today",
            center: "title",
            right: "month,basicWeek,basicDay"
        },
        editable: true,
        eventLimit: true, // allow "more" link when too many events
        eventSources: [
            {
                url: "?q=Events/calendarapi",
                type: "POST",
                data: {
                    custom_param1: "something",
                    custom_param2: "somethingelse"
                },
                error: function () {
                    alert("there was an error while fetching events!");
                }
            }
        ]
    });


//});


//jQuery("document").ready(function () {
    var event_id = jQuery("#id_event").val();
    var baseUrl = jQuery("#baseUrl").val();

    if (event_id > 0) {
        var data = {"true": "true"};
        jQuery.ajax({
            type: "GET",
            dataType: "json",
            url: "?q=api/eventDataById/&id=" + event_id,
            data: data,
            enctype: "multipart/form-data",
            uploadMultiple: true,
            success: function (data) {
                var personsCoOrganizer = data.persons.CoOrganizer;
                var index;
                //console.log(data.address.street_address);
                jQuery("#addressname").val(data.address.street_address);
                jQuery("#eventTitle").val(data.title);
                jQuery("#editor").html(data.summary);
                jQuery("#event_type").val(data.event_type_id).change();
                jQuery("#event_type").val(data.event_type_id).change();
                jQuery("#orientation").val(data.orientation).change();
                jQuery("#destination").val(data.destination).change();
                jQuery("#destination").val(data.destination).change();
                jQuery("#mycolor").val(data.color).change();
                jQuery("#mycolor_display").css('background-color', data.color);
                jQuery('#start_date').val(data.start_date);
                jQuery('#end_date').val(data.end_date);
                for (index = 0; index < personsCoOrganizer.length; ++index) {
                    var pCoOrg = personsCoOrganizer[index];
                    if (pCoOrg.contact_id == data.created_id) {
                        jQuery("#asindividual").checkbox({checked: true});
                    }
                }
                jQuery("input[name='org[]']").each(function () {
                    var curentOrgId = jQuery(this).val();
                    for (index = 0; index < personsCoOrganizer.length; ++index) {
                        var pCoOrg = personsCoOrganizer[index];
                        if (pCoOrg.contact_id == curentOrgId) {
                            jQuery(this).checkbox({checked: true});
                        }
                    }

                });
            }
        });
    }

    jQuery('#autocompleteOrg').autocomplete({
        serviceUrl: '?q=api/list/org',
        onSelect: function (suggestion) {
            jQuery("#autocompleteOrg_id").val(suggestion.data).change();
        },
        transformResult: function (response) {
            var data = JSON.parse(response);
            var myListOrg = [];
            jQuery.each(data, function (key, value) {
                myListOrg.push({value: value.value, data: value.data});
            });
            return {suggestions: myListOrg};
        }
    });

    jQuery('#autocompleteOrg').on('input', function (e) {
        var element = jQuery(this);
        var autocompleteOrgManuel = element.val();
        jQuery("#autocompleteOrg_id").val(autocompleteOrgManuel).change();
    });



    //var popupElement = '<div class="btn-group btn-toggle"><button class="btn btn-sm btn-info">On</button><button class="btn btn-sm btn-primary active">Off</button></div>'+
    //                  "<div id='mymap2'></div>";


    if (typeof L === 'object') { /* resolution confli avec  */
        L.mapbox.accessToken = 'pk.eyJ1IjoiYWRuYW5lIiwiYSI6InMzQTJyeHcifQ.RSgsPIjWzbpBKErEIeyGWw';
        var map = L.mapbox.map('mymap2', 'adnane.lkkh5jee')
                .setView([48.866577999228674, 2.364656925201416], 10);

        var marker = L.marker(new L.LatLng(48.866577999228674, 2.364656925201416), {
            icon: L.mapbox.marker.icon({
                'marker-color': 'ff8888',
                'marker-borderTopRightRadius': '0px !important'
                        /* 'border-bottom-left-radius': '0px' */
            }),
            draggable: true
        });



        marker.bindPopup('This marker is draggable! Move it around.');
        marker.addTo(map);

        map.on('click', function (e) {
            //map.panTo(e.layer.getLatLng());
            //m.panTo(e.latlng);
            marker.setLatLng(e.latlng);
            ondragend();
            //window[e.type].innerHTML = e.containerPoint.toString() + ', ' + e.latlng.toString();            
        });



        marker.on('dragend', ondragend);

        // Set the initial marker coordinate on load.


        function ondragend() {
            var m = marker.getLatLng();
            jQuery('#mylat').val(m.lat);
            jQuery('#mylong').val(m.lng);
            var data = {
                format: "json",
                lat: m.lat,
                lon: m.lng,
                zoom: 18,
                addressdetails: 1
            };
            jQuery.ajax({
                method: "GET",
                url: "https://nominatim.openstreetmap.org/reverse",
                data: data
            }).done(function (msg) {
                console.log(msg);
                if (!msg.error) {
                    jQuery("#addressname").val(msg.display_name);
                    jQuery('#placename').val(msg.display_name);
                    jQuery('#country').val(get_code(msg.address.country_code));
                    jQuery('#codepostal').val(msg.address.postcode);
                    jQuery('#city').val(msg.address.county);
                    
                } else {
                    jQuery("#addressname").val("(" + data.lat + "," + data.lon + ")");
                }
            });
        }

       // ondragend();


        jQuery('#addressbutton').popover({
            animation: true,
            content: jQuery("#mypopin"),
            html: true
        });

        jQuery('#addressbutton').on('show.bs.popover', function () {
            var mlong = parseFloat(jQuery('#long').val());
            var mlat = parseFloat(jQuery('#lat').val());
             
            setMapTag(mlong, mlat, null);
        });

        jQuery('#mymap2').on("click", function () {
        	  jQuery('#street').val(jQuery('#mylong').val() + "/" + jQuery('#mylat').val());
              //jQuery('#placename').val();
              //jQuery('#codepostal').val();
              //jQuery('#city').val();
              //jQuery('#country').val();
              jQuery('#long').val(jQuery('#mylong').val());
              jQuery('#lat').val(jQuery('#mylat').val());
             
        });
        
        jQuery('#acceptcoord').on("click", function () {
            //jQuery('#addressname').val(jQuery('#mylong').val()+"/"+jQuery('#mylat').val());
            jQuery('#street').val(jQuery('#mylong').val() + "/" + jQuery('#mylat').val());
            //jQuery('#placename').val();
            //jQuery('#codepostal').val();
            //jQuery('#city').val();
            //jQuery('#country').val();
            jQuery('#long').val(jQuery('#mylong').val());
            jQuery('#lat').val(jQuery('#mylat').val());
            jQuery('#addressbutton').popover('hide');
        });
        
        if (jQuery('body').hasClass('page-events-add')) {
        	
       
        
       // map.setView([48.866577999228674, 2.364656925201416], 10);
     //   marker.setLatLng([48.866577999228674, 2.364656925201416]);
        // init lang / lat / street
     //   jQuery("#long").val('2.364656925201416');
      //  jQuery("#lat").val('48.866577999228674');
     //   jQuery("#codepostal").val('75003');
     //   jQuery("#street").val('1, Place de la République, Quartier des Enfants-Rouges, Paris, Ile-de-France, France');
        }
    }

    function getZoom(osmvalue) {
        if (osmvalue == null && myLastZoom != null) {
            return myLastZoom;
        }
        if (osmvalue == undefined) {
            return 8;
        }
        var zoom = 16;
        switch (osmvalue) {
            case "continent":
                zoom = 2;
                break;
            case "country":
                zoom = 5;
                break;
            case "unclassified":
                zoom = 15;
                break;
            case "residential":
                zoom = 16;
                break;
            case "administrative":
                zoom = 7;
                break;
            default:
                zoom = 16;
        }

        return +zoom;
    }

    function setMapTag(mlong, mlat, osmvalue) {
        var zoom = getZoom(osmvalue);
        if (!isNaN(mlong) && !isNaN(mlat)) {
            var mlongFloatVal = parseFloat(mlong);
            var mlatFloatVal = parseFloat(mlat);
            map.setView([mlatFloatVal, mlongFloatVal], zoom);
            myLastZoom = parseInt(zoom);
            marker.setLatLng([mlatFloatVal, mlongFloatVal]);
            jQuery('#mylong').val(mlongFloatVal);
            jQuery('#mylat').val(mlatFloatVal);

        } else {
            var editedUserLong = jQuery('#long').val();
            var editedUserLat = jQuery('#lat').val();
            if (typeof editedUserLong !== "undefined" && editedUserLat !== "undefined") {
                if (editedUserLong != '' && editedUserLat !== '') {
                    add_events_display_message('warning', 'GPS of the adress is incorrect');
                }
            } else {
                add_events_display_message('warning', 'GPS of the adress is incorrect');
            }
        }
    }


    jQuery("#public_attendees_demande").click(function () {
        add_user_attendee();
    });

    jQuery("#public_followers_demande").click(function () {
        add_user_followers();
    });

    function add_user_attendee() {
        var event_id = jQuery("#event_id").val();
        var data = {"event_id": event_id};
        data = jQuery(this).serialize() + "&" + jQuery.param(data);
        jQuery.ajax({
            type: "POST",
            dataType: "json",
            url: "?q=api/events/attendees/demande",
            data: data,
            success: function (data) {
                if (data.result == "ok") {
                    if (data.already_registered.toString() === 'false') {
                        add_events_display_message('status', 'new registred');
                        var persons_attendee_number = jQuery("#persons_attendee_number").html();
                        var persons_attendee_number_to_int = parseInt(persons_attendee_number);
                        var new_persons_attendee_number = persons_attendee_number_to_int + 1;
                        jQuery("#persons_attendee_number").html(new_persons_attendee_number);
                    } else {
                        add_events_display_message('status', 'Already registered');
                    }
                }
                if (data.result == "ko") {
                    add_events_display_message('error', 'You have Error in registration contact admin');
                }
            }
        });
        return false;
    }

    function add_user_followers() {
        var event_id = jQuery("#event_id").val();
        var data = {"event_id": event_id};
        data = jQuery(this).serialize() + "&" + jQuery.param(data);
        jQuery.ajax({
            type: "POST",
            dataType: "json",
            url: "?q=api/events/followers/demande",
            data: data,
            success: function (data) {
                if (data.result == "ok") {
                    if (data.already_registered.toString() === 'false') {
                        add_events_display_message('status', 'Thank you for your following');
                        var persons_follower_number = jQuery("#persons_follower_number").html();
                        var persons_follower_number_to_int = parseInt(persons_follower_number);
                        var new_persons_follower_number = persons_follower_number_to_int + 1;
                        jQuery("#persons_follower_number").html(new_persons_follower_number);
                    } else {
                        add_events_display_message('status', 'You are already following this event');
                    }
                }
                if (data.result == "ko") {
                    add_events_display_message('error', 'You have Error in registration contact admin');
                }
            }
        });
        return false;
    }

    jQuery("#admin_attendees_demande").click(function () {
        add_events_display_message('status', 'You are the admin');
    });

    jQuery("#admin_followers_demande").click(function () {
        add_events_display_message('status', 'You are the admin');
    });

    var connected_user_is_attendee = jQuery("#connected_user_is_attendee").val();
    if (typeof connected_user_is_attendee !== "undefined") {
        var event_id = jQuery("#event_id").val();
        var data = {"event_id": event_id, "val": 'attendee'};
        data = jQuery(this).serialize() + "&" + jQuery.param(data);
        jQuery.ajax({
            type: "POST",
            dataType: "json",
            url: "?q=api/events/current/user/itis",
            data: data,
            success: function (data) {
                if (data.result == "ok") {
                    jQuery("#connected_user_is_attendee").checkbox({checked: true});
                }
            }
        });
    }

    var connected_user_is_followers = jQuery("#connected_user_is_followers").val();
    if (typeof connected_user_is_followers !== "undefined") {
        var event_id = jQuery("#event_id").val();
        var data = {"event_id": event_id, "val": 'followers'};
        data = jQuery(this).serialize() + "&" + jQuery.param(data);
        jQuery.ajax({
            type: "POST",
            dataType: "json",
            url: "?q=api/events/current/user/itis",
            data: data,
            success: function (data) {
                if (data.result == "ok") {
                    jQuery("#connected_user_is_followers").checkbox({checked: true});
                }
            }
        });
    }

    jQuery("#connected_user_is_attendee").change(function () {
        var connected_user_is_attendee_checked_val = jQuery("#connected_user_is_attendee").is(':checked');
        if (connected_user_is_attendee_checked_val.toString() === 'true') {
            add_user_attendee();
        } else {
            add_user_not_attendee();
        }
    });

    jQuery("#connected_user_is_followers").change(function () {
        var connected_user_is_followers_checked_val = jQuery("#connected_user_is_followers").is(':checked');
        if (connected_user_is_followers_checked_val.toString() === 'true') {
            add_user_followers();
        } else {
            add_user_not_followers();
        }
    });

    function add_user_not_attendee() {
        var event_id = jQuery("#event_id").val();
        var persons_attendee_number = jQuery("#persons_attendee_number").html();
        var persons_attendee_number_to_int = parseInt(persons_attendee_number);
        var data = {"event_id": event_id, "val": 'attendee'};
        data = jQuery(this).serialize() + "&" + jQuery.param(data);
        jQuery.ajax({
            type: "POST",
            dataType: "json",
            url: "?q=api/events/current/user/isnot",
            data: data,
            success: function (data) {
                if (data.result.toString() === "ok") {
                    add_events_display_message('status', 'Attendee canceled');
                    var new_persons_attendee_number_to_int = persons_attendee_number_to_int - 1;
                    if (new_persons_attendee_number_to_int >= 0) {
                        jQuery("#persons_attendee_number").html(new_persons_attendee_number_to_int);
                    }
                }
            }
        });
    }

    function add_user_not_followers() {
        var event_id = jQuery("#event_id").val();
        var persons_follower_number = jQuery("#persons_follower_number").html();
        var persons_follower_number_to_int = parseInt(persons_follower_number);
        var data = {"event_id": event_id, "val": 'followers'};
        data = jQuery(this).serialize() + "&" + jQuery.param(data);
        jQuery.ajax({
            type: "POST",
            dataType: "json",
            url: "?q=api/events/current/user/isnot",
            data: data,
            success: function (data) {
                if (data.result.toString() === "ok") {
                    add_events_display_message('status', 'Followers canceled');
                    var new_persons_follower_number_to_int = persons_follower_number_to_int - 1;
                    if (new_persons_follower_number_to_int >= 0) {
                        jQuery("#persons_follower_number").html(new_persons_follower_number_to_int);
                    }
                }
            }
        });
    }
});

