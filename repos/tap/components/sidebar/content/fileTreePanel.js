import React, { useCallback } from 'react'
import {
  TreeList,
  TouchableIcon
} from 'SVComponents'
import { Values } from 'SVConstants'
import { NoteAdd } from 'SVAssets/icons'
import { useTheme } from '@keg-hub/re-theme'
import { setActiveModal } from 'SVActions/modals'
import { reStyle } from '@keg-hub/re-theme/reStyle'
import { Touchable, Text, View } from '@keg-hub/keg-components'

const { MODAL_TYPES } = Values

const ScrollingView = reStyle(View)(theme => ({
  overflowY: 'scroll',
  height: '100vh',
  paddingBottom: '9em'
}))

const HeaderMain = reStyle(View)(theme => ({
  minH: 50,
  flD: 'row',
  bgC: theme?.tapColors?.defaultDark,
}))

const TextContainer = reStyle(View)({
  fl:1, 
  pL: 8,
  jtC: 'center', 
})

const TextHeader = reStyle(Text)(theme => ({
  ftWt: 'bold',
  ftSz: 20,
  c: theme?.colors?.palette?.white01
}))

const IconContainer = reStyle(View)({
  fl: 1, 
  pR: 5,
  jtC: 'center',
  alI: 'flex-end', 
})

const AddIcon = reStyle(({styles, hovered, ...props}) => (
  <NoteAdd
    {...props}
    {...styles?.main}
    {...(hovered && styles.hover)}
  />
), 'styles')(theme => ({
  main: {
    style: {
      transitionDuration: '0.8s',
      transitionProperty: 'stroke color fill',
    },
    size: 30,
    fill: theme?.colors?.palette?.white01,
    stroke: theme?.tapColors?.disabledColor,
  },
  hover: {
    fill: theme?.tapColors?.success,
  }
}))

/**
 * Title with Touchable NoteAdd icon
 * 
 * @param {object} props
 * @param {object} props.styles
 * @param {string} props.title
 * 
 * @returns {Component}
 */
const FileTreeHeader = ({styles, title}) => {


  const onPress = useCallback(() => setActiveModal(MODAL_TYPES.CREATE_FILE), [])

  return (
    <HeaderMain>
      <TextContainer>
        <TextHeader>
          {title}
        </TextHeader>
      </TextContainer>
      <IconContainer>
        <Touchable onPress={onPress} showFeedback={true}>
          {({ hovered }) => (<AddIcon hovered={hovered} />)}
        </Touchable>
      </IconContainer>
    </HeaderMain>
  )
}

/**
 * FileTree with child elements : header and treelist(with a scrollable wrapper)
 * @param {Object} props 
 * 
 * @returns {Component}
 */
export const FileTreePanel = (props) => {
  const theme = useTheme()
  const styles = theme.get('sidebar.content')

  return (
    <View>
      <FileTreeHeader 
        styles={styles?.testFiles}
        title={props?.title}
      />
      <ScrollingView>
        <TreeList {...props}/>
      </ScrollingView>
    </View>
  )
}