import React from 'react'
import { TrackerMain, TrackerTests, TrackerText } from './screencast.restyle'

export const Tracker = props => {
  const { activeFile } = props

  return (
    <TrackerMain>
      <TrackerTests>
        <TrackerText>
          {activeFile.content}
        </TrackerText>
      </TrackerTests>
    </TrackerMain>
  )

}