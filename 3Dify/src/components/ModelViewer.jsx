import * as THREE from 'three'
import { useEffect, useRef } from 'react'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'


export default function ModelViewer() {
  const mountRef = useRef(null)

  useEffect(() => {
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(92, 1, 0.1, 1000)
    camera.position.z = 5

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(600, 400)
    mountRef.current.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true // smooth rotation


    // Lighting setup
    scene.add(new THREE.AmbientLight(0xffffff, 0.4))
    const light = new THREE.DirectionalLight(0xffffff, 1)
    light.position.set(5, 5, 5)
    scene.add(light)

    const mtlLoader = new MTLLoader()
mtlLoader.setPath('/models/')
mtlLoader.load('3DModel.mtl', (materials) => {
  materials.preload()

  const objLoader = new OBJLoader()
  objLoader.setMaterials(materials)
  objLoader.setPath('/models/')
  objLoader.load('3DModel.obj', (obj) => {
    obj.scale.set(7, 7, 7)

    // Center it
    const box = new THREE.Box3().setFromObject(obj)
    const center = box.getCenter(new THREE.Vector3())
    obj.position.sub(center)

    obj.rotation.y = Math.PI / 8

obj.position.x += -1.5// move right
obj.position.z += 1 // move forward
obj.position.y += -1 // up and down

    scene.add(obj)
  })
})


    function animate() {
  requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
}
animate()

    return () => {
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement)
      }
    }
  }, [])

  return <div ref={mountRef} style={{ width: '100%', height: '500px' }} />
}
