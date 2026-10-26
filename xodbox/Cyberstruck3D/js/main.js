/**
 * PURE MATHEMATICS ENGINE
 * Self-contained 3D Vector3 and Matrix4 implementations.
 */
class Vec3 {
  constructor(x = 0, y = 0, z = 0) {
    this.x = x; this.y = y; this.z = z;
  }
  set(x, y, z) { this.x = x; this.y = y; this.z = z; return this; }
  clone() { return new Vec3(this.x, this.y, this.z); }
  copy(v) { this.x = v.x; this.y = v.y; this.z = v.z; return this; }
  add(v) { this.x += v.x; this.y += v.y; this.z += v.z; return this; }
  sub(v) { this.x -= v.x; this.y -= v.y; this.z -= v.z; return this; }
  scale(s) { this.x *= s; this.y *= s; this.z *= s; return this; }
  lenSq() { return this.x * this.x + this.y * this.y + this.z * this.z; }
  len() { return Math.sqrt(this.lenSq()); }
  norm() {
    const l = this.len();
    if (l > 1e-6) { this.x /= l; this.y /= l; this.z /= l; }
    return this;
  }
  dot(v) { return this.x * v.x + this.y * v.y + this.z * v.z; }
  cross(v) {
    const rx = this.y * v.z - this.z * v.y;
    const ry = this.z * v.x - this.x * v.z;
    const rz = this.x * v.y - this.y * v.x;
    return new Vec3(rx, ry, rz);
  }
  distSq(v) {
    const dx = this.x - v.x, dy = this.y - v.y, dz = this.z - v.z;
    return dx * dx + dy * dy + dz * dz;
  }
  dist(v) { return Math.sqrt(this.distSq(v)); }
  lerp(v, t) {
    this.x += (v.x - this.x) * t;
    this.y += (v.y - this.y) * t;
    this.z += (v.z - this.z) * t;
    return this;
  }
}

class Mat4 {
  constructor() {
    this.elements = new Float32Array(16);
    this.identity();
  }
  identity() {
    const e = this.elements;
    e.fill(0);
    e[0] = 1; e[5] = 1; e[10] = 1; e[15] = 1;
    return this;
  }
  copy(m) {
    this.elements.set(m.elements);
    return this;
  }
  multiply(b) {
    const a = this.elements;
    const be = b.elements;
    const te = new Float32Array(16);
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        te[c * 4 + r] =
          a[0 * 4 + r] * be[c * 4 + 0] +
          a[1 * 4 + r] * be[c * 4 + 1] +
          a[2 * 4 + r] * be[c * 4 + 2] +
          a[3 * 4 + r] * be[c * 4 + 3];
      }
    }
    this.elements.set(te);
    return this;
  }
  perspective(fovyRad, aspect, near, far) {
    const f = 1.0 / Math.tan(fovyRad / 2.0);
    const nf = 1.0 / (near - far);
    const e = this.elements;
    e.fill(0);
    e[0] = f / aspect;
    e[5] = f;
    e[10] = (far + near) * nf;
    e[11] = -1.0;
    e[14] = 2.0 * far * near * nf;
    return this;
  }
  lookAt(eye, center, up) {
    const z = new Vec3().copy(eye).sub(center).norm();
    const x = up.cross(z).norm();
    const y = z.cross(x).norm();
    const e = this.elements;
    e[0] = x.x; e[4] = x.y; e[8] = x.z;  e[12] = -x.dot(eye);
    e[1] = y.x; e[5] = y.y; e[9] = y.z;  e[13] = -y.dot(eye);
    e[2] = z.x; e[6] = z.y; e[10] = z.z; e[14] = -z.dot(eye);
    e[3] = 0;   e[7] = 0;   e[11] = 0;   e[15] = 1;
    return this;
  }
  translate(x, y, z) {
    const t = new Mat4();
    t.elements[12] = x;
    t.elements[13] = y;
    t.elements[14] = z;
    return this.multiply(t);
  }
  rotateY(angleRad) {
    const c = Math.cos(angleRad), s = Math.sin(angleRad);
    const r = new Mat4();
    r.elements[0] = c;  r.elements[8] = s;
    r.elements[2] = -s; r.elements[10] = c;
    return this.multiply(r);
  }
  rotateX(angleRad) {
    const c = Math.cos(angleRad), s = Math.sin(angleRad);
    const r = new Mat4();
    r.elements[5] = c;  r.elements[9] = -s;
    r.elements[6] = s;  r.elements[10] = c;
    return this.multiply(r);
  }
  rotateZ(angleRad) {
    const c = Math.cos(angleRad), s = Math.sin(angleRad);
    const r = new Mat4();
    r.elements[0] = c;  r.elements[4] = -s;
    r.elements[1] = s;  r.elements[5] = c;
    return this.multiply(r);
  }
  scale(x, y, z) {
    const s = new Mat4();
    s.elements[0] = x;
    s.elements[5] = y;
    s.elements[10] = z;
    return this.multiply(s);
  }
}

/**
 * SYNTHETIC SOUND ENGINE
 * Real-time sound effects generated algorithmically without audio files.
 */
class SoundEngine {
  constructor() {
    this.ctx = null;
  }
  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }
  playShoot() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    // Punchy transient noise
    const bufferSize = this.ctx.sampleRate * 0.08;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    // Laser tonal sweep
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(680, t);
    osc.frequency.exponentialRampToValueAtTime(80, t + 0.1);

    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

    osc.connect(gain);
    noise.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    noise.start(t);
    osc.stop(t + 0.12);
  }
  playBotShoot() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(350, t);
    osc.frequency.exponentialRampToValueAtTime(90, t + 0.14);

    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.15);
  }
  playHit() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1200, t);
    osc.frequency.exponentialRampToValueAtTime(2400, t + 0.05);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.linearRampToValueAtTime(0.0, t + 0.06);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.06);
  }
  playPlayerHurt() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.linearRampToValueAtTime(40, t + 0.25);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.linearRampToValueAtTime(0.01, t + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.25);
  }
  playExplosion() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const bSize = this.ctx.sampleRate * 0.6;
    const buf = this.ctx.createBuffer(1, bSize, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < bSize; i++) {
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bSize, 2);
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buf;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(280, t);
    filter.frequency.linearRampToValueAtTime(50, t + 0.5);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.7, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.6);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(t);
  }
  playReload() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, t);
    osc.frequency.setValueAtTime(800, t + 0.08);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.linearRampToValueAtTime(0, t + 0.16);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.16);
  }
}

/**
 * WEBGL RENDERING ENGINE & SHADERS
 */
const VS_SOURCE = `
  attribute vec3 aPosition;
  attribute vec3 aNormal;
  attribute vec2 aTexCoord;

  uniform mat4 uModel;
  uniform mat4 uView;
  uniform mat4 uProjection;

  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying vec2 vTexCoord;

  void main() {
    vec4 worldPos = uModel * vec4(aPosition, 1.0);
    vWorldPos = worldPos.xyz;
    vNormal = normalize((uModel * vec4(aNormal, 0.0)).xyz);
    vTexCoord = aTexCoord;
    gl_Position = uProjection * uView * worldPos;
  }
`;

