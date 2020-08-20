$(document).ready(function () {

        function renderCurrentWeather(ajxResponse)
        {       $("#currentWeather").html("");  //clear the card.
                // console.log(ajxResponse);                       
                let city = ajxResponse.city.name;
                let currentWeather = ajxResponse.list[0];                 //get temp humidity windspeed and uv index
                let crTemp = (currentWeather.main.temp-273.15) * 1.8 +32;   
                let crHmdty = currentWeather.main.humidity;
                let crWndSpd = currentWeather.wind.speed;
                let icnCW = currentWeather.weather[0].icon;
                let imgICW = $('<img src = https://openweathermap.org/img/wn/' + icnCW + '@2x.png' + '>');
                let cityName = $('<h3>' + city + ' ' + time +  '</h3>');
                cityName.append(imgICW); 
                let Temp = $('<h4>' + 'Temperature: ' + parseInt(crTemp) + 'F°' + '</h4>'); 
                let Hmdty = $('<h4>' + 'Humidity: ' + crHmdty + '%' + '</h4>'); 
                let WndSpd = $('<h4>' + 'Wind Speed: ' + crWndSpd + ' MPH' + '</h4>'); 
                let BGColor = setUVbgColor(uvI.uv);
                let uv = $('<h4>');
                uv.attr('class', BGColor);
                uv.text("UV Index: " + uvI.uv);
                // console.log(uvTest);
                $('#currentWeather').append(cityName);
                $('#currentWeather').append(Temp);
                $('#currentWeather').append(Hmdty);
                $('#currentWeather').append(WndSpd);
                $('#currentWeather').append(uv);
                addToCityList(city);
                 //getuv
                 //set 5 day forcast
                let day1 = ajxResponse.list[1];
                let day2 = ajxResponse.list[2];
                let day3 = ajxResponse.list[3];
                let day4 = ajxResponse.list[4];
                let day5 = ajxResponse.list[5];
                buildFiveDayForecast(ajxResponse.list);     
        }

        function buildFiveDayForecast(jsnArray) {
                $('#Day1').html("");
                $('#Day2').html("");
                $('#Day3').html("");
                $('#Day4').html("");
                $('#Day5').html("");

                for (i = 0; i < jsnArray.length; i++) {
                        let dt = jsnArray[i].dt_txt;
                        let tm = jsnArray[i].main.temp;
                        let tm2;
                        let hm = jsnArray[i].main.humidity;
                        let icn = jsnArray[i].weather[0].icon;
                        if (dt.substring(11) === '15:00:00') {   //add date
                                forDate = dt.substring(0, 10);
                                fiveDayObj.date.push(forDate);
                                //add temperature
                                tm2 = (tm - 273.15) * 1.8 + 32;   //get temp humidity windspeed and uv index
                                forTemp = parseInt(tm2);
                                fiveDayObj.temp.push(forTemp);
                                //add humidity
                                forHumidity = hm;
                                fiveDayObj.hum.push(forHumidity);
                                //add icon
                                forIcon = icn;
                                fiveDayObj.icon.push(forIcon);

                        }
                }
                var d;
                for (n = 0; n < fiveDayObj.date.length; n++) {
                        d = n + 1;
                        var h3Date = $('<h6>' + fiveDayObj.date[n] + '<h6>');
                        $('#Day' + d).append(h3Date);
                        var h3Temp = $('<h6>' + FiveDayObject.temp[n] + 'F°' + '<h6>');
                        $('#Day' + d).append(h3Temp);
                        var icon = $('<img src = https://openweathermap.org/img/wn/' + fiveDayObj.icon[n] + '@2x.png' + '>');
                        $('#Day' + d).append(icon);
                        var h3Humidity = $('<h6>' + FiveDayObject.hum[n] + '%' + '<h6>');
                        $('#Day' + d).append(h3Humidity);
                }
                fiveDayObj.clear();
        }


        function prefillCityList(){
            
                addToCityList("San Jose");
                addToCityList("Phoenix");
                addToCityList("Green Valley");
                addToCityList("Rio Rico");
                addToCityList("Tucson");
                addToCityList("Nogales");
                addToCityList("Chicago");
                addToCityList("New York");
                addToCityList("Los Angeles");
                addToCityList("San Francisco");
        }


        function buildQueryURL(cityString) {  //Here we build the queryURL and then send to renderCurrentWeather.
                let apiCall = "https://api.openweathermap.org/data/2.5/forecast";
                let cityName = "?q=" + cityString;
                var queryURL = apiCall + cityName + key;
                if (test) {
                        renderCurrentWeather(lastCity);
                } else {
                        $.ajax({
                                url: queryURL,
                                method: "GET"
                        }).then(function (response) {
                                console.log(response);
                                let resCity = response;
                                localStorage.setItem("lastCity", JSON.stringify(resCity)); // this is used so we can test without having to query the server
                                getUVindex(response.city.coord.lat, response.city.coord.lon);
                                renderCurrentWeather(response);
                                
                        });
                }
        }

        function getUVindex(lat, lon) {   // We esentially do the same thing as above but for UV index.
                let UVdata = [];
                let apiCall = "https://api.openweathermap.org/data/2.5/uvi?" //?appid={appid}&lat={lat}&lon={lon}
                let la = "&lat=" + lat;
                let lo = "&lon=" + lon;
                let KK = 'appid=beec6cc5881d930f74eb86a67a7a1dae';
                var queryURL = apiCall + KK + la + lo;
                if (test) {
                        renderUVIndex(lastUV);
                } else {
                        $.ajax({
                                url: queryURL,
                                method: "GET"
                        }).then(function (response) {
                               // console.log(response);
                                let UVdata = JSON.stringify(response.value);
                                localStorage.setItem("lastUV", JSON.stringify(UVdata)); // this is used so we can test without having to query the server
                                prepareUV(UVdata);
                                // AtestFun(UVdata);
                                // AtestFun(uvI.uv);   
                        });
                }
        }

        function addToCityList(ctyName) {
                let found = false;
                for (i = 0; i < cityList.length; i++) //search for city presence in list  //lookup includes to improve this....
                { if (cityList[i] === ctyName) found = true; }
                if (!found) //if it's not found we add it.
                {
                        let tblRow = $('<tr>');
                        let thCity = $('<th>' + ctyName + '</th>');
                        thCity.addClass('cityBtn');
                        thCity.attr('id', 'cBtn');
                        thCity.attr('city', ctyName);
                        tblRow.append(thCity);
                        $('#cityList').prepend(tblRow);
                        cityList.push(ctyName);
                        localStorage.setItem("cityList", JSON.stringify(cityList));
                }
        }

        function prepareUV(string)
        {
               let UVindex = string;
               uvI.uv = UVindex

        }

        function setUVbgColor(uvIndexString)
        {      
                console.log(uvIndexString);
                let value = parseInt(uvIndexString);
                let moderate = 'bg-primary text-white';
                let high = 'bg-warning text-white';
                let veryHigh = 'bg-danger text-white';

                if(value >= 8)
                {
                   return veryHigh;
                }
                else if(value <8 && value > 5)
                {
                        return high;
                }else{
                        return moderate;
                }

        }

        $("#searchBtn").on("click", function () {
                  event.preventDefault();
                  console.log('click');
                  let cityStr = $("#cityInpt")
                  buildQueryURL(cityStr.val());
                
        });
        
        $("#cityList").on("click", "tr", function () { //event delegation!
                var city = $(this).attr('id');
                console.log($(this).text());
                cityString = $(this).text();
                buildQueryURL(cityString);
               
        });
       
        //Variable initializations.
        let key = "&appid=beec6cc5881d930f74eb86a67a7a1dae";
        let lastCity = JSON.parse(localStorage.getItem("lastCity")); //used for testing
        let lastUV = JSON.parse(localStorage.getItem("lastUV"));//" " " 
        let time = moment().format('LLL');
        let test = false; //to minimize unecessary querys this boolean item is utilized.
        let forDate;
        let forTemp;
        let forHumidity;
        let forIcon;
        let fiveDayObj = Object.create(FiveDayObject);
        let uvI = Object.create(uvIndexObject);
        let cityList = [];
        let cityStore = JSON.parse(localStorage.getItem("cityList"));
        let cityNm = '';
        if(!test)
        {
                if (cityStore !== null) {
                cityList = cityStore;
                lastCity = "";  
                        for(n = 0; n < cityList.length; n++)
                        {
                                city = cityList.shift(n);
                                if(city !== -1){ addToCityList(city) };
                                lastCity = city;
                        }
                        buildQueryURL(lastCity);
                } else {
                        cityList = [];
                        prefillCityList();
                        buildQueryURL('New York');
                }
        }        
});

//create object for 5 day list
let FiveDayObject = {
        'date':[],
        'temp':[],
        'hum':[],
        'icon':[],
        clear:function(){
                this.date.splice(0, this.date.length);
                this.temp.splice(0, this.temp.length);
                this.hum.splice(0, this.hum.length);
                this.icon.splice(0, this.icon.length);
        }
};

let uvIndexObject = {
            'uv':'',
};

// let renderModule = {

//         'city':'',
//         'currentWeather':'',
//         'currentTemp':'',
//         'currentHumidity':'',
//         'currentWindSpeed':'',
// }