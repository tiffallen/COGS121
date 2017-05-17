
<h1> Milestone 9 – Project Progress </h1>

<h2> Jason: Full-text search, improved filter, dynamic map-resizing, bug fixes </h2>
<p> 
  - Added new feature: Full-text search. Using Bonsai and Flashlight to host an Elasticsearch instance on Heroku that listens to our Firebase database. When a user filters/searches, an Elasticsearch query is written to our Firebase database, which gets pulled by Bonsai, which processes the query and writes it back to the Firebase database. <br />
  - Made filters and searches stack with each other. <br />
  - Added new feature: For filters and searches that produce at least one result, the map now centers upon the first result.<br />
  - Added new feature: Dynamic map resizing when window dimensions change. <br />
  - Switch from using JSON to Firebase and Elasticsearch as primary storage. <br />
  - Radio buttons switched to dropdown to save space. "Clear form" X appears on search input box. <br />
  - Improved layout for mobile view. <br />
  - Fixed issue causing map to recenter whenever location data was updated. <br />
  - Fixed mixed protocol bug preventing resources from loading properly.
</p>

![alt text][jason_update]


<h2> Stephanie:  </h2>
<p> 

</p>

![Icons Design][steph_update] 
![Stephs progress screenshot][steph_update1]

<h2> Tiffany:  </h2>
<p> 

</p>

![alt text][tiffany_update]

<h2> Jimmy:  </h2>
<p>
- Added more info to our data including college name, quick info description, and a link to a picture of it.<br />
- Made the pop up page more informational. <br />
- Pop ups now go away when you click anywhere else on the map.<br />
</p>

![alt text][jimmy_update]



<h2> Final Milestone 9 Screenshot: </h2>

![alt text][final_update]

[jason_update]: ../images/milestone11/jason.png "Jason's Screenshot"
[jimmy_update]: ../images/milestone11/jimmy.png "Jimmy's Screenshot"
[steph_update]: ../images/milestone11/stephanie.png "Stephanie's Screenshot"
[tiffany_update]: ../images/milestone11/tiffany.PNG "Tiffany's Screenshot"
[final_update]: ../images/milestone11/final.png "Final Screenshot"
