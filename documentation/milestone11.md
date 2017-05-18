<h1> Milestone 11 – Project Progress </h1>

<h2> Jason:  </h2>
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
    - Added UI changes to main pages to make more brand focused
    - Added UI changes to login page, so that only login shows, just sign in shows (has link on bottom to change between them)
    - Added a detailed popup page that takes the name that the user clicked on, still needs to add quick info on this page
    - Started footer but didnt complete
</p>

![Stephs progress screenshot][steph_update]

<h2> Tiffany:  </h2>
<p> 
    - implemented the first login page </br>
    - users can login if they have an account using a username and password </br>
    - password must be "strong" </br>
    - If the user inputs the wrong password, they will not be able to login </br>
    - If they are a new user, they can make an account. Once they do so, they are guided to an introduction page before the main app. </br>
    - logout buttons on each page that will log each user out of their account and go back to the login page </br>
    - made a general project page that links the github and our app. </br>
</p>

![alt text][tiffany_update1]
![alt text][tiffany_update2]
![alt text][tiffany_update3]
![alt text][tiffany_update4]

<h2> Jimmy:  </h2>
<p>
- Added more info to our data including college name, quick info description, and a link to a picture of it.<br />
- Made the pop up page more informational. <br />
- Pop ups now go away when you click anywhere else on the map.<br />
</p>

![alt text][jimmy_update]



<h2> Final Milestone 9 Screenshot: </h2>

![alt text][final_update]

[jason_update]: ../images/milestone11/jason.png "jason update"
[jimmy_update]: ../images/milestone11/jimmy.png "jimmy update"
[steph_update]: ../images/milestone11/stephUpdate.png
[tiffany_update1]: ../images/milestone11/tiff_1.PNG "tiff update 1"
[tiffany_update2]: ../images/milestone11/tiff_2.PNG "tiff update 2"
[tiffany_update3]: ../images/milestone11/tiff_3.PNG "tiff update 3"
[tiffany_update4]: ../images/milestone11/tiff_4.PNG "tiff update 4"
[final_update]: ../images/milestone9/final.png "Final Screenshot"

