// import * as vscode from 'vscode'
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
  * Given a start index in the list of events, check that a sequence of down/up/click starts at this position, on the
  * same target. If so, return the number of events that consistute the sequence. Otherwise return -1.
  */
  lookAheadForClickSequence = (startIndex) => {
    const first = this.rawEvents[startIndex]
    const second = this.rawEvents[startIndex + 1]
    const third = this.rawEvents[startIndex + 2]

    const startsWithMouseDown = first && first.type === 'mousedown'
    if (!startsWithMouseDown) {
      return -1
    }
    const target = first.target

    const continuesWithMouseUp = second && second.type === 'mouseup' && second.target === target
    if (!continuesWithMouseUp) {
      return -1
    }

    const finishesWithClick = third && third.type === 'click' && third.target === target
    if (!finishesWithClick) {
      return -1
    }

    return 3
  }

  /**
  * Given a start index in the list of events, check that a sequence of keypresses starts at this position, on the
  * same target. If so, return the number of events that consistute the sequence. Otherwise return -1.
  */

  lookAheadForFillSequence = (startIndex) => {
    const first = this.rawEvents[startIndex]
    if (!first || first.type !== 'keypress' || first.key?.length !== 1) {
      return -1
    }
    const target = first.target

    let length = 1
    while (this.rawEvents[startIndex + length] && this.rawEvents[startIndex + length].type === 'keypress' && this.rawEvents[startIndex + length].target === target) {
      length ++
    }

    return length
  }

  /**
  * Create a new PageEvent array based on the raw one, but removing subsequent key presses, turning them into fill
  * events, and removing down/up mouse events, turning them into clicks.
  */
  getProcessedEvents = () => {
    const processedEvents = []

    for (let i = 0; i < this.rawEvents.length; i++) {
      const clickSequenceLength = this.lookAheadForClickSequence(i)
      if (clickSequenceLength > -1) {
        processedEvents.push({
          type: 'click',
          target: this.rawEvents[i].target
        })
        i += clickSequenceLength - 1
        continue
      }

      const fillSequenceLength = this.lookAheadForFillSequence(i)
      if (fillSequenceLength > -1) {
        processedEvents.push({
          type: 'fill',
          target: this.rawEvents[i].target,
          inputValue: this.rawEvents[i + fillSequenceLength - 1].inputValue
        })
        i += fillSequenceLength - 1
        continue
      }

      processedEvents.push(this.rawEvents[i])
    }
    
    return processedEvents
  }


  processKeyPressEvents = (fireEvent) => {
    if(!this.keypressEvents.length) return

    const events = []

    const finalEvt = this.keypressEvents
      .reduce((acc, evt) => {
        if(!acc){
          // Check if the input already had text before
          evt.inputValue !== evt.key &&
            (evt.previousValue = evt.inputValue.slice(0, -1))

          return evt
        }
        
        const targetEqual = evt.target === acc.target
        const charEqual = evt.inputValue.slice(0, -1) === acc.inputValue

        // If the targets are equal but not the text 
        // Then assume the target was cleared, and replace with new text
        if(targetEqual && !charEqual){
          events.push(acc)
          events.push({...acc, inputValue: ''})

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
      const type = evt.key === evt.inputValue
        ? `keypress`
        : evt.previousValue
          ? evt.key === evt.inputValue.slice(evt.previousValue.length)
            ? `keypress`
            : `fill`
          : `fill`

      fireEvent({
        type: 'RECORD-ACTION',
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
    if(pageEvent.type === 'keypress'){
      this.keypressEvents.push(pageEvent)
      this.keypressTimer = setTimeout(() => this.processKeyPressEvents.call(this, fireEvent), 2000)
      return false
    }

    // Non-keypress event and keypress exists the process the keypress events
    else if(this.keypressEvents.length) {
      this.processKeyPressEvents(fireEvent)
    }

    return true
  }

  checkClickSequence = (pageEvent, fireEvent) => {
    const lastEvtMD = this.lastEvent.type === 'mousedown'
    const lastEvtMU = this.lastEvent.type === 'mouseup'
    
    this.lastEvent = pageEvent

    // If last event was mouse up, and current event is click, use click only
    if(lastEvtMU && pageEvent.type === 'click'){
      // Get the cached mousedown event
      const downEvent = this.trackEvents.shift() || noOpObj
      this.trackEvents = []
      
      // Use the original target of the mousedown event
      const event = {
        ...pageEvent,
        target: downEvent.target || pageEvent.target
      }
  
      fireEvent({
        type: 'RECORD-ACTION',
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
    else if(lastEvtMD && pageEvent.type === 'mouseup'){
      this.trackEvents.push(pageEvent)
      return false
    }

    // If this event is mousedown
    // Then track event and wait for mouseup event
    else if(pageEvent.type === 'mousedown'){
      this.trackEvents.push(pageEvent)
      return false
    }

    this.trackEvents = []

    return true
  }

  getCode = () => {
    return this.generator.getCode()
  }
}


module.exports = {
  EventsRecorder: new EventsRecorder()
}