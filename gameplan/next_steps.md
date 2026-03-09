2/7/2026:
* Look into adding the SQLite DB to the project.
* Get it setup and get a basic understanding of what it is and how to use it.
* What is SQLite: https://www.youtube.com/watch?v=Bzme7_42lz8
* How to easily create SQLite DB: https://www.youtube.com/watch?v=XSZE1iiKdSw 
* SQLite Docs: https://sqlite.org/quickstart.html 


2/12/2026:
* Add more backend endpoints for retrieving all team data (look at /server README.md for examples)
* Read in SQLite data on frontend and display
* Export SQLite data to excel/sheets and play around with charts (what makes sense vs what doesn't)


3/7/2026:
* look into the index.ts file in the 'server' folder and start to reorganize it a bit. I'd like to separate out the endpoints and the queries into different folders
* try to create a new endpoint (ex: get all price history for a specific team).


3/7/2026:
* add endpoints to get/set team as 'active' (tracking prices is turned ON) for a specific team
* add endpoint to get all teams and corresponding teamId (need this to call teamId specific endpoints)


3/8/2026:
* Start on React side and call one of the endpoints from the frontend
* trigger team specific endpoints based on button presses on main page


3/8/2026:
* Update LandingPage to display the team links in sets of rows and columns
* Update TeamPage to display the prices and timestamps in a list


future:
* research potential graph packages to display prices on frontend
* research how to pull betting odds off of FanDuel/ESPN/Ceasar's
* display graph for team data on frontend
* display list of teams and their betting odds to make playoff and NC
* add endpoint to immediately scrape data from cfp-rsvp.com (get latest data on command)