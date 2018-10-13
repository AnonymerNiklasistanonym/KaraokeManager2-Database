/***************************************************************************************************************
 * Copyright 2018 AnonymerNiklasistanonym > https://github.com/AnonymerNiklasistanonym/KaraokeManager2-Database
 ***************************************************************************************************************/

/*
 * This file contains:
 * Dropzone initialization and configuration on the client side
 */

// Wait till all content is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Configure dropzone upload widget
  Dropzone.options.uploadWidget = {
    acceptedFiles: 'image/*',
    dictDefaultMessage: 'Drag an image here to set a new profile picture, or click to select one',
    headers: {
      'x-csrf-token': document.getElementById('token').value
    },
    maxFilesize: 3, // MB
    paramName: 'file',
    init () {
      const blub = Dropzone.forElement('#uploadWidget')

      console.log('never executed, ... yay')
      blub.on('thumbnail', (file, dataUrl) => {
        if (file.rejectDimensions !== undefined || file.acceptDimensions !== undefined) {
          // Do the dimension checks you want to do
          const maxImageWidth = 128
          const maxImageHeight = 128
          if (file.width > maxImageWidth || file.height > maxImageHeight) {
            file.rejectDimensions()
          } else {
            file.acceptDimensions()
          }
        }
        console.log('Thumbnail generated', file, dataUrl)
      })
      blub.on('drop', event => {
        console.log('Drop', event)
      })
      blub.on('dragenter', event => {
        console.log('Dragenter', event)
      })
      blub.on('dragleave', event => {
        console.log('Dragleave', event)
      })
      blub.on('addedfile', file => {
        console.log('Added file', file)
      })
      blub.on('removedfile', file => {
        console.log('Removed file', file)
      })
      blub.on('sending', (file, xhrObject, formData) => {
        console.log('Sending file', file, xhrObject, formData)
        // Will send the filesize along with the file as POST data.
        formData.append('filesize', file.size)
      })
      blub.on('success', (file, serverResponse) => {
        console.log('Success', serverResponse)
      })
      blub.on('uploadprogress', (file, progress, bytesSent) => {
        console.log('Upload progress', file, progress, bytesSent)
      })
      blub.on('error', (file, errorMessage) => {
        console.log('Error', file, errorMessage)
      })
      blub.on('processing', (file, progress) => {
        console.log('Processing', file)
      })
    },
    accept (file, done) {
      file.acceptDimensions = done
      file.rejectDimensions = () => {
        done('The image must be at least 128 x 128')
      }
    }
  }
  // Initialize dropzone upload widget
  Dropzone.options.uploadWidget.init()
})
