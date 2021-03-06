var devices=[];
var markers = [];
var infowindow = [];

var map;

// Calls from app.component.ts
function myMap() {
  // Execute only if url is only these , to avoid unneccessary loading of map
  if(window.location.href=='http://localhost:4200/#/' ||window.location.href=='http://swajal.in/iiot/#/'||window.location.href=='https://swajal.in/iiot/#/' ){
    getLocation();
    // set the center of map, position it will show the map for first time
    var myCenter = new google.maps.LatLng(28.7041,77.1025);
    var mapCanvas = document.getElementById("map");
    var mapOptions = {center: myCenter, zoom: 5,
      mapTypeControl: true,
      mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU}
    };
    // creates map 
    map = new google.maps.Map(mapCanvas, mapOptions);
    
    setTimeout(()=>{
      var i=0
      var previousCluster='';
      var currentCluster;
      var temp=-1;
      var html='';
      // for each device set markers on map
      for( var device of devices){
        // set only those markers which user is privledged
        if(JSON.parse(sessionStorage.user)[device.Cluster_Name]==1){
          var lat = lanAndlon(parseInt(device.Latitude));
          var lon = lanAndlon(parseInt(device.Longitude));
          var address = '\"'+device.Location+'\"';
          var id = '\"'+ device.DeviceID+'\"';
          var cluster = '\"'+ device.Cluster_Name+'\"';
          var machineNo = '\"'+ device.MachineNo+'\"';
          var deviceLoc = new google.maps.LatLng(lat,lon);
          currentCluster = device.Cluster_Name;
          // Cluster's in the dropdown
          if(currentCluster!=previousCluster){
            temp=temp+1;
            previousCluster=currentCluster;            
            html=html+'<li><button class="btn" onclick="opacity('+"\'"+ currentCluster+"\'"+','+temp+')"style="width:100%;background:white;padding:1px">'+currentCluster+'</button></li>';
          }
          // type of marker to be embedded
          markers.push(new google.maps.Marker({position:deviceLoc,id:i,cluster:device.Cluster_Name,icon:'https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=•|'+iconSrc[temp%10]}));
          markers[markers.length-1].setMap(map);
          // content to show in the marker
          infowindow.push(new google.maps.InfoWindow({
                content: "Decive Location: <b><span style = \"display: flex; justify-content: center; font-size:15px;\">"+device.Location+" ("+device.Cluster_Name+
                ")</span><br></b>DeviceID: <b><span style = \"display: flex; justify-content: center; font-size:15px; color:#999\">  "+device.DeviceID+
                "</span></b><br><span style = \"display: flex; justify-content: center; font-size:15px;\"><button type='button' onclick='redirect("+id+","+address+","+cluster+","+machineNo+
                ")'>Analyse</button></span>"
          }));
          // if user clicks on marker other markers closed and the clicked one opened
          google.maps.event.addListener(markers[markers.length-1],'click',function() {
            for(var marker of markers){
              infowindow[marker.id].close(map,markers[marker.id]);
            }
            infowindow[this.id].open(map,markers[this.id]);
          });
          i=i+1;
        }
     
      }
  
      // creates a div for  Filter By Cluster Button on map
      var centerControlDiv = document.createElement('div');
      //set it on map
      var centerControl = new CenterControl(centerControlDiv, map,html);
      centerControlDiv.index = 1;
      // position of button on map
      map.controls[google.maps.ControlPosition.TOP_RIGHT].push(centerControlDiv);
      searchBar();
  
    },2500)
  
  }
 
}
// Redirect the page according to the selected id  , calls on click of marker 
function redirect(id,address,cluster,machineNo){
  document.cookie="location="+address+"; path=/";
  document.cookie="cluster="+cluster+"; path=/";
  document.cookie="id="+id+"; path=/"; 
  document.cookie="machineNo="+machineNo+"; path=/"
  window.location.href= window.location.href + cluster+'/'+id+'/WaterDispenser'
}
// Removes other markers when filter by cluster
function opacity(cluster,temp){
  for(var marker of markers){
    if(cluster!=marker.cluster){   
      marker.setMap(null); // removes marker from map
    }
    else{
      marker.setMap(map); // set markers of that particular cluster on map
    }
  }
}
// Request all the machines from Device_Data table
function getLocation(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
      // if response status is 200 , parse text into json
      if(this.readyState==4 && this.status ==200){
        devices=JSON.parse(this.responseText);
      }	
    } 
    // xhttp.open("POST","http://localhost/~yashbahetiiitk/swajal_dashboard/src/assets/Php/machines.php",true);
    // xhttp.open("POST","http://localhost:8000/assets/Php/machines.php",true);
    xhttp.open("POST","/iiot/assets/Php/machines.php",true);  


    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded"); // content-set header
    xhttp.send("table=Device_Data"); // send table name ( url encoded)
}

