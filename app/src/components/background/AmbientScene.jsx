import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function AmbientScene() {
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return undefined

        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100)
        camera.position.z = 8
        let renderer
        try {
            renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
        } catch {
            return undefined
        }
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
        renderer.setClearColor(0x000000, 0)

        const orb = new THREE.Mesh(
            new THREE.IcosahedronGeometry(2.5, 2),
            new THREE.MeshBasicMaterial({ color: 0x9bb3ff, wireframe: true, transparent: true, opacity: 0.2 }),
        )
        scene.add(orb)

        const particlePositions = new Float32Array(180 * 3)
        for (let index = 0; index < particlePositions.length; index += 3) {
            const radius = 3.5 + (index % 7) * 0.35
            const angle = index * 0.47
            particlePositions[index] = Math.cos(angle) * radius
            particlePositions[index + 1] = Math.sin(angle * 1.3) * radius * 0.55
            particlePositions[index + 2] = Math.sin(angle) * radius - 1
        }

        const particlesGeometry = new THREE.BufferGeometry()
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))
        const particles = new THREE.Points(
            particlesGeometry,
            new THREE.PointsMaterial({ color: 0xd6ddff, size: 0.035, transparent: true, opacity: 0.55 }),
        )
        scene.add(particles)

        const pointer = { x: 0, y: 0 }
        const target = { x: 0, y: 0 }
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        let frameId

        const resize = () => {
            const width = window.innerWidth
            const height = window.innerHeight
            renderer.setSize(width, height, false)
            camera.aspect = width / height
            camera.updateProjectionMatrix()
        }

        const handlePointerMove = (event) => {
            target.x = (event.clientX / window.innerWidth - 0.5) * 0.35
            target.y = (event.clientY / window.innerHeight - 0.5) * 0.25
        }

        const render = () => {
            pointer.x += (target.x - pointer.x) * 0.03
            pointer.y += (target.y - pointer.y) * 0.03
            orb.rotation.y += reducedMotion ? 0 : 0.0018
            orb.rotation.x += reducedMotion ? 0 : 0.0008
            particles.rotation.y -= reducedMotion ? 0 : 0.00035
            orb.position.x = pointer.x
            orb.position.y = -pointer.y
            renderer.render(scene, camera)
            if (!reducedMotion) frameId = requestAnimationFrame(render)
        }

        resize()
        window.addEventListener('resize', resize)
        window.addEventListener('pointermove', handlePointerMove, { passive: true })
        render()

        return () => {
            cancelAnimationFrame(frameId)
            window.removeEventListener('resize', resize)
            window.removeEventListener('pointermove', handlePointerMove)
            orb.geometry.dispose()
            orb.material.dispose()
            particlesGeometry.dispose()
            particles.material.dispose()
            renderer.dispose()
        }
    }, [])

    return <canvas ref={canvasRef} className="ambient-scene" aria-hidden="true" />
}