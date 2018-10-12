/***************************************************************************************************************
 * Copyright 2018 AnonymerNiklasistanonym > https://github.com/AnonymerNiklasistanonym/KaraokeManager2-Database
 ***************************************************************************************************************/

/*
 * This file contains:
 * Make time tags relative to the current time.
 */

// Wait till all content is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Run on load and then every 5 seconds in an interval
  RelativeTime.updateAllTimeTags()
  setInterval(() => { RelativeTime.updateAllTimeTags() }, 5000)
})

class RelativeTime {
  /**
   * Recognize all time tags and change their content to a relative time difference
   * @example <p>I have a date on <time datetime="2008-02-14 20:00">10 years ago</time>.</p>
   * <p>I made a post <time datetime="2018-10-12 11:18">10 seconds ago</time>.</p>
   */
  static updateAllTimeTags () {
    const allTimeTags = document.getElementsByTagName('time')
    // Set content of every time tag
    Array.from(allTimeTags)
      .forEach(timeTag => {
        // <time datetime="YYYY-MM-DDThh:mm:ssTZD">
        // Check if there is a datetime tag
        if (timeTag.dateTime !== undefined && timeTag.dateTime !== '') {
          const unixTime = new Date(timeTag.dateTime).getTime() / 1000
          // If unix time conversion was a number make time relative
          if (!isNaN(unixTime)) {
            timeTag.innerHTML = this.relativeTimeDifference(unixTime)
          }
        }
      })
  }

  /**
   * Function based on the code snippet from fearofawhackplanet
   * (https://stackoverflow.com/users/207752/fearofawhackplanet)
   * on Stack Overflow (https://stackoverflow.com/a/6109105/7827128)
   * @param {number} previousUnixTime - The unix time of the previous time
   */
  // tslint:disable-next-line:cyclomatic-complexity
  static relativeTimeDifference (previousUnixTime) {
    // Get the amount of minutes/hours/... per hour/day/...
    const msPerSecond = 1000
    const msPerMinute = msPerSecond * 60
    const msPerHour = msPerMinute * 60
    const msPerDay = msPerHour * 24
    const msPerMonth = msPerDay * 30
    const msPerYear = msPerDay * 365

    // Time elapsed from then to now (convert unix time to javascript time format)
    const elapsed = Date.now() - (previousUnixTime * 1000)

    const arrayOfObjects = [
      { divisor: msPerSecond, stringOne: 'second ago', stringMore: 'seconds ago' },
      { divisor: msPerMinute, stringOne: 'minute ago', stringMore: 'minutes ago' },
      { divisor: msPerHour, stringOne: 'hour ago', stringMore: 'hours ago' },
      { divisor: msPerDay, stringOne: 'day ago', stringMore: 'days ago' },
      { divisor: msPerMonth, stringOne: 'moth ago', stringMore: 'months ago' },
      { divisor: msPerYear, stringOne: 'year ago', stringMore: 'years ago' }
    ]

    // Calculate string output
    for (let index = 0; index < arrayOfObjects.length; index++) {
      if (index === arrayOfObjects.length - 1 || elapsed < arrayOfObjects[index + 1].divisor) {
        const agoTime = Math.round(elapsed / arrayOfObjects[index].divisor)

        return `${agoTime} ${(agoTime === 1 ? arrayOfObjects[index].stringOne : arrayOfObjects[index].stringMore)}`
      }
    }
  }
}
