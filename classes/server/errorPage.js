#!/usr/bin/env node

/***************************************************************************************************************
 * Copyright 2018 AnonymerNiklasistanonym > https://github.com/AnonymerNiklasistanonym/KaraokeManager2-Database
 ***************************************************************************************************************/

/*
 * This file contains:
 * TODO
 */

const defaultLink = '/birds/test'
const defaultLinkText = 'Back to home page'
const defaultLinkObject = [{ link: defaultLink, text: defaultLinkText }]

class ErrorPage {
  /**
   * Get error page not empty body object
   * @param {*} bodyJson
   * @returns {{body: string, hasBody: boolean}}
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
   * @param {import('./serverTypes').IErrorPageLink[]} customLinks
   * @returns {import('./serverTypes').IErrorPageLinkReturnObject}
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
   * @param {import('./serverTypes').IErrorPageLink[]} linkObject
   * @param {boolean} add Add given link object to default link object
   * @returns {import('./serverTypes').IErrorPageLink[]}
   */
  static createErrorLinks (linkObject = defaultLinkObject, add = false) {
    if (add) {
      return [...defaultLinkObject, ...linkObject]
    } else {
      return linkObject
    }
  }
}

module.exports = ErrorPage
