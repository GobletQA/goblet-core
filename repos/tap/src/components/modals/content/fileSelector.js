import React, { useCallback, useState, useMemo } from 'react'
import { Modal } from '../modal'
import { Values } from 'HKConstants'
import { CreateFile } from './createFile'
import { File } from 'HKAssets/icons/file'
import { addToast } from 'HKActions/toasts'
import { noPropArr, capitalize } from '@keg-hub/jsutils'
import { isVNCMode } from 'HKUtils/isVNCMode'
import { FileNameSelect } from './fileNameSelect'
import { FileCode } from 'HKAssets/icons/fileCode'
import { loadFile } from 'HKActions/files/api/loadFile'
import { CheckCircle } from 'HKAssets/icons/checkCircle'
import { createFile } from 'HKActions/files/api/createFile'
import { formatFileName } from 'HKUtils/helpers/formatFileName'
import { setActiveModal } from 'HKActions/modals/setActiveModal'
import { useFileGroups } from 'HKHooks/activeFile/useFileGroups'
import { ControlledAuto } from 'HKComponents/form/controlledAuto'
import { GobletButton } from 'HKComponents/buttons/button.restyle'
import { useFileTypeMeta } from 'HKHooks/activeFile/useFileTypeMeta'
import { setModalVisibility } from 'HKActions/modals/setModalVisibility'
import { useFileTypeOptions } from 'HKHooks/activeFile/useFileTypeOptions'
import { DisconnectRepoButton } from 'HKComponents/buttons/disconnectRepoButton'

const activeVNC = isVNCMode()
const { SCREENS, MODAL_TYPES, CREATE_NEW_FILE } = Values

/**
 * Callback helper to load a file model based on the selected file location
 * @param {string} location - Location of the file to be loaded
 * @param {Array<Object>} treeNodes - Group of nodes for the active fileType
 * @param {string} screenId - The ID of the screen to load on file load
 *
 * @returns {function} - To be called when load file action should happen
 */
const useLoadFile = (location, treeNodes, screenId, setIsLoading) => {
  return useCallback(async () => {
    const treeNode = treeNodes[location]

    if (!treeNode)
      return addToast({
        type: `warn`,
        message: `File at '${location}' does not exist in the file tree!`,
      })

    setIsLoading(true)
    await loadFile(treeNode, screenId)
    setIsLoading(false)

    setModalVisibility(false)
  }, [
    location,
    screenId,
    treeNodes,
    setIsLoading
  ])
}

/**
 * Callback to create a new file based on the selected file type and input name
 * @param {string} fileType - Type of file to create
 * @param {string} fileName - Name of the file to create
 * @param {function} setFileName - Method to update the name of the file in the UI
 *
 * @returns {function} - To be called when create file action should happen
 */
const useCreateFile = (fileType, fileName, setFileName, fileTypeMeta, setIsLoading) => {
  return useCallback(async () => {
    
    const screenID = fileType == Values.FILE_TYPES.REPORT ? SCREENS.REPORTS : SCREENS.EDITOR
    const name = formatFileName(fileName, fileTypeMeta)
    setIsLoading(true)
    const resp = await createFile(fileType, name, screenID)
    setIsLoading(false)

    if(!resp || !resp.file) return 

    //Reset test name so that previously entered name does not remain in the name field
    setFileName('')
    // Close the modal
    setModalVisibility(false)

  }, [
    fileType,
    fileName,
    setFileName,
    fileTypeMeta,
    setIsLoading
  ])
}

/**
 * Callback helper to update the file type when selected from the ui
 * Auto updates the selected tab to match the file type
 * Auto updates the file location to the first existing when new type is selected
 * @param {Object} props
 * @param {string} props.fileType - Current selected file type
 * @param {Object} props.fileGroups - FileTree nodes separated into groups
 * @param {string} props.selectedTab - Current selected tap
 * @param {function} props.setFileType - Sets a new file type
 * @param {function} props.setFileLocation - Sets a new file location to load
 * @returns {function} props.setSelectedTab - Sets the tab to be set active
 */
