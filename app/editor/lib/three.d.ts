import 'three'

declare module 'three' {
  interface Object3D {
    sharedId: string
  }
}