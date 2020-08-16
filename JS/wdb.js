$(document).ready(function () {
        // var citylist = $.getJSON('./people.json');
        //var queryURL = "";
        var tucson = JSON.parse(localStorage.getItem("Tucson"));
        console.log(tucson);
        console.log(tucson.name);
        console.log(tucson.list[0]);
        console.log(tucson.list[1]);
        console.log(tucson.list[2]);
        console.log(tucson.list[3]);
        console.log(tucson.list[4]);

        function buildQueryURL(cityString){
                console.log(typeof(cityString));
                let apiCall = "https://api.openweathermap.org/data/2.5/forecast";
                let cityName =  "?q="+cityString; 
                let key = "&appid=beec6cc5881d930f74eb86a67a7a1dae";
                console.log(cityString);
                var queryURL= apiCall+cityName+key;

                // query the city.list.json file to get a city by id.
                $.ajax({
                        url: queryURL,
                        method: "GET"
                }).then(function(response){
                        let resCity = response;
                        console.log("5 day forecase?")
                        console.log(resCity);
                        localStorage.setItem("Tucson", JSON.stringify(resCity));

                });
        }

        $("#searchBtn").on("click", function () {
                  event.preventDefault();
                  console.log('click');
                  let cityStr = $("#cityInpt")
                  buildQueryURL(cityStr.val());
                 //run your prepend to side bar function
        });
        
      

});
// localStorage.setItem("ScoreBoard", JSON.stringify(scoreArray));
// localStorage.setItem("ScoreBoard", JSON.stringify(scoreArray));

