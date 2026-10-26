// --- i808developer --- 

// --- Scene Setup ---
    const container = document.getElementById('canvas-container');
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x02050e, 0.038);

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0.8, 4.8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 8.0;
    controls.minDistance = 2.0;
    controls.maxPolarAngle = Math.PI / 2 + 0.15; // Allow viewing slightly from below
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.8;

    // Lighting Setup
    const ambientLight = new THREE.AmbientLight(0x0d1e3a, 1.2);
    scene.add(ambientLight);

    const screenLight = new THREE.PointLight(0x38bdf8, 2.5, 4.5);
    screenLight.position.set(0, 0.8, 0.6);
    scene.add(screenLight);

    const holoLight = new THREE.PointLight(0x00e1ff, 3.2, 3.5);
    holoLight.position.set(0, -1.0, 0);
    scene.add(holoLight);

    const topRimLight = new THREE.DirectionalLight(0xa5f3fc, 1.0);
    topRimLight.position.set(0, 5, 2);
    scene.add(topRimLight);

    // --- Procedural Canvas Texture for Laptop Screen ---
    const screenCanvas = document.createElement('canvas');
    screenCanvas.width = 1024;
    screenCanvas.height = 680;
    const sCtx = screenCanvas.getContext('2d');
    const screenTexture = new THREE.CanvasTexture(screenCanvas);
    screenTexture.generateMipmaps = true;
    screenTexture.minFilter = THREE.LinearMipmapLinearFilter;

    // Helper: Draw the stylized circuit emblem from the user's reference image
    function drawCircuitEmblem(ctx, cx, cy, size, progress) {
      ctx.save();
      ctx.translate(cx, cy);

      // Central glowing diamond
      const dSize = size * 0.32;
      ctx.lineWidth = 14;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Outer gradient stroke for diamond
      const grad = ctx.createLinearGradient(-dSize, -dSize, dSize, dSize);
      grad.addColorStop(0, '#00d2ff');
      grad.addColorStop(0.35, '#3a7bd5');
      grad.addColorStop(0.65, '#f857a6');
      grad.addColorStop(1, '#ff5858');

      ctx.strokeStyle = grad;
      ctx.beginPath();
      ctx.moveTo(0, -dSize);
      ctx.lineTo(dSize, 0);
      ctx.lineTo(0, dSize);
      ctx.lineTo(-dSize, 0);
      ctx.closePath();
      ctx.stroke();

      // Inner hollow diamond
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(0, -dSize * 0.55);
      ctx.lineTo(dSize * 0.55, 0);
      ctx.lineTo(0, dSize * 0.55);
      ctx.lineTo(-dSize * 0.55, 0);
      ctx.closePath();
      ctx.stroke();

      // Radiating circuit branches (4 symmetrical directions: Top, Right, Bottom, Left)
      const branches = [
        { angle: -Math.PI / 2, color: '#38bdf8' }, // Top
        { angle: 0, color: '#fb923c' },             // Right
        { angle: Math.PI / 2, color: '#f43f5e' },  // Bottom
        { angle: Math.PI, color: '#2563eb' }       // Left
      ];

      branches.forEach((b) => {
        ctx.save();
        ctx.rotate(b.angle);

        ctx.strokeStyle = b.color;
        ctx.fillStyle = b.color;
        ctx.lineWidth = 8;

        // Main center trace out
        ctx.beginPath();
        ctx.moveTo(0, dSize * 0.9);
        ctx.lineTo(0, dSize * 1.7);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, dSize * 1.7 + 6, 8, 0, Math.PI * 2);
        ctx.fill();

        // Left wing trace
        ctx.beginPath();
        ctx.moveTo(-18, dSize * 0.7);
        ctx.lineTo(-45, dSize * 1.05);
        ctx.lineTo(-45, dSize * 1.45);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(-45, dSize * 1.45 + 6, 6, 0, Math.PI * 2);
        ctx.fill();

        // Right wing trace
        ctx.beginPath();
        ctx.moveTo(18, dSize * 0.7);
        ctx.lineTo(45, dSize * 1.05);
        ctx.lineTo(45, dSize * 1.45);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(45, dSize * 1.45 + 6, 6, 0, Math.PI * 2);
        ctx.fill();

        // Traveling pulse packet animation
        const pulseY = (dSize * 0.9) + ((progress * 1.2) % 1) * (dSize * 0.8);
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(0, pulseY, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      });

      ctx.restore();
    }

    function renderScreenCanvas(time) {
      // White glossy display background as seen in the reference
      const bgGrad = sCtx.createRadialGradient(512, 280, 50, 512, 340, 550);
      bgGrad.addColorStop(0, '#ffffff');
      bgGrad.addColorStop(0.7, '#f4f6fa');
      bgGrad.addColorStop(1, '#e2e8f0');
      sCtx.fillStyle = bgGrad;
      sCtx.fillRect(0, 0, screenCanvas.width, screenCanvas.height);

      // Subtle cyber grid on screen
      sCtx.strokeStyle = 'rgba(203, 213, 225, 0.4)';
      sCtx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < screenCanvas.width; x += gridSize) {
        sCtx.beginPath();
        sCtx.moveTo(x, 0);
        sCtx.lineTo(x, screenCanvas.height);
        sCtx.stroke();
      }
      for (let y = 0; y < screenCanvas.height; y += gridSize) {
        sCtx.beginPath();
        sCtx.moveTo(0, y);
        sCtx.lineTo(screenCanvas.width, y);
        sCtx.stroke();
      }

      // Draw the vibrant emblem
      drawCircuitEmblem(sCtx, 512, 250, 160, time * 0.8);

      // Text logo: i808developer
      sCtx.textAlign = 'center';
      sCtx.fillStyle = '#0f172a';
      sCtx.font = '700 68px "Inter", sans-serif';
      sCtx.letterSpacing = '-2px';
      sCtx.fillText('i808developer', 512, 455);

      // Subtitle status pulse
      sCtx.font = '500 18px "JetBrains Mono", monospace';
      sCtx.fillStyle = '#64748b';
      sCtx.letterSpacing = '3px';
      sCtx.fillText('SYSTEM INITIALIZED • ONLINE', 512, 495);

      screenTexture.needsUpdate = true;
    }

    // --- 3D Laptop Mesh Construction ---
    const laptopGroup = new THREE.Group();
    scene.add(laptopGroup);

    // Chassis Material (Dark space-gray anodized metal)
    const aluminumMaterial = new THREE.MeshStandardMaterial({
      color: 0x1e2430,
      metalness: 0.85,
      roughness: 0.28,
    });

    const bezelMaterial = new THREE.MeshStandardMaterial({
      color: 0x05070c,
      roughness: 0.4,
    });

    const screenMaterial = new THREE.MeshStandardMaterial({
      map: screenTexture,
      roughness: 0.15,
      metalness: 0.1,
      emissive: 0xffffff,
      emissiveMap: screenTexture,
      emissiveIntensity: 0.55
    });

    // 1. Laptop Base / Body
    const baseWidth = 2.4;
    const baseDepth = 1.6;
    const baseHeight = 0.07;

    const baseGeometry = new THREE.BoxGeometry(baseWidth, baseHeight, baseDepth);
    const laptopBase = new THREE.Mesh(baseGeometry, aluminumMaterial);
    laptopBase.position.y = 0;
    laptopGroup.add(laptopBase);

    // Keyboard indentation
    const kbIndentGeo = new THREE.BoxGeometry(1.9, 0.005, 0.9);
    const kbIndentMat = new THREE.MeshStandardMaterial({ color: 0x0d121c, roughness: 0.7 });
    const kbIndent = new THREE.Mesh(kbIndentGeo, kbIndentMat);
    kbIndent.position.set(0, baseHeight / 2 + 0.001, -0.15);
    laptopBase.add(kbIndent);

    // Trackpad
    const tpGeo = new THREE.BoxGeometry(0.7, 0.002, 0.45);
    const tpMat = new THREE.MeshStandardMaterial({ color: 0x222938, roughness: 0.3, metalness: 0.7 });
    const trackpad = new THREE.Mesh(tpGeo, tpMat);
    trackpad.position.set(0, baseHeight / 2 + 0.002, 0.45);
    laptopBase.add(trackpad);

    // Subtle individual procedural keyboard keys
    const keysGroup = new THREE.Group();
    const rows = 5;
    const cols = 14;
    const keyW = 0.115;
    const keyD = 0.12;
    const keyH = 0.015;
    const keyGeo = new THREE.BoxGeometry(keyW, keyH, keyD);
    const keyMat = new THREE.MeshStandardMaterial({ color: 0x111622, roughness: 0.5 });

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const kMesh = new THREE.Mesh(keyGeo, keyMat);
        const kx = (c - (cols - 1) / 2) * 0.13;
        const kz = (r - (rows - 1) / 2) * 0.16;
        kMesh.position.set(kx, baseHeight / 2 + keyH / 2, -0.15 + kz);
        keysGroup.add(kMesh);
      }
    }
    laptopBase.add(keysGroup);

    // 2. Laptop Lid & Hinge
    const lidGroup = new THREE.Group();
    lidGroup.position.set(0, baseHeight / 2, -baseDepth / 2); // Hinge pivot point
    laptopGroup.add(lidGroup);

    const lidHeight = 1.5;
    const lidThickness = 0.04;
    const lidGeo = new THREE.BoxGeometry(baseWidth, lidHeight, lidThickness);
    const laptopLid = new THREE.Mesh(lidGeo, aluminumMaterial);
    // Center lid relative to hinge
    laptopLid.position.set(0, lidHeight / 2, -lidThickness / 2);
    lidGroup.add(laptopLid);

    // Display Screen Mesh
    const screenGeo = new THREE.PlaneGeometry(baseWidth * 0.92, lidHeight * 0.88);
    const screenMesh = new THREE.Mesh(screenGeo, screenMaterial);
    screenMesh.position.set(0, lidHeight / 2, 0.021); // Front of the lid
    lidGroup.add(screenMesh);

    // Notch / Webcam indicator
    const notchGeo = new THREE.BoxGeometry(0.2, 0.035, 0.005);
    const notchMesh = new THREE.Mesh(notchGeo, bezelMaterial);
    notchMesh.position.set(0, lidHeight * 0.95, 0.023);
    lidGroup.add(notchMesh);

    // Default angle: tilted open (~195 degrees)
    let currentLidAngle = THREE.MathUtils.degToRad(195);
    lidGroup.rotation.x = Math.PI - currentLidAngle;

    // --- 3D Holographic Projected Circuit (Under Laptop) ---
    const holoCircuitGroup = new THREE.Group();
    holoCircuitGroup.position.set(0, -0.9, 0);
    scene.add(holoCircuitGroup);

    // Hologram Lines Material
    let holoColorHex = 0x00f3ff;
    const holoLineMat = new THREE.LineBasicMaterial({
      color: holoColorHex,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      linewidth: 2
    });

    // Create concentric circuit diamond tracks
    function createDiamondPath(radius) {
      const pts = [];
      pts.push(new THREE.Vector3(0, 0, -radius));
      pts.push(new THREE.Vector3(radius * 1.3, 0, 0));
      pts.push(new THREE.Vector3(0, 0, radius));
      pts.push(new THREE.Vector3(-radius * 1.3, 0, 0));
      pts.push(new THREE.Vector3(0, 0, -radius));
      const geom = new THREE.BufferGeometry().setFromPoints(pts);
      return new THREE.Line(geom, holoLineMat);
    }

    holoCircuitGroup.add(createDiamondPath(0.35));
    holoCircuitGroup.add(createDiamondPath(0.65));
    holoCircuitGroup.add(createDiamondPath(0.95));

    // Branching circuit traces
    const traceCoords = [
      // Left branches
      [-0.8, 0, -0.8 * 1.3, 0, -1.5, 0, 0.15, 0],
      [-1.3, 0, 0, -1.9, 0, 0],
      [-0.8, 0, 0.8 * 1.3, 0, -1.5, 0, -0.15, 0],
      // Right branches
      [0.8, 0, -0.8 * 1.3, 0, 1.5, 0, 0.15, 0],
      [1.3, 0, 0, 1.9, 0, 0],
      [0.8, 0, 0.8 * 1.3, 0, 1.5, 0, -0.15, 0],
      // Top & Bottom vertical feeds
      [0, -0.95, 0, -1.5],
      [0, 0.95, 0, 1.5]
    ];

    const branchGeo = new THREE.BufferGeometry();
    const branchPositions = [];

    // Helper lines
    function addTraceSegment(x1, z1, x2, z2) {
      branchPositions.push(x1, 0, z1);
      branchPositions.push(x2, 0, z2);
    }

    addTraceSegment(-0.85, 0, -1.5, 0);
    addTraceSegment(-1.5, 0, -1.7, -0.3);
    addTraceSegment(-1.5, 0, -1.7, 0.3);
    addTraceSegment(0.85, 0, 1.5, 0);
    addTraceSegment(1.5, 0, 1.7, -0.3);
    addTraceSegment(1.5, 0, 1.7, 0.3);
    addTraceSegment(0, -0.95, 0, -1.6);
    addTraceSegment(-0.4, -0.6, -0.8, -1.2);
    addTraceSegment(0.4, -0.6, 0.8, -1.2);
    addTraceSegment(0, 0.95, 0, 1.6);
    addTraceSegment(-0.4, 0.6, -0.8, 1.2);
    addTraceSegment(0.4, 0.6, 0.8, 1.2);

    branchGeo.setAttribute('position', new THREE.Float32BufferAttribute(branchPositions, 3));
    const branchesMesh = new THREE.LineSegments(branchGeo, holoLineMat);
    holoCircuitGroup.add(branchesMesh);

    // Node pads (glowing points at circuit terminals)
    const nodeCoords = [
      [0, 0], [0.45, 0], [-0.45, 0], [0, 0.45], [0, -0.45],
      [-1.7, -0.3], [-1.7, 0.3], [1.7, -0.3], [1.7, 0.3],
      [0, -1.6], [0, 1.6], [-0.8, -1.2], [0.8, -1.2],
      [-0.8, 1.2], [0.8, 1.2], [-1.3, 0], [1.3, 0]
    ];

    const nodeGeo = new THREE.BufferGeometry();
    const nodePos = [];
    nodeCoords.forEach(c => nodePos.push(c[0], 0, c[1]));
    nodeGeo.setAttribute('position', new THREE.Float32BufferAttribute(nodePos, 3));

    // Circle point sprite generator for glowing nodes
    function createGlowPointTexture() {
      const pCanvas = document.createElement('canvas');
      pCanvas.width = 64;
      pCanvas.height = 64;
      const ctx = pCanvas.getContext('2d');
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 30);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.3, '#38bdf8');
      grad.addColorStop(0.7, 'rgba(56, 189, 248, 0.4)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(pCanvas);
    }

    const nodePointTexture = createGlowPointTexture();
    const nodeMat = new THREE.PointsMaterial({
      map: nodePointTexture,
      size: 0.16,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: holoColorHex
    });
    const nodesPointsMesh = new THREE.Points(nodeGeo, nodeMat);
    holoCircuitGroup.add(nodesPointsMesh);

    // Holographic vertical transmission projector rings
    const ringGeo = new THREE.RingGeometry(0.3, 0.33, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: holoColorHex,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending
    });
    const holoRing = new THREE.Mesh(ringGeo, ringMat);
    holoRing.rotation.x = Math.PI / 2;
    holoRing.position.y = -0.05;
    holoCircuitGroup.add(holoRing);

    // --- 3D Cascading Binary Rain Streams ---
    const rainColumnCount = 140;
    const rainColumnGroup = new THREE.Group();
    scene.add(rainColumnGroup);

    // Procedural binary glyph texture atlas (1s and 0s)
    function generateBinaryAtlasTexture() {
      const bCanvas = document.createElement('canvas');
      bCanvas.width = 128;
      bCanvas.height = 512;
      const bCtx = bCanvas.getContext('2d');
      bCtx.fillStyle = 'transparent';
      bCtx.fillRect(0, 0, 128, 512);

      bCtx.font = 'bold 38px "JetBrains Mono", monospace';
      bCtx.textAlign = 'center';

      // Draw glowing binary numbers vertically
      const chars = ['0', '1', '1', '0', '0', '1', '0', '1', '#', '8', '0', '8'];
      chars.forEach((ch, idx) => {
        const yPos = 40 + idx * 38;
        // Glow
        bCtx.shadowColor = '#38bdf8';
        bCtx.shadowBlur = 12;
        bCtx.fillStyle = idx === 0 ? '#ffffff' : '#38bdf8';
        bCtx.fillText(ch, 64, yPos);
      });

      return new THREE.CanvasTexture(bCanvas);
    }

    const binaryTexture = generateBinaryAtlasTexture();
    const rainPlanes = [];
    const rainGeo = new THREE.PlaneGeometry(0.3, 2.8);

    for (let i = 0; i < rainColumnCount; i++) {
      const rainMat = new THREE.MeshBasicMaterial({
        map: binaryTexture,
        transparent: true,
        opacity: THREE.MathUtils.randFloat(0.4, 0.85),
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide
      });

      const mesh = new THREE.Mesh(rainGeo, rainMat);
      
      // Spread across volume
      const rx = THREE.MathUtils.randFloatSpread(10);
      const rz = THREE.MathUtils.randFloatSpread(6) - 1; // around & behind laptop
      const ry = THREE.MathUtils.randFloat(-4, 6);

      mesh.position.set(rx, ry, rz);
      mesh.scale.setScalar(THREE.MathUtils.randFloat(0.7, 1.4));

      rainPlanes.push({
        mesh: mesh,
        speed: THREE.MathUtils.randFloat(1.2, 2.8),
        initialY: ry,
        resetY: 6.5,
        floorY: -5.5
      });

      rainColumnGroup.add(mesh);
    }

    // --- Ambient Cyber Dust / Motes ---
    const dustCount = 200;
    const dustGeo = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount * 3; i += 3) {
      dustPositions[i] = THREE.MathUtils.randFloatSpread(12);
      dustPositions[i + 1] = THREE.MathUtils.randFloatSpread(8);
      dustPositions[i + 2] = THREE.MathUtils.randFloatSpread(8);
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.035,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    const dustParticles = new THREE.Points(dustGeo, dustMat);
    scene.add(dustParticles);

    // --- Interactive Cyber Sound Generator (Tone.js) ---
    let isAudioPlaying = false;
    let synthDrone = null;
    let filter = null;
    let noise = null;

    async function initCyberAudio() {
      if (synthDrone) return;
      await Tone.start();

      // Atmospheric cyber bass drone
      synthDrone = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: "sawtooth" },
        envelope: { attack: 2, decay: 3, sustain: 0.8, release: 4 }
      }).toDestination();

      filter = new Tone.AutoFilter({
        frequency: "4n",
        baseFrequency: 180,
        octaves: 2.5
      }).toDestination().start();

      synthDrone.connect(filter);
      synthDrone.volume.value = -18;

      // Soft high-frequency binary stream noise
      noise = new Tone.NoiseSynth({
        noise: { type: 'pink' },
        envelope: { attack: 1.5, decay: 2, sustain: 0.2, release: 2 }
      }).toDestination();
      noise.volume.value = -28;
    }

    const audioBtn = document.getElementById('btn-audio');
    const audioLabel = document.getElementById('audio-label');

    audioBtn.addEventListener('click', async () => {
      try {
        if (!isAudioPlaying) {
          await initCyberAudio();
          synthDrone.triggerAttack(["C2", "G2", "C3"]);
          isAudioPlaying = true;
          audioLabel.innerText = "SOUND: ON";
          audioBtn.classList.add('bg-cyan-500/30', 'border-cyan-400');
        } else {
          synthDrone.releaseAll();
          isAudioPlaying = false;
          audioLabel.innerText = "SOUND: MUTED";
          audioBtn.classList.remove('bg-cyan-500/30', 'border-cyan-400');
        }
      } catch (e) {
        console.warn("Audio playback gesture initialized.");
      }
    });

    // UI Event Listeners
    let rainSpeedMultiplier = 1.2;
    const speedSlider = document.getElementById('slider-speed');
    speedSlider.addEventListener('input', (e) => {
      rainSpeedMultiplier = parseFloat(e.target.value);
    });

    const lidSlider = document.getElementById('slider-lid');
    lidSlider.addEventListener('input', (e) => {
      const deg = parseFloat(e.target.value);
      currentLidAngle = THREE.MathUtils.degToRad(deg);
      lidGroup.rotation.x = Math.PI - currentLidAngle;
    });

    const spinBtn = document.getElementById('btn-toggle-spin');
    const spinStatus = document.getElementById('spin-status');
    spinBtn.addEventListener('click', () => {
      controls.autoRotate = !controls.autoRotate;
      spinStatus.innerText = controls.autoRotate ? 'ON' : 'OFF';
      spinStatus.className = controls.autoRotate ? 'text-cyan-400 font-bold' : 'text-gray-400 font-bold';
    });

    const resetCamBtn = document.getElementById('btn-reset-cam');
    resetCamBtn.addEventListener('click', () => {
      controls.reset();
      camera.position.set(0, 0.8, 4.8);
      controls.target.set(0, 0, 0);
    });

