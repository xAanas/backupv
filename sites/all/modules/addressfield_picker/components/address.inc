<?php

function _webform_defaults_address() {
  return array(
    'name' => '',
    'form_key' => NULL,
    'pid' => 0,
    'weight' => 0,
    'value' => '',
    'mandatory' => 0,
    'extra' => array(
      'default_country' => '',
      'csv_separate' => '',
      'field_placename'=>'',
      'field_street'=>'',
      'field_postalcode'=>'',
      'field_city'=>'',
      'field_longitude'=>'',
      'field_lattitude'=>'',
      'field_country'=>'',
      'field_fieldset'=>''
    ),
  );
}

function _webform_theme_address() {
  return array(
    'webform_display_address' => array(
      'render element' => 'element',
    ),
  );
}

function _webform_edit_address($component) {
  print_r($component);
  $form = array();
  $counties = _addressfield_picker_countries();
  $form['extra']['default_country'] = array(
    '#type' => 'select',
    '#title' => t('Default Country'),
    '#default_value' => 'FR',
    '#required' => FALSE,
    '#options'=>$counties,
    '#description' => t('Default country, if set map will be centered on'),
  );
  $form['extra']['csv_separate'] = array(
    '#type' => 'radios',
    '#title' => t('CSV download'),
    '#description' => t('How would you like addresses presented in CSV downloads?'),
    '#options' => array(
      0 => t('Display entire address in a single column'),
      1 => t('Display each address component in a separate column'),
    ),
    '#default_value' => $component['extra']['csv_separate'],
  );
  return $form;
}