const FS_SOURCE = `
  precision mediump float;

  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying vec2 vTexCoord;

  uniform vec3 uColor;
  uniform vec3 uLightDir;
  uniform vec3 uCamPos;
  uniform float uMaterialType; // 0: Solid, 1: Sci-Fi Floor Grid, 2: Wall Panels, 3: Glowing Visor
  uniform float uTime;

  void main() {
    vec3 N = normalize(vNormal);
    vec3 L = normalize(-uLightDir);
    vec3 V = normalize(uCamPos - vWorldPos);
    vec3 H = normalize(L + V);

    // Diffuse & Ambient
    float diff = max(dot(N, L), 0.0);
    vec3 ambient = vec3(0.08, 0.12, 0.16);
    float spec = pow(max(dot(N, H), 0.0), 32.0) * 0.4;

    vec3 baseColor = uColor;

    // Procedural Sci-Fi Textures
    if (uMaterialType > 0.5 && uMaterialType < 1.5) {
      // Floor tech grid
      vec2 grid = abs(fract(vWorldPos.xz * 0.5) - 0.5);
      float line = smoothstep(0.02, 0.05, min(grid.x, grid.y));
      baseColor = mix(uColor * 1.5, uColor * 0.5, line);
    } else if (uMaterialType > 1.5 && uMaterialType < 2.5) {
      // Metal wall panels with seams
      vec2 panel = abs(fract(vec2(vWorldPos.x + vWorldPos.z, vWorldPos.y) * 0.25) - 0.5);
      float border = step(0.46, max(panel.x, panel.y));
      baseColor = mix(uColor, uColor * 0.3, border);
    } else if (uMaterialType > 2.5) {
      // Neon/Glow visor (emissive)
      gl_FragColor = vec4(uColor * 2.0, 1.0);
      return;
    }

    vec3 lit = ambient * baseColor + baseColor * diff + vec3(spec);

    // Distance Fog for atmosphere
    float dist = length(uCamPos - vWorldPos);
    float fog = clamp((dist - 15.0) / (70.0 - 15.0), 0.0, 0.85);
    vec3 fogColor = vec3(0.02, 0.03, 0.05);

    gl_FragColor = vec4(mix(lit, fogColor, fog), 1.0);
  }
`;

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function initShaderProgram(gl, vsSource, fsSource) {
  const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
  const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program));
    return null;
  }
  return program;
}

/**
 * 3D PRIMITIVE GEOMETRY GENERATORS
 * Builds vertex positions, normals, and UVs in packed buffers.
 */
function createBoxBuffer(gl, w = 1, h = 1, d = 1) {
  const hw = w / 2, hh = h / 2, hd = d / 2;
  const positions = [
    // Front
    -hw,-hh, hd,  hw,-hh, hd,  hw, hh, hd, -hw,-hh, hd,  hw, hh, hd, -hw, hh, hd,
    // Back
     hw,-hh,-hd, -hw,-hh,-hd, -hw, hh,-hd,  hw,-hh,-hd, -hw, hh,-hd,  hw, hh,-hd,
    // Top
    -hw, hh, hd,  hw, hh, hd,  hw, hh,-hd, -hw, hh, hd,  hw, hh,-hd, -hw, hh,-hd,
    // Bottom
    -hw,-hh,-hd,  hw,-hh,-hd,  hw,-hh, hd, -hw,-hh,-hd,  hw,-hh, hd, -hw,-hh, hd,
    // Right
     hw,-hh, hd,  hw,-hh,-hd,  hw, hh,-hd,  hw,-hh, hd,  hw, hh,-hd,  hw, hh, hd,
    // Left
    -hw,-hh,-hd, -hw,-hh, hd, -hw, hh, hd, -hw,-hh,-hd, -hw, hh, hd, -hw, hh,-hd
  ];
  const normals = [
    // Front
    0,0,1, 0,0,1, 0,0,1, 0,0,1, 0,0,1, 0,0,1,
    // Back
    0,0,-1, 0,0,-1, 0,0,-1, 0,0,-1, 0,0,-1, 0,0,-1,
    // Top
    0,1,0, 0,1,0, 0,1,0, 0,1,0, 0,1,0, 0,1,0,
    // Bottom
    0,-1,0, 0,-1,0, 0,-1,0, 0,-1,0, 0,-1,0, 0,-1,0,
    // Right
    1,0,0, 1,0,0, 1,0,0, 1,0,0, 1,0,0, 1,0,0,
    // Left
    -1,0,0, -1,0,0, -1,0,0, -1,0,0, -1,0,0, -1,0,0
  ];
  const uvs = [];
  for (let i = 0; i < 6; i++) {
    uvs.push(0,0, 1,0, 1,1, 0,0, 1,1, 0,1);
  }

  const posBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  const normBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normBuf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

  const uvBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, uvBuf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW);

  return { posBuf, normBuf, uvBuf, vertexCount: 36 };
}

class ParticleSystem {
  constructor() {
    this.particles = [];
  }
  emit(x, y, z, count = 12, color = [1, 0.6, 0.2], speed = 6.0) {
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;
      const spd = speed * (0.3 + Math.random() * 0.9);
      this.particles.push({
        pos: new Vec3(x, y, z),
        vel: new Vec3(
          Math.cos(phi) * Math.sin(theta) * spd,
          Math.sin(phi) * spd + 1.5,
          Math.cos(phi) * Math.cos(theta) * spd
        ),
        color: [...color],
        life: 1.0,
        decay: 1.5 + Math.random() * 2.0,
        size: 0.08 + Math.random() * 0.08
      });
    }
  }
  update(dt) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.pos.x += p.vel.x * dt;
      p.pos.y += p.vel.y * dt;
      p.pos.z += p.vel.z * dt;
      p.vel.y -= 9.8 * dt; // gravity
      p.life -= p.decay * dt;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }
}

/**
 * ARENA GEOMETRY DEFINITION
 * Map boundaries, pillars, crates, cover platforms.
 */
class Arena {
  constructor(gl, boxMesh) {
    this.gl = gl;
    this.boxMesh = boxMesh;
    this.size = 64; // 64x64 arena
    this.wallHeight = 6.0;

    // List of static collision boxes { minX, maxX, minZ, maxZ, minY, maxY, color, matType }
    this.colliders = [];
    this.buildMap();
  }

  addBlock(x, y, z, w, h, d, color = [0.2, 0.25, 0.3], matType = 2) {
    this.colliders.push({
      x, y, z, w, h, d,
      minX: x - w / 2, maxX: x + w / 2,
      minY: y - h / 2, maxY: y + h / 2,
      minZ: z - d / 2, maxZ: z + d / 2,
      color, matType
    });
  }

