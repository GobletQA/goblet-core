// import * as vscode from 'vscode'
const { CodeGenerator } = require('./codeGenerator')

/**
* Records all raw page events received via playwright
*/
class EventsRecorder {
  rawEvents = []

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

  getCode = () => {
    const generator = new CodeGenerator(this)
    return generator.getCode()
  }
}


module.exports = {
  EventsRecorder: new EventsRecorder()
}