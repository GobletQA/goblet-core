import { Values } from 'HKConstants'
const { CATEGORIES } = Values

export const specResults = {
  [CATEGORIES.SPEC_RESULTS]: {
    // "Feature: Workflow": {
    //   "start": {
    //     "id": "suite1",
    //     "description": "Feature: Workflow",
    //     "fullName": "Feature > Workflow",
    //     "failedExpectations": [],
    //     "testPath": "/keg/repos/lancetipton/current/goblet/bdd/features/workflow.feature",
    //     "type": "feature",
    //     "action": "start",
    //     "timestamp": 1642624894665
    //   },
    //   "end": {
    //     "id": "suite1",
    //     "description": "Feature: Workflow",
    //     "fullName": "Feature > Workflow",
    //     "failedExpectations": [],
    //     "testPath": "/keg/repos/lancetipton/current/goblet/bdd/features/workflow.feature",
    //     "status": "finished",
    //     "type": "feature",
    //     "action": "end",
    //     "timestamp": 1642624907223
    //   }
    // },
    // "Scenario: Search the web for google": {
    //   "start": {
    //     "id": "suite2",
    //     "description": "Scenario: Search the web for google",
    //     "fullName": "Feature > Workflow Scenario > Search the web for google",
    //     "failedExpectations": [],
    //     "testPath": "/keg/repos/lancetipton/current/goblet/bdd/features/workflow.feature",
    //     "type": "scenario",
    //     "action": "start",
    //     "timestamp": 1642624894665
    //   },
    //   "end": {
    //     "id": "suite2",
    //     "description": "Scenario: Search the web for google",
    //     "fullName": "Feature > Workflow Scenario > Search the web for google",
    //     "failedExpectations": [],
    //     "testPath": "/keg/repos/lancetipton/current/goblet/bdd/features/workflow.feature",
    //     "status": "finished",
    //     "type": "scenario",
    //     "action": "end",
    //     "timestamp": 1642624907223
    //   }
    // },
    // "Given I navigate to \"https://www.google.com\"": {
    //   "start": {
    //     "id": "spec0",
    //     "description": "Given I navigate to \"https://www.google.com\"",
    //     "fullName": "Feature > Workflow Scenario > Search the web for google Given I navigate to \"https://www.google.com\"",
    //     "failedExpectations": [],
    //     "passedExpectations": [],
    //     "pendingReason": "",
    //     "testPath": "/keg/repos/lancetipton/current/goblet/bdd/features/workflow.feature",
    //     "type": "step",
    //     "action": "start",
    //     "timestamp": 1642624894665
    //   },
    //   "end": {
    //     "id": "spec0",
    //     "description": "Given I navigate to \"https://www.google.com\"",
    //     "fullName": "Feature > Workflow Scenario > Search the web for google Given I navigate to \"https://www.google.com\"",
    //     "failedExpectations": [],
    //     "passedExpectations": [],
    //     "pendingReason": "",
    //     "testPath": "/keg/repos/lancetipton/current/goblet/bdd/features/workflow.feature",
    //     "status": "passed",
    //     "type": "step",
    //     "action": "end",
    //     "timestamp": 1642624895937
    //   }
    // },
    // "When I set the element \".gLFyf\" text to \"@keg-hub/keg-core\"": {
    //   "start": {
    //     "id": "spec1",
    //     "description": "When I set the element \".gLFyf\" text to \"@keg-hub/keg-core\"",
    //     "fullName": "Feature > Workflow Scenario > Search the web for google When I set the element \".gLFyf\" text to \"@keg-hub/keg-core\"",
    //     "failedExpectations": [],
    //     "passedExpectations": [],
    //     "pendingReason": "",
    //     "testPath": "/keg/repos/lancetipton/current/goblet/bdd/features/workflow.feature",
    //     "type": "step",
    //     "action": "start",
    //     "timestamp": 1642624895937
    //   },
    //   "end": {
    //     "id": "spec1",
    //     "description": "When I set the element \".gLFyf\" text to \"@keg-hub/keg-core\"",
    //     "fullName": "Feature > Workflow Scenario > Search the web for google When I set the element \".gLFyf\" text to \"@keg-hub/keg-core\"",
    //     "failedExpectations": [],
    //     "passedExpectations": [],
    //     "pendingReason": "",
    //     "testPath": "/keg/repos/lancetipton/current/goblet/bdd/features/workflow.feature",
    //     "status": "passed",
    //     "type": "step",
    //     "action": "end",
    //     "timestamp": 1642624905799
    //   }
    // },
    // "When I press the key \"enter\"": {
    //   "start": {
    //     "id": "spec2",
    //     "description": "When I press the key \"enter\"",
    //     "fullName": "Feature > Workflow Scenario > Search the web for google When I press the key \"enter\"",
    //     "failedExpectations": [],
    //     "passedExpectations": [],
    //     "pendingReason": "",
    //     "testPath": "/keg/repos/lancetipton/current/goblet/bdd/features/workflow.feature",
    //     "type": "step",
    //     "action": "start",
    //     "timestamp": 1642624905799
    //   },
    //   "end": {
    //     "id": "spec2",
    //     "description": "When I press the key \"enter\"",
    //     "fullName": "Feature > Workflow Scenario > Search the web for google When I press the key \"enter\"",
    //     "failedExpectations": [],
    //     "passedExpectations": [],
    //     "pendingReason": "",
    //     "testPath": "/keg/repos/lancetipton/current/goblet/bdd/features/workflow.feature",
    //     "status": "passed",
    //     "type": "step",
    //     "action": "end",
    //     "timestamp": 1642624906310
    //   }
    // },
    // "Then the element \"#search\" contains the text \"@keg-hub/keg-core - npm\"": {
    //   "start": {
    //     "id": "spec3",
    //     "description": "Then the element \"#search\" contains the text \"@keg-hub/keg-core - npm\"",
    //     "fullName": "Feature > Workflow Scenario > Search the web for google Then the element \"#search\" contains the text \"@keg-hub/keg-core - npm\"",
    //     "failedExpectations": [],
    //     "passedExpectations": [],
    //     "pendingReason": "",
    //     "testPath": "/keg/repos/lancetipton/current/goblet/bdd/features/workflow.feature",
    //     "type": "step",
    //     "action": "start",
    //     "timestamp": 1642624906311
    //   },
    //   "end": {
    //     "id": "spec3",
    //     "description": "Then the element \"#search\" contains the text \"@keg-hub/keg-core - npm\"",
    //     "fullName": "Feature > Workflow Scenario > Search the web for google Then the element \"#search\" contains the text \"@keg-hub/keg-core - npm\"",
    //     "failedExpectations": [],
    //     "passedExpectations": [],
    //     "pendingReason": "",
    //     "testPath": "/keg/repos/lancetipton/current/goblet/bdd/features/workflow.feature",
    //     "status": "passed",
    //     "type": "step",
    //     "action": "end",
    //     "timestamp": 1642624907223
    //   }
    // }
  }
}
