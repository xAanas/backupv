<div id='compteur'></div>
<div id='map'></div>
<div id='mapdiv'></div>
<div id='list'></div>
<h3>Veuillez choisir un filtre : </h3>
<div align="right">
<button id="cite">Cité</button>
<button id="ville">Ville</button>
<button id="pays">Pays</button>
</div>
<div id="accordion">
    
</div>
<script src="https://code.jquery.com/jquery-1.12.4.js"></script>
<script src="http://www.openlayers.org/api/OpenLayers.js"></script>
<script src="https://code.jquery.com/ui/1.12.0/jquery-ui.js"></script>
<script>

  jQuery(function () {
    
      var vectorSource = new ol.source.Vector({
          // empty vector
      })
    

//create the style
      var iconStyle = new ol.style.Style({
          image: new ol.style.Icon(/**@type {olx.style.IconOptions}*/({
              anchor: [0.5, 46],
              anchorXUnits: 'fraction',
              anchorYUnits: 'pixels',
              opacity: 0.75,
              src: 'http://mapping.referata.com/w/images/Blue_marker.png'
          }))
      });

// and apply a style to whole layer
      var vectorLayer = new ol.layer.Vector({
          source: vectorSource
          //style: iconStyle
      });


      jQuery.ajax({
          url: '/?q=maptaftajson',
          success: function (response) {
              var i, lat, lon, geom, feature, features = [], style, rnd;
              console.log(response);
              //var response = JSON.parse(response);
              //console.log(toto);
              var jsonlen = response.length;
              
              // a loop that handles each feature
              for (let cid of response.rowCid){
                  jQuery('#accordion').append('<h3>'+ response.rowNomLieu[cid] +'</h3><div>adresse : '+ response.rowAdresse[cid]+'<br/> description : '+ response.rowDescription[cid]+'</div>');
                  lat = parseFloat(response.rowLatitudes[cid]);
                  lon = parseFloat(response.rowLongitudes[cid]);


                  geom = new ol.geom.Point(
                          ol.proj.transform([lon, lat], 'EPSG:4326', 'EPSG:3857')
                          );

                  //feature = new ol.Feature(geom);
                  feature = new ol.Feature(geom,
                  {description : "response.rowAdresse[cid]"},
                  {externalGraphic: 'http://mapping.referata.com/w/images/Blue_marker.png', graphicHeight: 25, graphicWidth: 21, graphicXOffset:-12, graphicYOffset:-25  }
                  );
                  features.push(feature);
                  rnd = Math.random();
                  style = [
                      new ol.style.Style({
                          text: new ol.style.Text({
                              text: '\uf041',
                              font: 'normal 18px FontAwesome',
                              textBaseline: 'Bottom',
                              fill: new ol.style.Fill({
                                  color: 'red',
                              })
                          })
                      })
                  ];

                  feature.setStyle(style);
                  feature.on("click", function () {
                      alert("featureeee");
                  });



              }

              var vectorSource = new ol.source.Vector({
                  features: features
              });

              var vectorLayer = new ol.layer.Vector({
                  source: vectorSource
              });

              // Maps
              var map = new ol.Map({
                  target: 'map', // The DOM element that will contains the map
                  renderer: 'canvas', // Force the renderer to be used
                  layers: [
                      // Add a new Tile layer getting tiles from OpenStreetMap source
                      new ol.layer.Tile({
                          source: new ol.source.OSM()
                      }),
                      vectorLayer
                  ],
                  // Create a view centered on the specified location and zoom level
                  view: new ol.View({
                      center: ol.proj.transform([2.229, 48.807], 'EPSG:4326', 'EPSG:3857'),
                      zoom: 5
                  }),
                  interactions: ol.interaction.defaults().extend([
                      new ol.interaction.DragRotateAndZoom()
                  ])
              });

              jQuery('#compteur').append('<h2> Vous êtes ' + response.compteur + ' à nous soutenir !</h2>');

              
              
              $('#accordion').accordion();
          }
      });
      $('#cite').on('click',function(){
        jQuery.ajax({
          url: '/?q=filtercite',
          success: function (response) {
            console.log(response);
            $('#accordion').empty();
            $.each(response.rowCityCid,function( index, values ) {
              var ville = index;
              var title = $('<h3>'+ index +'</h3><div id="'+index+'"></div>');
              jQuery('#accordion').append(title);
              $.each(values,function( index, value ) {  
                  jQuery('#'+ville).append('Nom du lieu : '+response.rowNomLieu[value]+ '<br/>adresse : '+ response.rowAdresse[value]+'<br/> description : '+ response.rowDescription[value]+'<br/><hr>');
                });  
            });
                
            
            $('#accordion').accordion();
          }
        });  
      });
      $('#ville').on('click',function(){
        jQuery.ajax({
          url: '/?q=filteretat',
          success: function (response) {
            console.log(response);
            $('#accordion').empty();
            $.each(response.rowCityCid,function( index, values ) {
              var ville = index;
              var title = $('<h3>'+ index +'</h3><div id="'+index+'"></div>');
              jQuery('#accordion').append(title);
              $.each(values,function( index, value ) {  
                  jQuery('#'+ville).append('Nom du lieu : '+response.rowNomLieu[value]+ '<br/>adresse : '+ response.rowAdresse[value]+'<br/> description : '+ response.rowDescription[value]+'<br/><hr>');
                });  
            });
                
            
            $('#accordion').accordion();
          }
        });  
      });
      $('#pays').on('click',function(){
        jQuery.ajax({
          url: '/?q=filterpays',
          success: function (response) {
            console.log(response);
            $('#accordion').empty();
            $.each(response.rowCityCid,function( index, values ) {
              var ville = index;
              ville = ville.replace(/ /g,"");
              var title = $('<h3>'+ index +'</h3><div id="'+ville+'"></div>');
              jQuery('#accordion').append(title);
              $.each(values,function( index, value ) { 
                  jQuery('#'+ville).append('Nom du lieu : '+response.rowNomLieu[value]+ '<br/>adresse : '+ response.rowAdresse[value]+'<br/> description : '+ response.rowDescription[value]+'<br/><hr>');
                });  
            });
                
            
            $('#accordion').accordion();
          }
        });  
      });
  });
</script>



