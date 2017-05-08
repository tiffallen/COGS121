<h1> Milestone 7 – Project Progress </h1>

<h2> Jason: What you contributed </h2>
<p> 
	Added a filter to filter sites by type labels (i.e. art, library, Stuart Collection, etc...). Sites can have multiple labels. Changing the filter will automatically hide all non-related site icons and show all related site icons. Also added functionality to create sites/locations dynamically from JSON data (not yet complete with reading from JSON file though).
</p>

![alt text][jason_update]


<h2> Stephanie: Creating Popups. location optimization. List of future locations </h2>
<p> 
	Created actual popups, comapred to last week where we had a text on top of the map saying the location name. Included coordinates with the popups, as well as adding code to exlude areas that didnt have a location marker from having a popup. Also optomized the code so adding locations is easier, by having locations organized in an array, and added through a for loop. Created list of possible locations we can feature in './documentation/locaationsToFeature.md'
</p>

![alt text][steph_update] 

<h2> Tiffany: What you contributed </h2>
<p> 
	Started working on how to incorporate JSON objects into the project. We don't have a local server set up yet so I was running into problems about how to access a local JSON object without an ajax call. We have a temporary fix right now of using data arrays within the javascript file to keep track of the locations. Going to continue working on the JSON and server (firebase or heroku) so that we can move from using data arrays to utilizing JSON to store all of the information/data about each location by the next milestone.
</p>

![alt text][tiffany_update]

<h2> Jimmy: Ability to add new places on map </h2>
<p>
	From the feedback that we got from out peers, one of them mentioned that they wanted to see the ability for users to add
their own locations. I was able to add our customized pins on the map when the user clicks any where on the map, then the user is 
prompted to label the new pin. This is still not in its final state, eventually this feature will send a request to us before displaying
it in the map. Users will also be able to add other information about the place thats not just the name. In my screenshot example we can 
see how a user would add a new pin and label it "Pangea", after it is added, the pop up window shows the newly inputed info. 
</p>

![alt text][jimmy_update]



<h2> Final Milestone 7 Screenshot: </h2>

![alt text][final_update]

[jason_update]: ../images/milestone7/jason.png "Jason's Screenshot"
[jimmy_update]: ../images/milestone7/jimmy.png "Jimmy's Screenshot"
[steph_update]: ../images/milestone7/stephanie.png "Stephanie's Screenshot"
[tiffany_update]: ../images/milestone7/tiffany.png "Tiffany's Screenshot"
[final_update]: ../images/milestone7/final.png "Final Screenshot"
