import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface HeroScene3DProps {
  night: boolean;
  heroRef: React.RefObject<HTMLElement | null>;
  copyRef: React.RefObject<HTMLDivElement | null>;
  onWebGLUnavailable: () => void;
}

type FinishType = 'plain' | 'rust' | 'wood';

interface RoomSpec {
  x: number;
  base: number;
  z: number;
  w: number;
  h: number;
  d: number;
  finish: FinishType;
}

const ROOM_LAYOUT: RoomSpec[] = [
  { x: -1.95, base: -2, z: 0.25, w: 1.15, h: 1.05, d: 1.3, finish: 'plain' },
  { x: -0.72, base: -2, z: 0.65, w: 1.2, h: 1.15, d: 1.25, finish: 'rust' },
  { x: 0.5, base: -2, z: 0.05, w: 1.1, h: 1.0, d: 1.4, finish: 'wood' },
  { x: 1.78, base: -2, z: 0.45, w: 1.25, h: 1.25, d: 1.3, finish: 'plain' },
  { x: -3.0, base: -0.92, z: 0.05, w: 1.2, h: 1.1, d: 1.3, finish: 'plain' },
  { x: -1.78, base: -0.88, z: -0.35, w: 1.2, h: 1.0, d: 1.2, finish: 'wood' },
  { x: -0.6, base: -0.85, z: 0.35, w: 1.02, h: 0.98, d: 1.1, finish: 'plain' },
  { x: 0.56, base: -0.95, z: -0.15, w: 1.15, h: 1.05, d: 1.3, finish: 'plain' },
  { x: 1.72, base: -0.75, z: 0.2, w: 1.05, h: 1.0, d: 1.2, finish: 'wood' },
  { x: 2.9, base: -0.75, z: -0.05, w: 1.2, h: 1.15, d: 1.4, finish: 'plain' },
  { x: -1.4, base: 0.12, z: -0.55, w: 1.0, h: 1.0, d: 1.1, finish: 'plain' },
  { x: -0.18, base: 0.08, z: -0.8, w: 0.95, h: 0.9, d: 1.0, finish: 'plain' },
  { x: 0.98, base: 0.25, z: -0.45, w: 1.15, h: 1.15, d: 1.2, finish: 'rust' },
  { x: 2.14, base: 0.4, z: -0.85, w: 1.1, h: 1.0, d: 1.1, finish: 'plain' },
];

function detectSoftwareWebGL(): boolean {
  try {
    const probeCanvas = document.createElement('canvas');
    const gl = probeCanvas.getContext('webgl2') || probeCanvas.getContext('webgl');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param));
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return false;
  }
}

