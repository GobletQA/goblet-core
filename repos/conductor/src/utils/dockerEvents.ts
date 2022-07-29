import Dockerode from 'dockerode'
import DockerEvents from 'docker-events'
import { checkCall, noOpObj } from '@keg-hub/jsutils'
import { TControllerEvts } from '../types'

const eventTypes = [
  `die`,
  `start`,
  `stop`,
  `create`,
  `destroy`,
  `connect`,
  `message`,
  `disconnect`,
]

/**
 * Adds event listeners to docker api events, and calls corresponding callbacks
 */
export const dockerEvents = (docker:Dockerode, events:TControllerEvts=noOpObj):DockerEvents => {
  const emitter = new DockerEvents({ docker })

  eventTypes.map(type => {
    emitter.on(type, (message?:string) => {
      console.log(`Docker-Api Event: "${type}"`)
      checkCall(events[type], message)
    })
  })

  emitter.start()

  return emitter
}