function _webform_render_address($component, $value = NULL, $filter = TRUE) {
  
  $path = drupal_get_path('module', 'addressfield_picker');
  $link = $GLOBALS['base_url'] . '/' . $path;
  drupal_add_js($link . '/js/countries.js', 'external');
  drupal_add_js($link . '/js/jquery.mockjax.js', 'external');
  drupal_add_js($link . '/js/jquery.autocomplete.js', 'external');
  drupal_add_js($link . '/js/jquery.webui-popover.min.js', 'external');
  drupal_add_js($link . '/bower_components/mapbox.js/mapbox.js', 'external');
  
  drupal_add_css($path . '/css/autocomplete.css', array('group' => CSS_DEFAULT, 'every_page' => TRUE));
  drupal_add_css($path . '/css/jquery.webui-popover.min.css', array('group' => CSS_DEFAULT, 'every_page' => TRUE));
  drupal_add_css($path . '/bower_components/mapbox.js/mapbox.css', array('group' => CSS_DEFAULT, 'every_page' => TRUE));
  
  $node = isset($component['nid']) ? node_load($component['nid']) : NULL;
  $counties = _addressfield_picker_countries();
  $element = array();
  
  
  

   $element['field_display'] = array(
    '#type' => 'textfield',
    '#title' => t('Address'),
    '#default_value' => "",
    //'#size' => 20,
    '#required' => FALSE,
    //'#maxlength' => 255,
    '#weight' => 1,
    '#description' => t('Address'),
    '#prefix'           => '<label for="form-item-submitted-addrissa">Adresse postale</label><div class="form-item form-type-textfield form-item-submitted- form-item-submitted-addrissa'.$component['form_key'].'-field-display" style="display:inline!important"><span style="display:inline!important">',
    '#theme_wrappers'   => array(),
    '#suffix'           => '<button id="form-item-submitted-'.$component['form_key'].'-field-display-btn" style="display:inline!important"><i class="fa fa-map-marker"></i></button></span>
                                <div id="'.$component['form_key'].'-mypopin" style="display:none;">
                                        <div id="'.$component['form_key'].'-mymap" style="width:400px;height:400px"></div>
                                        <p><strong>Help</strong>:
                                        move <img style="margin:0px;padding:0px;" src="'.$link . '/img/pointer.png'.'"/> or double click to pick a place in the map <small>(v1.0)</small></p>
                                        
                                </div>
                                </div>',
  );
  
  $element['field_country'] = array(
    '#type' => 'hidden',
    '#title' => t('Country'),
    '#size' => 60,
    '#required' => FALSE,
    '#maxlength' => 255,
    '#weight' => 1.1,
    '#description' => t('Country'),
  );
  $element['field_street'] = array(
    '#type' => 'hidden',
    '#title' => t('Street'),
    '#size' => 60,
    '#required' => FALSE,
    '#maxlength' => 255,
    '#weight' => 1.1,
    '#description' => t('Street'),
  );
  $element['field_city'] = array(
    '#type' => 'hidden',
    '#title' => t('City'),
    '#default_value' => $component['extra']['field_city'],
    '#size' => 60,
    '#required' => FALSE,
    '#maxlength' => 255,
    '#weight' => 1.1,
    //'#parents' => array('extra', 'field_fieldset'),
    '#description' => t('City'),
  );
   
   $element['field_postalcode'] = array(
    '#type' => 'hidden',
    '#title' => t('Postal Code'),
    '#default_value' => $component['extra']['field_postalcode'],
    '#size' => 60,
    '#required' => FALSE,
    '#maxlength' => 255,
    '#weight' => 1.2,
    //'#parents' => array('extra', 'field_fieldset'),
    '#description' => t('Postal Code'),
  );
  
   $element['field_placename'] = array(
    '#type' => 'hidden',
    '#title' => t('Place Name'),
    '#size' => 60,
    '#required' => FALSE,
    '#maxlength' => 255,
    '#weight' => 1.1,
    '#description' => t('Place Name'),
  );
   
  $element['field_longitude'] = array(
    '#type' => 'hidden',
    '#title' => t('Longitude'),
    '#default_value' => $component['extra']['field_longitude'],
    '#size' => 60,
    '#required' => FALSE,
    '#maxlength' => 255,
    '#weight' => 1.1,
  //  '#parents' => array('extra', 'field_fieldset'),
    '#description' => t('Longitude'),
  );
  $element['field_lattitude'] = array(
    '#type' => 'hidden',
    '#title' => t('Lattitude'),
    '#default_value' => $component['extra']['field_lattitude'],
    '#size' => 60,
    '#required' => FALSE,
    '#maxlength' => 255,
    '#weight' => 1.1,
   // '#parents' => array('extra', 'field_fieldset'),
    '#description' => t('Lattitude'),
  );
   $element['field_housenumber'] = array(
    '#type' => 'hidden',
    '#title' => t('Housenumber'),
    '#size' => 60,
    '#required' => FALSE,
    '#maxlength' => 255,
    '#weight' => 1.1,
   // '#parents' => array('extra', 'field_fieldset'),
    '#description' => t('Housenumber'),
  );
   $element['field_state'] = array(
    '#type' => 'hidden',
    '#title' => t('State'),
    '#size' => 60,
    '#required' => FALSE,
    '#maxlength' => 255,
    '#weight' => 1.1,
    '#description' => t('State'),
  );
  
  
  drupal_add_js('
  jQuery(document).ready(function(){
  
  jQuery("input[type=text][name=\'submitted['.$component['form_key'].'][field_display]\'").autocomplete({
        serviceUrl: "http://photon.komoot.de/api/?lang=fr",
        paramName: "q",
        onSelect: function (suggestion) {
            if (typeof connected_user_is_attendee !== "undefined") {
                var cp = suggestion.obj.postcode.split(";");
                var cp_val = cp[0];
            } else {
                cp_val = null;
            }
            console.log (suggestion.obj);
            jQuery("input[type=hidden][name=\'submitted['.$component['form_key'].'][field_street]\'").val(suggestion.obj.street);
            jQuery("input[type=hidden][name=\'submitted['.$component['form_key'].'][field_placename]\'").val(suggestion.obj.name);
            jQuery("input[type=hidden][name=\'submitted['.$component['form_key'].'][field_postalcode]\'").val(suggestion.obj.postcode);
            jQuery("input[type=hidden][name=\'submitted['.$component['form_key'].'][field_city]\'").val(suggestion.obj.city);
            jQuery("input[type=hidden][name=\'submitted['.$component['form_key'].'][field_country]\'").val(suggestion.obj.country);
            jQuery("input[type=hidden][name=\'submitted['.$component['form_key'].'][field_housenumber]\'").val(suggestion.obj.housenumber);
            jQuery("input[type=hidden][name=\'submitted['.$component['form_key'].'][field_state]\'").val(suggestion.obj.state);
            jQuery("input[type=hidden][name=\'submitted['.$component['form_key'].'][field_longitude]\'").val(suggestion.geo.coordinates[0]);
            jQuery("input[type=hidden][name=\'submitted['.$component['form_key'].'][field_lattitude]\'").val(suggestion.geo.coordinates[1]);
            var mlong = suggestion.geo.coordinates[0];
            var mlat = suggestion.geo.coordinates[1];
            //setMapTag(mlong, mlat, suggestion.obj.osm_value);
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
                console.log("transformResult:false");
                return false;

            }


            jQuery.each(data.features, function (key, value) {
                console.log("transformResult:items");
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
    
    
    jQuery("#form-item-submitted-'.$component['form_key'].'-field-display-btn").webuiPopover({
                        title:"'.t('Map Selector').'",
                        closeable:true, 
                        //width:600, 
                        //height:600, 
                        url:"#'.$component['form_key'].'-mypopin",
                        onShow:onpopshow
                        });
    
    WebuiPopovers.hideAll();
    
    /*
    jQuery("#form-item-submitted-'.$component['form_key'].'-field-display-btn").on("click",function(e){
       
       e.preventDefault();
       e.stopPropagation(); 
       WebuiPopovers.show("#'.$component['form_key'].'-mypopin");
       console.log("hiiii");
    });
    */

    var myLastZoom = null;
    /**carte **/
    if (typeof L === "object") { /* resolution confli avec  */
        L.mapbox.accessToken = "pk.eyJ1IjoiYWRuYW5lIiwiYSI6InMzQTJyeHcifQ.RSgsPIjWzbpBKErEIeyGWw";
        var map = L.mapbox.map("'.$component['form_key'].'-mymap", "adnane.lkkh5jee")
                .setView([48.866577999228674, 2.364656925201416], 10);

        var marker = L.marker(new L.LatLng(48.866577999228674, 2.364656925201416), {
            icon: L.mapbox.marker.icon({
                "marker-color": "ff8888",
                "marker-borderTopRightRadius": "0px !important"
                        /* "border-bottom-left-radius": "0px" */
            }),
            draggable: true
        });



        marker.bindPopup("This marker is draggable! Move it around.");
        marker.addTo(map);

        map.on("click", function (e) {
            //map.panTo(e.layer.getLatLng());
            //m.panTo(e.latlng);
            marker.setLatLng(e.latlng);
            ondragend();
            //window[e.type].innerHTML = e.containerPoint.toString() + ", " + e.latlng.toString();            
        });



        marker.on("dragend", ondragend);

        // Set the initial marker coordinate on load.


        function ondragend() {
            var m = marker.getLatLng();
            jQuery("input[type=hidden][name=\'submitted['.$component['form_key'].'][field_longitude]\'").val(m.lat);
            jQuery("input[type=hidden][name=\'submitted['.$component['form_key'].'][field_longitude]\'").val(m.lng);
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
                     jQuery("input[type=hidden][name=\'submitted['.$component['form_key'].'][field_street]\'").val(msg.address.road);
                     jQuery("input[type=hidden][name=\'submitted['.$component['form_key'].'][field_placename]\'").val("");
                     jQuery("input[type=hidden][name=\'submitted['.$component['form_key'].'][field_postalcode]\'").val(msg.address.postcode);
                     jQuery("input[type=hidden][name=\'submitted['.$component['form_key'].'][field_city]\'").val(msg.address.county);
                     jQuery("input[type=hidden][name=\'submitted['.$component['form_key'].'][field_country]\'").val(msg.address.country);
                     jQuery("input[type=hidden][name=\'submitted['.$component['form_key'].'][field_housenumber]\'").val(msg.address.house_number);
                     jQuery("input[type=hidden][name=\'submitted['.$component['form_key'].'][field_state]\'").val(msg.address.state);
                     jQuery("input[type=hidden][name=\'submitted['.$component['form_key'].'][field_longitude]\'").val(msg.lon);
                     jQuery("input[type=hidden][name=\'submitted['.$component['form_key'].'][field_lattitude]\'").val(msg.lat);
                     jQuery("input[type=text][name=\'submitted['.$component['form_key'].'][field_display]\'").val(msg.display_name);
                    
                } else {
                    jQuery("#addressname").val("(" + data.lat + "," + data.lon + ")");
                }
            });
        }

       //ondragend();
        
        
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
                    jQuery("input[type=hidden][name=\'submitted['.$component['form_key'].'][field_longitude]\'").val(mlongFloatVal);
                    jQuery("input[type=hidden][name=\'submitted['.$component['form_key'].'][field_lattitude]\'").val(mlatFloatVal);

                } else {
                    var editedUserLong = jQuery("input[type=hidden][name=\'submitted['.$component['form_key'].'][field_longitude]\'").val();
                    var editedUserLat = jQuery("input[type=hidden][name=\'submitted['.$component['form_key'].'][field_lattitude]\'").val();
                    if (typeof editedUserLong !== "undefined" && editedUserLat !== "undefined") {
                        if (editedUserLong != "" && editedUserLat !== "") {
                            alert("warning", "GPS of the adress is incorrect");
                        }
                    } else {
                        alert("warning", "GPS of the adress is incorrect");
                    }
                }
       }
        
        function onpopshow() {
            map._onResize(); 
            var mlong = parseFloat(jQuery("input[type=hidden][name=\'submitted['.$component['form_key'].'][field_longitude]\'").val());
            var mlat = parseFloat(jQuery("input[type=hidden][name=\'submitted['.$component['form_key'].'][field_lattitude]\'").val());
             
            setMapTag(mlong, mlat, null);
        }

        jQuery("#mymap2").on("click", function () {
        	  jQuery("#street").val(jQuery("#mylong").val() + "/" + jQuery("#mylat").val());
              //jQuery("#placename").val();
              //jQuery("#codepostal").val();
              //jQuery("#city").val();
              //jQuery("#country").val();
              jQuery("#long").val(jQuery("#mylong").val());
              jQuery("#lat").val(jQuery("#mylat").val());
             
        });
        
        jQuery("#acceptcoord").on("click", function () {
            //jQuery("#addressname").val(jQuery("#mylong").val()+"/"+jQuery("#mylat").val());
            jQuery("#street").val(jQuery("#mylong").val() + "/" + jQuery("#mylat").val());
            //jQuery("#placename").val();
            //jQuery("#codepostal").val();
            //jQuery("#city").val();
            //jQuery("#country").val();
            jQuery("#long").val(jQuery("#mylong").val());
            jQuery("#lat").val(jQuery("#mylat").val());
            jQuery("#addressbutton").popover("hide");
        });
        

    }else{
        console.log("non L");
    }
    
    
    
    
    
    })',array('type' => 'inline', 'scope' => 'footer', 'weight' => 5));
  return $element;
}


function _webform_display_address($component, $value, $format = 'html') {
  return array(
    '#title' => t('Address'),
    '#weight' => $component['weight'],
    '#theme' => 'webform_display_address',
    '#theme_wrappers' => $format == 'html' ? array('webform_element') : array('webform_element_text'),
    '#format' => $format,
    '#value' => json_encode($value),
    '#translatable' => array('title'),
  );
}

function theme_webform_display_address($variables) {
  $element = $variables['element'];
  $value = $element['#value'];
  return trim($value) !== '' ? $value : ' ';
}

function _webform_table_address($component, $value) {
  return check_plain(empty($value[0]) ? '' : $value[0]);
}

function _webform_csv_headers_address($component, $export_options) {
  $header = array();
  $header[0] = '';
  $header[1] = $component['extra']['field_prefix'];
  $header[2] = $component['extra']['field_suffix'];
  return $header;
}

function _webform_csv_data_address($component, $export_options, $value) {
  return !isset($value[0]) ? '' : $value[0];
}
?>
