
export type TControllerEvt = (messate?:string) => void

export type TControllerEvts = {
  die?: TControllerEvt
  start?: TControllerEvt
  stop?: TControllerEvt
  create?: TControllerEvt
  destroy?: TControllerEvt
  connect?: TControllerEvt
  message?: TControllerEvt
  disconnect?: TControllerEvt
}