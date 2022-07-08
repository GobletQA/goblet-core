@example
Feature: Example Feature!!! 
  As an internet user
  I want to navigate to google
  
  Scenario: Search the web for google
    Given I navigate to "https://www.google.com"
    When I set the element ".gLFyf" text to "@keg-hub/keg-core"
    When I press the key "enter"
    Then the element "#search" contains the text "@keg-hub/keg-core - npm"
    
