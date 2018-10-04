/***************************************************************************************************************
 * Copyright 2018 AnonymerNiklasistanonym > https://github.com/AnonymerNiklasistanonym/KaraokeManager2-Database
 ***************************************************************************************************************/

// Wait till all content is loaded
document.addEventListener('DOMContentLoaded', () => {

  // Define all HTML elements
  const musicRange = document.getElementById('musicRange')
  const fastForward = document.getElementById('fast-forward-button')
  const playPause = document.getElementById('play-pause-button')
  const playPauseIcon = document.getElementById('play-pause-icon')
  const fastRewind = document.getElementById('fast-rewind-button')

  // Define global variables
  let isSliderDragged = false
  let interval

  // Define global constants
  const wavesurfer = WaveSurfer.create({
    container: '#waveformContainer',
    waveColor: '#c5c5c5',
    progressColor: '#000000',
    cursorColor: '#000000',
    splitChannels: false,
    normalize: true,
    height: 128,
    cursorWidth: 1,
    responsive: true,
    mediaControls: true,
    fillParent: true,
    hideScrollbar: true
  })
  const context = new AudioContext()

  // Define constant anonymous functions
  const updateRange = () => {
    musicRange.value = Math.round(wavesurfer.getCurrentTime())
  }
  const onPlay = () => {
    interval = setInterval(() => {
      console.log('onplay')
      // Document.getElementById('timeButton').innerText = 'Time: ' + wavesurfer.getCurrentTime()
      if (isSliderDragged === false) { updateRange() }
    }, 100)
  }
  const onPause = () => {
    console.log('onpause')
    clearInterval(interval)
    // Document.getElementById('timeButton').innerText = 'Time: [Paused] ' + wavesurfer.getCurrentTime()
  }
  const updatePlayPause = () => {
    if (wavesurfer.isPlaying()) {
      playPauseIcon.innerHTML = 'pause'
      onPlay()
    } else {
      playPauseIcon.innerHTML = 'play_arrow'
      onPause()
    }
    updateRange()
  }

  /*
   * Define wavesurfer callback functions
   */
  // Callback when wavesurfer loaded the music file
  wavesurfer.on('ready', () => {
    // Set the range from 0 to maximum seconds
    musicRange.min = Math.round(0)
    musicRange.max = Math.round(wavesurfer.getDuration())
    // Update UI elements
    updatePlayPause()
  })
  // Callback when wavesurfer plays the music file
  wavesurfer.on('play', () => { updatePlayPause() })
  // Callback when wavesurfer pauses the music file
  wavesurfer.on('pause', () => { updatePlayPause() })
  // Callback when wavesurfer jumps to a timestamp of the music file
  wavesurfer.on('seek', () => { updateRange() })

  /*
   * Define HTML elements callback functions
   */
  // Recognize when user changes slider values
  musicRange.addEventListener('click', () => { isSliderDragged = true })
  // Recognize when user changes slider values and leaves
  musicRange.addEventListener('input', () => {
    wavesurfer.seekTo(musicRange.value === 0 ? 0 : musicRange.value / musicRange.max)
    isSliderDragged = false
  })
  // Recognize when user clicks 'play/pause' button
  playPause.addEventListener('click', () => {
    context.resume()
      .then(() => { wavesurfer.playPause() })
      .catch(console.error)
  })
  // Recognize when user clicks 'fast forward' button
  fastForward.addEventListener('click', () => { wavesurfer.skipForward() })
  // Recognize when user clicks 'fast rewind' button
  fastRewind.addEventListener('click', () => { wavesurfer.skipBackward() })

  /*
   * Load song file
   */
  wavesurfer.load(document.getElementById('songFile').value)
})
