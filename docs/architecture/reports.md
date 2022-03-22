# Reports

## Notes
* Reports should not be depended on other file types ( first class citizens )
* Can be related to other files, but not depend

## Flows
### Sidebar Results File 
* When a Results file is selected from the sidebar
  * Action should be called to set the results file active for the results screen
  * Action should run before the results screen is loaded
### Switch to Results Screen
* On screen other then Results Screen, and switching to the results screen
  * Action should be called that does the following
    * Should find the most recent results file for active file of that screen
    * It should then be set as the active file of the results screen 
    * This should happen before the results screen loads
  * If no results files exist
    * Display message with relevant information
### On Test Run
* When tests are running, and switching to Results Screen
  * Should display a loading indicator that the rests are running
  * Once the tests finish, the Results file of that test run should display



