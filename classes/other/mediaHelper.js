// import jimp and file read/writer
const Jimp = require('jimp')
const fs = require('fs')

/**
 * Static class that has methods to do things with images and co:
 * - methods to log website/cookie parameters in one command
 * - methods to get specific variables like the reti blue color
 */
class MediaLibrary {
  static get imageSizesDefaultProfilePicture () {
    return [60, 80, 128, 512]
  }

  static get fileNameDefaultProfilePicture () {
    return 'public\\pictures\\picture_profile_#_512.png'
  }

  static get fileNamesDefaultProfilePicture () {
    let fileNames = []
    for (let i = 0; i < this.imageSizesDefaultProfilePicture.length; i++) {
      fileNames.push(`public\\pictures\\picture_profile_#_${this.imageSizesDefaultProfilePicture[i]}.jpg`)
    }
    return fileNames
  }

  static getfileNamesCustomProfilePictures (accountId) {
    let fileNames = []
    for (let i = 0; i < this.imageSizesDefaultProfilePicture.length; i++) {
      fileNames.push(`public\\pictures\\picture_profile_${accountId}_${this.imageSizesDefaultProfilePicture[i]}.jpg`)
    }
    return fileNames
  }

  static checkDefaultProfilePictures (callback = console.log) {
    let allFilesWereFound = true
    for (let i = 0; i < this.fileNamesDefaultProfilePicture.length; i++) {
      if (fs.existsSync(this.fileNamesDefaultProfilePicture[i])) {} else {
        allFilesWereFound = false
        console.log(`>> ${this.fileNamesDefaultProfilePicture[i]} not found`)
      }
    }
    if (allFilesWereFound) {
      callback(null)
    } else {
      Jimp.read(this.fileNameDefaultProfilePicture, (err, imageFile) => {
        if (err) fs.unlinkSync(this.fileNameDefaultProfilePicture)
        if (err) return callback(err)
        imageFile.cover(this.imageSizesDefaultProfilePicture[0], this.imageSizesDefaultProfilePicture[0]).write(this.fileNamesDefaultProfilePicture[0])
        console.log(`>> Profile image was saved on server (${this.imageSizesDefaultProfilePicture[0]}px)`)

        Jimp.read(this.fileNameDefaultProfilePicture, (err, imageFile) => {
          if (err) fs.unlinkSync(this.fileNameDefaultProfilePicture)
          if (err) return callback(err)

          imageFile.cover(this.imageSizesDefaultProfilePicture[1], this.imageSizesDefaultProfilePicture[1]).write(this.fileNamesDefaultProfilePicture[1])
          console.log(`>> Profile image was saved on server (${this.imageSizesDefaultProfilePicture[1]}px)`)

          Jimp.read(this.fileNameDefaultProfilePicture, (err, imageFile) => {
            if (err) fs.unlinkSync(this.fileNameDefaultProfilePicture)
            if (err) return callback(err)

            imageFile.cover(this.imageSizesDefaultProfilePicture[2], this.imageSizesDefaultProfilePicture[2]).write(this.fileNamesDefaultProfilePicture[2])
            console.log(`>> Profile image was saved on server (${this.imageSizesDefaultProfilePicture[2]}px)`)

            Jimp.read(this.fileNameDefaultProfilePicture, (err, imageFile) => {
              if (err) fs.unlinkSync(this.fileNameDefaultProfilePicture)
              if (err) return callback(err)

              imageFile.cover(this.imageSizesDefaultProfilePicture[3], this.imageSizesDefaultProfilePicture[3]).write(this.fileNamesDefaultProfilePicture[3])
              console.log(`>> Profile image was saved on server (${this.imageSizesDefaultProfilePicture[3]}px)`)

              callback(null)
            })
          })
        })
      })
    }
  }

  static checkProfilePicturesOfAllAccountsAndRestoreThemIfNecessary (arrayWithAllAccountIds) {
    if (arrayWithAllAccountIds === null || arrayWithAllAccountIds === undefined || arrayWithAllAccountIds.length === 0) return
    for (let i = 0; i < arrayWithAllAccountIds.length; i++) {
      const accountFileNames = this.getfileNamesCustomProfilePictures(arrayWithAllAccountIds[i].id)
      let picturesWereRecovered = false
      for (let j = 0; j < this.fileNamesDefaultProfilePicture.length; j++) {
        if (!fs.existsSync(accountFileNames[j])) {
          picturesWereRecovered = true
          console.log('>> Copy file ' + this.fileNamesDefaultProfilePicture[j] + ' to ' + accountFileNames[j])
          fs.copyFileSync(this.fileNamesDefaultProfilePicture[j], accountFileNames[j])
        }
      }
      if (picturesWereRecovered) console.log(`>> Account pictures of account ${arrayWithAllAccountIds[i].id} - "${arrayWithAllAccountIds[i].name}" aka "${arrayWithAllAccountIds[i].nick_name}" were *recovered*`)
    }
  }

  static copyDefaultProfilePictures (accountId) {
    const accountFileNames = this.getfileNamesCustomProfilePictures(accountId)
    for (let i = 0; i < this.imageSizesDefaultProfilePicture.length; i++) {
      fs.copyFileSync(this.fileNamesDefaultProfilePicture[i], accountFileNames[i])
    }
  }

  static setProfilePicture (accountId, fileName, callback = console.log) {
    const removeFile = (fileName !== undefined)
    if (fileName === undefined) fileName = this.fileNameDefaultProfilePicture

    const accountImageFiles = this.getfileNamesCustomProfilePictures(accountId)

    Jimp.read(fileName, (err, imageFile) => {
      if (err && removeFile) fs.unlinkSync(fileName)
      if (err) return callback(err)

      imageFile.cover(this.imageSizesDefaultProfilePicture[0], this.imageSizesDefaultProfilePicture[0]).write(accountImageFiles[0])
      console.log(`>> Profile image was saved on server (${this.imageSizesDefaultProfilePicture[0]}px)`)

      Jimp.read(fileName, (err, imageFile) => {
        if (err && removeFile) fs.unlinkSync(fileName)
        if (err) return callback(err)

        imageFile.cover(this.imageSizesDefaultProfilePicture[1], this.imageSizesDefaultProfilePicture[1]).write(accountImageFiles[1])
        console.log(`>> Profile image was saved on server (${this.imageSizesDefaultProfilePicture[1]}px)`)

        Jimp.read(fileName, (err, imageFile) => {
          if (err && removeFile) fs.unlinkSync(fileName)
          if (err) return callback(err)

          imageFile.cover(this.imageSizesDefaultProfilePicture[2], this.imageSizesDefaultProfilePicture[2]).write(accountImageFiles[2])
          console.log(`>> Profile image was saved on server (${this.imageSizesDefaultProfilePicture[2]}px)`)

          Jimp.read(fileName, (err, imageFile) => {
            if (err && removeFile) fs.unlinkSync(fileName)
            if (err) return callback(err)

            imageFile.cover(this.imageSizesDefaultProfilePicture[3], this.imageSizesDefaultProfilePicture[3]).write(accountImageFiles[3])
            console.log(`>> Profile image was saved on server (${this.imageSizesDefaultProfilePicture[3]}px)`)

            if (removeFile) fs.unlinkSync(fileName)

            callback(null)
          })
        })
      })
    })
  }
}

// export the static class to another script
module.exports = MediaLibrary
