import React, { useMemo } from 'react'
import { Values } from 'HKConstants'
import { deepMerge } from '@keg-hub/jsutils'
import { toggleRotationStyle } from 'HKUtils/theme'
import { isEmptyFolderNode } from 'HKUtils/fileTree'
import { useStoreItems } from 'HKHooks/store/useStoreItems'
import { useActiveFile } from 'HKHooks/activeFile/useActiveFile'
import { useTheme, useThemeHover, useStyle } from '@keg-hub/re-theme'
import {
  ReIcon,
  ReName,
  RePending,
  ReNodeMain,
  ReEmptyMain,
  ReEmptyText,
} from './tree.restyle'

const { CATEGORIES } = Values

const useLevelMeta = (level, themePad, nodeType) =>
  useMemo(() => {
    const nodePad = nodeType === 'file' ? themePad : themePad * level

    return {
      nodeLevel: level === 0 ? 'root' : 'child',
      padStyle: level && { main: { paddingLeft: nodePad } },
    }
  }, [level, themePad, nodeType])

/**
 * Hook to get the correct styles for the tree node
 * @param {number} level - Current location within the tree of the nodes to be rendered
 * @param {string} nodeType - The type of node being checked ( Folder || File )
 * @param {boolean} isNodeActive - Is the node currently active
 *
 * @returns {Object} - Reg for the root node, and the styles to be applied
 */
const useTreeStyles = (level, nodeType, isNodeActive) => {
  const theme = useTheme()
  const treeStyle = useStyle('treeList')
  const { nodeLevel, padStyle } = useLevelMeta(level, theme.padding.size, nodeType)

  const [styleRef, mainStyles] = useThemeHover(
    treeStyle?.default?.[nodeLevel][nodeType],
    treeStyle?.hover?.[nodeLevel][nodeType]
  )
  const activeStyles = treeStyle?.active?.[nodeLevel][nodeType]

  return useMemo(() => {
    return {
      styleRef,
      styles: deepMerge(
        isNodeActive ? activeStyles : mainStyles,
        level && padStyle
      ),
    }
  }, [padStyle, styleRef, mainStyles, activeStyles, isNodeActive])
}

/**
 * Hook to memoize is a node is active base on it's path and the current active file path
 * @param {boolean} expanded - Is the node currently expanded
 * @param {string} nodeType - The type of node being checked ( Folder || File )
 * @param {Object} nodePath - Path to the node on the local file system
 * @param {Object} filePath - Path to the active file on the local file system
 *
 * @returns {boolean} - True if the node is active
 */
const useNodeActive = (expanded, nodeType, nodePath, filePath) =>
  useMemo(() => {
    return (expanded && nodeType === 'folder') || filePath === nodePath
  }, [expanded, nodeType, nodePath, filePath])

/**
 * Hook to memoize the name of the node based on it's type
 * @param {Object} node - node object: { children, location, id, modified, name, type }
 *
 * @returns {string} - Name of the node
 */
const useNodeName = node =>
  useMemo(() => {
    return node?.type === 'folder' ? node.name?.toUpperCase() : node.name
  }, [node?.type, node?.name])

/**
 * Hook to memoize to check which tree node has pending changes
 * @param {Array<FileModel>} pendingFiles - array of fileModels
 * @param {string} location - full path of current node location
 *
 * @returns {string} - Name of the node
 */
const usePendingContent = (pendingFiles, location) =>
  useMemo(() => {
    return pendingFiles && pendingFiles[location]
  }, [location, pendingFiles])

const RenderNodeText = props => {
  const { style, nodeName, showPending } = props

  return (
    <ReName style={style} className={`tree-node-name`}>
      {nodeName}
      {showPending && <RePending className={`tree-node-pending`}>*</RePending>}
    </ReName>
  )
}

/**
 * Component for list item based on the props
 * @param {Object} props
 * @param {Object} props.node - node object: { children, location, id, modified, name, type }
 * @param {Boolean} props.expanded - if the list item is expanded
 * @param {Boolean} props.hasChildren
 *
 */
export const RenderNode = ({ node, level, expanded }) => {
  const activeFile = useActiveFile()
  const { pendingFiles } = useStoreItems([CATEGORIES.PENDING_FILES])
  const nodeName = useNodeName(node)
  const nodeType = node?.type

  // Check if active file or expanded folder
  const isNodeActive = useNodeActive(
    expanded,
    nodeType,
    activeFile?.location,
    node?.location
  )
  const showPending = usePendingContent(pendingFiles, node?.location)
  const { styles, styleRef } = useTreeStyles(level, nodeType, isNodeActive)

  return (
    <ReNodeMain
      className={[`tree-node-main`, expanded ? `tree-node-expanded` : ``]}
      ref={styleRef}
      style={styles?.main}
    >
      <RenderNodeText
        nodeName={nodeName}
        style={styles?.text}
        showPending={showPending}
      />
      {nodeType === 'folder' ? (
        isEmptyFolderNode(node) ? (
          <ReEmptyMain className={`tree-node-empty-main`}>
            <ReEmptyText className={`tree-node-empty-text`}>
              ( Empty )
            </ReEmptyText>
          </ReEmptyMain>
        ) : (
          <ReIcon
            className={`tree-node-icon`}
            style={toggleRotationStyle({
              isToggled: expanded,
              onValue: 180,
              offValue: 0,
            })}
          />
        )
      ) : null}
    </ReNodeMain>
  )
}
