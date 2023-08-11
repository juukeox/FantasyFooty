# This app scrapes data on fantasy football players and provides users with a personalised table of suggestions for their team.

 *Find detalis at bottom of page.* 



## Users start by **fetching the latest information for all players in the online FPL database**. Users then pick from a variety of factors that will affect the recommendation score of each player.
 ![Hubpage](/hubpage.png "Hubpage") 
 
 



## The flask app is responsible for the **scraping and calculations that give players a huge range of suggestions.**
 ![Hubpage](/scraping.png "Server side") 
 
 
 


## **Finally, your results.** These are sorted by score and filtered according to the user's needs.
![Hubpage](/results.png "Results") 




This app is built on React  for the front end and has required me to learn JSX, CSS and more.
Complex Python implementation has allowed for a variety of tasks for the flask back end.
The app is now in the process of being refined so that it can be one clean, installable file for use on desktop and mobile.
Suggestions welcome!

*Most key files found in src folder*

# To Run
Assumed Windows powershell. 2 terminals needed so front end and back end can work together.

## Back end
Go into the "src" folder (within root directory) and activate the virtual environment with ".\venv\Scripts\activate"
Launch the flask app with - "flask run"

## Front end
Run "npm install"
Run "npm start"


### Easy as that!