  buildMap() {
    const s = this.size;
    const h = this.wallHeight;

    // Outer perimeter walls
    this.addBlock(0, h/2, -s/2, s, h, 2, [0.15, 0.2, 0.26], 2);
    this.addBlock(0, h/2, s/2, s, h, 2, [0.15, 0.2, 0.26], 2);
    this.addBlock(-s/2, h/2, 0, 2, h, s, [0.15, 0.2, 0.26], 2);
    this.addBlock(s/2, h/2, 0, 2, h, s, [0.15, 0.2, 0.26], 2);

    // Center monolith pillar complex
    this.addBlock(0, 3, 0, 6, 6, 6, [0.25, 0.32, 0.4], 2);

    // Inner cover crates and barriers
    const covers = [
      [-14, 1.25, -14, 4, 2.5, 4],
      [14, 1.25, -14, 4, 2.5, 4],
      [-14, 1.25, 14, 4, 2.5, 4],
      [14, 1.25, 14, 4, 2.5, 4],

      // Rectangular waist-high barricades
      [0, 1.0, -16, 12, 2.0, 1.5],
      [0, 1.0, 16, 12, 2.0, 1.5],
      [-16, 1.0, 0, 1.5, 2.0, 12],
      [16, 1.0, 0, 1.5, 2.0, 12],

      // Corner structures
      [-22, 2.5, -22, 6, 5.0, 6],
      [22, 2.5, -22, 6, 5.0, 6],
      [-22, 2.5, 22, 6, 5.0, 6],
      [22, 2.5, 22, 6, 5.0, 6],
    ];

    covers.forEach(c => {
      this.addBlock(c[0], c[1], c[2], c[3], c[4], c[5], [0.18, 0.24, 0.3], 2);
    });
  }

  checkCollision(pos, radius = 0.5) {
    let corrected = new Vec3().copy(pos);
    for (let c of this.colliders) {
      if (pos.y + 1.8 > c.minY && pos.y < c.maxY) {
        // Clamp to closest point on AABB
        const cx = Math.max(c.minX, Math.min(corrected.x, c.maxX));
        const cz = Math.max(c.minZ, Math.min(corrected.z, c.maxZ));
        const dx = corrected.x - cx;
        const dz = corrected.z - cz;
        const dsq = dx * dx + dz * dz;

        if (dsq < radius * radius && dsq > 1e-6) {
          const d = Math.sqrt(dsq);
          const overlap = radius - d;
          corrected.x += (dx / d) * overlap;
          corrected.z += (dz / d) * overlap;
        } else if (dsq <= 1e-6) {
          // Inside collider - push out to nearest edge
          corrected.x += radius;
        }
      }
    }
    return corrected;
  }

  raycast(origin, dir, maxDist = 80) {
    let closestT = maxDist;
    let hitPoint = null;

    for (let c of this.colliders) {
      // Slab method ray-AABB intersection
      let tmin = (c.minX - origin.x) / (dir.x || 1e-6);
      let tmax = (c.maxX - origin.x) / (dir.x || 1e-6);
      if (tmin > tmax) [tmin, tmax] = [tmax, tmin];

      let tymin = (c.minY - origin.y) / (dir.y || 1e-6);
      let tymax = (c.maxY - origin.y) / (dir.y || 1e-6);
      if (tymin > tymax) [tymin, tymax] = [tymax, tymin];

      if (tmin > tymax || tymin > tmax) continue;
      if (tymin > tmin) tmin = tymin;
      if (tymax < tmax) tmax = tymax;

      let tzmin = (c.minZ - origin.z) / (dir.z || 1e-6);
      let tzmax = (c.maxZ - origin.z) / (dir.z || 1e-6);
      if (tzmin > tzmax) [tzmin, tzmax] = [tzmax, tzmin];

      if (tmin > tzmax || tzmin > tmax) continue;
      if (tzmin > tmin) tmin = tzmin;

      if (tmin > 0 && tmin < closestT) {
        closestT = tmin;
        hitPoint = new Vec3(
          origin.x + dir.x * tmin,
          origin.y + dir.y * tmin,
          origin.z + dir.z * tmin
        );
      }
    }
    return hitPoint ? { dist: closestT, pos: hitPoint } : null;
  }
}

/**
 * AI ENEMY BOT CLASS
 * Autonomous Finite State Machine (PATROL, CHASE, ATTACK).
 */
class Bot {
  constructor(x, z, level = 1) {
    this.pos = new Vec3(x, 1.0, z);
    this.vel = new Vec3();
    this.yaw = Math.random() * Math.PI * 2;
    this.health = 100 + (level - 1) * 20;
    this.maxHealth = this.health;
    this.speed = 4.2 + Math.min(2.5, level * 0.4);
    this.state = 'PATROL';
    this.target = new Vec3(
      (Math.random() - 0.5) * 44,
      1.0,
      (Math.random() - 0.5) * 44
    );
    this.fireTimer = Math.random() * 1.5;
    this.fireRate = Math.max(0.6, 1.4 - level * 0.12);
    this.accuracy = Math.min(0.85, 0.45 + level * 0.08);
    this.isDead = false;
    this.radius = 0.8;
    this.hitReaction = 0;
  }

  update(dt, player, arena, sound, particles, enemyProjectiles) {
    if (this.isDead) return;

    if (this.hitReaction > 0) this.hitReaction -= dt * 4;

    const toPlayer = new Vec3().copy(player.pos).sub(this.pos);
    const distToPlayer = toPlayer.len();
    toPlayer.y = 0; // horizontal only for vision

    // Vision cone & Ray check
    const botHeading = new Vec3(-Math.sin(this.yaw), 0, -Math.cos(this.yaw));
    const toPlayerNorm = new Vec3().copy(toPlayer).norm();
    const dot = botHeading.dot(toPlayerNorm);

    // AI Perception
    const seesPlayer = (distToPlayer < 38.0 && dot > 0.4) || (distToPlayer < 12.0);

    // State Transitions
    if (seesPlayer) {
      this.state = (distToPlayer < 24.0) ? 'ATTACK' : 'CHASE';
    } else if (this.state !== 'PATROL') {
      this.state = 'PATROL';
      this.pickNewPatrolPoint();
    }

    // State Behaviors
    if (this.state === 'PATROL') {
      const toTarget = new Vec3().copy(this.target).sub(this.pos);
      toTarget.y = 0;
      if (toTarget.len() < 2.0) {
        this.pickNewPatrolPoint();
      } else {
        const dir = toTarget.norm();
        const targetYaw = Math.atan2(-dir.x, -dir.z);
        this.rotateTowards(targetYaw, dt * 3.5);
        this.pos.x += -Math.sin(this.yaw) * (this.speed * 0.5) * dt;
        this.pos.z += -Math.cos(this.yaw) * (this.speed * 0.5) * dt;
      }
    } else if (this.state === 'CHASE') {
      const targetYaw = Math.atan2(-toPlayerNorm.x, -toPlayerNorm.z);
      this.rotateTowards(targetYaw, dt * 4.5);
      this.pos.x += -Math.sin(this.yaw) * this.speed * dt;
      this.pos.z += -Math.cos(this.yaw) * this.speed * dt;
    } else if (this.state === 'ATTACK') {
      // Look directly at player
      const targetYaw = Math.atan2(-toPlayerNorm.x, -toPlayerNorm.z);
      this.rotateTowards(targetYaw, dt * 6.0);

      // Strafe sideways slightly during shooting
      if (distToPlayer > 8.0) {
        this.pos.x += -Math.sin(this.yaw) * (this.speed * 0.4) * dt;
        this.pos.z += -Math.cos(this.yaw) * (this.speed * 0.4) * dt;
      }

      // Attack firing
      this.fireTimer -= dt;
      if (this.fireTimer <= 0) {
        this.fireTimer = this.fireRate;
        this.shootAtPlayer(player, enemyProjectiles, sound);
      }
    }

    // Resolve collision against walls
    this.pos = arena.checkCollision(this.pos, this.radius);
    this.pos.y = 1.0; // lock to floor
  }

