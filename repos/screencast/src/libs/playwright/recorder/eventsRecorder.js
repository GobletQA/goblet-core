
const { constants } = require('./constants')
const { CodeGenerator } = require('./codeGenerator')

/**
* Records all raw page events received via playwright
*/
class EventsRecorder {
  rawEvents = []
  generator = null
  trackEvents = []
  lastEvent = {}
  keypressEvents = []
  keypressTimer = null

  constructor(){
    this.generator = new CodeGenerator(this)
  }

  recordEvent = (event) => {
    this.rawEvents.push(event)
  }

  /**
  * Captures a sequence of key presses on the same target within a given time frame
  * Builds and dispatches events for the key presses based on  a given time frame and target
  */
  processKeyPressEvents = (fireEvent) => {
    if(!this.keypressEvents.length) return

    const events = []

    const finalEvt = this.keypressEvents
      .reduce((acc, evt) => {
        if(!acc){
          // Check if the input already had text before
          evt.value !== evt.key &&
            (evt.previousValue = evt.value.slice(0, -1))

          return evt
        }
        
        const targetEqual = evt.target === acc.target
        const charEqual = evt.value.slice(0, -1) === acc.value

        // If the targets are equal but not the text 
        // Then assume the target was cleared, and replace with new text
        if(targetEqual && !charEqual){
          events.push(acc)
          events.push({...acc, value: ''})

          return evt
        }

        // If not target equal, then input was changed
        // So store the current acc, and switch to the new event
        else if(!targetEqual && charEqual){
          events.push(acc)
          return evt
        }

        // Otherwise the events are the same
        // So update the current acc with the next evt
        return {
          ...acc,
          ...evt,
        }
      }, false)

    // Add the final event to the end of any cached events
    events.push(finalEvt)
    
    
    // Loop all found events, generate the code, and call the fireEvent callback
    events.map(evt => {
      // Check if it's a keypress event or should convert into fill event
      const type = evt.key === evt.value
        ? constants.keypress
        : evt.previousValue
          ? evt.key === evt.value.slice(evt.previousValue.length)
            ? constants.keypress
            : constants.fill
          : constants.fill

      fireEvent({
        type: constants.recordAction,
        data: {
          ...evt,
          type,
          code: this.generator.codeFromEvent({ ...evt, type })
        },
        message: `keypress actions recorded`,
      })
    })

    this.keypressEvents = []
    this.keypressTimer = undefined
  }


  checkFillSequence = (pageEvent, fireEvent) => {
    // If a timer is already set, clear it out
    if(this.keypressTimer){
      clearTimeout(this.keypressTimer)
      delete this.keypressTimer
    }

    // Add the keypress event and reset the keypress timer 
    if(pageEvent.type === constants.keypress){
      this.keypressEvents.push(pageEvent)
      this.keypressTimer = setTimeout(() => 
        this.processKeyPressEvents.call(this, fireEvent),
        constants.pressTimeout
      )
      return false
    }

    // Non-keypress event and keypress exists the process the keypress events
    else if(this.keypressEvents.length) {
      this.processKeyPressEvents(fireEvent)
    }

    return true
  }


  /**
  * Checks that a sequence of down/up/click starts on the same target
  * If so, dispatches the number of events that constitute the sequence
  */
  checkClickSequence = (pageEvent, fireEvent) => {
    const lastEvtMD = this.lastEvent.type === constants.mousedown
    const lastEvtMU = this.lastEvent.type === constants.mouseup
    
    this.lastEvent = pageEvent

    // If last event was mouse up, and current event is click, use click only
    if(lastEvtMU && pageEvent.type === constants.click){
      // Get the cached mousedown event
      const downEvent = this.trackEvents.shift() || noOpObj
      this.trackEvents = []
      
      // Use the original target of the mousedown event
      const event = {
        ...pageEvent,
        target: downEvent.target || pageEvent.target
      }
  
      fireEvent({
        type: constants.recordAction,
        data: {
          ...event,
          code: this.generator.codeFromEvent(event)
        },
        message: `${event.type} action recorded`,
      })

      return false
    }

    // If last event was mouse down, and current event is mouse up
    // Then track mouse up and wait for click event
    else if(lastEvtMD && pageEvent.type === constants.mouseup){
      this.trackEvents.push(pageEvent)
      return false
    }

    // If this event is mousedown
    // Then track event and wait for mouseup event
    else if(pageEvent.type === constants.mousedown){
      this.trackEvents.push(pageEvent)
      return false
    }

    this.trackEvents = []

    return true
  }

}


module.exports = {
  EventsRecorder: new EventsRecorder()
}