<div id='compteur'></div>
<div style='width:890px!important;height:500px!important;display: block!important;'>
<div id='mapdiv' style='width:890px!important;height:500px!important;display: block!important;'></div>
</div>
<div id='list'></div>
<h3>Veuillez choisir un filtre : </h3>
<div align="right">
<button id="cite">Cité</button>
<button id="ville">Ville</button>
<button id="pays">Pays</button>
</div>

<div id="accordioncontainer">
<div id="accordion">
</div>
    
</div>
<!--<script src="http://www.openlayers.org/api/OpenLayers.js"></script>-->
<script src="OpenLayers.js"></script>
<script src="https://code.jquery.com/jquery-1.12.4.js"></script>
<script src="https://code.jquery.com/ui/1.12.0/jquery-ui.js"></script>
<script>

  jQuery(function () {
    jQuery.ajax({
          url: '/?q=maptaftajson',
          success: function (response) {
    var i, lat, lon, geom, feature, features = [], style, rnd;
    console.log(response);
     map = new OpenLayers.Map("mapdiv");
    map.addLayer(new OpenLayers.Layer.OSM());
    
    epsg4326 =  new OpenLayers.Projection("EPSG:4326"); //WGS 1984 projection
    projectTo = map.getProjectionObject(); //The map projection (Spherical Mercator)
   
    var lonLat = new OpenLayers.LonLat( 2.229 ,48.807 ).transform(epsg4326, projectTo);
          
    
    var zoom=5;
    map.setCenter (lonLat, zoom);

    var vectorLayer = new OpenLayers.Layer.Vector("Overlay");
    
    // Define markers as "features" of the vector layer:
    for (let cid of response.rowCid){
                  jQuery('#accordion').append('<h3>'+ response.rowNomLieu[cid] +'</h3><div>adresse : '+ response.rowAdresse[cid]+'<br/> description : '+ response.rowDescription[cid]+'</div>');
                  lat = parseFloat(response.rowLatitudes[cid]);
                  lon = parseFloat(response.rowLongitudes[cid]);
    var feature = new OpenLayers.Feature.Vector(
             new OpenLayers.Geometry.Point( lon, lat ).transform(epsg4326, projectTo),
            {description:'Nom : '+response.rowNomLieu[cid]+'<br/> Description : '+response.rowDescription[cid]} ,
            {externalGraphic: 'http://mapping.referata.com/w/images/Blue_marker.png', graphicHeight: 25, graphicWidth: 21, graphicXOffset:-12, graphicYOffset:-25  }
        );   
    vectorLayer.addFeatures(feature);
  }
    

   
    map.addLayer(vectorLayer);
 
    
    //Add a selector control to the vectorLayer with popup functions
    var controls = {
      selector: new OpenLayers.Control.SelectFeature(vectorLayer, { onSelect: createPopup, onUnselect: destroyPopup })
    };

    function createPopup(feature) {
      feature.popup = new OpenLayers.Popup.FramedCloud("pop",
          feature.geometry.getBounds().getCenterLonLat(),
          null,
          '<div class="markerContent">'+feature.attributes.description+'</div>',
          null,
          true,
          function() { controls['selector'].unselectAll(); }
      );
      //feature.popup.closeOnMove = true;
      map.addPopup(feature.popup);
    }

    function destroyPopup(feature) {
      feature.popup.destroy();
      feature.popup = null;
    }
    
    map.addControl(controls['selector']);
    controls['selector'].activate();
    
    
            jQuery('#compteur').append('<h2> Vous êtes ' + response.compteur + ' à nous soutenir !</h2>');
            jQuery('#accordion').accordion();
          }
        });
        
      // filters
      jQuery('#cite').on('click',function(){
        jQuery.ajax({
          url: '/?q=filtercite',
          success: function (response) {
            console.log(response);
            
            jQuery('#accordioncontainer').empty();
            jQuery('#accordioncontainer').append("<div id='accordion'></div>");
            jQuery.each(response.rowCityCid,function( index, values ) {
              var ville = index;
              var title = jQuery('<h3>'+ index +'</h3><div id="'+index+'"></div>');
              jQuery('#accordion').append(title);
              jQuery.each(values,function( index, value ) {  
                  jQuery('#'+ville).append('Nom du lieu : '+response.rowNomLieu[value]+ '<br/>adresse : '+ response.rowAdresse[value]+'<br/> description : '+ response.rowDescription[value]+'<br/><hr>');
                });  
            });
                
            jQuery('#accordion').accordion();
          }
        });  
      });
      
      jQuery('#ville').on('click',function(){
        jQuery.ajax({
          url: '/?q=filteretat',
          success: function (response) {
            console.log(response);
            jQuery('#accordioncontainer').empty();
            jQuery('#accordioncontainer').append("<div id='accordion'></div>");
            jQuery.each(response.rowCityCid,function( index, values ) {
              var ville = index;
              var title = jQuery('<h3>'+ index +'</h3><div id="'+index+'"></div>');
              jQuery('#accordion').append(title);
              jQuery.each(values,function( index, value ) {  
                  jQuery('#'+ville).append('Nom du lieu : '+response.rowNomLieu[value]+ '<br/>adresse : '+ response.rowAdresse[value]+'<br/> description : '+ response.rowDescription[value]+'<br/><hr>');
                });  
            });
                
            
            jQuery('#accordion').accordion();
          }
        });  
      });
      
      jQuery('#pays').on('click',function(){
        jQuery.ajax({
          url: '/?q=filterpays',
          success: function (response) {
            console.log(response);
            jQuery('#accordioncontainer').empty();
            jQuery('#accordioncontainer').append("<div id='accordion'></div>");
            jQuery.each(response.rowCityCid,function( index, values ) {
              var ville = index;
              ville = ville.replace(/ /g,"");
              var title = jQuery('<h3>'+ index +'</h3><div id="'+ville+'"></div>');
              jQuery('#accordion').append(title);
              jQuery.each(values,function( index, value ) { 
                  jQuery('#'+ville).append('Nom du lieu : '+response.rowNomLieu[value]+ '<br/>adresse : '+ response.rowAdresse[value]+'<br/> description : '+ response.rowDescription[value]+'<br/><hr>');
                });  
            });
                
            
            jQuery('#accordion').accordion();
          }
        });  
      });
  });
</script>



