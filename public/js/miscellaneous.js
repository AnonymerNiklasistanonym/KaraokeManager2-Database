/***************************************************************************************************************
 * Copyright 2018 AnonymerNiklasistanonym > https://github.com/AnonymerNiklasistanonym/KaraokeManager2-Database
 ***************************************************************************************************************/

/*
 * This file contains:
 * A collection of small things
 */

/**
 * Prevents a form from submitting itself when executing on a button click
 * @param {event} event Form event
 * @param {function} callback Callback function
 * @example <input type="submit" value="Share" onclick="formEventReplacement(event,() => alert('Reaction'))">
 */
const formEventReplacement = (event, callback) => {
  // Prevent the form from submitting
  event.preventDefault()
  // Call the callback function
  callback()
}

// tslint:disable:max-line-length
/**
 * Method to add event listeners to an input element
 * @param {HTMLElement} textInputElement Text input element
 * @param {{click?:function(Event,string,*),focus?:function(Event,string,*),focusout?:function(Event,string,*),input?:function(Event,string,*)}} callbacks Callback functions
 */
const trackTextInput = (textInputElement, callbacks) => {
  // tslint:disable-next-line:cyclomatic-complexity
  if ((textInputElement === undefined || textInputElement === null) ||
        (callbacks === undefined || callbacks === {})) {
    // Only add event listeners if the element exists
    return
  }
  if (callbacks.click !== undefined) {
    textInputElement.addEventListener('click', event => {
      callbacks.click(event, textInputElement.value,
        textInputCursorConversion(event, textInputElement.value))
    })
  }
  if (callbacks.input !== undefined) {
    textInputElement.addEventListener('input', event => {
      callbacks.input(event, textInputElement.value,
        textInputCursorConversion(event, textInputElement.value))
    })
  }
  if (callbacks.focus !== undefined) {
    textInputElement.addEventListener('focus', event => {
      callbacks.focus(event, textInputElement.value,
        textInputCursorConversion(event, textInputElement.value))
    })
  }
  if (callbacks.focusout !== undefined) {
    textInputElement.addEventListener('focusout', event => {
      callbacks.focusout(event, textInputElement.value,
        textInputCursorConversion(event, textInputElement.value, false))
    })
  }
}
// tslint:enable:max-line-length

/**
 * Convert event and text content to object
 * @param {Event} event Input event
 * @param {string} textInput Input content
 * @param {boolean} isFocused Is the input element focused
 * @returns {{afterCursor:string,beforeCursor:string,focused:boolean}} object
 */
const textInputCursorConversion = (event, textInput, isFocused = true) => ({
  afterCursor: textInput.substring(event.target.selectionStart),
  beforeCursor: textInput.substring(0, event.target.selectionStart),
  focused: isFocused
})
