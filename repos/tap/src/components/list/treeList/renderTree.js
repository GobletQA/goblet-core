import React, { useState, useRef, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { TreeNodes } from './treeNodes'
import { get, noOp } from '@keg-hub/jsutils'

/**
 * Hook to check if specific props have updated
 * If they have, then reset the expanded nodes
 * @param {Object} props - Props of the current render
 * @param {function} setExpandedNodes - Updates the expanded nodes state when called
 */
const useCheckPropsUpdate = (props, setExpandedNodes) => {
  const { data, idKey, childrenKey } = props
  const propsRef = useRef({ data, idKey, childrenKey })

  useEffect(() => {
    const hasDataUpdated = propsRef.current.data !== data
    const hasIdKeyUpdated = propsRef.current.idKey !== idKey
    const childrenKeyUpdated = propsRef.current.childrenKey !== childrenKey

    // Check if props have updated, if not, just return
    if (!hasDataUpdated && !hasIdKeyUpdated && !childrenKeyUpdated) return

    // If there was an update,
    // Then update the ref, and reset the expanded nodes
    propsRef.current.data = data
    propsRef.current.idKey = idKey
    propsRef.current.childrenKey = childrenKey
    setExpandedNodes({})
  }, [data, idKey, childrenKey, setExpandedNodes])
}

/**
 * Hook to build all the callbacks needed to update nodes state
 * @param {Object} props - Props of the current render
 * @param {Object} expandedNodes - Current state of expanded nodes
 * @param {function} setExpandedNodes - Updates the expanded nodes state when called
 *
 * @returns {Object} - Contains callback function to interact with a nodes expanded state
 */
const useNodeCallbacks = (props, expandedNodes, setExpandedNodes) => {
  const {
    idKey,
    childrenKey,
    onNodePress,
    initialExpanded,
    isNodeExpanded = noOp,
  } = props

  const hasChildren = useCallback(
    node => get(node, `${childrenKey}.length`, 0) > 0,
    [childrenKey, expandedNodes]
  )

  const isExpanded = useCallback(
    id =>
      isNodeExpanded !== noOp
        ? isNodeExpanded(id)
        : get(expandedNodes, id, initialExpanded),
    [expandedNodes, isNodeExpanded, initialExpanded]
  )

  const updateNodeKeyById = useCallback(
    (id, expanded) => {
      setExpandedNodes({ ...expandedNodes, [id]: expanded })
    },
    [expandedNodes, setExpandedNodes]
  )

  const collapseNode = useCallback(
    id => updateNodeKeyById(id, false),
    [updateNodeKeyById]
  )
  const expandNode = useCallback(
    id => updateNodeKeyById(id, true),
    [updateNodeKeyById]
  )

  const toggleCollapse = useCallback(
    id => {
      isExpanded(id) ? collapseNode(id) : expandNode(id)
    },
    [isExpanded, expandNode, collapseNode, expandedNodes]
  )

  const handlePressed = useCallback(
    async ({ node, level }) => {
      const nodePressResult = await onNodePress({ node, level })
      nodePressResult !== false &&
        hasChildren(node) &&
        toggleCollapse(node[idKey])
    },
    [idKey, hasChildren, onNodePress, expandedNodes, toggleCollapse]
  )

  return {
    isExpanded,
    hasChildren,
    handlePressed,
  }
}

export const RenderTree = props => {
  const [expandedNodes, setExpandedNodes] = useState({})
  useCheckPropsUpdate(props, setExpandedNodes)

  const { isExpanded, hasChildren, handlePressed } = useNodeCallbacks(
    props,
    expandedNodes,
    setExpandedNodes
  )

  return (
    <TreeNodes
      level={0}
      nodes={props.data}
      idKey={props.idKey}
      RenderNodes={TreeNodes}
      isExpanded={isExpanded}
      hasChildren={hasChildren}
      handlePressed={handlePressed}
      renderNode={props.renderNode}
      childrenKey={props.childrenKey}
      pressOpacity={props.pressOpacity}
      onNodeLongPress={props.onNodeLongPress}
      shouldDisableTouchOnLeaf={props.shouldDisableTouchOnLeaf}
    />
  )
}

RenderTree.propTypes = {
  idKey: PropTypes.string,
  onNodePress: PropTypes.func,
  childrenKey: PropTypes.string,
  pressOpacity: PropTypes.number,
  isNodeExpanded: PropTypes.func,
  initialExpanded: PropTypes.bool,
  onNodeLongPress: PropTypes.func,
  data: PropTypes.array.isRequired,
  renderNode: PropTypes.func.isRequired,
  shouldDisableTouchOnLeaf: PropTypes.func,
}

RenderTree.defaultProps = {
  idKey: 'id',
  pressOpacity: 0.2,
  onNodePress: noOp,
  isNodeExpanded: noOp,
  onNodeLongPress: noOp,
  initialExpanded: false,
  childrenKey: 'children',
  shouldDisableTouchOnLeaf: () => false,
}
