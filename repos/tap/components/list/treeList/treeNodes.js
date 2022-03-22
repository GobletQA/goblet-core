import React from 'react'
import { TreeNode } from './treeNode'

export const TreeNodes = props => {
  const { nodes, ...nodeProps } = props

  return nodes.map(node => {
    return <TreeNode key={node[nodeProps.idKey]} {...nodeProps} node={node} />
  })
}
