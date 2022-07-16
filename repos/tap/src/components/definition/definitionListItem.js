import React, { useCallback, useMemo, useState } from 'react'
import { ListItem } from '../list/listItem'
import { useThemeHover, useStyle } from '@keg-hub/re-theme'
import { MetaToggle, DefinitionMeta } from './definitionMeta'
import { View, Row, Touchable } from '@keg-hub/keg-components'
import {
  checkCall,
  noOpObj,
  isEmptyColl,
  capitalize,
} from '@keg-hub/jsutils'

const { Actions, Title } = ListItem

const useFormattedTitle = (title = '') =>
  useMemo(() => {
    const [type, ...rest] = title.split(' ')
    return `${capitalize(type)} ${rest.join(' ')}`
  }, [title])

export const DefinitionListItem = React.memo(props => {
  const {
    active,
    actions,
    group,
    meta,
    title,
    uuid,
    onItemPress,
  } = props

  const hasMetaData = !isEmptyColl(meta)
  const mergeStyles = useStyle('list.item', 'definitions.list.list.item')

  const activeStyle = active ? mergeStyles.active : noOpObj
  const [rowRef, itemStyles] = useThemeHover(
    mergeStyles.default,
    mergeStyles.hover
  )
  const rowStyles = useStyle(itemStyles.row, activeStyle?.row)

  const onPress = useCallback(
    event => checkCall(onItemPress, event, { title, active, uuid }),
    [title, active, uuid, onItemPress]
  )

  const [metaToggled, setMetaToggled] = useState(false)
  const metaStyles = !hasMetaData
    ? mergeStyles.noMeta
    : metaToggled
    ? mergeStyles.activeMeta
    : noOpObj

  const toggleMeta = useCallback(
    () => setMetaToggled(!metaToggled),
    [metaToggled, setMetaToggled]
  )

  const formattedTitle = useFormattedTitle(title)

  return (
    <Row key={`${group}-${title}`} className='list-item-row' style={rowStyles}>
      <View
        className={`def-list-item-main`}
        ref={rowRef}
        style={[itemStyles.main, activeStyle?.main, metaStyles.main]}
      >
        <Touchable
          style={itemStyles.touchable}
          showFeedback={true}
          className='definition-list-item'
          onPress={toggleMeta}
        >
          {hasMetaData && (
            <MetaToggle
              styles={itemStyles.meta}
              metaStyles={metaStyles.meta}
              onPress={toggleMeta}
              toggled={metaToggled}
            />
          )}
          <Title
            title={formattedTitle}
            style={[itemStyles.title, activeStyle?.title, metaStyles.title]}
          />
        </Touchable>
        <Actions
          actions={actions}
          onPress={onPress}
          styles={itemStyles.actions}
        />
      </View>
      {hasMetaData && meta?.expressions && (
        <DefinitionMeta
          meta={meta}
          group={group}
          title={title}
          toggled={metaToggled}
          styles={itemStyles.meta}
          metaStyles={metaStyles.meta}
          setMetaToggled={setMetaToggled}
        />
      )}
    </Row>
  )
})
