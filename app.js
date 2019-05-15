const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express()

const key = require('./config/key.js');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set('view engine', 'ejs')

app.get('/', function(req, res) {
  res.render('index', {
    weather: null,
    error: null
  });
})

app.post('/', function(req, res) {
  let city = req.body.city;

  let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${key.api}`

  //console.log(url);
  request(url, function(err, response, body) {
    if (err) {
      res.render('index', {
        weather: null,
        error: 'Error, please try again'
      });
    } else {
      let weather = JSON.parse(body)
      //console.log(weather);
      if (weather.main == undefined) {
        res.render('index', {
          weather: null,
          error: 'Error, please try again'
        });
      } else {
        let weatherText = `It's ${weather.main.temp} degrees in ${weather.name}!`;
        res.render('index', {
          weather: weatherText,
          data: weather,
          error: null
        });
      }
    }
  });
})

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
});
