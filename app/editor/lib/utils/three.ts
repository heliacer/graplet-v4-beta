import { Object3D, Scene } from 'three'

export function getObjectsByTypes(scene: Scene, types: string[]) {
  const objects: Object3D[] = []
  for (const type of types) {
    const objs = scene.getObjectsByProperty('type', type)
    objects.push(...objs)
  }
  return objects
}
