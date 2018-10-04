/***************************************************************************************************************
 * Copyright 2018 AnonymerNiklasistanonym > https://github.com/AnonymerNiklasistanonym/KaraokeManager2-Database
 ***************************************************************************************************************/

// Wait till all content is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize sidebar navigation for small devices/windows
  M.Sidenav.init(document.querySelector('.sidenav'), {
    inDuration: 350,
    outDuration: 350,
    edge: 'left',
    closeOnClick: true
  })
  // Toast demo
  M.toast({ html: 'I am a toast!' })
  // Toast with content demo
  M.toast({ html: '<span>I am toast content</span><button class="btn-flat toast-action">Undo</button>' })
  // Initialize FAB demo
  M.FloatingActionButton.init(document.querySelectorAll('.fixed-action-btn'), {})
  // Setup tooltipps
  M.Tooltip.init(document.querySelectorAll('.tooltipped'), {})
})
