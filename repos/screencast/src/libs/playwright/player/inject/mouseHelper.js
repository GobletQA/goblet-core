/**
 * This injects a dom element into the page that moves with the mouse
 * This simulates the mouse movement when tests are running
 */


/**
 * Init script that checks if the script should run based on recording state
 */
async function initGobletMouseTracking(){
  // Check if the browser events should be recorder
  // Calls a globally injected script via playwright
  const isPlaying = await window.isGobletPlaying()
  if(!isPlaying) return

  // Install mouse helper only for top-level frame.
  window === window.parent &&
  window.addEventListener('DOMContentLoaded', () => {

    const box = document.createElement('goblet-mouse-pointer')
    const styleElement = document.createElement('style')

    styleElement.innerHTML = `
      goblet-mouse-pointer {
        pointer-events: none;
        position: absolute;
        top: 0;
        z-index: 10000;
        left: 0;
        width: 20px;
        height: 20px;
        background: rgba(0,0,0,.4);
        border: 1px solid white;
        border-radius: 10px;
        margin: -10px 0 0 -10px;
        padding: 0;
        transition: background .2s, border-radius .2s, border-color .2s;
      }
      goblet-mouse-pointer.button-1 {
        transition: none;
        background: rgba(0,0,0,0.9);
      }
      goblet-mouse-pointer.button-2 {
        transition: none;
        border-color: rgba(0,0,255,0.9);
      }
      goblet-mouse-pointer.button-3 {
        transition: none;
        border-radius: 4px;
      }
      goblet-mouse-pointer.button-4 {
        transition: none;
        border-color: rgba(255,0,0,0.9);
      }
      goblet-mouse-pointer.button-5 {
        transition: none;
        border-color: rgba(0,255,0,0.9);
      }
    `

    document.head.appendChild(styleElement)
    document.body.appendChild(box)

    document.addEventListener('mousemove', event => {
      box.style.left = event.pageX + 'px'
      box.style.top = event.pageY + 'px'
      updateButtons(event.buttons)
    }, true)

    document.addEventListener('mousedown', event => {
      updateButtons(event.buttons)
      box.classList.add('button-' + event.which);
    }, true)

    document.addEventListener('mouseup', event => {
      updateButtons(event.buttons)
      box.classList.remove('button-' + event.which);
    }, true)
    
    const updateButtons = (buttons) => {
      for (let i = 0; i < 5; i++)
        box.classList.toggle('button-' + i, buttons & (1 << i))
    }

  }, false)

}


initGobletMouseTracking()


