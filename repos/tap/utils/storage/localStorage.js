import { Values } from 'HKConstants'
import { KeyStore } from 'KegNative/keyStore'
const { STORAGE } = Values

class Storage {

  /**
  * Loads repo object from local storage
  * Then immediately removes it from local storage
  */
  get = async (key, parse) => {
    const name = STORAGE[key] || key
    if(!name) return console.error(`A key is required to get a local storage item, instead got "${name}"`)

    try {
      const savedData = await KeyStore.getItem(name)
      return !savedData
        ? undefined
        : parse
          ? JSON.parse(savedData)
          : savedData
    }
    catch (err) {}
  }


  set = async (key, data) => {
    const name = STORAGE[key] || key
    if(!name) return console.error(`A key is required to set a local storage item, instead got "${name}"`)

    try {
      return await KeyStore.setItem(name, data)
    }
    catch (err) {}
  }

  /**
   * Removes the store repo from local storage
   */
  remove = async (key) => {
    const name = STORAGE[key] || key
    if(!name) return console.error(`A key is required to remove a local storage item, instead got "${name}"`)
    
    try {
      return await KeyStore.removeItem(name)
    }
    catch (err) {}
  }

  getUser = async () => this.get(STORAGE.USER, true)
  setUser = async (data) => this.set(STORAGE.USER, data)
  removeUser = async () => this.remove(STORAGE.USER)
 
  getJwt = async () => this.get(STORAGE.JWT)
  setJwt = async (data) => this.set(STORAGE.JWT, data)
  removeJwt = async () => this.remove(STORAGE.JWT)

  getRepo = async () => this.get(STORAGE.REPO, true)
  setRepo = async (data) => this.set(STORAGE.REPO, data)
  removeRepo = async () => this.remove(STORAGE.REPO)

}

export const localStorage = new Storage()