const useSelectFileType = props => {
  const {
    fileType,
    fileGroups,
    setFileType,
    selectedTab,
    setSelectedTab,
    setFileLocation,
  } = props
  return useCallback(
    meta => {
      const type = meta.key.toLowerCase()
      if (!type || fileType === type) return

      setFileType(type)

      type == Values.FILE_TYPES.REPORT
        ? setSelectedTab(SCREENS.REPORTS)
        : setSelectedTab(SCREENS.EDITOR)

      /**
       * When the file type changes
       * We need to also update the selected file location
       * Otherwise the previous fileType's selected location will be set
       * This auto selects the first file of the fileType
       */
      const newTreeNodes = fileGroups[type]
      const firstNode = newTreeNodes && newTreeNodes[0]
      firstNode && setFileLocation(firstNode.value)

    },
    [
      fileType,
      fileGroups,
      setFileType,
      selectedTab,
      setSelectedTab,
      setFileLocation,
    ]
  )
}

/**
 * Modal Component to modify active settings of the Application
 * @param {Object} props
 * @returns
 */
export const FileSelectorModal = props => {
  const { title = 'File Select', visible = false } = props

  const typeOptions = useFileTypeOptions()
  const [fileType, setFileType] = useState('feature')
  const fileTypeMeta = useFileTypeMeta(fileType)
  const fileGroups = useFileGroups(typeOptions)
  const treeNodes = fileGroups[fileType] || noPropArr

  
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTab, setSelectedTab] = useState(SCREENS.EDITOR)
  const [fileLocation, setFileLocation] = useState(CREATE_NEW_FILE)
  const [fileName, setFileName] = useState('')

  const loadFile = useLoadFile(
    fileLocation,
    treeNodes,
    selectedTab,
    setIsLoading
  )
  const createFile = useCreateFile(
    fileType,
    fileName,
    setFileName,
    fileTypeMeta,
    setIsLoading
  )

  const {isDisabled, onAction, actionText} = useMemo(() => {
    const validFile = treeNodes.map(node => fileLocation === node.value).find(val => val)
    const isCreate = fileLocation === CREATE_NEW_FILE
    const isDisabled = isLoading || !validFile || (isCreate && !fileName)
    
    return !isCreate
    ? { onAction: loadFile, actionText: 'Load File', isDisabled } 
    : { onAction: createFile, actionText: 'Create File', isDisabled } 
  }, [
    fileName,
    loadFile,
    treeNodes,
    isLoading,
    createFile,
    fileLocation,
  ])

  const onSetFileType = useSelectFileType({
    fileType,
    fileGroups,
    setFileType,
    selectedTab,
    setSelectedTab,
    setFileLocation,
  })

  const onDisconnect = useCallback(() => {
    setActiveModal(MODAL_TYPES.CONNECT_REPO)
  }, [])


  const fileTypeOptions = useMemo(() => {
    return typeOptions.map(meta => {
      return {
        ...meta,
        activeShowList: true,
        text: capitalize(meta.label),
      }
    })
  }, [typeOptions])

  return (
    <Modal
      Icon={File}
      title={title}
      visible={visible}
      type='selectFile'
      classPrefix='modal-file-select'
      footerLeft={
        activeVNC && (
          <DisconnectRepoButton
            text={`Disconnect`}
            disabled={isLoading}
            onClick={onDisconnect}
          />
        )
      }
      footerRight={
        <GobletButton
          type='primary'
          text={actionText}
          Icon={CheckCircle}
          onClick={onAction}
          disabled={isDisabled}
          classPrefix={`file-select`}
        />
      }
    >

      <ControlledAuto
        zIndex={5}
        required={true}
        Aside={FileCode}
        title={'File Type'}
        emptyShowList={true}
        disabled={isLoading}
        values={fileTypeOptions}
        onSelect={onSetFileType}
        text={capitalize(fileType)}
        placeholder='Select a file type'
        className={'modal-file-settings-field-file-type'}
      />

      <FileNameSelect
        zIndex={4}
        fileType={fileType}
        disabled={isLoading}
        treeNodes={treeNodes}
        fileLocation={fileLocation}
        setFileLocation={setFileLocation}
      />
      {fileTypeMeta && fileLocation === CREATE_NEW_FILE && (
        <CreateFile
          fileType={fileType}
          fileName={fileName}
          disabled={isLoading}
          onBlur={setFileName}
          onChange={setFileName}
          setFileName={setFileName}
          fileTypeMeta={fileTypeMeta}
        />
      )}
    </Modal>
  )
}
