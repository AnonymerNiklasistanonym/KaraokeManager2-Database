/***************************************************************************************************************
 * Copyright 2018 AnonymerNiklasistanonym > https://github.com/AnonymerNiklasistanonym/KaraokeManager2-Database
 ***************************************************************************************************************/

/*
 * Make notifications
 */

/**
 * A function callback array: Map<number, function>
 * Save the action todo in here and remove it later or call it
 */
const toastCallbackActions = new Map([])

/**
 * Create notifications
 */
class NotificationHelper {
  /**
   * Display toast
   * @param {string} message Message to display
   * @param {function} [timeoutCallback] Function that gets called when message timed out
   * @param {{title: string, action: function}} [buttonAction] Button action text and action function
   * @example NotificationHelper.createToast('hi')
   * @example NotificationHelper.createToast('hi', () => { alert('Timeout') })
   * @example NotificationHelper.createToast('hi', undefined,
   *   { title: 'action', action: () => { alert('Action') } })
   * @example NotificationHelper.createToast('hi', () => { alert('Timeout') },
   *   { title: 'action', action: () => { alert('Action') } })
   */
  static createToast (message, timeoutCallback, buttonAction) {
    const toast = { html: message }
    if (timeoutCallback !== undefined) {
      toast.completeCallback = () => { timeoutCallback() }
    }
    if (buttonAction !== undefined) {
      // Create unique id for mapping the callback function to a Map
      let id = 0
      while (toastCallbackActions.has(id)) {
        id = Math.floor(Math.random() * 1000000)
        console.log(id)
      }
      // Create new button content
      toast.html = `<span>${toast.html}</span>` +
        `<button onclick="Notifications.toastActionCallback(${id})" class="btn-flat toast-action">` +
        `${buttonAction.title}</button>`
      // Add action to map
      toastCallbackActions.set(id, buttonAction.action)
      // Delete action from map after the timeout
      if (timeoutCallback !== undefined) {
        toast.completeCallback = () => {
          timeoutCallback()
          toastCallbackActions.delete(id)
        }
      } else {
        toast.completeCallback = () => { toastCallbackActions.delete(id) }
      }
    }
    M.toast(toast, 10000)
  }
  /**
   * Call previously saved callback action
   * @param {number} id Unique callback action identifier
   */
  static toastActionCallback (id) {
    // Check if the id fits to an existing mapped function
    if (toastCallbackActions.has(id)) {
      // If yes execute this function and then delete the entry
      toastCallbackActions.get(id)()
      toastCallbackActions.delete(id)
    } else {
      console.error(`toastActionCallback > Id not found! (${id})`)
    }
  }
  /**
   * Returns if the browser 'Notifications_API' can be used
   * https://notifications.spec.whatwg.org/#dom-notification-actions,
   * https://developer.mozilla.org/en-US/docs/Web/API/Notification/Notification,
   * https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API
   * @returns {Promise<boolean>} True when supported
   */
  static checkIfNativeNotificationsAreSupported () {
    return new Promise((resolve, reject) => {
      if (!('Notification' in window)) {
        reject(Error('This browser does not support desktop notifications api!'))
      }
      // If supported request permission to use notification api
      if (window.Notification.permission !== 'granted') {
        window.Notification.requestPermission(() => {
          if (window.Notification.permission === 'granted') {
            resolve(true)
          } else {
            reject(Error('The user did not grant permission to use the desktop notifications api!'))
          }
        })
      } else {
        resolve(true)
      }
    })
  }
  /**
   * Show a native notification
   * @param {string} title Message title
   * @param {string} body Message body
   * @param {string} image Image URL
   * @param {string} icon Icon image URL
   * @param {function} onclick On click callback
   * @example NotificationHelper.showNotification('Title', 'Body')
   * @example NotificationHelper.showNotification('Title', 'Body',
   *  'https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Wikipedia-logo-v2.svg/526px-Wikipedia-logo-v2.svg.png')
   * @example NotificationHelper.showNotification('Title', 'Body',
   *  'https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Wikipedia-logo-v2.svg/526px-Wikipedia-logo-v2.svg.png',
   *  'https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Wikipedia-logo-v2.svg/526px-Wikipedia-logo-v2.svg.png')
   * @example NotificationHelper.showNotification('Title', 'Body',
   *  undefined, undefined, () => { alert('Callback [OnClick]') })
   */
  static showNotification (title, body, image, icon, onclick) {
    this.checkIfNativeNotificationsAreSupported()
      // tslint:disable-next-line:cyclomatic-complexity
      .then(supported => {
        if (!supported) {
          console.error('API not supported!')
        } else {
          // Allow only messages that have at least a title and a body
          if (title === undefined || body === undefined) { return }
          // Add the text to the notification
          const options = { body }
          // Add additional information to the notification
          if (image !== undefined) { options.image = image }
          if (icon !== undefined) { options.icon = icon }
          // Create notification
          const notification = new window.Notification(title, options)
          // Add onclick action (url for example)
          if (onclick !== undefined) {
            notification.onclick = onclick
          }
        }
      }).catch(console.error)
  }
}
