import React, { useMemo, useRef, useEffect } from 'react'
import { noOpObj } from '@keg-hub/jsutils'
import { useStyle } from '@keg-hub/re-theme'
import { View } from '@keg-hub/keg-components/view'
import { ReOutputMain, ReMessage, ReMessageText } from './cmd.restyle'

const useRunMessages = messages =>
  useMemo(() => {
    return messages && Object.values(messages)
  }, [messages])

const bottomStyle = { maxHeight: 0, opacity: 0 }
const AlwaysScrollToBottom = ({ messagesAmount }) => {
  const bottomRef = useRef()

  useEffect(() => {
    bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
    // Tracks the message amount
    // Every time a new message is added, then scroll the view to the bottom
  }, [messagesAmount])

  return <View ref={bottomRef} style={bottomStyle} />
}

const Message = React.memo(({ styles = noOpObj, message, timestamp, type }) => {
  // TODO: Once the output is parsed
  // Add restyle components for the different types of messages
  // success / error / standard out, etc..
  // Then based on the message type, use that component to render the message
  return (
    <ReMessage>
      <ReMessageText>{message}</ReMessageText>
    </ReMessage>
  )
})

export const RenderOutput = ({ testRunModel = noOpObj, testFile }) => {
  const styles = useStyle(`cmdOutput.renderOutput`)
  const messages = useRunMessages(testRunModel?.messages)

  return (
    (
      <ReOutputMain>
        {messages &&
          messages.length &&
          messages.map(message => (
            <Message styles={styles} key={message.timestamp} {...message} />
          ))}
        <AlwaysScrollToBottom messagesAmount={messages && messages.length} />
      </ReOutputMain>
    ) || null
  )
}
