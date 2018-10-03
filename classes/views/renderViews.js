const Handlebars = require('handlebars')
const fs = require('fs').promises
const path = require('path')

const alignPathToViewsDirectory = path.join(__dirname, '../../views')
const dataPath = path.join(__dirname, '../../data/views/render.json')

/**
 * @param {string} filePath Path to a file
 * @returns {Promise<string>} File content
 */
const getFileContent = filePath =>
  new Promise((resolve, reject) =>
    fs.readFile(filePath)
      .then(content => content.toString()).then(resolve)
      .catch(reject))

/**
 * @param {string} filePath Path to a file
 * @returns {Promise<boolean>} File content
 */
const getFileExists = filePath =>
  new Promise((resolve, reject) =>
    fs.access(filePath).then(() => resolve(true)).catch(() => resolve(false)))

/**
 * @param {string} filePath Path to a file
 * @returns {Promise<*>} File content
 */
const getFileJsonContent = filePath =>
  new Promise((resolve, reject) =>
    getFileContent(filePath)
      .then(JSON.parse).then(resolve)
      .catch(reject))

/**
 * @param {{layoutFileName: string[],replacePaths: {findPath: string, replaceWith: string[], completePath?: true}[], templateFileName: string[]}
} object
 * @returns {Promise<void>}
 */
const renderTemplate = object => new Promise((resolve, reject) => {
  const layoutPath = path.join(alignPathToViewsDirectory, ...object.layoutFileName)
  const templatePath = path.join(alignPathToViewsDirectory, ...object.templateFileName)

  const layoutDataPath = layoutPath + '.json'
  const templateDataPath = templatePath + '.json'

  let layoutData = {}
  let templateData = {}
  const layoutDataPromise = new Promise((resolve, reject) => getFileExists(layoutDataPath)
    .then(exists => exists ? getFileJsonContent(layoutDataPath)
      .then(fileContent => { layoutData = fileContent }).then(resolve)
      .catch(reject) : resolve())
    .catch(reject))
  const templateDataPromise = new Promise((resolve, reject) => getFileExists(templateDataPath)
    .then(exists => exists ? getFileJsonContent(templateDataPath)
      .then(fileContent => { templateData = fileContent }).then(resolve)
      .catch(reject) : resolve())
    .catch(reject))

  const layoutCodePromise = getFileContent(layoutPath)
  const templateCodePromise = getFileContent(templatePath)

  Promise.all([layoutCodePromise, templateCodePromise])
    .then(resultCode => {
      const layout = Handlebars.compile(resultCode[0])
      const template = Handlebars.compile(resultCode[1])

      Promise.all([layoutDataPromise, templateDataPromise])
        .then(() => {
          let resultString = layout({ ...layoutData, body: template(templateData) })

          object.replacePaths.forEach(subObject => {
            const regex = new RegExp(subObject.findPath, 'g')
            let replaceWith = path.join(...subObject.replaceWith)
            for (let i = 0; i < object.templateFileName.length - 1; i++) {
              replaceWith = path.join('..', replaceWith)
            }
            const regex2 = new RegExp('\\\\', 'g')
            resultString = resultString.replace(regex, replaceWith.replace(regex2, '/') + (subObject.completePath === undefined ? '/' : ''))
          })

          const filePath = templatePath + '.html'
          fs.writeFile(filePath, resultString).then(() => { console.log('created file: ', filePath) }).then(resolve).catch(reject)
        })
        .catch(reject)
    })
    .catch(reject)
})

/**
 * @type {{layoutFileName: string[],replacePaths: {findPath: string, replaceWith: string[], completePath?: true}[], templateFiles: string[][]}[]}
 */
getFileJsonContent(dataPath)
  .then(dataObject => Promise.all([...dataObject.map(layout => Promise.all([...layout.templateFiles.map(template =>
    renderTemplate({ ...layout, templateFileName: template })
  )
  ]))]).catch(console.error)).catch(console.error)
