export interface UserT {
  id: string
  email: string
  name: string
  password: string
  createdAt?: Date
}

/**
 * @todo implement loading mechanism
 */
export interface ProjectData {
  workspace: { [key: string]: any } // eslint-disable-line @typescript-eslint/no-explicit-any
  scene: {
    objects: {
      id: string
      position: [number, number, number]
      rotation: [number, number, number]
      scale: [number, number, number]
    }
  }
}