  rotateTowards(targetYaw, maxStep) {
    let diff = (targetYaw - this.yaw) % (Math.PI * 2);
    if (diff < -Math.PI) diff += Math.PI * 2;
    if (diff > Math.PI) diff -= Math.PI * 2;
    this.yaw += Math.max(-maxStep, Math.min(maxStep, diff));
  }

  pickNewPatrolPoint() {
    this.target.set(
      (Math.random() - 0.5) * 44,
      1.0,
      (Math.random() - 0.5) * 44
    );
  }

  shootAtPlayer(player, enemyProjectiles, sound) {
    sound.playBotShoot();
    // Calculate direction with inaccuracy offset
    const dir = new Vec3().copy(player.pos).sub(this.pos).norm();
    const spread = (1.0 - this.accuracy) * 0.18;
    dir.x += (Math.random() - 0.5) * spread;
    dir.y += (Math.random() - 0.5) * spread;
    dir.z += (Math.random() - 0.5) * spread;
    dir.norm();

    enemyProjectiles.push({
      pos: new Vec3(this.pos.x, this.pos.y + 0.5, this.pos.z),
      vel: dir.scale(32.0),
      life: 2.5
    });
  }

  takeDamage(amount, sound, particles) {
    this.health -= amount;
    this.hitReaction = 1.0;
    particles.emit(this.pos.x, this.pos.y + 0.6, this.pos.z, 8, [0, 1, 0.8], 5);
    if (this.health <= 0 && !this.isDead) {
      this.isDead = true;
      sound.playExplosion();
      particles.emit(this.pos.x, this.pos.y + 0.8, this.pos.z, 40, [1, 0.3, 0.1], 10);
    }
  }
}

/**
 * FIRST-PERSON PLAYER CONTROLLER
 */
class Player {
  constructor() {
    this.pos = new Vec3(0, 1.8, 18);
    this.vel = new Vec3();
    this.yaw = 0.0;
    this.pitch = 0.0;
    this.hp = 100;
    this.maxHp = 100;
    this.shield = 100;
    this.maxShield = 100;
    this.ammoClip = 42;
    this.clipCapacity = 42;
    this.ammoTotal = 808;
    this.isReloading = false;
    this.reloadTimer = 0;
    this.fireTimer = 0;
    this.fireInterval = 0.11; // ~550 RPM
    this.recoil = 0.0;
    this.bobPhase = 0.0;
    this.isCrouched = false;
    this.isSprinting = false;
    this.onGround = true;
    this.radius = 0.6;
    this.height = 1.8;
  }

  update(dt, input, arena, sound, particles, playerProjectiles) {
    if (this.hp <= 0) return;

    // Recharge shield slowly after cooldown
    if (this.shield < this.maxShield) {
      this.shield = Math.min(this.maxShield, this.shield + dt * 4.0);
    }

    // Recoil decay
    this.recoil *= Math.exp(-dt * 12.0);

    // Movement calculation
    const moveDir = new Vec3();
    const forward = new Vec3(-Math.sin(this.yaw), 0, -Math.cos(this.yaw));
    const right = new Vec3(Math.cos(this.yaw), 0, -Math.sin(this.yaw));

    if (input.keys['KeyW']) moveDir.add(forward);
    if (input.keys['KeyS']) moveDir.sub(forward);
    if (input.keys['KeyD']) moveDir.add(right);
    if (input.keys['KeyA']) moveDir.sub(right);

    const isMoving = moveDir.lenSq() > 0.001;
    if (isMoving) moveDir.norm();

    this.isSprinting = input.keys['ShiftLeft'] || input.keys['ShiftRight'];
    this.isCrouched = input.keys['KeyC'];

    let targetSpeed = 8.5;
    if (this.isSprinting && !this.isCrouched) targetSpeed = 13.5;
    if (this.isCrouched) targetSpeed = 4.2;

    const accel = 60.0;
    this.vel.x += (moveDir.x * targetSpeed - this.vel.x) * Math.min(1.0, accel * dt);
    this.vel.z += (moveDir.z * targetSpeed - this.vel.z) * Math.min(1.0, accel * dt);

    // Jump booster
    if (input.keys['Space'] && this.onGround) {
      this.vel.y = 8.2;
      this.onGround = false;
    }

    // Apply gravity
    this.vel.y -= 22.0 * dt;

    // Apply translations
    this.pos.x += this.vel.x * dt;
    this.pos.z += this.vel.z * dt;
    this.pos.y += this.vel.y * dt;

    // Floor & Jump landing
    const baseHeight = this.isCrouched ? 1.1 : 1.8;
    if (this.pos.y <= baseHeight) {
      this.pos.y = baseHeight;
      this.vel.y = 0;
      this.onGround = true;
    }

    // Wall collision
    this.pos = arena.checkCollision(this.pos, this.radius);

    // Bob Head  logic
    if (isMoving && this.onGround) {
      this.bobPhase += dt * (this.isSprinting ? 18.0 : 12.0);
    } else {
      this.bobPhase = 0;
    }

    // Reload handling
    if (input.keys['KeyR'] && !this.isReloading && this.ammoClip < this.clipCapacity && this.ammoTotal > 0) {
      this.startReload(sound);
    }
    if (this.isReloading) {
      this.reloadTimer -= dt;
      if (this.reloadTimer <= 0) {
        const needed = this.clipCapacity - this.ammoClip;
        const take = Math.min(needed, this.ammoTotal);
        this.ammoClip += take;
        this.ammoTotal -= take;
        this.isReloading = false;
      }
    }

    // Firing handling
    if (this.fireTimer > 0) this.fireTimer -= dt;
    if (input.mouseDown && this.fireTimer <= 0 && !this.isReloading) {
      if (this.ammoClip > 0) {
        this.shoot(sound, playerProjectiles);
      } else {
        this.startReload(sound);
      }
    }
  }

  startReload(sound) {
    if (this.isReloading || this.ammoTotal <= 0) return;
    this.isReloading = true;
    this.reloadTimer = 1.3;
    sound.playReload();
  }

  shoot(sound, playerProjectiles) {
    this.ammoClip--;
    this.fireTimer = this.fireInterval;
    this.recoil = Math.min(0.08, this.recoil + 0.025);
    sound.playShoot();

    // Shooting direction from camera view
    const dir = new Vec3(
      -Math.sin(this.yaw) * Math.cos(this.pitch),
      Math.sin(this.pitch),
      -Math.cos(this.yaw) * Math.cos(this.pitch)
    ).norm();

    // Small spread if hip firing while moving
    const spread = (this.isSprinting ? 0.03 : 0.008);
    dir.x += (Math.random() - 0.5) * spread;
    dir.y += (Math.random() - 0.5) * spread;
    dir.z += (Math.random() - 0.5) * spread;
    dir.norm();

    playerProjectiles.push({
      pos: new Vec3(this.pos.x, this.pos.y - 0.15, this.pos.z),
      vel: dir.scale(95.0),
      life: 1.8
    });
  }