function openNav() {
  document.getElementById("mySidenav").style.width = "50%";
}
function myChess() {
  let myWindow = window.open("https://808developer.github.io/xodbox/ChessSpider3D", "new_tab");
}
function myRealm() {
  let myWindow = window.open("https://808developer.github.io/xodbox/Realm3D", "new_tab");
}
function myRetro() {
  let myWindow = window.open("https://808developer.github.io/xodbox/RetroShooter3D", "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=50,left=0,width=650,height=800");
}
function myTerminal() {
  let myWindow = window.open("https://808developer.github.io/xodbox/Terminal3D", "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=50,left=0,width=650,height=800");
}
function myAsteroid() {
  let myWindow = window.open("https://808developer.github.io/xodbox/AsteroidShooter3D", "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=50,left=0,width=650,height=800");
}
function myStruck() {
  let myWindow = window.open("https://808developer.github.io/xodbox/Cyberstruck3D", "_blank", "toolbar=yes,scrollbars=yes,resizable=yes");
}
function btnProducts() { 
    document.getElementById("myProducts").style.color = "green";
    document.getElementById("myContact").style.color = "white";
    document.getElementById("myAbout").style.color = "white";
}
function btnContact() {
    document.getElementById("myContact").style.color = "green";
    document.getElementById("myProducts").style.color = "white";
    document.getElementById("myAbout").style.color = "white";
}
function btnAbout() {
    document.getElementById("myAbout").style.color = "green";
    document.getElementById("myProducts").style.color = "white";
    document.getElementById("myContact").style.color = "white";
}
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("myProducts").style.color = "white";
    document.getElementById("myContact").style.color = "white";
    document.getElementById("myAbout").style.color = "white";
}


    // Color Swatches
    const colorButtons = document.querySelectorAll('#color-selectors button');
    colorButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const hex = btn.getAttribute('data-color');
        const color = new THREE.Color(hex);
        holoLineMat.color.set(color);
        nodeMat.color.set(color);
        ringMat.color.set(color);
        holoLight.color.set(color);

        colorButtons.forEach(b => b.classList.remove('border-2', 'border-white'));
        btn.classList.add('border-2', 'border-white');
      });
    });

    // --- Responsive Canvas Resizing ---
    window.addEventListener('resize', onWindowResize, false);
    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    // --- Main Render & Animation Loop ---
    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // 1. Redraw dynamic screen texture with pulsing logic
      renderScreenCanvas(elapsedTime);

      // 2. Subtle floating hover / bobbing of laptop and hologram
      const hoverY = Math.sin(elapsedTime * 1.5) * 0.05;
      laptopGroup.position.y = hoverY;
      holoCircuitGroup.position.y = -0.9 + hoverY * 0.7;

      // Holographic slow rotation
      holoCircuitGroup.rotation.y = elapsedTime * 0.15;
      holoRing.scale.setScalar(1.0 + Math.sin(elapsedTime * 3) * 0.06);

      // 3. Falling binary code columns
      rainPlanes.forEach((rp) => {
        rp.mesh.position.y -= rp.speed * rainSpeedMultiplier * delta;
        if (rp.mesh.position.y < rp.floorY) {
          rp.mesh.position.y = rp.resetY;
          rp.mesh.position.x = THREE.MathUtils.randFloatSpread(10);
        }
      });

      // 4. Subtle dust particle floating
      dustParticles.rotation.y = elapsedTime * 0.02;

      // 5. Update controls & render scene
      controls.update();
      renderer.render(scene, camera);
    }

    // Initialize animation once DOM and resources load
    window.onload = function () {
      animate();
    };