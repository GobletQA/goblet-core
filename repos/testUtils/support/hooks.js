import { AfterAll, BeforeAll } from 'HerkinParkin'
import {
  initialize,
  cleanup,
} from 'HerkinRepos/testUtils/playwright/playwrightTestEnv'

BeforeAll(initialize)
AfterAll(cleanup)