  takeDamage(amount, sound, damageFlashElem) {
    if (this.hp <= 0) return;

    sound.playPlayerHurt();
    damageFlashElem.classList.add('hurt');
    setTimeout(() => damageFlashElem.classList.remove('hurt'), 120);

    if (this.shield > 0) {
      this.shield -= amount;
      if (this.shield < 0) {
        this.hp += this.shield; // remaining bleeds to HP
        this.shield = 0;
      }
    } else {
      this.hp -= amount;
    }
    this.hp = Math.max(0, this.hp);
  }
}

/**
 * MAIN GAME CONTROLLER & SCENE RENDERER
 */
class CyberstrikeGame {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.radarCanvas = document.getElementById('radar-canvas');
    this.gl = this.canvas.getContext('webgl', { antialias: true, alpha: false });
    this.radarCtx = this.radarCanvas.getContext('2d');

    if (!this.gl) {
      alert("WebGL is not supported on this hardware.");
      return;
    }

    this.sound = new SoundEngine();
    this.particles = new ParticleSystem();

    // Initialize Shaders & Buffers
    this.shaderProgram = initShaderProgram(this.gl, VS_SOURCE, FS_SOURCE);
    this.uniforms = {
      uModel: this.gl.getUniformLocation(this.shaderProgram, 'uModel'),
      uView: this.gl.getUniformLocation(this.shaderProgram, 'uView'),
      uProjection: this.gl.getUniformLocation(this.shaderProgram, 'uProjection'),
      uColor: this.gl.getUniformLocation(this.shaderProgram, 'uColor'),
      uLightDir: this.gl.getUniformLocation(this.shaderProgram, 'uLightDir'),
      uCamPos: this.gl.getUniformLocation(this.shaderProgram, 'uCamPos'),
      uMaterialType: this.gl.getUniformLocation(this.shaderProgram, 'uMaterialType'),
      uTime: this.gl.getUniformLocation(this.shaderProgram, 'uTime')
    };
    this.attribs = {
      aPosition: this.gl.getAttribLocation(this.shaderProgram, 'aPosition'),
      aNormal: this.gl.getAttribLocation(this.shaderProgram, 'aNormal'),
      aTexCoord: this.gl.getAttribLocation(this.shaderProgram, 'aTexCoord')
    };

    // Shared Box Mesh
    this.boxMesh = createBoxBuffer(this.gl, 1, 1, 1);

    // Systems
    this.arena = new Arena(this.gl, this.boxMesh);
    this.player = new Player();
    this.bots = [];
    this.playerProjectiles = [];
    this.enemyProjectiles = [];

    // State
    this.wave = 1;
    this.kills = 0;
    this.isPaused = false;
    this.isPlaying = false;
    this.lastTime = performance.now();

    // User Input
    this.input = {
      keys: {},
      mouseDown: false
    };

