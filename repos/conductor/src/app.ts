require('source-map-support').install({environment: 'node'})
import { Conductor } from './index'
import { appConfig } from '@gobletqa/conductor/configs/app.config'

new Conductor(appConfig).start()
