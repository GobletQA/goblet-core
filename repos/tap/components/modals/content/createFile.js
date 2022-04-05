import React, { useCallback, useEffect, useRef } from 'react'
import { noOpObj } from '@keg-hub/jsutils'
import { FileSig } from 'HKAssets/icons/fileSig'
import { formatFileName } from 'HKUtils/helpers/formatFileName'
import { ControlledInput } from 'HKComponents/form/controlledInput'


/**
 * Modal component for creating new test files
 * @param {Object} props
 * @returns
 */
export const CreateFile = props => {

  const {
    onBlur,
    onChange,
    fileType,
    fileName,
    setFileName,
    fileTypeMeta=noOpObj,
    ...inputProps
  } = props

  const curTypeRef = useRef(fileTypeMeta.type)
  const onNameChange = useCallback(value => onChange?.(value || ``), [fileName, onChange])

  const onBlurCB = useCallback(evt => {
    const val = evt?.target?.value
    const fileName = val ? formatFileName(val, fileTypeMeta) : val
    onBlur?.(fileName)
    setTimeout(() => evt?.target?.blur())
  }, [fileName, fileTypeMeta, onBlur])

  // TODO: @lance-tipton - Sometimes logging out throws an error because fileTypeMeta no longer exists
  // Should probably just return if that's the case. Need to investigate
  // This is just a quick fix that seems to solve the problem
  const relLoc = fileTypeMeta?.location
    ? fileTypeMeta?.location?.split('/current').pop()
    : `/<parent-folder>`

  useEffect(() => {
    if(curTypeRef.current === fileTypeMeta.type) return
    curTypeRef.current = fileTypeMeta.type

    if(!fileName) return
    const updatedName = formatFileName(fileName, fileTypeMeta)
    updatedName !== fileName && setFileName(updatedName)
  }, [fileName, fileTypeMeta])
  
  return (
    <ControlledInput
      {...inputProps}
      Aside={FileSig}
      required={true}
      value={fileName}
      onBlur={onBlurCB}
      title={'File Name'}
      onChange={onNameChange}
      placeholder={`my-new-file`}
      className={'modal-create-file-field-name'}
      helper={`Use "/" to create the file in a sub-folder relative to the "${relLoc}" folder`}
    />
  )
}
