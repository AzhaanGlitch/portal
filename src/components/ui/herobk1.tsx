"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

export default function BackgroundAnimation1() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        let scene: THREE.Scene,
            camera: THREE.PerspectiveCamera,
            renderer: THREE.WebGLRenderer,
            composer: EffectComposer,
            particles: THREE.Points
        const mouse = new THREE.Vector2(10000, 10000);
        let particleData: any[] = [];

        function init() {
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(
                75,
                window.innerWidth / window.innerHeight,
                0.1,
                1000
            );
            camera.position.set(0, 0, 50);

            renderer = new THREE.WebGLRenderer({
                canvas: canvasRef.current!,
                antialias: true,
                alpha: true,
            });
            renderer.setClearColor(0x000000, 0);
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

            composer = new EffectComposer(renderer);
            composer.addPass(new RenderPass(scene, camera));
            const bloomPass = new UnrealBloomPass(
                new THREE.Vector2(window.innerWidth, window.innerHeight),
                1.0,
                0.8,
                0.1
            );
            composer.addPass(bloomPass);

            createMainParticles();

            window.addEventListener("resize", onWindowResize);
            window.addEventListener("mousemove", onMouseMove);
        }

        function createMainParticles() {
            const particleCount = 6000;
            const positions = new Float32Array(particleCount * 3);
            const colors = new Float32Array(particleCount * 3);
            const baseColor = new THREE.Color(0x001f3f);

            for (let i = 0; i < particleCount; i++) {
                const i3 = i * 3;
                const x = (Math.random() - 0.5) * 120;
                const y = (Math.random() - 0.5) * 120;

                particleData.push({
                    originalPos: new THREE.Vector3(x, y, (Math.random() - 0.5) * 20),
                    currentPos: new THREE.Vector3(x, y, (Math.random() - 0.5) * 20),
                    velocity: new THREE.Vector3(),
                });

                positions[i3] = x;
                positions[i3 + 1] = y;
                positions[i3 + 2] = particleData[i].originalPos.z;

                baseColor.toArray(colors, i3);
            }

            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

            const material = new THREE.PointsMaterial({
                size: 2,
                vertexColors: true,
                transparent: true,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
                sizeAttenuation: true,
            });

            particles = new THREE.Points(geometry, material);
            scene.add(particles);
        }

        function onWindowResize() {
            const width = window.innerWidth;
            const height = window.innerHeight;

            camera.aspect = width / height;
            camera.updateProjectionMatrix();

            renderer.setSize(width, height);
            composer.setSize(width, height);

        }

        function onMouseMove(event: MouseEvent) {
            if (!canvasRef.current) return;

            const rect = canvasRef.current.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            // normalize to -1..1 range based on canvas size
            mouse.x = (x / rect.width) * 2 - 1;
            mouse.y = -(y / rect.height) * 2 + 1;
        }

        const clock = new THREE.Clock();
        function animate() {
            const delta = clock.getDelta();
            const elapsedTime = clock.getElapsedTime();
            requestAnimationFrame(animate);

            const mousePos3D = new THREE.Vector3(mouse.x, mouse.y, 0.5);
            mousePos3D.unproject(camera);
            const dir = mousePos3D.sub(camera.position).normalize();
            const distance = -camera.position.z / dir.z;
            const finalMousePos = camera.position
                .clone()
                .add(dir.multiplyScalar(distance));

            const positions = particles.geometry.attributes.position.array;
            const colors = particles.geometry.attributes.color.array;
            const highlightColor = new THREE.Color(0x826a94ff); // Hover color (orange/red)
            const baseColor = new THREE.Color(0x001935); // Original color
            const hoverRadius = 18;

            for (let i = 0; i < particleData.length; i++) {
                const i3 = i * 3;
                const data = particleData[i];

                const diff = new THREE.Vector3().subVectors(
                    data.currentPos,
                    finalMousePos
                );
                const dist = diff.length();

                let force = 0;
                if (dist < hoverRadius) {
                    force = (1 - dist / hoverRadius) * 0.1;
                    diff.normalize();
                    data.velocity.add(diff.multiplyScalar(force));

                    data.velocity.x += (Math.random() - 0.5) * 0.05;
                    data.velocity.y += (Math.random() - 0.5) * 0.05;
                }

                const springForce = new THREE.Vector3()
                    .subVectors(data.originalPos, data.currentPos)
                    .multiplyScalar(0.01);
                data.velocity.add(springForce);
                data.velocity.multiplyScalar(0.92);

                data.currentPos.add(data.velocity);

                positions[i3] = data.currentPos.x;
                positions[i3 + 1] = data.currentPos.y;
                positions[i3 + 2] =
                    data.currentPos.z +
                    Math.sin(data.originalPos.x * 0.1 + elapsedTime) * 5.0;

                // Smooth color transition on hover
                let colorMix = dist < hoverRadius ? 1 - dist / hoverRadius : 0;
                const color = baseColor.clone().lerp(highlightColor, colorMix);
                color.toArray(colors, i3);
            }
            particles.geometry.attributes.position.needsUpdate = true;
            particles.geometry.attributes.color.needsUpdate = true;



            composer.render();
        }

        init();
        animate();

        return () => {
            window.removeEventListener("resize", onWindowResize);
            window.removeEventListener("mousemove", onMouseMove);
        };
    }, []);

    return (
        
        <div className="w-full h-screen flex items-center justify-center p-4 relative overflow-hidden bg-transparent">
            <canvas ref={canvasRef} className="relative w-full h-full z-0 bg-transparent" />
        </div>
    );
}
