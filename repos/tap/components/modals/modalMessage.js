import React from 'react'
import { renderFromType } from '@keg-hub/keg-components'

import {
  ReLoading,
  ReErrorIcon,
  ReConnecting,
  ReConnectError,
} from './modal.restyle'

export const ModalMessage = props => {
  const {
    error,
    loading,
    message,
    ErrorIcon,
    LoadingIcon,
    MessageIcon,
  } = props

  return (
    <>
      {error && (
        <ReConnectError className='herkin-repo-connect-error' >
          {renderFromType(ErrorIcon || (<ReErrorIcon />))}
          {error}
        </ReConnectError>
      )}
      {loading && (
        <ReConnecting className='herkin-repo-connect-loading' >
          {renderFromType(LoadingIcon || (<ReLoading size='small' />))}
          {loading}
        </ReConnecting>
      )}
      {message && (
        <ReConnecting className='herkin-repo-connect-message' >
          {renderFromType(MessageIcon)}
          {message}
        </ReConnecting>
      )}
    </>
  )
}