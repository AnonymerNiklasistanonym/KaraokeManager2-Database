#!/usr/bin/env node

/***************************************************************************************************************
 * Copyright 2018 AnonymerNiklasistanonym > https://github.com/AnonymerNiklasistanonym/KaraokeManager2-Database
 ***************************************************************************************************************/

/*
 * This file contains:
 * Error page handler methods
 * - Create error links
 * - Default error link (Back to home)
 * - Error body object
 */

const defaultLink = '/'
const defaultLinkText = 'Back to home page'
const defaultLinkObject = [{ link: defaultLink, text: defaultLinkText }]

/**
 * Ease of use class for error pages
 */
class ErrorPage {
  /**
   * Get error page not empty body object
   * @param {*} bodyJson Json data object
   * @returns {import('./errorPageTypes').IErrorPageBodyReturnObject}
   */
  static getCustomBody (bodyJson) {
    let body = bodyJson
    let hasBody = false
    if (body !== undefined && Object.getOwnPropertyNames(body).length !== 0) {
      hasBody = true
      body = JSON.stringify(body, undefined, 2)
    }

    return { body, hasBody }
  }
  /**
   * Get error page links
   * @param {import('./errorPageTypes').IErrorPageLink[]} customLinks
   * @returns {import('./errorPageTypes').IErrorPageLinkReturnObject}
   */
  static getCustomLinks (customLinks) {
    let links
    let hasLinks = false
    if (customLinks !== undefined && customLinks.length > 0) {
      links = customLinks
      hasLinks = true
    }

    return { hasLinks, links }
  }
  /**
   * Create error page links ('Back to homepage')
   * Default argument is for a 'back to home page' link
   * @param {import('./errorPageTypes').IErrorPageLink[]} linkObject
   * @param {boolean} add Add given link object to default link object
   * @returns {import('./errorPageTypes').IErrorPageLink[]}
   */
  static createErrorLinks (linkObject = defaultLinkObject, add = false) {
    return add ? [...defaultLinkObject, ...linkObject] : linkObject
  }
}

module.exports = ErrorPage
