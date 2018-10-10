/***************************************************************************************************************
 * Copyright 2018 AnonymerNiklasistanonym > https://github.com/AnonymerNiklasistanonym/KaraokeManager2-Database
 ***************************************************************************************************************/

// Wait till all content is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize sidebar navigation for small devices/windows
  M.Sidenav.init(document.querySelector('.sidenav'), {
    closeOnClick: true,
    edge: 'left',
    inDuration: 350,
    outDuration: 350
  })
  // Toast demo
  M.toast({ html: 'I am a toast!' })
  // Toast with content demo
  M.toast({ html: '<span>I am toast content</span><button class="btn-flat toast-action">Undo</button>' })
  // Initialize FAB demo
  M.FloatingActionButton.init(document.querySelectorAll('.fixed-action-btn'), {})
  // Setup tooltipps
  M.Tooltip.init(document.querySelectorAll('.tooltipped'), {})
  // Setup popup for images
  M.Materialbox.init(document.querySelectorAll('.materialboxed'), {})
  // Tap target feature
  const instance = M.TapTarget.init(document.querySelectorAll('.tap-target'), {})
  if (instance !== undefined && instance.length >= 1) {
    instance[0].open()
  }
  // Collapsible elements
  M.Collapsible.init(document.querySelectorAll('.collapsible'), {})
})
