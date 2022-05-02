import React, { useCallback, useState, useRef, useEffect } from 'react'
import { Values } from 'HKConstants'
import { capitalize } from '@keg-hub/jsutils'
import { PlusCircle } from 'HKAssets/icons/plusCircle'
import { ControlledAuto } from 'HKComponents/form/controlledAuto'

const { CREATE_NEW_FILE } = Values

const setFileLocError = (setError, fileLocation) => {
  const message = fileLocation
    ? `File "${fileLocation}" does not exist`
    : `A file name is required!`

  setError(message)
}

/**
 * Displays a drop down list of existing files that can be selected
 * @param {Object} props
 * @param {Object} props.styles
 * @param {Array} props.treeNodes
 * @param {Function} props.setFileLocation
 *
 * @returns {Component}
 */
export const FileNameSelect = props => {
  const {
    zIndex,
    styles,
    fileType,
    treeNodes,
    fileLocation,
    setFileLocation,
  } = props

  const onValueChange = useCallback(
    fileName => {
      // Check if location is set to create a new file || check for the fileModel
      fileName === CREATE_NEW_FILE
        ? setFileLocation(CREATE_NEW_FILE)
        : setFileLocation(fileName)
    },
    [setFileLocation]
  )

  const onSelectItem = useCallback(
    update => {
      setFileLocation(update.key)
    },
    [treeNodes, setFileLocation]
  )
  
  const onFocus = useCallback(evt => {
    evt.target.select()
  }, [fileLocation])

  const [error, setError] = useState(null)
  const onBlur = useCallback(evt => {
    const validFile = treeNodes.map(node => node.value === fileLocation).find(val => val)
    if(validFile || fileLocation === CREATE_NEW_FILE){
      setError(false)
      return
    }

    setFileLocError(setError, fileLocation)
    evt.target.focus()
    evt.stopPropagation()
  }, [fileLocation, treeNodes])

  useEffect(() => {
    const validFile = treeNodes.map(node => fileLocation === node.text).find(val => val)

    if(fileLocation === CREATE_NEW_FILE || validFile){
      setError(false)
      return
    }

    !error && setFileLocError(setError, fileLocation)
  }, [fileLocation, treeNodes, error, setError])

  return (
    <ControlledAuto
      error={error}
      zIndex={zIndex}
      styles={styles}
      required={true}
      onBlur={onBlur}
      values={treeNodes}
      onFocus={onFocus}
      Aside={PlusCircle}
      text={fileLocation}
      emptyShowList={true}
      onSelect={onSelectItem}
      onChange={onValueChange}
      title={`Select ${capitalize(fileType)} File`}
      placeholder={`Typing the name of a file...`}
      className={'modal-file-settings-field-file-select'}
      helper={`Click the input to select from a list of existing files or select "Create New File"`}
    />
  )
}
