import React, {useCallback} from 'react'

import { Values } from 'HKConstants'
import { noOpObj } from '@keg-hub/jsutils'
import { Sync } from 'HKAssets/icons/sync'
import { Save } from 'HKAssets/icons/save'
import { Times } from 'HKAssets/icons/times'
import { DefinitionList } from './definitionList'
import { DefinitionTabs } from './definitionTabs'
import { setActiveModal } from 'HKActions/modals'
import { useDefinitionHooks } from './useDefinitionHooks'
import { ActiveDefinitionsEditor } from './activeDefinitionsEditor'
import { useEditorFileName } from 'HKHooks/activeFile/useEditorFileName'
import { getRemoteDefinitions } from 'HKActions/definitions/api/getRemoteDefinitions'
import {
  Surface,
  SurfaceAction,
  SurfaceActionSpacer
} from 'HKComponents/surface'

const {DEFINITION_TABS, MODAL_TYPES} = Values

/**
 * DefinitionsEditor
 * @param {Object} props
 * @param {Array=} props.active - list of active definitions
 * @param {String} props.activeTab
 * @param {Object=} props.list - list of all definitions
 * @param {Object=} props.styles
 * @param {Object=} props.activeFile
 * @param {Object} props.featureEditorRef
 * @param {Object} props.feature
 */
export const DefinitionsEditor = React.memo(props => {
  const {
    list,
    feature,
    featureEditorRef,
    styles = noOpObj,
  } = props

  const {
    tab,
    switchTabs,
    definitionTypes,
    onSaveDefinition,
    onEditDefinition,
    activeDefinition,
    setActiveDefinition,
  } = useDefinitionHooks(props)

  const onRemoveDefinition = useCallback(async () => {
    if(!activeDefinition) return

    setActiveModal(
      MODAL_TYPES.CONFIRM_REMOVE_FILE,
      true,
      {activeFile: activeDefinition, screenId: false}
    )
  }, [activeDefinition])

  const isEditorTab = tab === DEFINITION_TABS.ACTIVE
  const surfaceStyles = isEditorTab
    ? styles.activeEditor
    : styles

  const surfaceTitle = useEditorFileName(activeDefinition)

  return (
    <Surface
      hasToggle={false}
      capitalize={false}
      title={isEditorTab ? surfaceTitle : 'Definitions'}
      styles={surfaceStyles}
      RightComponent={
        isEditorTab
          ? (
            <>
              <SurfaceAction
                Icon={Save}
                text='SAVE'
                onPress={onSaveDefinition}
              />
              <SurfaceActionSpacer />
              <SurfaceAction
                Icon={Times}
                text='DELETE'
                type='danger'
                onPress={onRemoveDefinition}
              />
            </>
            )
          : (
            <SurfaceAction
              Icon={Sync}
              text='SYNC'
              onPress={getRemoteDefinitions}
            />
          )
      }
      className={`definitions-surface-main`}
      prefix={isEditorTab ? 'Editor' : 'List'}
    >
      <DefinitionTabs activeTab={tab} onTabSelect={switchTabs} />
      {isEditorTab && (
        <ActiveDefinitionsEditor
          styles={styles}
          featureEditorRef={featureEditorRef}
          activeDefinition={activeDefinition}
          setActiveDefinition={setActiveDefinition}
        />
      )}
      {!isEditorTab && (
        <DefinitionList
          feature={feature}
          styles={styles.list}
          contextRef={featureEditorRef}
          activeDefinition={activeDefinition}
          onEditDefinition={onEditDefinition}
          definitions={list || definitionTypes}
        />
      )}
    </Surface>
  )
})
