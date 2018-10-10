#!/usr/bin/env node

/***************************************************************************************************************
 * Copyright 2018 AnonymerNiklasistanonym > https://github.com/AnonymerNiklasistanonym/KaraokeManager2-Database
 ***************************************************************************************************************/

/*
 * This file contains:
 * Documentation file structure (Markdown) renderer
 */

const path = require('path')

/**
 * Render file structure to markdown
 */
class FileStructureRenderer {
  /**
   * Render the header of each file
   * @param {string} filePath
   * @param {number} depth
   * @param {boolean} isDirectory
   * @param {string} directory
   * @param {string} preDirectory
   * @returns {string}
   */
  static renderMarkdownFileHeader (filePath, depth, isDirectory = true, directory, preDirectory) {
    let directoryString = filePath
    if (directory !== undefined) {
      directoryString = path.join(directory, directoryString)
    }
    if (preDirectory !== undefined) {
      directoryString = path.join(preDirectory, directoryString)
    }

    return `${'#'.repeat(depth)}${isDirectory ? ' ' : ' '} ${filePath}` +
      ` [\`${isDirectory ? 'directory' : 'file'} link\`](${directoryString.replace(/\\/g, '/')})`
  }
  /**
   * @param {string} fileInfo
   * @returns {string}
   */
  static renderMarkdownFileInfo (fileInfo) {
    if (fileInfo === undefined) {
      return undefined
    }

    return fileInfo
  }
  /**
   * @param {object} jsonObject
   * @param {string} filePath
   * @param {string} directory
   * @param {string} preDirectory
   * @returns {string}
   */
  static renderMarkdownFileJsonHelp (jsonObject, filePath, directory, preDirectory) {
    if (jsonObject === undefined) {
      return undefined
    }

    let directoryString = filePath
    if (directory !== undefined) {
      directoryString = path.join(directory, directoryString)
    }
    if (preDirectory !== undefined) {
      directoryString = path.join(preDirectory, directoryString)
    }

    // tslint:disable-next-line:prefer-template
    return `[> JSON example template](${directoryString.replace(/\\/g, '/')}.json)\n\n` +
      `\`\`\`json\n${JSON.stringify(jsonObject, undefined, 2)}\n\`\`\``
  }
  /**
   * @param {boolean} render
   * @param {string} filePath
   * @param {string} directory
   * @param {string} preDirectory
   * @returns {string}
   */
  static renderMarkdownFileExample (render, filePath, directory, preDirectory) {
    if (render === undefined) {
      return undefined
    }
    let directoryString = filePath
    if (directory !== undefined) {
      directoryString = path.join(directory, directoryString)
    }
    if (preDirectory !== undefined) {
      directoryString = path.join(preDirectory, directoryString)
    }

    return `[> HTML example](${directoryString.replace(/\\/g, '/')}.html)`
  }
  /**
   * Render a markdown object to string
   * @param {import('./../documentationTypes').IFile} fileObject
   * @param {number} depth
   * @param {string} directoryPath
   * @param {string} preDirectory
   * @returns {import('../documentationTypes').IMdFile}
   */
  static renderFileToMarkdownObject (fileObject, depth = 1, directoryPath, preDirectory) {
    const markdownFileInfo = this.renderMarkdownFileInfo(fileObject.info)
    const markdownFileHeader = this.renderMarkdownFileHeader(fileObject.path, depth,
      fileObject.hasOwnProperty('files'), directoryPath, preDirectory)
    const markdownFileJsonHelp = this.renderMarkdownFileJsonHelp(fileObject.jsonHelp, fileObject.path,
      directoryPath, preDirectory)
    const markdownFileHtmlExample = this.renderMarkdownFileExample(fileObject.htmlExample,
      fileObject.path, directoryPath, preDirectory)

    if (fileObject.hasOwnProperty('files')) {
      const directoryPathNew = directoryPath ? path.join(directoryPath, fileObject.path) : fileObject.path
      const fileArray = fileObject.files.map(file =>
        this.renderFileToMarkdownObject(file, depth + 1, directoryPathNew, preDirectory))

      return {
        description: markdownFileInfo,
        files: fileArray,
        header: markdownFileHeader,
        htmlExample: markdownFileHtmlExample,
        jsonHelp: markdownFileJsonHelp
      }
    } else {
      return {
        description: markdownFileInfo,
        header: markdownFileHeader,
        htmlExample: markdownFileHtmlExample,
        jsonHelp: markdownFileJsonHelp
      }
    }
  }
  /**
   * Create Markdown string from a Markdown object
   * @param {import('../documentationTypes').IMdFile} markdownObject Markdown object
   * @returns {string} Markdown string of object
   */
  static renderFileToMarkdown (markdownObject) {
    // tslint:disable-next-line:cyclomatic-complexity
    let walkingString = markdownObject.header + '\n\n'
    if (markdownObject.hasOwnProperty('description') && markdownObject.description !== undefined) {
      walkingString += markdownObject.description + '\n\n'
    }
    if (markdownObject.hasOwnProperty('htmlExample') && markdownObject.htmlExample !== undefined) {
      walkingString += markdownObject.htmlExample + '\n\n'
    }
    if (markdownObject.hasOwnProperty('jsonHelp') && markdownObject.jsonHelp !== undefined) {
      walkingString += markdownObject.jsonHelp + '\n\n'
    }
    if (markdownObject.hasOwnProperty('files') && markdownObject.files !== undefined) {
      walkingString += markdownObject.files.map(a => this.renderFileToMarkdown(a))
        .join('\n\n')
    }

    return walkingString
  }
  /**
   * Get table of contents of a markdown string
   * @param {string} markdownString Markdown content string
   * @returns {string} Table of content as a markdown string
   */
  static getTocOfMdContent (markdownString) {
    const markdownAnalysis = markdownString
      .split('\n')
      .filter(line => line.startsWith('#'))
      .map(line => {
        const length = line
          .match(/^(#)*\s/)[0]
          .trim()
          .length
        const title = line
          .match(/\s(\S)*(\s\[)/)[0]
          .slice(0, -1)
          .trim()
        const linkTitle = line
          .match(/\[`(.)*`\]/)[0]
          .slice(2, -2)
          .trim()
        const link2 = line
          .match(/\[(.)*\)/)[0]

        return {
          link: `${title.replace(/[\s.]/, '-')}-${linkTitle.replace(/[\s.]/, '-')}`,
          link2,
          order: length,
          title
        }
      })
    let order = 999
    markdownAnalysis.forEach(element => {
      if (element.order < order) {
        order = element.order
      }
    })
    let walkingString = ''
    for (const element of markdownAnalysis) {
      walkingString += '  '.repeat(element.order - order) +
        ` - [${element.title}](#${element.link}) ${element.link2}\n`
    }

    return walkingString
  }
}

module.exports = FileStructureRenderer
