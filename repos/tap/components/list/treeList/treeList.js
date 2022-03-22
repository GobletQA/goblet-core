import React, { useMemo } from 'react'
import { Values } from 'HKConstants'
import { RenderNode } from './renderNode'
import { RenderTree } from './renderTree'
import { Loading } from '@keg-hub/keg-components'
import { constructFileTree } from 'HKUtils/fileTree'
import { noOpObj, checkCall } from '@keg-hub/jsutils'
import { useStoreItems } from 'HKHooks/store/useStoreItems'
import { useLoadFileByType } from 'HKHooks/activeFile/useLoadFileByType'

const { CATEGORIES } = Values

/**
 * Only close the sidebar if it's not a folder that's clicked
 * @param {Object} node - TreeList node
 *
 */
const closeOnFile = (node, callback) => {
  node.type !== 'folder' && checkCall(callback, false)
}

/**
 * TreeList
 * @param {Object} props
 * @param {Function} props.onSidebarToggled - function to toggle on/off the sidebar if needed
 *
 */
export const TreeList = props => {
  const { fileTree = noOpObj } = useStoreItems([CATEGORIES.FILE_TREE])
  const { rootPaths, nodes } = fileTree
  const { onSidebarToggled } = props

  const tree = useMemo(
    () => constructFileTree(rootPaths, nodes),
    [rootPaths, nodes]
  )

  const onItemPress = useLoadFileByType(closeOnFile, onSidebarToggled)

  return !tree ? (
    <Loading />
  ) : (
    <RenderTree
      data={tree || []}
      renderNode={RenderNode}
      onNodePress={onItemPress}
    />
  )
}
