import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useLanguage } from '../context/LanguageContext';
import { CrossSectionType } from '../utils/mathEvaluator';
import { GeoGebraModuleType } from './GeoGebra2DCanvas';
import { export3DWebGLScene } from '../utils/chartExporter';
import { RotateCw, Eye, Grid, RefreshCw, Layers, Download } from 'lucide-react';

interface GeoGebra3DViewProps {
  f: (x: number) => number;
  g?: (x: number) => number;
  a: number;
  b: number;
  activeX: number;
  revolutionAngle: number; // in radians, 0 to 2*PI
  moduleType: GeoGebraModuleType;
  revolutionAxis?: 'x-axis' | 'y-axis' | 'line-y' | 'line-x';
  axisValue?: number;
  crossSectionShape?: CrossSectionType;
  numSlices?: number;
  showWireframe?: boolean;
  isTransparent?: boolean;
  unrollShell?: boolean;
}

export const GeoGebra3DView: React.FC<GeoGebra3DViewProps> = ({
  f,
  g = () => 0,
  a,
  b,
  activeX,
  revolutionAngle,
  moduleType,
  revolutionAxis = 'x-axis',
  axisValue = 0,
  crossSectionShape = 'square',
  numSlices = 24,
  showWireframe = false,
  isTransparent = false,
  unrollShell = false,
}) => {
  const { t } = useLanguage();
  const mountRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const animFrameId = useRef<number | null>(null);

  const [autoRotate, setAutoRotate] = useState(false);
  const [showAxes, setShowAxes] = useState(true);

  // Initialize Three.js scene once
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Headless/Software-GL probe
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060913); // dark cosmos navy
    sceneRef.current = scene;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 450;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(8, 7, 10);
    camera.lookAt(0, 1, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true,
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 3));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 50;
    controls.minDistance = 2;
    controlsRef.current = controls;

    // Ambient & Directional Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x818cf8, 1.4); // soft indigo
    dirLight1.position.set(10, 15, 10);
    dirLight1.castShadow = !isSoftwareGl;
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 0.8); // soft sky blue fill
    dirLight2.position.set(-10, -5, -10);
    scene.add(dirLight2);

    // Coordinate Grid in the X-Z ground plane
    const gridHelper = new THREE.GridHelper(16, 16, 0x334155, 0x1e293b);
    gridHelper.position.y = -0.01;
    scene.add(gridHelper);

    // Procedural 3D model container
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);
    modelGroupRef.current = modelGroup;

    // Animation Loop
    const animate = () => {
      animFrameId.current = requestAnimationFrame(animate);
      if (controlsRef.current) {
        controlsRef.current.autoRotate = autoRotate;
        controlsRef.current.autoRotateSpeed = 2.0;
        controlsRef.current.update();
      }
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(container);

    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update autoRotate
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
    }
  }, [autoRotate]);

  // Build the 3D Math Model whenever parameters change
  useEffect(() => {
    const group = modelGroupRef.current;
    if (!group) return;

    // Clear previous geometries and materials safely
    while (group.children.length > 0) {
      const child = group.children[0];
      group.remove(child);
      if ((child as THREE.Mesh).geometry) {
        (child as THREE.Mesh).geometry.dispose();
      }
      if ((child as THREE.Mesh).material) {
        const mat = (child as THREE.Mesh).material;
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
        else mat.dispose();
      }
    }

    // 1. Add 3D Coordinate Axes Arrows (+X red, +Y green, +Z blue)
    if (showAxes) {
      const axesGroup = new THREE.Group();
      const axisLen = 6;
      // X axis (red)
      const xDir = new THREE.Vector3(1, 0, 0);
      axesGroup.add(new THREE.ArrowHelper(xDir, new THREE.Vector3(0, 0, 0), axisLen, 0xf43f5e, 0.4, 0.2));
      // Y axis (green)
      const yDir = new THREE.Vector3(0, 1, 0);
      axesGroup.add(new THREE.ArrowHelper(yDir, new THREE.Vector3(0, 0, 0), axisLen, 0x10b981, 0.4, 0.2));
      // Z axis (blue)
      const zDir = new THREE.Vector3(0, 0, 1);
      axesGroup.add(new THREE.ArrowHelper(zDir, new THREE.Vector3(0, 0, 0), axisLen, 0x38bdf8, 0.4, 0.2));

      // Revolution Axis Line indicator
      if (moduleType === 'solids_revolution' || moduleType === 'surface_area') {
        const isX = revolutionAxis === 'x-axis' || revolutionAxis === 'line-y';
        const k = revolutionAxis === 'x-axis' ? 0 : axisValue;
        const lineGeo = new THREE.BufferGeometry().setFromPoints(
          isX
            ? [new THREE.Vector3(-8, k, 0), new THREE.Vector3(8, k, 0)]
            : [new THREE.Vector3(k, -8, 0), new THREE.Vector3(k, 8, 0)]
        );
        const lineMat = new THREE.LineDashedMaterial({
          color: 0xf59e0b,
          dashSize: 0.3,
          gapSize: 0.2,
          linewidth: 2,
        });
        const line = new THREE.Line(lineGeo, lineMat);
        line.computeLineDistances();
        axesGroup.add(line);
      } else if (moduleType === 'cylindrical_shells') {
        // Vertical axis x = k
        const k = axisValue;
        const lineGeo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(k, -6, 0),
          new THREE.Vector3(k, 6, 0),
        ]);
        const lineMat = new THREE.LineDashedMaterial({
          color: 0xf59e0b,
          dashSize: 0.3,
          gapSize: 0.2,
          linewidth: 2,
        });
        const line = new THREE.Line(lineGeo, lineMat);
        line.computeLineDistances();
        axesGroup.add(line);
      }

      group.add(axesGroup);
    }

    // Material definitions with PBR shading
    const solidMat = new THREE.MeshStandardMaterial({
      color: 0x6366f1, // indigo-500
      roughness: 0.3,
      metalness: 0.1,
      wireframe: showWireframe,
      transparent: isTransparent,
      opacity: isTransparent ? 0.65 : 0.95,
      side: THREE.DoubleSide,
    });

    const innerWasherMat = new THREE.MeshStandardMaterial({
      color: 0x10b981, // emerald-500 for inner hole
      roughness: 0.35,
      metalness: 0.1,
      wireframe: showWireframe,
      transparent: isTransparent,
      opacity: isTransparent ? 0.7 : 0.95,
      side: THREE.DoubleSide,
    });

    const sliceHighlightMat = new THREE.MeshStandardMaterial({
      color: 0xf43f5e, // rose-500 glowing slice
      roughness: 0.2,
      metalness: 0.2,
      emissive: 0x881337,
      emissiveIntensity: 0.4,
      side: THREE.DoubleSide,
    });

    const minX = Math.min(a, b);
    const maxX = Math.max(a, b);
    const angle = Math.max(revolutionAngle, 0.05);

    // ==========================================
    // 1. SOLIDS OF REVOLUTION (DISKS & WASHERS)
    // ==========================================
    if (moduleType === 'solids_revolution') {
      const xSteps = 50;
      const thetaSteps = Math.max(Math.round(40 * (angle / (2 * Math.PI))), 8);
      const isXAxis = revolutionAxis === 'x-axis' || revolutionAxis === 'line-y';
      const k = revolutionAxis === 'x-axis' ? 0 : axisValue;

      // Outer boundary mesh: sweeps f(x)
      const outerGeo = new THREE.BufferGeometry();
      const positions: number[] = [];
      const indices: number[] = [];

      for (let i = 0; i <= xSteps; i++) {
        const x = minX + (i / xSteps) * (maxX - minX);
        const radius = Math.abs(f(x) - k);

        for (let j = 0; j <= thetaSteps; j++) {
          const theta = (j / thetaSteps) * angle;

          if (isXAxis) {
            // Revolve around horizontal line y = k in the y-z plane
            const px = x;
            const py = k + radius * Math.cos(theta);
            const pz = radius * Math.sin(theta);
            positions.push(px, py, pz);
          } else {
            // Revolve around vertical line x = k in the x-z plane
            const px = k + radius * Math.cos(theta);
            const py = x;
            const pz = radius * Math.sin(theta);
            positions.push(px, py, pz);
          }
        }
      }

      for (let i = 0; i < xSteps; i++) {
        for (let j = 0; j < thetaSteps; j++) {
          const aIdx = i * (thetaSteps + 1) + j;
          const bIdx = (i + 1) * (thetaSteps + 1) + j;
          const cIdx = (i + 1) * (thetaSteps + 1) + (j + 1);
          const dIdx = i * (thetaSteps + 1) + (j + 1);
          indices.push(aIdx, bIdx, dIdx);
          indices.push(bIdx, cIdx, dIdx);
        }
      }

      outerGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      outerGeo.setIndex(indices);
      outerGeo.computeVertexNormals();
      group.add(new THREE.Mesh(outerGeo, solidMat));

      // Inner boundary mesh if washer: sweeps g(x)
      let hasInner = false;
      for (let i = 0; i <= 10; i++) {
        if (Math.abs(g(minX + (i * (maxX - minX)) / 10) - k) > 1e-3) {
          hasInner = true;
          break;
        }
      }

      if (hasInner) {
        const innerGeo = new THREE.BufferGeometry();
        const inPos: number[] = [];
        const inIdx: number[] = [];

        for (let i = 0; i <= xSteps; i++) {
          const x = minX + (i / xSteps) * (maxX - minX);
          const rInner = Math.abs(g(x) - k);

          for (let j = 0; j <= thetaSteps; j++) {
            const theta = (j / thetaSteps) * angle;
            if (isXAxis) {
              inPos.push(x, k + rInner * Math.cos(theta), rInner * Math.sin(theta));
            } else {
              inPos.push(k + rInner * Math.cos(theta), x, rInner * Math.sin(theta));
            }
          }
        }

        for (let i = 0; i < xSteps; i++) {
          for (let j = 0; j < thetaSteps; j++) {
            const aIdx = i * (thetaSteps + 1) + j;
            const bIdx = (i + 1) * (thetaSteps + 1) + j;
            const cIdx = (i + 1) * (thetaSteps + 1) + (j + 1);
            const dIdx = i * (thetaSteps + 1) + (j + 1);
            // Reverse winding for inner tube
            inIdx.push(aIdx, dIdx, bIdx);
            inIdx.push(bIdx, dIdx, cIdx);
          }
        }

        innerGeo.setAttribute('position', new THREE.Float32BufferAttribute(inPos, 3));
        innerGeo.setIndex(inIdx);
        innerGeo.computeVertexNormals();
        group.add(new THREE.Mesh(innerGeo, innerWasherMat));
      }

      // REPRESENTATIVE SWEPT DISK / WASHER SLICE AT activeX
      const sliceX = Math.min(Math.max(activeX, minX), maxX);
      const outerR = Math.abs(f(sliceX) - k);
      const innerR = Math.abs(g(sliceX) - k);
      const sliceThick = (maxX - minX) * 0.04;

      const diskShape = new THREE.Shape();
      diskShape.absarc(0, 0, outerR, 0, angle, false);
      if (innerR > 1e-3) {
        const holePath = new THREE.Path();
        holePath.absarc(0, 0, innerR, 0, angle, true);
        diskShape.holes.push(holePath);
      }

      const extrudeSettings: THREE.ExtrudeGeometryOptions = {
        depth: sliceThick,
        bevelEnabled: false,
      };

      const sliceGeo = new THREE.ExtrudeGeometry(diskShape, extrudeSettings);
      const sliceMesh = new THREE.Mesh(sliceGeo, sliceHighlightMat);

      if (isXAxis) {
        // Oriented along X-axis
        sliceMesh.rotation.y = Math.PI / 2;
        sliceMesh.position.set(sliceX - sliceThick / 2, k, 0);
      } else {
        // Oriented along Y-axis
        sliceMesh.rotation.x = Math.PI / 2;
        sliceMesh.position.set(k, sliceX - sliceThick / 2, 0);
      }
      group.add(sliceMesh);
    }

    // ==========================================
    // 2. METHOD OF CYLINDRICAL SHELLS
    // ==========================================
    else if (moduleType === 'cylindrical_shells') {
      const k = axisValue; // vertical axis x = k
      const xSteps = 45;
      const thetaSteps = Math.max(Math.round(36 * (angle / (2 * Math.PI))), 8);

      // 3D Swept Solid of the entire region
      const solidGeo = new THREE.BufferGeometry();
      const sPos: number[] = [];
      const sIdx: number[] = [];

      for (let i = 0; i <= xSteps; i++) {
        const x = minX + (i / xSteps) * (maxX - minX);
        const radius = Math.abs(x - k);
        const yTop = f(x);
        const yBot = g(x);

        for (let j = 0; j <= thetaSteps; j++) {
          const theta = (j / thetaSteps) * angle;
          const px = k + radius * Math.cos(theta);
          const pz = radius * Math.sin(theta);
          sPos.push(px, yTop, pz);
          sPos.push(px, yBot, pz);
        }
      }

      for (let i = 0; i < xSteps; i++) {
        for (let j = 0; j < thetaSteps; j++) {
          const aTop = (i * (thetaSteps + 1) + j) * 2;
          const bTop = ((i + 1) * (thetaSteps + 1) + j) * 2;
          const cTop = ((i + 1) * (thetaSteps + 1) + (j + 1)) * 2;
          const dTop = (i * (thetaSteps + 1) + (j + 1)) * 2;
          sIdx.push(aTop, bTop, dTop);
          sIdx.push(bTop, cTop, dTop);
        }
      }

      solidGeo.setAttribute('position', new THREE.Float32BufferAttribute(sPos, 3));
      solidGeo.setIndex(sIdx);
      solidGeo.computeVertexNormals();

      const shellTransMat = new THREE.MeshStandardMaterial({
        color: 0x6366f1,
        roughness: 0.4,
        transparent: true,
        opacity: isTransparent ? 0.35 : 0.65,
        wireframe: showWireframe,
        side: THREE.DoubleSide,
      });
      group.add(new THREE.Mesh(solidGeo, shellTransMat));

      // REPRESENTATIVE CYLINDRICAL SHELL AT activeX
      const shellX = Math.min(Math.max(activeX, minX), maxX);
      const rShell = Math.abs(shellX - k);
      const hShell = Math.abs(f(shellX) - g(shellX));
      const yBase = Math.min(f(shellX), g(shellX));
      const dr = (maxX - minX) * 0.05; // shell thickness dx

      if (!unrollShell) {
        // Cylindrical Shell in circular form
        const shellCylGeo = new THREE.CylinderGeometry(
          rShell,
          rShell,
          hShell,
          48,
          1,
          true,
          0,
          angle
        );
        const shellMat = new THREE.MeshStandardMaterial({
          color: 0xf43f5e,
          emissive: 0x9f1239,
          emissiveIntensity: 0.5,
          side: THREE.DoubleSide,
          roughness: 0.2,
          transparent: true,
          opacity: 0.85,
        });
        const shellMesh = new THREE.Mesh(shellCylGeo, shellMat);
        shellMesh.position.set(k, yBase + hShell / 2, 0);
        group.add(shellMesh);
      } else {
        // UNROLLED RECTANGULAR SLAB: 2*pi*r * h * dr
        const unrolledLength = angle * rShell;
        const unrollBoxGeo = new THREE.BoxGeometry(unrolledLength, hShell, dr);
        const unrollMat = new THREE.MeshStandardMaterial({
          color: 0xf43f5e,
          roughness: 0.2,
          emissive: 0x9f1239,
          emissiveIntensity: 0.4,
        });
        const unrollMesh = new THREE.Mesh(unrollBoxGeo, unrollMat);
        unrollMesh.position.set(k + unrolledLength / 2, yBase + hShell / 2, rShell + 1.5);
        group.add(unrollMesh);
      }
    }

    // ==========================================
    // 3. VOLUME WITH KNOWN CROSS-SECTIONS
    // ==========================================
    else if (moduleType === 'cross_sections') {
      const nSlices = Math.max(numSlices, 8);
      const dxSlice = (maxX - minX) / nSlices;

      // Helper function to build 2D polygon cross-section on the XY plane
      const createCrossSectionShape = (s: number, shape: CrossSectionType): THREE.Shape => {
        const poly = new THREE.Shape();
        if (s <= 1e-4) return poly;

        switch (shape) {
          case 'square':
            poly.moveTo(0, 0);
            poly.lineTo(s, 0);
            poly.lineTo(s, s);
            poly.lineTo(0, s);
            poly.closePath();
            break;

          case 'semicircle':
            poly.moveTo(0, 0);
            poly.absarc(s / 2, 0, s / 2, 0, Math.PI, false);
            poly.closePath();
            break;

          case 'equilateral_triangle': {
            const h = (Math.sqrt(3) / 2) * s;
            poly.moveTo(0, 0);
            poly.lineTo(s, 0);
            poly.lineTo(s / 2, h);
            poly.closePath();
            break;
          }

          case 'isosceles_right_leg':
            poly.moveTo(0, 0);
            poly.lineTo(s, 0);
            poly.lineTo(0, s);
            poly.closePath();
            break;

          case 'isosceles_right_hyp':
            poly.moveTo(0, 0);
            poly.lineTo(s, 0);
            poly.lineTo(s / 2, s / 2);
            poly.closePath();
            break;

          case 'rectangle_2x':
            poly.moveTo(0, 0);
            poly.lineTo(s, 0);
            poly.lineTo(s, 2 * s);
            poly.lineTo(0, 2 * s);
            poly.closePath();
            break;

          default:
            poly.moveTo(0, 0);
            poly.lineTo(s, 0);
            poly.lineTo(s, s);
            poly.lineTo(0, s);
            poly.closePath();
        }
        return poly;
      };

      // Extrude discrete slices along interval [a, b]
      for (let i = 0; i < nSlices; i++) {
        const xSlice = minX + i * dxSlice;
        const yTop = f(xSlice);
        const yBot = g(xSlice);
        const s = Math.abs(yTop - yBot);

        if (s < 0.05) continue;

        const poly = createCrossSectionShape(s, crossSectionShape);
        const sliceGeo = new THREE.ExtrudeGeometry(poly, {
          depth: dxSlice * 0.95,
          bevelEnabled: false,
        });

        // Rotate so cross-section stands vertically (in Z) perpendicular to the base
        sliceGeo.rotateY(Math.PI / 2);

        const isCurrentActive =
          Math.abs(xSlice + dxSlice / 2 - activeX) < dxSlice * 0.8;

        const sliceMat = isCurrentActive
          ? sliceHighlightMat
          : new THREE.MeshStandardMaterial({
              color: 0x6366f1,
              roughness: 0.35,
              metalness: 0.1,
              transparent: isTransparent,
              opacity: isTransparent ? 0.75 : 0.95,
              wireframe: showWireframe,
            });

        const mesh = new THREE.Mesh(sliceGeo, sliceMat);
        mesh.position.set(xSlice, Math.min(yTop, yBot), 0);
        group.add(mesh);
      }

      // Base footprint outline in the xy plane
      const basePoints: THREE.Vector3[] = [];
      const samples = 40;
      for (let i = 0; i <= samples; i++) {
        const x = minX + (i / samples) * (maxX - minX);
        basePoints.push(new THREE.Vector3(x, f(x), 0));
      }
      for (let i = samples; i >= 0; i--) {
        const x = minX + (i / samples) * (maxX - minX);
        basePoints.push(new THREE.Vector3(x, g(x), 0));
      }
      const baseGeo = new THREE.BufferGeometry().setFromPoints(basePoints);
      const baseLine = new THREE.Line(baseGeo, new THREE.LineBasicMaterial({ color: 0x38bdf8, linewidth: 2 }));
      group.add(baseLine);
    }

    // ==========================================
    // 4. ARC LENGTH 3D VISUALIZATION
    // ==========================================
    else if (moduleType === 'arc_length') {
      const samples = 100;
      const curvePoints: THREE.Vector3[] = [];
      for (let i = 0; i <= samples; i++) {
        const x = minX + (i / samples) * (maxX - minX);
        curvePoints.push(new THREE.Vector3(x, f(x), 0));
      }

      // Smooth curve tube
      const curvePath = new THREE.CatmullRomCurve3(curvePoints);
      const tubeGeo = new THREE.TubeGeometry(curvePath, 80, 0.08, 12, false);
      const tubeMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x0284c7,
        emissiveIntensity: 0.5,
        roughness: 0.2,
      });
      group.add(new THREE.Mesh(tubeGeo, tubeMat));

      // Secant polygonal chords (discrete approximation)
      const nChords = Math.max(numSlices, 6);
      const chordPoints: THREE.Vector3[] = [];
      for (let i = 0; i <= nChords; i++) {
        const x = minX + (i / nChords) * (maxX - minX);
        chordPoints.push(new THREE.Vector3(x, f(x), 0));
      }

      const chordGeo = new THREE.BufferGeometry().setFromPoints(chordPoints);
      const chordLine = new THREE.Line(
        chordGeo,
        new THREE.LineBasicMaterial({ color: 0xf59e0b, linewidth: 2.5 })
      );
      group.add(chordLine);

      // Secant node spheres
      const sphereGeo = new THREE.SphereGeometry(0.12, 16, 16);
      const sphereMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.2 });
      chordPoints.forEach((pt) => {
        const sphere = new THREE.Mesh(sphereGeo, sphereMat);
        sphere.position.copy(pt);
        group.add(sphere);
      });
    }

    // ==========================================
    // 5. SURFACE AREA OF SOLIDS OF REVOLUTION
    // ==========================================
    else if (moduleType === 'surface_area') {
      const xSteps = 60;
      const thetaSteps = Math.max(Math.round(44 * (angle / (2 * Math.PI))), 8);
      const isXAxis = revolutionAxis === 'x-axis' || revolutionAxis === 'line-y';
      const k = revolutionAxis === 'x-axis' ? 0 : axisValue;

      const surfaceGeo = new THREE.BufferGeometry();
      const sPos: number[] = [];
      const sIdx: number[] = [];

      for (let i = 0; i <= xSteps; i++) {
        const x = minX + (i / xSteps) * (maxX - minX);
        const radius = Math.abs(f(x) - k);

        for (let j = 0; j <= thetaSteps; j++) {
          const theta = (j / thetaSteps) * angle;
          if (isXAxis) {
            sPos.push(x, k + radius * Math.cos(theta), radius * Math.sin(theta));
          } else {
            sPos.push(k + radius * Math.cos(theta), x, radius * Math.sin(theta));
          }
        }
      }

      for (let i = 0; i < xSteps; i++) {
        for (let j = 0; j < thetaSteps; j++) {
          const aIdx = i * (thetaSteps + 1) + j;
          const bIdx = (i + 1) * (thetaSteps + 1) + j;
          const cIdx = (i + 1) * (thetaSteps + 1) + (j + 1);
          const dIdx = i * (thetaSteps + 1) + (j + 1);
          sIdx.push(aIdx, bIdx, dIdx);
          sIdx.push(bIdx, cIdx, dIdx);
        }
      }

      surfaceGeo.setAttribute('position', new THREE.Float32BufferAttribute(sPos, 3));
      surfaceGeo.setIndex(sIdx);
      surfaceGeo.computeVertexNormals();

      const surfPbrMat = new THREE.MeshStandardMaterial({
        color: 0xa855f7, // purple-500
        roughness: 0.25,
        metalness: 0.15,
        wireframe: showWireframe,
        transparent: isTransparent,
        opacity: isTransparent ? 0.6 : 0.95,
        side: THREE.DoubleSide,
      });
      group.add(new THREE.Mesh(surfaceGeo, surfPbrMat));

      // Frustum ribbon element at activeX
      const sliceX = Math.min(Math.max(activeX, minX), maxX);
      const rRibbon = Math.abs(f(sliceX) - k);
      const ribbonWidth = (maxX - minX) * 0.05;

      const ribbonCylGeo = new THREE.CylinderGeometry(
        rRibbon,
        rRibbon,
        ribbonWidth,
        36,
        1,
        true,
        0,
        angle
      );
      if (isXAxis) ribbonCylGeo.rotateZ(Math.PI / 2);
      const ribbonMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        emissive: 0xb45309,
        emissiveIntensity: 0.6,
        side: THREE.DoubleSide,
      });
      const ribbonMesh = new THREE.Mesh(ribbonCylGeo, ribbonMat);
      ribbonMesh.position.set(sliceX, k, 0);
      group.add(ribbonMesh);
    }
  }, [
    f,
    g,
    a,
    b,
    activeX,
    revolutionAngle,
    moduleType,
    revolutionAxis,
    axisValue,
    crossSectionShape,
    numSlices,
    showWireframe,
    isTransparent,
    unrollShell,
    showAxes,
  ]);

  // Reset 3D camera
  const handleResetCamera = () => {
    if (!controlsRef.current) return;
    controlsRef.current.reset();
  };

  const handleExport3DRender = () => {
    if (!rendererRef.current) return;
    export3DWebGLScene(
      rendererRef.current.domElement,
      `geogebra-3d-calculus-${moduleType}.png`
    );
  };

  return (
    <div className="relative w-full h-full min-h-[380px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-inner flex flex-col">
      <div ref={mountRef} className="w-full h-full flex-1 cursor-grab active:cursor-grabbing block" />

      {/* Top-Left Resolution Status Badge */}
      <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-xl border border-slate-800/80 text-[10px] font-mono text-sky-400 flex items-center gap-1.5 pointer-events-none z-10">
        <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
        <span>{t('hdQualityBadge')}</span>
      </div>

      {/* 3D Visualizer Top-Right Quick Controls */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-800 shadow-lg z-10">
        <button
          onClick={() => setAutoRotate((prev) => !prev)}
          className={`p-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1 cursor-pointer ${
            autoRotate
              ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white'
          }`}
          title={t('autoRotateTooltip')}
          aria-label={t('autoRotateTooltip')}
        >
          <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
        </button>

        <button
          onClick={() => setShowAxes((prev) => !prev)}
          className={`p-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1 cursor-pointer ${
            showAxes
              ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-400'
          }`}
          title={t('toggleAxesTooltip')}
          aria-label={t('toggleAxesTooltip')}
        >
          <Grid className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={handleResetCamera}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
          title={t('resetCameraTooltip')}
          aria-label={t('resetCameraTooltip')}
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>

        <div className="h-4 w-px bg-slate-800 mx-0.5" />

        {/* 3D PNG Snapshot Export Button */}
        <button
          onClick={handleExport3DRender}
          className="p-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 transition cursor-pointer"
          title={t('export3DRender')}
          aria-label={t('export3DRender')}
        >
          <Download className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Bottom 3D Helper Badge */}
      <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>{t('mouseHint3D')}</span>
      </div>
    </div>
  );
};
