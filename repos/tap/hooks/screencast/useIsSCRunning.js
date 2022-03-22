import React, { useMemo } from 'react'
import { useSCStatus } from './useSCStatus'

export const useIsSCRunning = () => {
  const status = useSCStatus()
  const isRunning = useMemo(() => {
    return Boolean(
      status.lastCheck &&
        status?.vnc?.running &&
        status?.sockify?.running &&
        status?.browser?.running
    )
  }, [status])

  return { status, isRunning }
}