    this.setupUI();
    this.setupEvents();
    this.resizeCanvas();
  }

  setupUI() {
    this.ui = {
      ud: document.getElementById('ud'),
      startMenu: document.getElementById('start-menu'),
      pauseMenu: document.getElementById('pause-menu'),
      gameOverMenu: document.getElementById('game-over-menu'),
      hpBar: document.getElementById('hp-bar'),
      hpVal: document.getElementById('hp-val'),
      shBar: document.getElementById('sh-bar'),
      shVal: document.getElementById('sh-val'),
      ammoClip: document.getElementById('ammo-clip'),
      ammoTotal: document.getElementById('ammo-total'),
      reloadPrompt: document.getElementById('reload-prompt'),
      waveIndicator: document.getElementById('wave-indicator'),
      killsIndicator: document.getElementById('kills-indicator'),
      damageFlash: document.getElementById('damage-flash'),
      hitmarker: document.getElementById('hitmarker'),
      chTop: document.getElementById('ch-top'),
      chBottom: document.getElementById('ch-bottom'),
      chLeft: document.getElementById('ch-left'),
      chRight: document.getElementById('ch-right'),
      gameOverStats: document.getElementById('game-over-stats')
    };
  }

  setupEvents() {
    window.addEventListener('resize', () => this.resizeCanvas());

    // Keyboard
    window.addEventListener('keydown', (e) => {
      this.input.keys[e.code] = true;
      if (e.code === 'KeyP' || e.code === 'Escape') {
        if (this.isPlaying && this.player.hp > 0) {
          this.togglePause();
        }
      }
    });
    window.addEventListener('keyup', (e) => {
      this.input.keys[e.code] = false;
    });

    // Mouse & Pointer Lock
    this.canvas.addEventListener('mousedown', (e) => {
      if (!this.isPlaying) return;
      if (document.pointerLockElement !== this.canvas) {
        this.canvas.requestPointerLock();
      } else {
        if (e.button === 0) this.input.mouseDown = true;
      }
    });

    window.addEventListener('mouseup', (e) => {
      if (e.button === 0) this.input.mouseDown = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (document.pointerLockElement === this.canvas && this.isPlaying && !this.isPaused) {
        const sens = 0.0022;
        this.player.yaw -= e.movementX * sens;
        this.player.pitch -= e.movementY * sens;
        // Clamp vertical pitch to avoid flipping
        const maxPitch = (Math.PI / 2) - 0.05;
        this.player.pitch = Math.max(-maxPitch, Math.min(maxPitch, this.player.pitch));
      }
    });

    // Menu Actions
    document.getElementById('start-btn').addEventListener('click', () => {
      this.sound.init();
      this.startGame();
    });

    document.getElementById('resume-btn').addEventListener('click', () => {
      this.togglePause();
      this.canvas.requestPointerLock();
    });

    document.getElementById('restart-btn').addEventListener('click', () => {
      this.startGame();
    });

    document.addEventListener('pointerlockchange', () => {
      if (document.pointerLockElement !== this.canvas && this.isPlaying && this.player.hp > 0) {
        if (!this.isPaused) this.togglePause();
      }
    });
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  togglePause() {
    this.isPaused = !this.isPaused;
    if (this.isPaused) {
      this.ui.pauseMenu.classList.remove('hidden');
    } else {
      this.ui.pauseMenu.classList.add('hidden');
      this.canvas.requestPointerLock();
      this.lastTime = performance.now();
    }
  }

  spawnWave(waveNum) {
    this.bots = [];
    const botCount = 3 + waveNum * 2;
    for (let i = 0; i < botCount; i++) {
      // Spawn around arena borders
      const angle = (i / botCount) * Math.PI * 2;
      const dist = 22 + Math.random() * 6;
      const x = Math.cos(angle) * dist;
      const z = Math.sin(angle) * dist;
      this.bots.push(new Bot(x, z, waveNum));
    }
    this.ui.waveIndicator.textContent = `ZONE 01 // WAVE ${waveNum}`;
  }

  startGame() {
    this.player = new Player();
    this.playerProjectiles = [];
    this.enemyProjectiles = [];
    this.particles.particles = [];
    this.kills = 0;
    this.wave = 1;
    this.isPaused = false;
    this.isPlaying = true;

    this.spawnWave(this.wave);

    this.ui.startMenu.classList.add('hidden');
    this.ui.pauseMenu.classList.add('hidden');
    this.ui.gameOverMenu.classList.add('hidden');
    this.ui.ud.style.display = 'block';

    this.canvas.requestPointerLock();
    this.lastTime = performance.now();
  }

  triggerHitmarker() {
    this.ui.hitmarker.classList.add('active');
    setTimeout(() => this.ui.hitmarker.classList.remove('active'), 90);
  }

  update(dt) {
    if (!this.isPlaying || this.isPaused) return;

    // Check game over
    if (this.player.hp <= 0) {
      this.isPlaying = false;
      document.exitPointerLock();
      this.ui.gameOverStats.textContent = `You reached Wave ${this.wave} with ${this.kills} Bot eliminations.`;
      this.ui.gameOverMenu.classList.remove('hidden');
      return;
    }

    // Update Player
    this.player.update(dt, this.input, this.arena, this.sound, this.particles, this.playerProjectiles);

    // Update Bots
    let livingBots = 0;
    for (let bot of this.bots) {
      if (!bot.isDead) {
        livingBots++;
        bot.update(dt, this.player, this.arena, this.sound, this.particles, this.enemyProjectiles);
      }
    }

    // Next Wave Trigger
    if (livingBots === 0) {
      this.wave++;
      this.player.ammoTotal += 120;
      this.player.hp = Math.min(this.player.maxHp, this.player.hp + 40);
      this.spawnWave(this.wave);
    }

    // Update Particles
    this.particles.update(dt);

    // Update Player Projectiles & Collision with Bots and Walls
    for (let i = this.playerProjectiles.length - 1; i >= 0; i--) {
      const p = this.playerProjectiles[i];
      const prevPos = p.pos.clone();
      p.pos.x += p.vel.x * dt;
      p.pos.y += p.vel.y * dt;
      p.pos.z += p.vel.z * dt;
      p.life -= dt;

      // Hit wall check
      const dir = new Vec3().copy(p.vel).norm();
      const wallHit = this.arena.raycast(prevPos, dir, p.vel.len() * dt);
      if (wallHit) {
        this.particles.emit(wallHit.pos.x, wallHit.pos.y, wallHit.pos.z, 6, [0.3, 0.9, 1.0], 4);
        this.playerProjectiles.splice(i, 1);
        continue;
      }

      // Hit bots check
      let hit = false;
      for (let bot of this.bots) {
        if (!bot.isDead) {
          const d = p.pos.dist(new Vec3(bot.pos.x, bot.pos.y + 0.8, bot.pos.z));
          if (d < bot.radius + 0.3) {
            bot.takeDamage(34, this.sound, this.particles);
            this.sound.playHit();
            this.triggerHitmarker();
            if (bot.isDead) {
              this.kills++;
              this.ui.killsIndicator.textContent = `ELIMINATIONS: ${this.kills}`;
            }
            hit = true;
            break;
          }
        }
      }

      if (hit || p.life <= 0) {
        this.playerProjectiles.splice(i, 1);
      }
    }

    // Update Enemy Projectiles & Collision with Player and Walls
    for (let i = this.enemyProjectiles.length - 1; i >= 0; i--) {
      const ep = this.enemyProjectiles[i];
      const prevPos = ep.pos.clone();
      ep.pos.x += ep.vel.x * dt;
      ep.pos.y += ep.vel.y * dt;
      ep.pos.z += ep.vel.z * dt;
      ep.life -= dt;

      // Hit wall check
      const dir = new Vec3().copy(ep.vel).norm();
      const wallHit = this.arena.raycast(prevPos, dir, ep.vel.len() * dt);
      if (wallHit) {
        this.enemyProjectiles.splice(i, 1);
        continue;
      }

      // Hit Player check
      const distToPlayer = ep.pos.dist(new Vec3(this.player.pos.x, this.player.pos.y - 0.5, this.player.pos.z));
      if (distToPlayer < 0.8) {
        this.player.takeDamage(18, this.sound, this.ui.damageFlash);
        this.particles.emit(ep.pos.x, ep.pos.y, ep.pos.z, 10, [1, 0.2, 0.2], 5);
        this.enemyProjectiles.splice(i, 1);
        continue;
      }

      if (ep.life <= 0) {
        this.enemyProjectiles.splice(i, 1);
      }
    }

    this.updateud();
    this.renderRadar();
  }

  updateud() {
    this.ui.hpBar.style.width = `${(this.player.hp / this.player.maxHp) * 100}%`;
    this.ui.hpVal.textContent = `${Math.ceil(this.player.hp)}%`;

    this.ui.shBar.style.width = `${(this.player.shield / this.player.maxShield) * 100}%`;
    this.ui.shVal.textContent = `${Math.ceil(this.player.shield)}%`;

    this.ui.ammoClip.textContent = this.player.ammoClip;
    this.ui.ammoTotal.textContent = `/ ${this.player.ammoTotal}`;

    if (this.player.ammoClip === 0 || this.player.isReloading) {
      this.ui.reloadPrompt.style.display = 'block';
      this.ui.reloadPrompt.textContent = this.player.isReloading ? "RECHARGING WEAPON..." : "PRESS [R] TO RELOAD";
    } else {
      this.ui.reloadPrompt.style.display = 'none';
    }

    // Dynamic crosshair spread
    const speed = Math.hypot(this.player.vel.x, this.player.vel.z);
    const spread = Math.floor(speed * 1.5 + this.player.recoil * 300);
    this.ui.chTop.style.transform = `translateY(-${spread}px)`;
    this.ui.chBottom.style.transform = `translateY(${spread}px)`;
    this.ui.chLeft.style.transform = `translateX(-${spread}px)`;
    this.ui.chRight.style.transform = `translateX(${spread}px)`;
  }

  renderRadar() {
    const ctx = this.radarCtx;
    const w = 140, h = 140;
    const cx = w / 2, cy = h / 2;
    const radarScale = 2.2;

    ctx.clearRect(0, 0, w, h);

    // Radar scan lines & circles
    ctx.strokeStyle = 'rgba(0, 255, 204, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, 30, 0, Math.PI * 2);
    ctx.arc(cx, cy, 60, 0, Math.PI * 2);
    ctx.moveTo(cx, 0); ctx.lineTo(cx, h);
    ctx.moveTo(0, cy); ctx.lineTo(w, cy);
    ctx.stroke();

    // Player position / arrow at center
    ctx.fillStyle = '#00ffcc';
    ctx.beginPath();
    ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Draw Bots on Radar relative to player facing orientation
    const pYaw = this.player.yaw;
    for (let bot of this.bots) {
      if (bot.isDead) continue;
      const dx = bot.pos.x - this.player.pos.x;
      const dz = bot.pos.z - this.player.pos.z;

      // Rotate coordinates into player's local reference frame
      const rx = dx * Math.cos(pYaw) - dz * Math.sin(pYaw);
      const rz = dx * Math.sin(pYaw) + dz * Math.cos(pYaw);

      const px = cx + rx * radarScale;
      const py = cy + rz * radarScale;

      // Inside radar boundaries
      if (Math.hypot(px - cx, py - cy) < 66) {
        ctx.fillStyle = bot.state === 'ATTACK' ? '#ff1144' : '#ffaa00';
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  render() {
    const gl = this.gl;
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);

    gl.clearColor(0.02, 0.03, 0.05, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(this.shaderProgram);

    // Camera view setup with bobbing & recoil
    const bobY = Math.sin(this.player.bobPhase) * 0.06;
    const bobX = Math.cos(this.player.bobPhase * 0.5) * 0.04;
    const camY = this.player.pos.y + bobY;
    const camX = this.player.pos.x + bobX;
    const camZ = this.player.pos.z;

    const pitch = this.player.pitch + this.player.recoil;
    const yaw = this.player.yaw;

    const eye = new Vec3(camX, camY, camZ);
    const forward = new Vec3(
      -Math.sin(yaw) * Math.cos(pitch),
      Math.sin(pitch),
      -Math.cos(yaw) * Math.cos(pitch)
    );
    const center = new Vec3().copy(eye).add(forward);
    const up = new Vec3(0, 1, 0);

    const aspect = this.canvas.width / this.canvas.height;
    const projMatrix = new Mat4().perspective(75 * Math.PI / 180, aspect, 0.1, 120.0);
    const viewMatrix = new Mat4().lookAt(eye, center, up);

    // Pass global view uniforms
    gl.uniformMatrix4fv(this.uniforms.uProjection, false, projMatrix.elements);
    gl.uniformMatrix4fv(this.uniforms.uView, false, viewMatrix.elements);
    gl.uniform3f(this.uniforms.uLightDir, 0.6, -1.0, 0.4);
    gl.uniform3f(this.uniforms.uCamPos, eye.x, eye.y, eye.z);
    gl.uniform1f(this.uniforms.uTime, performance.now() * 0.001);

    // Setup Mesh Attributes for Box Buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, this.boxMesh.posBuf);
    gl.vertexAttribPointer(this.attribs.aPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(this.attribs.aPosition);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.boxMesh.normBuf);
    gl.vertexAttribPointer(this.attribs.aNormal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(this.attribs.aNormal);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.boxMesh.uvBuf);
    gl.vertexAttribPointer(this.attribs.aTexCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(this.attribs.aTexCoord);

    // 1. Render Arena Floor (Sci-fi tech grid)
    const floorModel = new Mat4().translate(0, -0.1, 0).scale(this.arena.size, 0.2, this.arena.size);
    gl.uniformMatrix4fv(this.uniforms.uModel, false, floorModel.elements);
    gl.uniform3f(this.uniforms.uColor, 0.12, 0.2, 0.26);
    gl.uniform1f(this.uniforms.uMaterialType, 1.0);
    gl.drawArrays(gl.TRIANGLES, 0, this.boxMesh.vertexCount);

    // 2. Render Arena Ceiling
    const ceilModel = new Mat4().translate(0, this.arena.wallHeight + 0.1, 0).scale(this.arena.size, 0.2, this.arena.size);
    gl.uniformMatrix4fv(this.uniforms.uModel, false, ceilModel.elements);
    gl.uniform3f(this.uniforms.uColor, 0.08, 0.1, 0.14);
    gl.uniform1f(this.uniforms.uMaterialType, 2.0);
    gl.drawArrays(gl.TRIANGLES, 0, this.boxMesh.vertexCount);

    // 3. Render Arena Static Obstacles & Walls
    for (let c of this.arena.colliders) {
      const m = new Mat4().translate(c.x, c.y, c.z).scale(c.w, c.h, c.d);
      gl.uniformMatrix4fv(this.uniforms.uModel, false, m.elements);
      gl.uniform3fv(this.uniforms.uColor, c.color);
      gl.uniform1f(this.uniforms.uMaterialType, c.matType);
      gl.drawArrays(gl.TRIANGLES, 0, this.boxMesh.vertexCount);
    }

    // 4. Render Multi-Part 3D AI Bots
    for (let bot of this.bots) {
      if (bot.isDead) continue;
      this.renderBotMesh(gl, bot);
    }

    // 5. Render Projectiles (Laser Bolts)
    // Player bolts (cyan glow)
    for (let p of this.playerProjectiles) {
      const pm = new Mat4().translate(p.pos.x, p.pos.y, p.pos.z).scale(0.12, 0.12, 0.6);
      gl.uniformMatrix4fv(this.uniforms.uModel, false, pm.elements);
      gl.uniform3f(this.uniforms.uColor, 0.0, 1.0, 0.85);
      gl.uniform1f(this.uniforms.uMaterialType, 3.0);
      gl.drawArrays(gl.TRIANGLES, 0, this.boxMesh.vertexCount);
    }
    // Enemy bolts (red/orange glow)
    for (let ep of this.enemyProjectiles) {
      const epm = new Mat4().translate(ep.pos.x, ep.pos.y, ep.pos.z).scale(0.15, 0.15, 0.6);
      gl.uniformMatrix4fv(this.uniforms.uModel, false, epm.elements);
      gl.uniform3f(this.uniforms.uColor, 1.0, 0.2, 0.1);
      gl.uniform1f(this.uniforms.uMaterialType, 3.0);
      gl.drawArrays(gl.TRIANGLES, 0, this.boxMesh.vertexCount);
    }

    // 6. Render Particles
    for (let pt of this.particles.particles) {
      const ptm = new Mat4().translate(pt.pos.x, pt.pos.y, pt.pos.z).scale(pt.size, pt.size, pt.size);
      gl.uniformMatrix4fv(this.uniforms.uModel, false, ptm.elements);
      gl.uniform3f(this.uniforms.uColor, pt.color[0], pt.color[1], pt.color[2]);
      gl.uniform1f(this.uniforms.uMaterialType, 3.0);
      gl.drawArrays(gl.TRIANGLES, 0, this.boxMesh.vertexCount);
    }

    // 7. Render 3D First-Person Weapon Model (Clear depth to draw over arena)
    gl.clear(gl.DEPTH_BUFFER_BIT);
    this.renderFirstPersonWeapon(gl, aspect);
  }

  renderBotMesh(gl, bot) {
    const hitFlash = bot.hitReaction > 0.05;
    const bodyColor = hitFlash ? [1.0, 1.0, 1.0] : [0.18, 0.22, 0.28];
    const armorColor = hitFlash ? [1.0, 0.8, 0.8] : [0.8, 0.25, 0.2];

    // Root Transformation (Position & Yaw)
    const root = new Mat4().translate(bot.pos.x, bot.pos.y, bot.pos.z).rotateY(bot.yaw);

    // Torso
    const torsoM = new Mat4().copy(root).translate(0, 0.5, 0).scale(0.9, 1.0, 0.55);
    gl.uniformMatrix4fv(this.uniforms.uModel, false, torsoM.elements);
    gl.uniform3fv(this.uniforms.uColor, bodyColor);
    gl.uniform1f(this.uniforms.uMaterialType, 0.0);
    gl.drawArrays(gl.TRIANGLES, 0, this.boxMesh.vertexCount);

    // Shoulder Armor
    const shoulderM = new Mat4().copy(root).translate(0, 0.9, 0).scale(1.2, 0.25, 0.65);
    gl.uniformMatrix4fv(this.uniforms.uModel, false, shoulderM.elements);
    gl.uniform3fv(this.uniforms.uColor, armorColor);
    gl.uniform1f(this.uniforms.uMaterialType, 0.0);
    gl.drawArrays(gl.TRIANGLES, 0, this.boxMesh.vertexCount);

    // Head Unit
    const headM = new Mat4().copy(root).translate(0, 1.25, 0).scale(0.5, 0.45, 0.5);
    gl.uniformMatrix4fv(this.uniforms.uModel, false, headM.elements);
    gl.uniform3fv(this.uniforms.uColor, bodyColor);
    gl.drawArrays(gl.TRIANGLES, 0, this.boxMesh.vertexCount);

    // Glowing Neon Visor Eye
    const visorColor = bot.state === 'ATTACK' ? [1.0, 0.0, 0.2] : [0.0, 0.9, 1.0];
    const visorM = new Mat4().copy(root).translate(0, 1.25, -0.26).scale(0.4, 0.12, 0.05);
    gl.uniformMatrix4fv(this.uniforms.uModel, false, visorM.elements);
    gl.uniform3fv(this.uniforms.uColor, visorColor);
    gl.uniform1f(this.uniforms.uMaterialType, 3.0);
    gl.drawArrays(gl.TRIANGLES, 0, this.boxMesh.vertexCount);

    // Robot Limbs (Legs)
    const legLeft = new Mat4().copy(root).translate(-0.25, -0.4, 0).scale(0.25, 0.8, 0.3);
    gl.uniformMatrix4fv(this.uniforms.uModel, false, legLeft.elements);
    gl.uniform3fv(this.uniforms.uColor, [0.12, 0.15, 0.18]);
    gl.uniform1f(this.uniforms.uMaterialType, 0.0);
    gl.drawArrays(gl.TRIANGLES, 0, this.boxMesh.vertexCount);

    const legRight = new Mat4().copy(root).translate(0.25, -0.4, 0).scale(0.25, 0.8, 0.3);
    gl.uniformMatrix4fv(this.uniforms.uModel, false, legRight.elements);
    gl.drawArrays(gl.TRIANGLES, 0, this.boxMesh.vertexCount);

    // Floating Health Bar Above Bot (Rendered in 3D world space)
    const hpPct = Math.max(0, bot.health / bot.maxHealth);
    const hpBgM = new Mat4().translate(bot.pos.x, bot.pos.y + 1.85, bot.pos.z).rotateY(this.player.yaw).scale(0.9, 0.08, 0.02);
    gl.uniformMatrix4fv(this.uniforms.uModel, false, hpBgM.elements);
    gl.uniform3f(this.uniforms.uColor, 0.2, 0.05, 0.05);
    gl.uniform1f(this.uniforms.uMaterialType, 3.0);
    gl.drawArrays(gl.TRIANGLES, 0, this.boxMesh.vertexCount);

    const hpFgM = new Mat4().translate(bot.pos.x - (1.0 - hpPct) * 0.45, bot.pos.y + 1.85, bot.pos.z + 0.01).rotateY(this.player.yaw).scale(0.9 * hpPct, 0.08, 0.02);
    gl.uniformMatrix4fv(this.uniforms.uModel, false, hpFgM.elements);
    gl.uniform3f(this.uniforms.uColor, 0.0, 1.0, 0.5);
    gl.uniform1f(this.uniforms.uMaterialType, 3.0);
    gl.drawArrays(gl.TRIANGLES, 0, this.boxMesh.vertexCount);
  }

  renderFirstPersonWeapon(gl, aspect) {
    // Separate projection for viewmodel to maintain FOV without clipping
    const weaponProj = new Mat4().perspective(60 * Math.PI / 180, aspect, 0.01, 10.0);
    gl.uniformMatrix4fv(this.uniforms.uProjection, false, weaponProj.elements);

    // Identity view for weapon model (attached to screen)
    const identityView = new Mat4();
    gl.uniformMatrix4fv(this.uniforms.uView, false, identityView.elements);

    // Natural weapon sway & breathing bob
    const swayX = Math.cos(this.player.bobPhase * 0.5) * 0.025;
    const swayY = Math.sin(this.player.bobPhase) * 0.02 - this.player.recoil * 0.8;
    const kickbackZ = this.player.recoil * 1.5;

    // Reload animation dip
    let reloadDip = 0;
    if (this.player.isReloading) {
      reloadDip = -Math.sin((this.player.reloadTimer / 1.3) * Math.PI) * 0.25;
    }

    const baseGun = new Mat4()
      .translate(0.28 + swayX, -0.24 + swayY + reloadDip, -0.55 + kickbackZ)
      .rotateY(0.04)
      .rotateX(-this.player.recoil * 0.5);

    // Weapon Receiver / Main Body
    const receiver = new Mat4().copy(baseGun).scale(0.09, 0.12, 0.42);
    gl.uniformMatrix4fv(this.uniforms.uModel, false, receiver.elements);
    gl.uniform3f(this.uniforms.uColor, 0.1, 0.14, 0.18);
    gl.uniform1f(this.uniforms.uMaterialType, 0.0);
    gl.drawArrays(gl.TRIANGLES, 0, this.boxMesh.vertexCount);

    // Heavy Barrel
    const barrel = new Mat4().copy(baseGun).translate(0, 0.03, -0.28).scale(0.05, 0.05, 0.28);
    gl.uniformMatrix4fv(this.uniforms.uModel, false, barrel.elements);
    gl.uniform3f(this.uniforms.uColor, 0.05, 0.06, 0.08);
    gl.drawArrays(gl.TRIANGLES, 0, this.boxMesh.vertexCount);

    // Cyan Neon Battery Energy Core
    const core = new Mat4().copy(baseGun).translate(0, 0.02, 0.04).scale(0.095, 0.06, 0.18);
    gl.uniformMatrix4fv(this.uniforms.uModel, false, core.elements);
    gl.uniform3f(this.uniforms.uColor, 0.0, 1.0, 0.8);
    gl.uniform1f(this.uniforms.uMaterialType, 3.0);
    gl.drawArrays(gl.TRIANGLES, 0, this.boxMesh.vertexCount);

    // Holo-Sight Sight Rail
    const rail = new Mat4().copy(baseGun).translate(0, 0.08, -0.06).scale(0.03, 0.04, 0.14);
    gl.uniformMatrix4fv(this.uniforms.uModel, false, rail.elements);
    gl.uniform3f(this.uniforms.uColor, 0.15, 0.2, 0.25);
    gl.uniform1f(this.uniforms.uMaterialType, 0.0);
    gl.drawArrays(gl.TRIANGLES, 0, this.boxMesh.vertexCount);

    // Muzzle Flash Effect when firing
    if (this.player.fireTimer > this.player.fireInterval * 0.6) {
      const flash = new Mat4().copy(baseGun).translate(0, 0.03, -0.48).scale(0.18, 0.18, 0.18);
      gl.uniformMatrix4fv(this.uniforms.uModel, false, flash.elements);
      gl.uniform3f(this.uniforms.uColor, 0.2, 1.0, 0.9);
      gl.uniform1f(this.uniforms.uMaterialType, 3.0);
      gl.drawArrays(gl.TRIANGLES, 0, this.boxMesh.vertexCount);
    }
  }

  loop(currentTime) {
    const dt = Math.min((currentTime - this.lastTime) * 0.001, 0.05); // clamp delta
    this.lastTime = currentTime;

    this.update(dt);
    this.render();

    requestAnimationFrame((t) => this.loop(t));
  }

  run() {
    requestAnimationFrame((t) => {
      this.lastTime = t;
      this.loop(t);
    });
  }
}

// Launch application after window load
window.onload = () => {
  const game = new CyberstrikeGame();
  game.run();
};