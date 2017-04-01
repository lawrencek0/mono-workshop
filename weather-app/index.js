$("#cover").spin();

$(document).ready(function(){
    getLocation();
});

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
    }
}

function successFunction(position) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    getWeatherData(lat, lon);
}

function errorFunction() {
    alert("Geocoder failed! Please allow location access to Geocorder!");
}

function getWeatherData(lat, lon) {
    $.ajax({
        type: 'GET',
        cache: false,
        url: 'https://api.wunderground.com/api/1bea8e756ccc9e0e/conditions/q/' + lat + ',' + lon + '.jsonp',
        contentType: "application/jsonp",
        dataType: "jsonp",
        success: function (response) {
            data = response;
            console.log(data);
            var city = data.current_observation.display_location.city;
            var country = data.current_observation.display_location.country;
            var desc = data.current_observation.weather;
            var icon = data.current_observation.icon_url;
            var tempC = Math.round(data.current_observation.temp_c);
            var tempF = Math.round(data.current_observation.temp_f);
            $("#location").append("<h3>" + city + ", " + country);
            $("#tempC").append(tempC + "<i class='wi wi-celsius'></i>");
            $("#tempF").append(tempF + "<i class='wi wi-fahrenheit'></i>");
            $('#desc').append(desc);
            $("#icon").append("<h2><img src='" +icon + "'></h2>");
            var sunCalc = SunCalc.getTimes(new Date(), lat, lon);
            var sunriseSec = sunCalc.sunrise.getHours() * 60 * 60 +  sunCalc.sunrise.getMinutes() * 60;
            var sunsetSec =sunCalc.sunset.getHours() * 60 * 60 +  sunCalc.sunset.getMinutes() * 60;
            var date = new Date();
            var now = date.getHours() * 60 * 60 + date.getMinutes();
            if (now > sunriseSec && now < sunsetSec) {               $('body').removeClass('night').addClass('day');
                $('#heading').append("Today's Weather");
            } else {
                $('body').removeClass('day').addClass('night white-text');
                $('#heading').append("Tonight's Weather");
            }
        },
        complete: function() {
            $("#cover").spin(false);
            $(".weather-app").css('display','block');
            $(".btn").css('display','inline-block');
        }
    });
}

$("#changeUnits").click(function() {
    $("#tempF").toggle();
    $("#tempC").toggle();
});