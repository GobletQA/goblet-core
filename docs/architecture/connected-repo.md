# Connected Repo Steps


## Page Load

### Frontend
* Pull repo from local storage if it exists
* Clear out local storage
  * At this point we don't know if the repo is still mounted, even if in local storage
  * So we check and try to load the repo if it exists
  * But if it doesn't then we have to re-connect, so local storage is no longer valid
* Call backend api repoStatus
  * Pass in the repo when making backend api call
* Handel response from backend based on returned data
  * If not mounted
    * In vnc mode, then show git connect modal
    * In local mode, then show empty project modal
  * If mounted
    * repo data should be returned in the response, so save it to the store

## Backend
* On all to repoStatus endpoint
  * 

