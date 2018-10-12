/***************************************************************************************************************
 * Copyright 2018 AnonymerNiklasistanonym > https://github.com/AnonymerNiklasistanonym/KaraokeManager2-Database
 ***************************************************************************************************************/

/*
 * This file contains:
 * LoginRegister helper
 */

// Wait till all content is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Make default action to log in
  LoginRegister.login()
  // Add login/register button 'on-click' listener for submitting to each corresponding site
  document.getElementById('loginAction')
    .addEventListener('click', () => { LoginRegister.login(true) })
  document.getElementById('registerAction')
    .addEventListener('click', () => { LoginRegister.register(true) })
})

class LoginRegister {
  /**
   * Overload default form submission which changes the action URL
   * and if wanted submits the form after checking validity
   * @param {string} url Form URL
   * @param {boolean} submit Submit form
   */
  static overrideSubmitForm (url, submit = false) {
    const loginRegister = document.getElementById('loginRegisterForm')
    loginRegister.action = url
    // If wanted try to submit the form
    if (submit) {
      // Therefore check first the validity of the form
      if (loginRegister.checkValidity()) {
        // If it is valid submit
        loginRegister.submit()
      } else {
        // If not show default validity warning
        loginRegister.reportValidity()
      }
    }
  }
  /**
   * Submit form to login route
   * @param {boolean} submit Submit form
   */
  static login (submit = false) {
    this.overrideSubmitForm('/account/action/login', submit)
  }
  /**
   * Submit form to register route
   * @param {boolean} submit Submit form
   */
  static register (submit = false) {
    this.overrideSubmitForm('/account/action/register', submit)
  }
}
