const app = {};

// API key has a limited # of calls each day --> if one doesn't work, please switch to the other
// app.key = `AWmz2ervkrJ0qWOeCH8Dl3gNyk1DY1CH`;
app.key = `uQZsBU5lGIvr1GvFTSTcghDhheb0Q3hz`;




// Randomize Background Image
const randomImage = [
    "url(../JS-project02/assets/BackgroundPhotos/156553-sunny-background-2560x1440-hd.jpg)",
    "url(../JS-project02/assets/BackgroundPhotos/156555-download-free-sunny-background-2560x1600.jpg)",
    "url(../JS-project02/assets/BackgroundPhotos/156561-sunny-background-1920x1249-samsung-galaxy.jpg)",
    "url(../JS-project02/assets/BackgroundPhotos/244638-beautiful-hd-forest-wallpaper-1920x1200.jpg)",
    "url(../JS-project02/assets/BackgroundPhotos/252222-sunny-background-1920x1200-windows-7.jpg)",
    "url(../JS-project02/assets/BackgroundPhotos/252224-sunny-background-1920x1080-photo.jpg)",
    "url(../JS-project02/assets/BackgroundPhotos/332713-mountains-wallpaper-1920x1080-for-android-40.jpg)"
]

selectImage = randomImage[Math.floor(Math.random() * randomImage.length)];
// $('html').css('background-image', selectImage,);

$("html").css("background-image", "linear-gradient(to bottom, rgba(255,255,255,0.4), rgba(255,255,255,0.4))," + selectImage);


// Get User postal code
let postalCode = prompt("For your local weather, please enter the first 3 characters of your postal code.");



// Get user postal code (q) to generate location key (needed for getWeather API call)
app.getLocation = () => {
    $.ajax ({
        url: `http://dataservice.accuweather.com/locations/v1/postalcodes/search`,
        method: 'GET',
        dataType: 'json',
        data: {
            apikey: app.key,
            q: postalCode
        }
    }).then( (result) => {
        app.getWeather(result[0].Key);
    })
};



// Retrieve Weather Data from AccuWeather
app.getWeather = (LocationKey) => {
    $.ajax({
        url: `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${LocationKey}`,
        method: 'GET',
        dataType: 'json',
        data: {
            apikey: app.key,
            metric: true
        }
    }).then( (results) => {
        // Call to displayWeather w/ retrieved data
        app.displayWeather(results);
        
    })
};



// Display Weather Data
app.displayWeather = (days) => {


    // Display Weather Headline
    const titleHtmlToAppend = `
        <p>${days.Headline.Text}</p>
    `;
    $('.weatherHeadline').append(titleHtmlToAppend);


    // Display daily weather data
    days.DailyForecasts.forEach( (weather) => {

        // Display Date
        const origDate = new Date(weather.Date);
        let month = origDate.getUTCMonth() + 1; //months from 1-12
        let day = origDate.getUTCDate();
        let year = origDate.getUTCFullYear();
        fixedDate = year + "/" + month + "/" + day;


        // Display Precipitation only when 
        let dayPrecipitation = "None";
        let nightPrecipitation = "None";

        if (weather.Day.HasPrecipitation == true) {
            dayPrecipitation = weather.Day.PrecipitationIntensity + " " + weather.Day.PrecipitationType;
        }

        if (weather.Night.HasPrecipitation == true) {
            nightPrecipitation = weather.Night.PrecipitationIntensity + " " + weather.Night.PrecipitationType;
        }


        // Get Weather Icons
        let dayIcon = "./assets/" + weather.Day.Icon + "-s.png"
        let nightIcon = "./assets/" + weather.Night.Icon + "-s.png"


        // Display Weather for 5 Days 
        const htmlToAppend = `
            <div class = "dayForecast">
                <h2 class = "dayDate">${fixedDate}</h2><hr> 
                <img src = ${dayIcon}  alt = "Daytime weather icon"/>
                <p class = "dayIconPhrase">${weather.Day.IconPhrase}</p>
                <p class = "dayHigh">${weather.Temperature.Maximum.Value} C</p>
                <p class = "precip">Precipitation:</p>
                <p class = "dayPrecipIntType">${dayPrecipitation}</p>
                <hr>
                <img src = ${nightIcon} alt = "Nighttime weather icon"/>
                <p class = "nightIconPhrase">${weather.Night.IconPhrase}</p>
                <p class = "nightLow">${weather.Temperature.Minimum.Value} C</p>
                <p class = "precip">Precipitation:</p>
                <p class = "nightPrecipIntType">${nightPrecipitation}</p>

            </div>
        `;
        $('.fiveDayFlexbox').append(htmlToAppend);
    });
};



app.init = function() {
    app.getLocation();
};

$(function() {
    app.init();
}); 