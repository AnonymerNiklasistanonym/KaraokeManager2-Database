#!/usr/bin/env node

/***************************************************************************************************************
 * Copyright 2018 AnonymerNiklasistanonym > https://github.com/AnonymerNiklasistanonym/KaraokeManager2-Database
 ***************************************************************************************************************/

/*
 * This file contains:
 * Document server routing hierarchy
 */

const expressListEndpoints = require('express-list-endpoints')
const { app } = require('../../server/server')
const fs = require('fs').promises
const path = require('path')
const DocumentationHelper = require('./../documentationHelper').DocumentationHelper

/**
 * Contains miscellaneous methods for ease of use of the server
 */
class DocumentServerRoutes {
  /**
   * Get all server routes
   * @returns {import('./serverRoutesTypes').IExpressListEndpointsObject[]}
   */
  static getServerRoutes () {
    return expressListEndpoints(app)
  }
  /**
   * Get JSON configuration file path
   * @returns {string}
   */
  static get jsonDataPath () {
    return path.join(__dirname, '../../../data/documentation/server_routes.json')
  }
  /**
   * Get JSON configuration object
   * @returns {Promise<import('./serverRoutesTypes').IJsonFileDataObject>}
   */
  static jsonContent () {
    return DocumentationHelper.getDocumentationInformationObject(this.jsonDataPath)
  }
  /**
   * Create markdown document of server routes
   * @param {import('./serverRoutesTypes').IFinalRouteObject[]} serverRoutes
   * @returns {string}
   */
  static createMarkdownContent (serverRoutes) {
    return serverRoutes.map(this.createMarkdownEntry).join('\n')
  }
  /**
   * Create markdown entry of server route
   * @param {import('./serverRoutesTypes').IFinalRouteObject} serverRoute
   * @returns {string} Markdown entry string
   */
  static createMarkdownEntry (serverRoute) {
    return `- \`${serverRoute.path}\` > **${serverRoute.methods.length === 0 ? '?' : serverRoute.methods.join(', ')}**${serverRoute.description !== undefined ? `<br>${serverRoute.description}` : ''}`
  }
  /**
   * Document server routes
   * @returns {Promise<void>}
   */
  static createDocumentation () {
    return new Promise((resolve, reject) => this.jsonContent()
      .then(jsonData => {
        const serverRoutes = this.getServerRoutes()
        const newThings = this.addInfoToServerRoutes(serverRoutes, jsonData.dictionary)
        const mdContent = this.createMarkdownContent(newThings.routes)
        Promise.all([fs.writeFile(this.jsonDataPath, JSON.stringify({ ...jsonData, dictionary: newThings.dictionary }, undefined, '\t')), DocumentationHelper.writeDocumentationFile(jsonData.filePath.join('/'),
          `# ${jsonData.title}\n\n` + mdContent + '\n', true)])
          .then(() => { resolve() })
          .catch(reject)
      })
      .catch(reject))
  }
  /**
   * Document server routes
   * @param {import('./serverRoutesTypes').IExpressListEndpointsObject[]} jsonRoutes
   * @param {import('./serverRoutesTypes').IJsonFileDataDictionaryObject[]} jsonDictionary
   * @returns {import('./serverRoutesTypes').IAddInfoToServerRoutesResult}
   */
  static addInfoToServerRoutes (jsonRoutes, jsonDictionary) {
    const routes = jsonRoutes.map(a => {
      const jsonDictionaryObject = jsonDictionary.find(b => b.path === a.path)
      return {
        ...a,
        description: jsonDictionaryObject !== undefined ? jsonDictionaryObject.description : 'TODO'
      }
    })
    const dictionary = routes.map(a => ({ path: a.path, description: a.description }))
    dictionary.push(...jsonDictionary.filter(a => dictionary
      .find(b => b.path === a.path) === undefined)
      .map(c => ({ path: c.path, description: c.description, currentlyUsed: false }))
      .sort())

    return { routes, dictionary }
  }
}

module.exports = DocumentServerRoutes