export const HeroScene3D: React.FC<HeroScene3DProps> = ({
  night,
  heroRef,
  copyRef,
  onWebGLUnavailable,
}) => {
  const stageRef = useRef<HTMLDivElement>(null);
  const nightTargetRef = useRef<number>(night ? 1 : 0);

  useEffect(() => {
    nightTargetRef.current = night ? 1 : 0;
  }, [night]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isSoftwareGl = detectSoftwareWebGL();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      onWebGLUnavailable();
      return;
    }

    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    stage.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    const world = new THREE.Group();
    scene.add(world);
    const stack = new THREE.Group();
    world.add(stack);

    const hemi = new THREE.HemisphereLight(
      new THREE.Color('#ffffff'),
      new THREE.Color('#c9bfae'),
      0.9
    );
    scene.add(hemi);

    const sun = new THREE.DirectionalLight(new THREE.Color('#fff1dc'), 1.3);
    sun.position.set(-5, 9, 7);
    sun.castShadow = !isSoftwareGl;
    sun.shadow.mapSize.set(1024, 1024);
    Object.assign(sun.shadow.camera, {
      left: -8,
      right: 8,
      top: 8,
      bottom: -8,
      near: 1,
      far: 30,
    });
    sun.shadow.radius = 4;
    sun.shadow.bias = -0.0008;
    scene.add(sun);

    const warm = new THREE.PointLight(new THREE.Color('#ffb66b'), 0, 9, 2);
    warm.position.set(0, 0, 1.2);
    stack.add(warm);

    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];
    const textures: THREE.Texture[] = [];

    // Procedural veined marble floor slab
    const cv = document.createElement('canvas');
    cv.width = 512;
    cv.height = 512;
    const g = cv.getContext('2d');
    if (g) {
      g.fillStyle = '#dcdad4';
      g.fillRect(0, 0, 512, 512);
      for (let i = 0; i < 26; i++) {
        g.strokeStyle = `rgba(120,118,112,${0.08 + Math.random() * 0.18})`;
        g.lineWidth = 0.6 + Math.random() * 1.6;
        g.beginPath();
        let x = Math.random() * 512;
        let y = Math.random() * 512;
        g.moveTo(x, y);
        for (let j = 0; j < 8; j++) {
          x += (Math.random() - 0.3) * 90;
          y += (Math.random() - 0.5) * 70;
          g.lineTo(x, y);
        }
        g.stroke();
      }
    }
    const marble = new THREE.CanvasTexture(cv);
    marble.colorSpace = THREE.SRGBColorSpace;
    textures.push(marble);

    const floorMat = new THREE.MeshStandardMaterial({
      map: marble,
      roughness: 0.35,
      metalness: 0,
    });
    materials.push(floorMat);

    const floorGeo = new THREE.BoxGeometry(7.4, 0.08, 4.6);
    geometries.push(floorGeo);
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.set(0.2, -2.04, 0.6);
    floor.receiveShadow = true;
    world.add(floor);

    const shadowPlaneGeo = new THREE.PlaneGeometry(40, 40);
    const shadowPlaneMat = new THREE.ShadowMaterial({ opacity: 0.16 });
    geometries.push(shadowPlaneGeo);
    materials.push(shadowPlaneMat);
    const shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -2.081;
    shadowPlane.receiveShadow = true;
    world.add(shadowPlane);

    // Atmospheric radial moon/sun disc
    const mc = document.createElement('canvas');
    mc.width = 256;
    mc.height = 256;
    const mg = mc.getContext('2d');
    if (mg) {
      const grd = mg.createRadialGradient(128, 128, 0, 128, 128, 128);
      grd.addColorStop(0, 'rgba(255,255,255,1)');
      grd.addColorStop(0.78, 'rgba(255,255,255,0.92)');
      grd.addColorStop(0.9, 'rgba(255,255,255,0.55)');
      grd.addColorStop(1, 'rgba(255,255,255,0)');
      mg.fillStyle = grd;
      mg.fillRect(0, 0, 256, 256);
    }
    const moonTex = new THREE.CanvasTexture(mc);
    textures.push(moonTex);

    const moonMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#dfe3da'),
      map: moonTex,
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
    });
    const moonGeo = new THREE.PlaneGeometry(6.6, 6.6);
    geometries.push(moonGeo);
    materials.push(moonMat);
    const moon = new THREE.Mesh(moonGeo, moonMat);
    moon.position.set(-0.9, 1.2, -3.4);
    world.add(moon);

    // Stacked architectural room frames
    const frameMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#5d5550'),
      roughness: 0.75,
    });
    const woodMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#8b5a36'),
      roughness: 0.7,
    });
    materials.push(frameMat, woodMat);

    const makeWallMat = () => {
      const m = new THREE.MeshStandardMaterial({
        color: new THREE.Color('#e7e3dc'),
        roughness: 0.9,
        emissive: new THREE.Color('#ffb969'),
        emissiveIntensity: 0,
      });
      materials.push(m);
      return m;
    };

    const makeRustMat = () => {
      const m = new THREE.MeshStandardMaterial({
        color: new THREE.Color('#8a4a2c'),
        roughness: 0.85,
        emissive: new THREE.Color('#ff9a4d'),
        emissiveIntensity: 0,
      });
      materials.push(m);
      return m;
    };

    interface BoxItem {
      grp: THREE.Group;
      home: THREE.Vector3;
      dir: THREE.Vector3;
      ph: number;
      wm: THREE.MeshStandardMaterial;
      lit: boolean;
      spin: number;
    }

    const boxes: BoxItem[] = [];
    const ctr = new THREE.Vector3(0, -0.6, 0);

    ROOM_LAYOUT.forEach((spec, i) => {
      const { x, base, z, w, h, d, finish } = spec;
      const grp = new THREE.Group();
      const t = 0.09;

      const addPart = (
        geo: THREE.BoxGeometry,
        mat: THREE.Material,
        px: number,
        py: number,
        pz: number
      ) => {
        geometries.push(geo);
        const m = new THREE.Mesh(geo, mat);
        m.position.set(px, py, pz);
        m.castShadow = true;
        m.receiveShadow = true;
        grp.add(m);
      };

      addPart(new THREE.BoxGeometry(w, t, d), frameMat, 0, h / 2 - t / 2, 0);
      addPart(
        new THREE.BoxGeometry(w, t, d),
        finish === 'wood' ? woodMat : frameMat,
        0,
        -h / 2 + t / 2,
        0
      );
      addPart(new THREE.BoxGeometry(t, h, d), frameMat, -w / 2 + t / 2, 0, 0);
      addPart(new THREE.BoxGeometry(t, h, d), frameMat, w / 2 - t / 2, 0, 0);

      const wm = finish === 'rust' ? makeRustMat() : makeWallMat();
      if (finish === 'rust') {
        addPart(new THREE.BoxGeometry(w - 2 * t, h - 2 * t, 0.03), wm, 0, 0, -d / 2 + 0.02);
        addPart(new THREE.BoxGeometry(0.03, h - 2 * t, d), wm, -w / 2 + t + 0.02, 0, 0);
      } else {
        addPart(new THREE.BoxGeometry(w - 2 * t, h - 2 * t, 0.03), wm, 0, 0, -d / 2 + 0.02);
      }

      grp.position.set(x, base + h / 2, z);
      stack.add(grp);

      const dir = new THREE.Vector3(x, base + h / 2, z).sub(ctr);
      dir.z += 0.5 * (i % 2 ? 1 : -1);
      dir.normalize();
      dir.y = Math.abs(dir.y) * 0.9 + 0.2;

      boxes.push({
        grp,
        home: grp.position.clone(),
        dir,
        ph: Math.random() * 6.28,
        wm,
        lit: (i * 7) % 3 !== 0 || finish === 'rust',
        spin: (Math.random() - 0.5) * 0.6,
      });
    });

    // Flocking birds
    const birdMat = new THREE.LineBasicMaterial({
      color: new THREE.Color('#3a3f37'),
      transparent: true,
      opacity: 0.8,
    });
    const birdGeo = new THREE.BufferGeometry().setAttribute(
      'position',
      new THREE.Float32BufferAttribute([-0.09, 0.04, 0, 0, 0, 0, 0, 0, 0, 0.09, 0.04, 0], 3)
    );
    geometries.push(birdGeo);
    materials.push(birdMat);

    const birds: THREE.LineSegments[] = [];
    for (let i = 0; i < 14; i++) {
      const b = new THREE.LineSegments(birdGeo, birdMat);
      b.position.set(
        -2.4 + Math.random() * 2.4,
        2.2 + Math.random() * 1.2,
        -2.2 + Math.random() * 0.6
      );
      b.userData = { ph: Math.random() * 6.28, sp: 0.06 + Math.random() * 0.06 };
      world.add(b);
      birds.push(b);
    }

    // Sizing
    let baseX = 0;
    const size = () => {
      const W = stage.clientWidth || 1;
      const H = stage.clientHeight || 1;
      const portrait = W / H < 0.9;
      renderer.setSize(W, H, false);
      cam.aspect = W / H;
      const a = W / H;
      if (portrait) {
        cam.position.set(0, 1.4, Math.max(18, 8.6 / (2 * Math.tan((16 * Math.PI) / 180) * a)));
      } else {
        cam.position.set(0, 1.6, 15.5);
      }
      cam.lookAt(0, 0, 0);
      cam.updateProjectionMatrix();
      const vh = 2 * cam.position.z * Math.tan((16 * Math.PI) / 180);
      const vw = vh * a;
      baseX = portrait ? 0 : Math.min(vw * 0.24, 4.2);
      world.position.set(baseX, portrait ? vh * 0.2 : 0.35, 0);
      world.scale.setScalar(1);
    };
    size();
    window.addEventListener('resize', size);

    // Pointer interaction (hover parallax + drag spin)
    let mx = 0;
    let my = 0;
    let drag = false;
    let lx = 0;
    let yaw = 0;
    let yawV = 0;

    const onPointerMove = (e: PointerEvent) => {
      mx = (e.clientX / window.innerWidth) * 2 - 1;
      my = (e.clientY / window.innerHeight) * 2 - 1;
      if (drag) {
        yawV += (e.clientX - lx) * 0.0009;
        lx = e.clientX;
      }
    };
    const onPointerDown = (e: PointerEvent) => {
      drag = true;
      lx = e.clientX;
    };
    const onPointerUp = () => {
      drag = false;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointerup', onPointerUp);

    // Day/night color interpolation targets
    const state = { k: nightTargetRef.current };
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const cDayHemi = new THREE.Color('#ffffff');
    const cNightHemi = new THREE.Color('#4f6070');
    const cDayGround = new THREE.Color('#c9bfae');
    const cNightGround = new THREE.Color('#151a14');
    const cDaySun = new THREE.Color('#fff1dc');
    const cNightSun = new THREE.Color('#9fb3ff');
    const cDayMoon = new THREE.Color('#dfe3da');
    const cNightMoon = new THREE.Color('#f2efe2');
    const cDayBird = new THREE.Color('#3a3f37');
    const cNightBird = new THREE.Color('#cfd3c4');

    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(stage);

    if (!isSoftwareGl) {
      renderer.compile(scene, cam);
    }

    const clock = new THREE.Clock();
    let frameId = 0;
    let disposed = false;

    const afterDraw = (cb: () => void) => {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (gl && typeof gl.fenceSync === 'function') {
        const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        gl.flush();
        const poll = () => {
          if (disposed) {
            if (sync) gl.deleteSync(sync);
            return;
          }
          const st = sync ? gl.getSyncParameter(sync, gl.SYNC_STATUS) : gl.SIGNALED;
          if (st === gl.UNSIGNALED) {
            frameId = window.setTimeout(poll, 5);
          } else {
            if (sync) gl.deleteSync(sync);
            frameId = window.setTimeout(cb, 80);
          }
        };
        frameId = window.setTimeout(poll, 5);
      } else {
        frameId = window.setTimeout(cb, 80);
      }
    };

    const tick = () => {
      if (disposed) return;

      if (!visible) {
        if (isSoftwareGl) {
          frameId = window.setTimeout(tick, 120);
        } else {
          frameId = requestAnimationFrame(tick);
        }
        return;
      }

      const t = clock.getElapsedTime();
      const target = nightTargetRef.current;
      state.k = reduce ? target : state.k + (target - state.k) * 0.06;
      const k = state.k;

      hemi.color.copy(cDayHemi).lerp(cNightHemi, k);
      hemi.groundColor.copy(cDayGround).lerp(cNightGround, k);
      hemi.intensity = lerp(0.95, 0.45, k);

      sun.color.copy(cDaySun).lerp(cNightSun, k);
      sun.intensity = lerp(1.35, 0.35, k);

      moonMat.color.copy(cDayMoon).lerp(cNightMoon, k);
      moonMat.opacity = lerp(0.62, 0.42, k);

      birdMat.color.copy(cDayBird).lerp(cNightBird, k);
      floorMat.color.setScalar(lerp(1, 0.32, k));
      warm.intensity = lerp(0, 1.6, k);
      renderer.toneMappingExposure = lerp(1.05, 1.2, k);

      const heroEl = heroRef.current;
      const copyEl = copyRef.current;
      const span = heroEl ? Math.max(1, heroEl.offsetHeight - window.innerHeight) : 1;
      const p = reduce ? 0 : Math.min(1, Math.max(0, window.scrollY / span));

      if (copyEl) {
        copyEl.style.opacity = String(Math.max(0, 1 - p * 1.6));
        copyEl.style.transform = `translateY(${-p * 40}px)`;
      }

      const ease = p * p * (3 - 2 * p);
      for (let i = 0; i < boxes.length; i++) {
        const b = boxes[i];
        const bob = reduce ? 0 : Math.sin(t * 0.8 + b.ph) * 0.025;
        b.grp.position.set(
          b.home.x + b.dir.x * ease * 1.9,
          b.home.y + b.dir.y * ease * 1.5 + bob,
          b.home.z + b.dir.z * ease * 2.2
        );
        b.grp.rotation.y = b.spin * ease;
        b.wm.emissiveIntensity = b.lit
          ? lerp(0, 1.15, k) * (0.85 + 0.15 * Math.sin(t * 1.3 + b.ph))
          : 0;
      }

      for (let i = 0; i < birds.length; i++) {
        const b = birds[i];
        if (!reduce) {
          b.position.x += (b.userData.sp as number) * 0.016;
          if (b.position.x > 1.6) b.position.x = -3.2;
        }
        b.scale.y = reduce ? 1 : 0.5 + 0.7 * Math.abs(Math.sin(t * 6 + (b.userData.ph as number)));
      }

      world.position.x = baseX * (1 - ease * 0.55);
      yawV *= 0.92;
      yaw += yawV;
      const idle = reduce ? 0 : Math.sin(t * 0.12) * 0.12;
      stack.rotation.y += (mx * 0.28 + idle + yaw + ease * 0.7 - stack.rotation.y) * 0.05;
      stack.rotation.x += (my * 0.06 + ease * 0.12 - stack.rotation.x) * 0.05;

      renderer.render(scene, cam);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    };

    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      io.disconnect();
      window.removeEventListener('resize', size);
      window.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      geometries.forEach((geo) => geo.dispose());
      materials.forEach((mat) => mat.dispose());
      textures.forEach((tex) => tex.dispose());
      renderer.dispose();
      if (renderer.domElement.parentNode === stage) {
        stage.removeChild(renderer.domElement);
      }
    };
  }, [heroRef, copyRef, onWebGLUnavailable]);

  return <div id="stage" ref={stageRef} aria-hidden="true" />;
};
