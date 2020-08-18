$(document).ready(function () {

        function buildFiveDayForecast(jsnArray){
             $('#Day1').html("");
             $('#Day2').html("");   
             $('#Day3').html("");
             $('#Day4').html("");
             $('#Day5').html("");
             for(i = 0; i < jsnArray.length; i++)
                {         
                    let dt = jsnArray[i].dt_txt;
                    let tm = jsnArray[i].main.temp;
                    let tm2;
                    let hm = jsnArray[i].main.humidity;
                    if(dt.substring(11) === '15:00:00')
                    {   //add date
                         forDate = dt.substring(0,10);
                         fiveDayObj.date.push(forDate);
                         //add temperature
                         tm2 = (tm - 273.15) * 1.8 + 32;   //get temp humidity windspeed and uv index
                         forTemp = parseInt(tm2);
                         fiveDayObj.temp.push(forTemp); 
                         //add humidity
                        forHumidity = hm;
                        fiveDayObj.hum.push(forHumidity);
                    }     
                }
                 console.log(fiveDayObj);
                 var d;
                 for(n=0; n < fiveDayObj.date.length; n++)
                 {
                    d=n+1;    
                    var h3Date = $('<h6>' + fiveDayObj.date[n] + '<h6>');
                    $('#Day'+d).append(h3Date); 
                    var h3Temp = $('<h6>' + FiveDayObject.temp[n] + 'F°' + '<h6>');
                    $('#Day'+d).append(h3Temp);   
                    var h3Humidity = $('<h6>' + FiveDayObject.hum[n] + '%'+ '<h6>');
                    $('#Day'+d).append(h3Humidity);    
                    console.log(d);
                 }
                 fiveDayObj.clear();
        }

        function renderCurrentWeather(ajxResponse)
        {       $("#currentWeather").html("");
                console.log(ajxResponse);                       
                let city = ajxResponse.city.name;
                console.log("rcw is type of: " + typeof(city));
                let currentWeather = ajxResponse.list[0];
                let crTemp = (currentWeather.main.temp-273.15) * 1.8 +32;   //get temp humidity windspeed and uv index
                let crHmdty = currentWeather.main.humidity;
                let crWndSpd = currentWeather.wind.speed;
                let cityName = $('<h3>' + city + ' ' + time + '</h3>'); 
                let Temp = $('<h4>' + 'Temperature: ' + parseInt(crTemp) + 'F°' + '</h4>'); 
                let Hmdty = $('<h4>' + 'Humidity: ' + crHmdty + '%' + '</h4>'); 
                let WndSpd = $('<h4>' + 'Wind Speed: ' + crWndSpd + ' MPH' + '</h4>'); 
                buildFiveDayForecast(ajxResponse.list);

                $('#currentWeather').append(cityName);
                $('#currentWeather').append(Temp);
                $('#currentWeather').append(Hmdty);
                $('#currentWeather').append(WndSpd);
                addToCityList(city);
                 //getuv
                 //set 5 day forcast
                let day1 = ajxResponse.list[1];
                let day2 = ajxResponse.list[2];
                let day3 = ajxResponse.list[3];
                let day4 = ajxResponse.list[4];
                let day5 = ajxResponse.list[5];
        }

        function addToCityList(ctyName){
                console.log("ctyName is type of: " + typeof(ctyName));
                let found = false;
                for(i = 0; i < cityList.length; i++) //search for city presence in list
                {   if(cityList[i]===ctyName) found = true;    }
                if(!found) //if it's not found we add it.
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

        function buildQueryURL(cityString){  //Here we build the queryURL and then send to renderCurrentWeather.
                let apiCall = "https://api.openweathermap.org/data/2.5/forecast";
                let cityName =  "?q="+cityString; 
                let key = "&appid=beec6cc5881d930f74eb86a67a7a1dae";
                var queryURL= apiCall+cityName+key;
            
                if(test){
                    renderCurrentWeather(lastCity);
                }else{
                $.ajax({
                        url: queryURL,
                        method: "GET"
                }).then(function(response){
                        let resCity = response;
                        console.log("5 day forecase?")
                        console.log(resCity);
                        localStorage.setItem("lastCity", JSON.stringify(resCity));
                        renderCurrentWeather(response);
                });
                }
        }

        function prefillCityList(){
                addToCityList("Chicago");
                addToCityList("New York");
                addToCityList("Los Angeles");
                addToCityList("San Francisco");
                addToCityList("San Jose");
                addToCityList("Phoenix");
                addToCityList("Tucson");
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
       
        //
        //
        let lastCity = JSON.parse(localStorage.getItem("lastCity")); //used for testing
        let time = moment().format('LLL');
        let test = false; //to minimize unecessary querys this boolean item is utilized.
        let forDate;
        let forTemp;
        let forHumidity;
        let fiveDayObj = Object.create(FiveDayObject);
        let cityList = [];
        let cityStore = JSON.parse(localStorage.getItem("cityList"));
        let city = '';
        if (cityStore !== null) {
            cityList = cityStore;
            lastCity = "";  
            for(n = 0; n < cityList.length; n++)
           {
                city = cityList.shift(n);
                console.log("city is type of:" + typeof(city));
                if(city !== -1){ addToCityList(city) };
                lastCity = city;
           }
            buildQueryURL(lastCity);
        } else {
                cityList = [];
                prefillCityList();
        }
});

//create object for 5 day list
let FiveDayObject = {
        'date':[],
        'temp':[],
        'hum':[],
        clear:function(){
                this.date.splice(0, this.date.length);
                this.temp.splice(0, this.temp.length);
                this.hum.splice(0, this.hum.length);
        }
}

