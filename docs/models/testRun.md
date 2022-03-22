
```js
import { setActiveTestFile } from 'HKActions/runner/setActiveTestFile'
// TODO: remove once output is finished
const addTestFileOutput = (activeTestFile) => {

  setActiveTestFile(activeTestFile)

  dispatch({
    type: ActionTypes.SET_ITEM,
    payload: {
      category: CATEGORIES.TEST_RUNS,
      key: activeTestFile.location,
      item: {
        file: activeTestFile.location,
        fileType: activeTestFile.fileType,
        lastRun: "1615252072389",
        output: [
          "Running feature tests for dayNavigation.feature",
        ]
      },
    }
  })
}
```