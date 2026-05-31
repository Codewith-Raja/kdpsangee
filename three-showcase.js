const stage = document.getElementById('future-stage');
const canvas = document.getElementById('future-canvas');
const section = document.getElementById('future-view');

const showFallback = () => {
  section?.classList.add('future-view--fallback');
};

if (!stage || !canvas || !section) {
  showFallback();
} else {
  try {
    const THREE = await import('https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js');
    const prefersLessMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lowPowerDevice =
      navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4 && window.innerWidth < 820;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !lowPowerDevice,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, lowPowerDevice ? 1.35 : 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 1.1, 7);

    const ambient = new THREE.AmbientLight(0xffffff, 1.15);
    const key = new THREE.DirectionalLight(0xf6d36a, 2.1);
    key.position.set(3, 5, 4);
    const rim = new THREE.PointLight(0xc41e3a, 2.2, 12);
    rim.position.set(-3.5, 1.5, 3);
    scene.add(ambient, key, rim);

    const root = new THREE.Group();
    scene.add(root);

    const loader = new THREE.TextureLoader();
    const productImages = ['c1.PNG', 'h1.PNG', 'd1.PNG', 'g1.PNG', 'm1.PNG'];
    const textures = await Promise.all(
      productImages.map(
        (src) =>
          new Promise((resolve, reject) => {
            loader.load(
              src,
              (texture) => {
                texture.colorSpace = THREE.SRGBColorSpace;
                texture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);
                resolve(texture);
              },
              undefined,
              reject
            );
          })
      )
    );

    const cardGroup = new THREE.Group();
    root.add(cardGroup);

    const cardGeometry = new THREE.BoxGeometry(1.25, 1.72, 0.055, 1, 1, 1);
    textures.forEach((texture, index) => {
      const material = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.46,
        metalness: 0.08,
      });
      const card = new THREE.Mesh(cardGeometry, material);
      const angle = (index / textures.length) * Math.PI * 2;
      card.position.set(Math.cos(angle) * 2.28, 0.28 + Math.sin(index) * 0.12, Math.sin(angle) * 0.92);
      card.rotation.y = -angle + Math.PI / 2;
      card.castShadow = false;
      card.userData.angle = angle;
      cardGroup.add(card);
    });

    const bowl = new THREE.Group();
    const bowlShell = new THREE.Mesh(
      new THREE.CylinderGeometry(1.08, 0.82, 0.46, 48, 1, true),
      new THREE.MeshStandardMaterial({
        color: 0xd4a012,
        metalness: 0.72,
        roughness: 0.28,
        side: THREE.DoubleSide,
      })
    );
    const spiceMound = new THREE.Mesh(
      new THREE.SphereGeometry(0.76, 48, 18, 0, Math.PI * 2, 0, Math.PI / 2),
      new THREE.MeshStandardMaterial({
        color: 0xc41e3a,
        roughness: 0.74,
        metalness: 0.02,
      })
    );
    const glowRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.64, 0.018, 8, 96),
      new THREE.MeshBasicMaterial({ color: 0xf0c94a, transparent: true, opacity: 0.72 })
    );
    bowl.position.y = -0.92;
    spiceMound.position.y = 0.08;
    glowRing.rotation.x = Math.PI / 2;
    glowRing.position.y = 0.04;
    bowl.add(bowlShell, spiceMound, glowRing);
    root.add(bowl);

    const particleCount = lowPowerDevice ? 70 : 120;
    const particleGeometry = new THREE.SphereGeometry(0.018, 8, 8);
    const particleMaterial = new THREE.MeshBasicMaterial({
      color: 0xf0c94a,
      transparent: true,
      opacity: 0.62,
    });
    const particles = new THREE.InstancedMesh(particleGeometry, particleMaterial, particleCount);
    const particleDummy = new THREE.Object3D();
    const particleSeeds = Array.from({ length: particleCount }, (_, i) => ({
      angle: (i / particleCount) * Math.PI * 2,
      radius: 1.35 + Math.random() * 2.4,
      height: -1 + Math.random() * 2.35,
      speed: 0.2 + Math.random() * 0.45,
    }));
    root.add(particles);

    const pointer = { x: 0, y: 0 };
    const setPointer = (event) => {
      const rect = stage.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      pointer.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    stage.addEventListener('pointermove', setPointer, { passive: true });
    stage.addEventListener('pointerleave', () => {
      pointer.x = 0;
      pointer.y = 0;
    });

    const resize = () => {
      const { width, height } = stage.getBoundingClientRect();
      renderer.setSize(Math.max(1, width), Math.max(1, height), false);
      camera.aspect = width / Math.max(1, height);
      camera.position.z = width < 520 ? 7.8 : 7;
      root.position.y = width < 520 ? 0.42 : 0.18;
      camera.updateProjectionMatrix();
    };

    let frameId = 0;
    let visible = true;
    const clock = new THREE.Clock();

    const render = () => {
      const elapsed = clock.getElapsedTime();
      const motion = prefersLessMotion ? 0 : elapsed;
      root.rotation.y = motion * 0.18 + pointer.x * 0.18;
      root.rotation.x = -pointer.y * 0.08;
      cardGroup.rotation.y = motion * 0.24;
      bowl.rotation.y = motion * 0.35;
      glowRing.scale.setScalar(1 + Math.sin(motion * 1.8) * 0.035);

      cardGroup.children.forEach((card, index) => {
        card.position.y = 0.28 + Math.sin(motion * 1.5 + index) * 0.08;
      });

      particleSeeds.forEach((seed, index) => {
        const a = seed.angle + motion * seed.speed;
        particleDummy.position.set(Math.cos(a) * seed.radius, seed.height, Math.sin(a) * seed.radius * 0.46);
        particleDummy.scale.setScalar(0.75 + Math.sin(motion * 2 + index) * 0.18);
        particleDummy.updateMatrix();
        particles.setMatrixAt(index, particleDummy.matrix);
      });
      particles.instanceMatrix.needsUpdate = true;

      renderer.render(scene, camera);
      if (!prefersLessMotion && visible) frameId = requestAnimationFrame(render);
    };

    const start = () => {
      cancelAnimationFrame(frameId);
      visible = true;
      render();
    };

    const stop = () => {
      visible = false;
      cancelAnimationFrame(frameId);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !document.hidden) start();
        else stop();
      },
      { threshold: 0.08 }
    );

    window.addEventListener('resize', resize, { passive: true });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stop();
      else start();
    });

    resize();
    observer.observe(section);
    render();
  } catch (error) {
    console.warn('3D showcase fallback enabled:', error);
    showFallback();
  }
}
