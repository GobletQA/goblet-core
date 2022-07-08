# Client - Frontend

## On App Init - step-by-step

### Repo Status
* First thing the `actions/init` action does is call the `actions/repo/statusRepo` action
  * This action calls the backend API to get the status of the mounted repo for both Local / VNC modes
* This call hits the backend endpoint `/repo/status`
  * Which then calls the `statusGoblet workflow`
* when the `statusGoblet workflow` executes it will
  * Validate the Local / VNC mode
  * Check if a repo is mounted (Local) / connected (VNC)
  * Get the meta data of the connected repo
* The `/repo/status` endpoint, then returns that metadata to the frontend

### Connect - VNC Only
* Based on the status, if in VNC mode, and no repo is connected
  * The Connect Git Repository Modal will be displayed
  * It can **NOT** be closed until a repo has been properly connected

### Mount - Local Only
* If no repo is mounted, a warning will be shown, but the user can still interact with the application
* The example repo will be used as the mounted repo, and all changes will be discarded

