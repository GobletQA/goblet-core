import { setItems } from 'HKActions'
import { Values } from 'HKConstants'

const { CATEGORIES } = Values

export const clearFileTree = () => {
  setItems(CATEGORIES.FILE_TREE, {})
}
