# Neighborhood Maps Project
Going to school in Northern California made me realize how much I love Mexican food. Having been born and raised in San Diego, there really is no comparison up north. Whenever I came home to visit, I would immediately get a burrito from one of my favorite taco shops. This app shows a list of my favorite taco shops in San Diego County.

![Demo of map being used](http://res.cloudinary.com/lptyiqogm/image/upload/v1487826496/maps_bncwus.gif)

## Get Started
Clone this repo, navigate to the folder and install oauth-signature-js
```
npm install oauth-signature
```
Open the index.html file in a browser

## Reflection
This app uses <a href="http://knockoutjs.com/">knockout.js</a> to handle a dynamic list of titles that renders depending if it satisfies a filter.

**Google Maps API** is used to display a map with markers at each restaurant location. Clicking each marker triggers an animation, and an infowindow to display with more information about that restaurant.

**Yelp API** An ajax request is made to retrieve data from the Yelp API. This data is used to display more info about a restaurant in its respective info window. 
