import * as THREE from 'three'
import { useEffect, useState } from 'react'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'

/**
 * Loads a 3D model offscreen, renders a single frame, and displays
 * the result as a static <img>. The Three.js context is fully disposed
 * after capture so there is no ongoing GPU cost.
 *
 * @param {string}  modelFolder  – e.g. "/models/integra"
 * @param {string}  alt          – alt text for the image
 * @param {string}  className    – passed to the <img> / placeholder wrapper
 */
export default function ModelThumbnail({ modelFolder, alt = '3D model', className = '' }) {
  const [src, setSrc] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let disposed = false

    // --- offscreen renderer (not attached to DOM) ---
    const width = 512
    const height = 384
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(1) // keep it light

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x1a1a2e)

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000)

    // lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.6))
    const dir = new THREE.DirectionalLight(0xffffff, 1)
    dir.position.set(5, 5, 5)
    scene.add(dir)
    const fill = new THREE.DirectionalLight(0xffffff, 0.3)
    fill.position.set(-3, 2, -4)
    scene.add(fill)

    const basePath = `${modelFolder}/`

    const mtlLoader = new MTLLoader()
    mtlLoader.setPath(basePath)
    mtlLoader.load('3DModel.mtl', (materials) => {
      if (disposed) return
      materials.preload()

      const objLoader = new OBJLoader()
      objLoader.setMaterials(materials)
      objLoader.setPath(basePath)
      objLoader.load('3DModel.obj', (obj) => {
        if (disposed) return

        // center + fit
        const box = new THREE.Box3().setFromObject(obj)
        const center = box.getCenter(new THREE.Vector3())
        obj.position.sub(center)

        const size = box.getSize(new THREE.Vector3()).length()
        camera.position.set(size * 0.5, size * 0.3, size * 0.9)
        camera.lookAt(0, 0, 0)

        scene.add(obj)

        // render one frame and capture
        renderer.render(scene, camera)
        const dataUrl = renderer.domElement.toDataURL('image/png')

        if (!disposed) {
          setSrc(dataUrl)
          setLoading(false)
        }

        // cleanup everything
        renderer.dispose()
        scene.traverse((child) => {
          if (child.geometry) child.geometry.dispose()
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((m) => m.dispose())
            } else {
              child.material.dispose()
            }
          }
        })
      })
    })

    return () => {
      disposed = true
      renderer.dispose()
    }
  }, [modelFolder])

  if (loading) {
    return (
      <div className={`flex items-center justify-center bg-white/[0.04] ${className}`}>
        <div className="flex items-center gap-2 text-gray-400">
          <div className="h-3 w-3 rounded-full border-2 border-white/20 border-t-white animate-spin" />
          <span className="text-xs">rendering…</span>
        </div>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
    />
  )
}
