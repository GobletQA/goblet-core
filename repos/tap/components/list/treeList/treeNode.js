import React, { useCallback, useMemo } from 'react'
import { View, Touchable, Drawer } from '@keg-hub/keg-components'

const useNodeState = (node, idKey, isExpanded, hasChildren) => {
  return useMemo(
    () => ({ expanded: isExpanded(node[idKey]), subNodes: hasChildren(node) }),
    [node, idKey, isExpanded, hasChildren]
  )
}

export const TreeNode = props => {
  const {
    node,
    level,
    idKey,
    renderNode,
    isExpanded,
    childrenKey,
    RenderNodes,
    hasChildren,
    pressOpacity,
    handlePressed,
    onNodeLongPress,
    shouldDisableTouchOnLeaf,
  } = props

  const onNodePressed = useCallback(
    () => handlePressed({ node, level }),
    [handlePressed, node, level]
  )

  const onLongNodePress = useCallback(
    () => onNodeLongPress({ node, level }),
    [onNodeLongPress, node, level]
  )

  const { expanded, subNodes } = useNodeState(
    node,
    idKey,
    isExpanded,
    hasChildren
  )

  return (
    <View>
      <Touchable
        onPress={onNodePressed}
        activeOpacity={pressOpacity}
        onLongPress={onLongNodePress}
        disabled={shouldDisableTouchOnLeaf({ node, level })}
      >
        {React.createElement(renderNode, {
          node,
          level,
          expanded,
          subNodes,
        })}
      </Touchable>
      {hasChildren && (
        <Drawer toggled={expanded} className='tree-sub-items-drawer'>
          <RenderNodes {...props} nodes={node[childrenKey]} level={level + 1} />
        </Drawer>
      )}
    </View>
  )
}
