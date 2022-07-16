import { definitions } from './definitions'
import { drawer } from './drawer'
import { features } from './features'
import { header } from './header'
import { list } from './list'
import { surface } from './surface'
import { tabbar } from './tabbar'
import { toast } from './toast'
import { treeList } from './treeList'

export const components = theme => ({
  definitions: definitions(theme),
  drawer: drawer(theme),
  features: features(theme),
  list: list(theme),
  tabbar: tabbar(theme),
  treeList: treeList(theme),
  toast: toast(theme),
  ...header(theme),
  ...surface(theme),
})
