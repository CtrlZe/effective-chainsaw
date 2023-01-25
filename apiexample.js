// initialize page after HTML loads
window.onload = function() {
   closeLightBox();  // close the lightbox because it's initially open in the CSS
   document.getElementById("button").onclick = function () {
     searchTvShows();
   };
   document.getElementById("lightbox").onclick = function () {
     closeLightBox();
   };
} // window.onload


// get data from TV Maze
function searchTvShows() {
  document.getElementById("main").innerHTML = "";
  
  var search = document.getElementById("search").value;  
    
  fetch('http://api.tvmaze.com/search/shows?q=' + search)
    .then(response => response.json())
    .then(data => showSearchResults(data) 
    );
} // window.onload 
 

// change the activity displayed 
function showSearchResults(data) {
  
  // show data from search
  console.log(data); 
  
  // show each tv show from search results in webpage
  for (let tvshow in data) {
    // document.getElementById("main").style.gridTemplateRows += " 1fr";
    // document.getElementById("main").style.gridRow = tvshow + "/" + tvshow;
    createTVShow(data[tvshow]);
  } // for


} // showSearchResults

// in the json, genres is an array of genres associated with the tv show 
// this function returns a string of genres formatted as a bulleted list
function showGenres(genres) {
  var g;
  var output = "<ul>";
  for (g in genres) {
    output += "<li>" + genres[g] + "</li>"; 
  } // for       
  output += "</ul>";
  return output; 
} // showGenres


// constructs one TV show entry on webpage
function createTVShow (tvshowJSON) {
  
  // get the main div tag (everything under search box)
  var elemMain = document.getElementById("main");
  
  // create divs to put groups of data in
  var elemShow = document.createElement("div");
  elemShow.setAttribute('class', 'elemShow');
  var elemInfo = document.createElement("div");
  elemInfo.setAttribute('class', 'elemInfo');
  var elemEpisodes = document.createElement("div");
  elemEpisodes.setAttribute('class', 'elemEpisodes');

  // create elements for the data
  var elemImage = document.createElement("img");
  elemImage.setAttribute('class', 'elemImage');
  var elemShowTitle = document.createElement("h2");
  elemShowTitle.classList.add("elemShowTitle"); // add a class to apply css
  var elemGenre = document.createElement("div");
  var elemRating = document.createElement("div");
  var elemSummary = document.createElement("div");
  
  // add JSON data to elements
  elemImage.src = tvshowJSON.show.image.medium;
  elemShowTitle.innerHTML = tvshowJSON.show.name;
  elemGenre.innerHTML = "Genres: " + showGenres(tvshowJSON.show.genres);
  elemSummary.innerHTML = tvshowJSON.show.summary;
  if(tvshowJSON.show.rating.average != null){ //sees if there is a rating to display
    elemRating.innerHTML = "Rating: " + tvshowJSON.show.rating.average;
  }

  // add the info to div
  elemInfo.appendChild(elemGenre);
  elemInfo.appendChild(elemRating);
  elemInfo.appendChild(elemSummary);
  
  // get id of show and add episode list
  var showId = tvshowJSON.show.id;
  fetchEpisodes(showId, elemEpisodes);
  
  // add this data to elemShow to group them together
  elemShow.appendChild(elemShowTitle);
  elemShow.appendChild(elemImage);
  elemShow.appendChild(elemInfo);
  elemShow.appendChild(elemEpisodes); 

  //add the show to main
  elemMain.appendChild(elemShow);
    
} // createTVShow

// fetch episodes for a given tv show id
function fetchEpisodes(showId, elemEpisodes) {
     
  console.log("fetching episodes for showId: " + showId);
  
  fetch('http://api.tvmaze.com/shows/' + showId + '/episodes')  
    .then(response => response.json())
    .then(data => showEpisodes(data, elemEpisodes));
    
} // fetch episodes

// list all episodes for a given showId in an ordered list 
// as a link that will open a light box with more info about each episode
function showEpisodes (data, elemEpisodes) {
  
  // print data from function fetchEpisodes with the list of episodes
  console.log("episodes");
  console.log(data); 

  var output = "<ol>";
  for (episode in data) {
    output += "<li><a href='javascript:fetchEpisodeInfo(" + data[episode].id + ")'>" + data[episode].name + "</a></li>";
  }
  output += "</ol>";
  elemEpisodes.innerHTML = output;
        
} // showEpisodes

// open fetch episode info from tvmaze using episodeId
function fetchEpisodeInfo(episodeId){
  fetch('https://api.tvmaze.com/episodes/' + episodeId)  
  .then(response => response.json())
  .then(data => showEpisodeInfo(data,));
} // fetchEpisodeInfo

// open lightbox and display episode info on it
function showEpisodeInfo(data){
  console.log("showEpisodeInfo");
  console.log(data);

  document.getElementById("lightbox").style.display = "block";

  // show episode info in lightbox
  document.getElementById("message").innerHTML = 
  '<div id="name"> ' + data.name + '</div>' +
  '<p id="season"> Season ' + data.season + ' Episode ' + data.number + '</p>';

  if(data.summary != null){
    document.getElementById("message").innerHTML += 
    '<p id="summary"> ' + data.summary + '</p>';
  }

  if(data.image != null){
    document.getElementById("message").innerHTML += 
    '<img id="image" src="' + data.image.medium + '">';
  }
}// showEpisodeInfo

// close the lightbox
function closeLightBox(){
  document.getElementById("lightbox").style.display = "none";
} // closeLightBox 
