import React from 'react'
import { CmdOutput } from './cmdOutput'
import { Aside } from 'HKComponents/aside'

const asideProps = {
  to: 0,
  type: 'spring',
  location: 'right',
  sidebarWidth: `60vw`,
  config: {
    speed: 20,
    bounciness: 1,
  },
  styles: {
    container: {
      minHeight: '90vh',
    },
  },
}

export const AsideCmdOutput = props => {
  // TODO: Add listener for browser window side
  // When it changes, need to also change the asideProps to match

  return (
    <Aside {...asideProps}>
      <CmdOutput activeFile={props.activeFile} />
    </Aside>
  )
}
