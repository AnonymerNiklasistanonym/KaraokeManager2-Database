/***************************************************************************************************************
 * Copyright 2018 AnonymerNiklasistanonym > https://github.com/AnonymerNiklasistanonym/KaraokeManager2-Database
 ***************************************************************************************************************/

/*
 * This file contains:
 * LoginRegister helper
 */

// Wait till all content is loaded
document.addEventListener('DOMContentLoaded', () => {
  LoginRegister.login()
  document.getElementById('loginAction')
    .addEventListener('click', () => { LoginRegister.login(true) })
  document.getElementById('registerAction')
    .addEventListener('click', () => { LoginRegister.register(true) })
})

class LoginRegister {
  /**
   * @param {string} url Form URL
   * @param {boolean} submit Submit form
   */
  static overrideSubmitForm (url, submit = false) {
    const loginRegister = document.getElementById('loginRegisterForm')
    loginRegister.action = url
    if (submit) {
      if (loginRegister.checkValidity()) {
        loginRegister.submit()
      } else {
        loginRegister.reportValidity()
      }
    }
  }
  static login (submit = false) {
    this.overrideSubmitForm('/account/action/login', submit)
  }
  static register (submit = false) {
    this.overrideSubmitForm('/account/action/register', submit)
  }
}
