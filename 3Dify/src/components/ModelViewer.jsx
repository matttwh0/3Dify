import * as THREE from 'three'
import { useEffect, useRef } from 'react'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'

/**
 * ModelViewer - renders a 3D OBJ model with orbit controls.
 *
 * @param {string} modelFolder - path to folder containing 3DModel.obj, 3DModel.mtl
 *                                e.g. "/models/integra"
 * @param {number} scale       - uniform scale factor (default 7)
 */
export default function ModelViewer({ modelFolder = '/models/integra', scale = 7 }) {
  const mountRef = useRef(null)

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    // --- renderer sized to container ---
    const width = container.clientWidth || 600
    const height = container.clientHeight || 400

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x1a1a2e)
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000)
    camera.position.z = 5

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(window.devicePixelRatio)
    container.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true

    // --- lighting ---
    scene.add(new THREE.AmbientLight(0xffffff, 0.5))
    const dirLight = new THREE.DirectionalLight(0xffffff, 1)
    dirLight.position.set(5, 5, 5)
    scene.add(dirLight)

    // --- load model ---
    const basePath = `${modelFolder}/`

    const mtlLoader = new MTLLoader()
    mtlLoader.setPath(basePath)
    mtlLoader.load('3DModel.mtl', (materials) => {
      materials.preload()

      const objLoader = new OBJLoader()
      objLoader.setMaterials(materials)
      objLoader.setPath(basePath)
      objLoader.load('3DModel.obj', (obj) => {
        obj.scale.set(scale, scale, scale)

        // center the model
        const box = new THREE.Box3().setFromObject(obj)
        const center = box.getCenter(new THREE.Vector3())
        obj.position.sub(center)

        // fit camera to model
        const size = box.getSize(new THREE.Vector3()).length()
        camera.position.set(0, 0, size * 1.2)
        controls.target.set(0, 0, 0)
        controls.update()

        scene.add(obj)
      })
    })

    // --- animation loop ---
    let frameId
    function animate() {
      frameId = requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    // --- handle resize ---
    function onResize() {
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    // --- cleanup ---
    return () => {
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(frameId)
      controls.dispose()
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [modelFolder, scale])

  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
}
