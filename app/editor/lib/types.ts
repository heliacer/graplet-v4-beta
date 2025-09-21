export interface ProjectData {
  workspace: { [key: string]: any } // eslint-disable-line @typescript-eslint/no-explicit-any
  scene: {
    objects: ObjectProps[]
  }
}

export interface ObjectProps {
  name: string
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number, number]
}
