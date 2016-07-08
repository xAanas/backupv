<div id='map'></div>
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
    source: vectorSource,
    style: iconStyle
});


jQuery.ajax({
    url:'/?q=mapjson', 
    success:function(response){
            var i, lat, lon, geom, feature, features = [], style, rnd;

            //var response = JSON.parse(response);
            //console.log(toto);
            var jsonlen = response.length;
            
            // a loop that handles each feature
            for (var i=0; i<jsonlen; i++){
                lat = parseFloat(response[i].latitude);
                lon = parseFloat(response[i].longitude);
                
                
                 geom = new ol.geom.Point(
                    ol.proj.transform([lon, lat], 'EPSG:4326', 'EPSG:3857')
                );

                feature = new ol.Feature(geom);
                features.push(feature);
                
                rnd = Math.random();
                style = [
                    new ol.style.Style({
                        text: new ol.style.Text({
                          text: '\uf041',
                          font: 'normal 18px FontAwesome',
                          textBaseline: 'Bottom',
                          fill: new ol.style.Fill({
                            color: 'blue',
                          })
                        })
                      })
                ];

                feature.setStyle(style);
                
                
                
                
              }
              
            var vectorSource = new ol.source.Vector({
                features: features
            });

            var vectorLayer = new ol.layer.Vector({
                source: vectorSource
            });

            // Maps
            var map = new ol.Map({
                target: 'map',  // The DOM element that will contains the map
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
              
              
            }
          });
      
  
});
</script>



