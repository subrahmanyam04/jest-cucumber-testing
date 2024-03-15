

Feature: Form Component
  As a user
  I want to interact with a form
  So that I can submit data

  Scenario: Inputting text into the form
    Given I have opened the form
    When I input "John" into the text input
    Then the text input should display "John"

  Scenario: Table updates after API call
    Given the getAllStudents function is mocked
    When the form component is rendered
    Then the table should contain the fetched data

  Scenario: Cancel Button in the form
    Given I have opened the form
    When I click the Cancel button
    Then the name field should be empty
    And the selected student ID should be null


  Scenario: Delete Button in the form
    Given I have opened the form
    When I click the Delete button for a student
    Then the student should be deleted from the list
    Then the get API is called

  Scenario: Edit Button in the form
    Given I have opened the form
    When I click the Edit button for a student
    Then the selected student id is set to the redux through action
    Then the student name should be displayed in the input field

  Scenario: Submitting the form with a valid name
    Given I have opened the form
    When I enter a valid name in the input field
    When I click submit button the form
    Then the form should send the name to the database through the addstudent
    Then After the successfull sending the name the get call should take place
    Then the input field should be cleared

  Scenario: Checking alert button while before submitting
    Given I have opened the form
    When the inputfield is empty
    Then I click submit button in the form
    Then should get an alert message 

  Scenario: Updating the form with a valid name
    Given I have opened the form
    When I click on the edit Button
    Then that editbutton holding the particular name should be set in inputfield
    Then I click on the Update button
    Then that upadted name along with use of the id the Update API is called
    Then After the successfull Updating the name the get call should take place
    Then the input field should be cleared

  Scenario: Checking alert button while before Updating
    Given I have opened the form
    When I click on the edit Button
    Then the inputfield is empty
    Then I click upadte button in the form
    Then should get an alert message


  Scenario: Catching and logging error if getAllStudents API call fails
    Given the getAllStudents API call fails
    When the Form component is rendered
    Then the error should be caught and logged

  Scenario: Deleting a student fails due to API call failure
    Given I have opened the form
    When I click the Delete button
    Then an error should be caught and logged

  Scenario: Updating a student fails due to API call failure
    Given I have opened the form
    When I click the Edit button
    When I enter name in the input field
    When I click the Update button
    Then an error should be caught and logged

 
