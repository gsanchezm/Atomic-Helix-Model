Feature: Cart process

  As a Sauce Labs customer
  I want to review my cart and proceed to checkout
  So that I can complete my purchase

  Background:
    Given the application is launched
    And SauceLab user submit credentials
    When he has added items to the cart

  Scenario: View items in the cart
    Then the cart should display all added items with correct title and price

  Scenario: Remove item from the cart
    When he removes a product
    Then the product should no longer appear in the cart

  Scenario: Proceed to checkout
    When he proceed to checkout
    Then the checkout page should be displayed