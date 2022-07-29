
import { TSpawnOpts } from '../types'

/**
 * Used to filter the input options passed to the spawn endpoint
 * Ensures only valid options are passed

  * Possible Options
    Image: 'ubuntu',
    AttachStdin: false,
    AttachStdout: true,
    AttachStderr: true,
    Tty: true,
    Cmd: ['/bin/bash', '-c', 'tail -f /var/log/dmesg'],
    OpenStdin: false,
    StdinOnce: false

 */
export const filterSpawnOpts = (options:TSpawnOpts) => {
  
}