// Convert string formatted lat , lon into decimal formatted lat,lon (28889981,22463287) => (28.889981,22.463287)
function lanAndlon(param){
  while(Math.abs(param)>100){
    if(param/100<1) {break};
    param = param/10;
  }
  return param;
}

// Map search bar added to search location of machines , "Refer Google Maps api for javascript"
function searchBar(){
    var input = document.getElementById('searchInput');
    var searchBox = new google.maps.places.SearchBox(input);
    if(window.innerWidth<550){
      map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(input);
    }
    else{
      map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);          
    }
    map.addListener('bounds_changed', function() {
      searchBox.setBounds(map.getBounds());
    });

    var markers1 = [];

    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {
      var places = searchBox.getPlaces();
      if (places.length == 0) {
        return;
      }
      // Clear out the old markers.
      markers1 = [];
      // For each place, get the icon, name and location.
      var bounds = new google.maps.LatLngBounds();
      places.forEach(function(place) {
          if (!place.geometry) {
            console.log("Returned place contains no geometry");
            return;
          }
          // Create a marker for each place.
          markers1.push(new google.maps.Marker({
            position: place.geometry.location
          }));

          if (place.geometry.viewport) {
            // Only geocodes have viewport.
            bounds.union(place.geometry.viewport);
          } else {
            bounds.extend(place.geometry.location);
          }
      });
      map.fitBounds(bounds);
    });
}

// Filter By Cluster Button (Control-UI) (Refer google maps center control options)
function CenterControl(controlDiv, map,html) {

  // CSS For Button 'Filter By Cluster'
  var controlUI = document.createElement('div');
  controlUI.style.backgroundColor = '#fff';
  controlUI.style.border = '2px solid #fff';
  controlUI.style.borderRadius = '3px';
  controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
  controlUI.style.cursor = 'pointer';
  controlUI.style.marginBottom = '22px';
  controlUI.style.textAlign = 'center';
  controlUI.style.marginTop = '8px';
  controlUI.style.marginRight = '16px';
  controlDiv.appendChild(controlUI); // appends the button on maps

  // CSS for interior text of button.
  var controlText = document.createElement('div');
  controlText.style.color = 'rgb(25,25,25)';
  controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
  controlText.style.fontSize = '16px';
  controlText.style.lineHeight = '38px';
  // sets the cluster names in the dropdown menu
  controlText.innerHTML = '<div class="dropdown"><button class="dropdown-toggle" type="button" data-toggle="dropdown" style="background:none;border:none">Filter by Cluster<span class="caret"></span></button><ul class="dropdown-menu">'+html+'</ul></div>';
  controlUI.appendChild(controlText);
  $('.dropdown-menu show').css({"display":"contents"})
}

// Colors of markers on map for one particular cluster
var iconSrc=[
    "ff0000",
    "0033cc",
    "00cc00",
    "ffff33",
    "6600cc",
    "ff9900",
    "cc00cc",
    "663300",
    "00e6e6",
    "9999ff"
] 

// function returns the value of cookie for a given name
function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
          c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
      }
  }
  return "";
} // retrieving Cookie