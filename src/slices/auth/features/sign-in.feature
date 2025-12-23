@web @auth
Feature: Sauce Labs Authentication

  Scenario: Valid login
    Given the application is launched
    When SauceLab user submit credentials
    Then the system should grant access

  Scenario: Invalid login
    Given the application is launched
    When SauceLab user submit locked credentials
    Then the system should show the error "Epic sadface: Sorry, this user has been locked out."

  Scenario: Missing credentials
    Given the application is launched
    When SauceLab user submit empty credentials
    Then the system should show the error "Epic sadface: Username is required"

  Scenario: Session handling
    When SauceLab user submit credentials
    And he log out
    Then the system should return to the login page