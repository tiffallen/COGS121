<h1> Milestone 14 – Project Progress </h1>

<h2> Jason: Adding new sites, Favorites list, Restructure database, Using cloud storage for images, Spinners, Theme/layout changes, Bug fixes</h2>

* Allow users to add new sites:
  * added custom bootbox dialog for user input
  * give users option to upload image file, or enter image URL
  * files selected by user are screened to make sure they are images, then uploaded to firebase cloud storage, and storage URL is saved
  * label dropdown menu now has checkboxes allowing multiple selections, also with a search box that filters checkboxes as you type
  * label dropdown menu is now dynamically populated with all labels in the database
  * all user input is now sent to database and persists across sessions and users
* User-specific data, favorites:
  * restructure database to allow for user-specific data
  * users can now add a site to their favorites list, or remove it
* Bug fixes:
  * fix login error
  * fix concurrent elasticsearch deletions issue
  * fix missing or uncessary text wrapping
* Busy/waiting spinners
  * if image load is taking time, display a spinner gif in place of image until load finishes
  * show bootbox dialog with spinner when uploading picture, or creating site
* Layout/theme changes
  * Reworked popup design, made index page responsive, rework login page


![alt text][jason_update]
![alt text][jason_update2]


<h2> Stephanie:  </h2>
<p> 

</p>

![Stephs progress screenshot][steph_update]

<h2> Tiffany:   </h2>
<p> 
- finished the introduction page for new users, making the style match the login page <br />
- the introduction page is in FAQ format. The questions are toggable so that the user can only open the questions that they are curious about </ br>
    - made the profile page showcase information from the user's login information such as their username <br />
    - made default user information until the user updates their own <br />'
    - if a user hasn't added a field of the information (such as year or college), the blank space is not shown on their profile </ br>
    - any saves from the user are added to the firebase database under the user's information and then
    showcased on their profile page, I had a lot of trouble saving the firebase username data/accessing it at other points in our web application<br />
</p>

![alt text][tiffany_update1]
![alt text][tiffany_update2]


<h2> Jimmy:  </h2>
<p>

</p>

![alt text][jimmy_update]


<h2> Final Milestone 14 Screenshot: </h2>

![alt text][final_update]
![alt text][final_update2]

[jason_update]: ../images/milestone14/jason.png "jason update"
[jason_update2]: ../images/milestone14/jason2.png "jason update2"
[jimmy_update]: ../images/milestone14/jimmy.PNG "jimmy update"
[steph_update]: ../images/milestone14/stephUpdate.png
[tiffany_update1]: ../images/milestone14/tiff1.PNG "tiff update 1"
[tiffany_update2]: ../images/milestone14/tiff2.PNG "tiff update 2"
[final_update]: ../images/milestone14/ "Final Screenshot"

[final_update2]: ../images/milestone14/ "Final Screenshot"
