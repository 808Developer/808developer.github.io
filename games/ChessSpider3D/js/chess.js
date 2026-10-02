// --- i808developer ---
// --- CUSTOM 3D MATH LIBRARY ---
    // Minimal alternatives to glMatrix to keep dependencies zero.
    const Math3D = {
        mat4: {
            create: () => new Float32Array([
                1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1
            ]),
            perspective: (out, fovy, aspect, near, far) => {
                let f = 1.0 / Math.tan(fovy / 2), nf;
                out[0] = f / aspect; out[1] = 0; out[2] = 0; out[3] = 0;
                out[4] = 0; out[5] = f; out[6] = 0; out[7] = 0;
                out[8] = 0; out[9] = 0; out[11] = -1;
                out[12] = 0; out[13] = 0; out[15] = 0;
                if (far != null && far !== Infinity) {
                    nf = 1 / (near - far);
                    out[10] = (far + near) * nf;
                    out[14] = (2 * far * near) * nf;
                } else {
                    out[10] = -1;
                    out[14] = -2 * near;
                }
                return out;
            },
            multiply: (out, a, b) => {
                let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
                    a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
                    a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
                    a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
                let b0  = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
                out[0] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
                out[1] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
                out[2] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
                out[3] = b0*a03 + b1*a13 + b2*a23 + b3*a33;
                b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
                out[4] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
                out[5] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
                out[6] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
                out[7] = b0*a03 + b1*a13 + b2*a23 + b3*a33;
                b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11];
                out[8] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
                out[9] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
                out[10] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
                out[11] = b0*a03 + b1*a13 + b2*a23 + b3*a33;
                b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
                out[12] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
                out[13] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
                out[14] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
                out[15] = b0*a03 + b1*a13 + b2*a23 + b3*a33;
                return out;
            },
            translate: (out, a, v) => {
                let x = v[0], y = v[1], z = v[2];
                let a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23;
                if (a === out) {
                    out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
                    out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
                    out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
                    out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
                } else {
                    a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
                    a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
                    a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];
                    out[0] = a00; out[1] = a01; out[2] = a02; out[3] = a03;
                    out[4] = a10; out[5] = a11; out[6] = a12; out[7] = a13;
                    out[8] = a20; out[9] = a21; out[10] = a22; out[11] = a23;
                    out[12] = a00 * x + a10 * y + a20 * z + a[12];
                    out[13] = a01 * x + a11 * y + a21 * z + a[13];
                    out[14] = a02 * x + a12 * y + a22 * z + a[14];
                    out[15] = a03 * x + a13 * y + a23 * z + a[15];
                }
                return out;
            },
            scale: (out, a, v) => {
                let x = v[0], y = v[1], z = v[2];
                out[0] = a[0] * x; out[1] = a[1] * x; out[2] = a[2] * x; out[3] = a[3] * x;
                out[4] = a[4] * y; out[5] = a[5] * y; out[6] = a[6] * y; out[7] = a[7] * y;
                out[8] = a[8] * z; out[9] = a[9] * z; out[10] = a[10] * z; out[11] = a[11] * z;
                out[12] = a[12]; out[13] = a[13]; out[14] = a[14]; out[15] = a[15];
                return out;
            },
            rotateX: (out, a, rad) => {
                let s = Math.sin(rad), c = Math.cos(rad);
                let a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
                let a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
                if (a !== out) { out[0] = a[0]; out[1] = a[1]; out[2] = a[2]; out[3] = a[3]; out[12] = a[12]; out[13] = a[13]; out[14] = a[14]; out[15] = a[15]; }
                out[4] = a10 * c + a20 * s; out[5] = a11 * c + a21 * s; out[6] = a12 * c + a22 * s; out[7] = a13 * c + a23 * s;
                out[8] = a20 * c - a10 * s; out[9] = a21 * c - a11 * s; out[10] = a22 * c - a12 * s; out[11] = a23 * c - a13 * s;
                return out;
            },
            rotateY: (out, a, rad) => {
                let s = Math.sin(rad), c = Math.cos(rad);
                let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
                let a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
                if (a !== out) { out[4] = a[4]; out[5] = a[5]; out[6] = a[6]; out[7] = a[7]; out[12] = a[12]; out[13] = a[13]; out[14] = a[14]; out[15] = a[15]; }
                out[0] = a00 * c - a20 * s; out[1] = a01 * c - a21 * s; out[2] = a02 * c - a22 * s; out[3] = a03 * c - a23 * s;
                out[8] = a00 * s + a20 * c; out[9] = a01 * s + a21 * c; out[10] = a02 * s + a22 * c; out[11] = a03 * s + a23 * c;
                return out;
            },
            rotateZ: (out, a, rad) => {
                let s = Math.sin(rad), c = Math.cos(rad);
                let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
                let a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
                if (a !== out) {
                    out[8] = a[8]; out[9] = a[9]; out[10] = a[10]; out[11] = a[11];
                    out[12] = a[12]; out[13] = a[13]; out[14] = a[14]; out[15] = a[15];
                }
                out[0] = a00 * c + a10 * s; out[1] = a01 * c + a11 * s; out[2] = a02 * c + a12 * s; out[3] = a03 * c + a13 * s;
                out[4] = a10 * c - a00 * s; out[5] = a11 * c - a01 * s; out[6] = a12 * c - a02 * s; out[7] = a13 * c - a03 * s;
                return out;
            },
            invert: (out, a) => {
                let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3], a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
                let a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11], a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
                let b00 = a00 * a11 - a01 * a10, b01 = a00 * a12 - a02 * a10, b02 = a00 * a13 - a03 * a10;
                let b03 = a01 * a12 - a02 * a11, b04 = a01 * a13 - a03 * a11, b05 = a02 * a13 - a03 * a12;
                let b06 = a20 * a31 - a21 * a30, b07 = a20 * a32 - a22 * a30, b08 = a20 * a33 - a23 * a30;
                let b09 = a21 * a32 - a22 * a31, b10 = a21 * a33 - a23 * a31, b11 = a22 * a33 - a23 * a32;
                let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
                if (!det) return null;
                det = 1.0 / det;
                out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
                out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
                out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
                out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
                out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
                out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
                out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
                out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
                out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
                out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
                out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
                out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
                out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
                out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
                out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
                out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
                return out;
            },
            transpose: (out, a) => {
                if (out === a) {
                    let a01 = a[1], a02 = a[2], a03 = a[3], a12 = a[6], a13 = a[7], a23 = a[11];
                    out[1] = a[4]; out[2] = a[8]; out[3] = a[12];
                    out[4] = a01; out[6] = a[9]; out[7] = a[13];
                    out[8] = a02; out[9] = a12; out[11] = a[14];
                    out[12] = a03; out[13] = a13; out[14] = a23;
                } else {
                    out[0] = a[0]; out[1] = a[4]; out[2] = a[8]; out[3] = a[12];
                    out[4] = a[1]; out[5] = a[5]; out[6] = a[9]; out[7] = a[13];
                    out[8] = a[2]; out[9] = a[6]; out[10] = a[10]; out[11] = a[14];
                    out[12] = a[3]; out[13] = a[7]; out[14] = a[11]; out[15] = a[15];
                }
                return out;
            },
            lookAt: (out, eye, center, up) => {
                let x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
                let eyex = eye[0], eyey = eye[1], eyez = eye[2];
                let upx = up[0], upy = up[1], upz = up[2];
                let centerx = center[0], centery = center[1], centerz = center[2];
                z0 = eyex - centerx; z1 = eyey - centery; z2 = eyez - centerz;
                len = 1 / Math.hypot(z0, z1, z2);
                z0 *= len; z1 *= len; z2 *= len;
                x0 = upy * z2 - upz * z1; x1 = upz * z0 - upx * z2; x2 = upx * z1 - upy * z0;
                len = Math.hypot(x0, x1, x2);
                if (!len) { x0 = 0; x1 = 0; x2 = 0; } else { len = 1 / len; x0 *= len; x1 *= len; x2 *= len; }
                y0 = z1 * x2 - z2 * x1; y1 = z2 * x0 - z0 * x2; y2 = z0 * x1 - z1 * x0;
                out[0] = x0; out[1] = y0; out[2] = z0; out[3] = 0;
                out[4] = x1; out[5] = y1; out[6] = z1; out[7] = 0;
                out[8] = x2; out[9] = y2; out[10] = z2; out[11] = 0;
                out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
                out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
                out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
                out[15] = 1;
                return out;
            }
        },
        vec3: {
            transformMat4: (out, a, m) => {
                let x = a[0], y = a[1], z = a[2];
                let w = m[3] * x + m[7] * y + m[11] * z + m[15];
                w = w || 1.0;
                out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
                out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
                out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
                return out;
            },
            subtract: (out, a, b) => { out[0] = a[0] - b[0]; out[1] = a[1] - b[1]; out[2] = a[2] - b[2]; return out; },
            normalize: (out, a) => {
                let x = a[0], y = a[1], z = a[2];
                let len = x*x + y*y + z*z;
                if (len > 0) { len = 1 / Math.sqrt(len); out[0] = a[0] * len; out[1] = a[1] * len; out[2] = a[2] * len; }
                return out;
            }
        }
    };

    // --- STREAMING_CHUNK: Setting up WebGL Context and Shaders... ---
    const canvas = document.getElementById('glcanvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

    if (!gl) {
        alert('Unable to initialize WebGL. Your browser or machine may not support it.');
        throw new Error('WebGL not supported');
    }

    const vsSource = `
        attribute vec4 aVertexPosition;
        attribute vec3 aVertexNormal;

        uniform mat4 uNormalMatrix;
        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;

        varying highp vec3 vLighting;
        varying highp vec3 vPosition;

        void main(void) {
            gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
            vPosition = gl_Position.xyz;

            highp vec3 ambientLight = vec3(0.3, 0.3, 0.35);
            highp vec3 directionalLightColor = vec3(0.9, 0.9, 0.9);
            highp vec3 directionalVector = normalize(vec3(0.8, 1.0, 0.5));

            highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);
            highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
            
            // Soft specular
            highp vec3 viewDir = normalize(-gl_Position.xyz);
            highp vec3 halfVector = normalize(directionalVector + viewDir);
            highp float specular = pow(max(dot(transformedNormal.xyz, halfVector), 0.0), 32.0);

            vLighting = ambientLight + (directionalLightColor * directional) + (vec3(1.0) * specular * 0.3);
        }
    `;

    const fsSource = `
        varying highp vec3 vLighting;
        varying highp vec3 vPosition;

        uniform highp vec4 uBaseColor;
        uniform int uState; // 0=normal, 1=selected, 2=highlighted move, 3=last move, 4=check

        void main(void) {
            highp vec4 color = uBaseColor;
            
            if (uState == 1) {
                color = mix(color, vec4(0.2, 0.8, 0.2, 1.0), 0.5); 
            } else if (uState == 2) {
                color = mix(color, vec4(0.9, 0.8, 0.2, 1.0), 0.6); 
                // Grid pattern for valid moves
                if(mod(floor(vPosition.x * 10.0) + floor(vPosition.y * 10.0), 2.0) == 0.0) color.rgb *= 0.8;
            } else if (uState == 3) {
                color = mix(color, vec4(0.2, 0.6, 1.0, 1.0), 0.4); 
            } else if (uState == 4) {
                color = mix(color, vec4(1.0, 0.1, 0.1, 1.0), 0.7); 
            }

            gl_FragColor = vec4(color.rgb * vLighting, color.a);
        }
    `;

    function loadShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('Shader compilation error: ' + gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
            vertexNormal: gl.getAttribLocation(shaderProgram, 'aVertexNormal'),
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
            normalMatrix: gl.getUniformLocation(shaderProgram, 'uNormalMatrix'),
            baseColor: gl.getUniformLocation(shaderProgram, 'uBaseColor'),
            state: gl.getUniformLocation(shaderProgram, 'uState'),
        },
    };

    // --- STREAMING_CHUNK: Generating 3D Procedural Geometry... ---
    
    // Geometry generator functions to keep code size small
    function createBox(w, h, d) {
        w/=2; h/=2; d/=2;
        const positions = [
            -w,-h, d,  w,-h, d,  w, h, d, -w, h, d, // Front
            -w,-h,-d, -w, h,-d,  w, h,-d,  w,-h,-d, // Back
            -w, h,-d, -w, h, d,  w, h, d,  w, h,-d, // Top
            -w,-h,-d,  w,-h,-d,  w,-h, d, -w,-h, d, // Bottom
             w,-h,-d,  w, h,-d,  w, h, d,  w,-h, d, // Right
            -w,-h,-d, -w,-h, d, -w, h, d, -w, h,-d, // Left
        ];
        const normals = [
             0, 0, 1,  0, 0, 1,  0, 0, 1,  0, 0, 1,
             0, 0,-1,  0, 0,-1,  0, 0,-1,  0, 0,-1,
             0, 1, 0,  0, 1, 0,  0, 1, 0,  0, 1, 0,
             0,-1, 0,  0,-1, 0,  0,-1, 0,  0,-1, 0,
             1, 0, 0,  1, 0, 0,  1, 0, 0,  1, 0, 0,
            -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0
        ];
        const indices = [];
        for (let i = 0; i < 6; i++) {
            let o = i * 4;
            indices.push(o, o+1, o+2, o, o+2, o+3);
        }
        return { positions, normals, indices };
    }

    function createCylinder(rBottom, rTop, height, radialSegments) {
        const positions = [], normals = [], indices = [];
        const halfH = height / 2;
        
        // Side
        for (let i = 0; i <= radialSegments; i++) {
            let u = i / radialSegments;
            let theta = u * Math.PI * 2;
            let sinTheta = Math.sin(theta);
            let cosTheta = Math.cos(theta);
            
            positions.push(rBottom * cosTheta, -halfH, rBottom * sinTheta);
            normals.push(cosTheta, 0, sinTheta); // Approx normal
            
            positions.push(rTop * cosTheta, halfH, rTop * sinTheta);
            normals.push(cosTheta, 0, sinTheta);
        }

        for (let i = 0; i < radialSegments; i++) {
            let p1 = i * 2, p2 = p1 + 1, p3 = p1 + 2, p4 = p1 + 3;
            indices.push(p1, p2, p4, p1, p4, p3);
        }

        let offset = positions.length / 3;
        // Top Cap
        positions.push(0, halfH, 0); normals.push(0, 1, 0);
        let centerTop = offset++;
        for (let i = 0; i <= radialSegments; i++) {
            let theta = (i / radialSegments) * Math.PI * 2;
            positions.push(rTop * Math.cos(theta), halfH, rTop * Math.sin(theta));
            normals.push(0, 1, 0);
            if (i > 0) indices.push(centerTop, offset + i - 1, offset + i);
        }
        offset += radialSegments + 1;

        // Bottom Cap
        positions.push(0, -halfH, 0); normals.push(0, -1, 0);
        let centerBottom = offset++;
        for (let i = 0; i <= radialSegments; i++) {
            let theta = (i / radialSegments) * Math.PI * 2;
            positions.push(rBottom * Math.cos(theta), -halfH, rBottom * Math.sin(theta));
            normals.push(0, -1, 0);
            if (i > 0) indices.push(centerBottom, offset + i, offset + i - 1);
        }

        return { positions, normals, indices };
    }

    function createSphere(radius, widthSegments, heightSegments) {
        const positions = [];
        const normals = [];
        const indices = [];

        for (let y = 0; y <= heightSegments; y++) {
            let v = y / heightSegments;
            let phi = v * Math.PI; // 0 to PI
            let sinPhi = Math.sin(phi);
            let cosPhi = Math.cos(phi);

            for (let x = 0; x <= widthSegments; x++) {
                let u = x / widthSegments;
                let theta = u * Math.PI * 2; // 0 to 2PI

                let xPos = Math.cos(theta) * sinPhi;
                let yPos = cosPhi;
                let zPos = Math.sin(theta) * sinPhi;

                positions.push(xPos * radius, yPos * radius, zPos * radius);
                normals.push(xPos, yPos, zPos);
            }
        }

        for (let y = 0; y < heightSegments; y++) {
            for (let x = 0; x < widthSegments; x++) {
                let first = (y * (widthSegments + 1)) + x;
                let second = first + widthSegments + 1;

                indices.push(first, second, first + 1);
                indices.push(second, second + 1, first + 1);
            }
        }

        return { positions, normals, indices };
    }

    function mergeGeometries(geoms) {
        const result = { positions: [], normals: [], indices: [] };
        let indexOffset = 0;
        for (let g of geoms) {
            result.positions.push(...g.geom.positions.map((v, i) => i%3===0 ? v+g.offset[0] : i%3===1 ? v+g.offset[1] : v+g.offset[2]));
            result.normals.push(...g.geom.normals);
            result.indices.push(...g.geom.indices.map(v => v + indexOffset));
            indexOffset += g.geom.positions.length / 3;
        }
        return result;
    }

    function createBufferInfo(geom) {
        const posBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(geom.positions), gl.STATIC_DRAW);

        const normBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(geom.normals), gl.STATIC_DRAW);

        const indBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(geom.indices), gl.STATIC_DRAW);

        return {
            position: posBuffer,
            normal: normBuffer,
            indices: indBuffer,
            vertexCount: geom.indices.length
        };
    }

    // Generate distinct piece geometries
    const gBase = createCylinder(0.4, 0.35, 0.2, 16);
    
    // Procedural Spider Geometry
    let spiderBodyParts = [
        { geom: createSphere(0.15, 8, 8), offset: [0, 0.15, 0.1] }, // Abdomen
        { geom: createBox(0.15, 0.1, 0.15), offset: [0, 0.1, -0.1] } // Head
    ];
    let spiderLegRightGeom = mergeGeometries([
        { geom: createBox(0.4, 0.02, 0.02), offset: [0.2, 0.1, 0] },
        { geom: createBox(0.02, 0.2, 0.02), offset: [0.4, 0.0, 0] }
    ]);
    let spiderLegLeftGeom = mergeGeometries([
        { geom: createBox(0.4, 0.02, 0.02), offset: [-0.2, 0.1, 0] },
        { geom: createBox(0.02, 0.2, 0.02), offset: [-0.4, 0.0, 0] }
    ]);

    const Models = {
        board: createBufferInfo(createBox(1, 0.2, 1)),
        spiderBody: createBufferInfo(mergeGeometries(spiderBodyParts)),
        spiderLegRight: createBufferInfo(spiderLegRightGeom),
        spiderLegLeft: createBufferInfo(spiderLegLeftGeom),
        pawn: createBufferInfo(mergeGeometries([
            { geom: gBase, offset: [0, 0.1, 0] },
            { geom: createCylinder(0.25, 0.15, 0.6, 12), offset: [0, 0.5, 0] },
            { geom: createSphere(0.18, 16, 12), offset: [0, 0.95, 0] } // Spherical tip
        ])),
        rook: createBufferInfo(mergeGeometries([
            { geom: gBase, offset: [0, 0.1, 0] },
            { geom: createCylinder(0.3, 0.3, 0.7, 12), offset: [0, 0.55, 0] },
            { geom: createCylinder(0.35, 0.35, 0.2, 8), offset: [0, 1.0, 0] } // Blocky top
        ])),
        knight: createBufferInfo(mergeGeometries([
            { geom: gBase, offset: [0, 0.1, 0] },
            { geom: createCylinder(0.3, 0.25, 0.5, 12), offset: [0, 0.45, 0] },
            { geom: createBox(0.4, 0.5, 0.6), offset: [0, 0.8, 0.1] } // Angled head abstraction
        ])),
        bishop: createBufferInfo(mergeGeometries([
            { geom: gBase, offset: [0, 0.1, 0] },
            { geom: createCylinder(0.25, 0.15, 0.8, 12), offset: [0, 0.6, 0] },
            { geom: createCylinder(0.18, 0.01, 0.4, 12), offset: [0, 1.2, 0] } // Tall point
        ])),
        queen: createBufferInfo(mergeGeometries([
            { geom: gBase, offset: [0, 0.1, 0] },
            { geom: createCylinder(0.3, 0.15, 1.0, 16), offset: [0, 0.7, 0] },
            { geom: createCylinder(0.15, 0.35, 0.2, 16), offset: [0, 1.3, 0] }, // Crown
            { geom: createCylinder(0.04, 0, 0.2, 33), offset: [-0.2, 1.5, 0.22] },
            { geom: createCylinder(0.04, 0, 0.2, 33), offset: [0, 1.5, 0.3] },
            { geom: createCylinder(0.04, 0, 0.2, 33), offset: [0.2, 1.5, 0.22] },
            { geom: createCylinder(0.04, 0, 0.2, 33), offset: [0.3, 1.5, 0.00] },
            { geom: createCylinder(0.04, 0, 0.2, 33), offset: [0.2, 1.5, -0.22] },
            { geom: createCylinder(0.04, 0, 0.2, 33), offset: [0.0, 1.5, -0.3] },
            { geom: createCylinder(0.04, 0, 0.2, 33), offset: [-0.2, 1.5, -0.22] },
            { geom: createCylinder(0.04, 0, 0.2, 33), offset: [-0.3, 1.5, 0.00] }
        ])),
        king: createBufferInfo(mergeGeometries([
            { geom: gBase, offset: [0, 0.1, 0] },
            { geom: createCylinder(0.3, 0.2, 1.1, 16), offset: [0, 0.75, 0] },
            { geom: createCylinder(0.25, 0.25, 0.1, 16), offset: [0, 1.35, 0] },
            { geom: createBox(0.1, 0.3, 0.1), offset: [0, 1.55, 0] }, // Cross V
            { geom: createBox(0.25, 0.1, 0.1), offset: [0, 1.55, 0] } // Cross H
        ]))
    };

    const PIECE_TYPES = { 'p': 'pawn', 'r': 'rook', 'n': 'knight', 'b': 'bishop', 'q': 'queen', 'k': 'king' };
    const COLORS = {
        white: [0.95, 0.95, 0.95, 1.0],
        black: [0.15, 0.15, 0.15, 1.0],
        boardLight: [0.8, 0.75, 0.65, 1.0],
        boardDark: [0.4, 0.3, 0.25, 1.0],
        spider: [0.05, 0.02, 0.02, 1.0]
    };

    // --- STREAMING_CHUNK: Implementing Chess Logic - Move Generation... ---
    class ChessEngine {
        constructor() {
            this.reset();
        }

        reset() {
            // 0x88 or 64 array. 64 array is easier for 3D mapping. 
            // 0 is a8, 7 is h8, 56 is a1, 63 is h1.
            this.board = new Array(64).fill(null);
            this.turn = 'w';
            this.castling = { wK: true, wQ: true, bK: true, bQ: true };
            this.enPassant = null; // index of target square
            this.halfMoves = 0;
            this.history = [];
            this.loadFEN('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
        }

        loadFEN(fen) {
            const parts = fen.split(' ');
            const ranks = parts[0].split('/');
            let i = 0;
            for (let r = 0; r < 8; r++) {
                for (let c = 0; c < ranks[r].length; c++) {
                    const char = ranks[r][c];
                    if (isNaN(char)) {
                        this.board[i++] = { type: char.toLowerCase(), color: char === char.toUpperCase() ? 'w' : 'b' };
                    } else {
                        i += parseInt(char);
                    }
                }
            }
        }

        // Returns all pseudo-legal moves for a specific side
        getPseudoLegalMoves(color) {
            const moves = [];
            for (let i = 0; i < 64; i++) {
                const p = this.board[i];
                if (p && p.color === color) {
                    this.getPieceMoves(i, p, moves);
                }
            }
            return moves;
        }

        getPieceMoves(idx, piece, moves) {
            const r = Math.floor(idx / 8);
            const c = idx % 8;
            const dir = piece.color === 'w' ? -1 : 1;
            const opp = piece.color === 'w' ? 'b' : 'w';

            const addMove = (to, type = 'normal', promo = null) => {
                moves.push({ from: idx, to, type, captured: this.board[to], promo });
            };

            const slide = (dr, dc) => {
                for (let step = 1; step < 8; step++) {
                    let nr = r + dr * step, nc = c + dc * step;
                    if (nr < 0 || nr > 7 || nc < 0 || nc > 7) break;
                    let target = nr * 8 + nc;
                    if (!this.board[target]) {
                        addMove(target);
                    } else {
                        if (this.board[target].color === opp) addMove(target, 'capture');
                        break;
                    }
                }
            };

            const jump = (offsets) => {
                for (let off of offsets) {
                    let nr = r + off[0], nc = c + off[1];
                    if (nr >= 0 && nr <= 7 && nc >= 0 && nc <= 7) {
                        let target = nr * 8 + nc;
                        if (!this.board[target] || this.board[target].color === opp) {
                            addMove(target, this.board[target] ? 'capture' : 'normal');
                        }
                    }
                }
            };

            if (piece.type === 'p') {
                // Forward
                let nr = r + dir;
                if (nr >= 0 && nr <= 7 && !this.board[nr * 8 + c]) {
                    if (nr === 0 || nr === 7) {
                        ['q','r','b','n'].forEach(p => addMove(nr * 8 + c, 'promotion', p));
                    } else {
                        addMove(nr * 8 + c);
                        // Double move
                        if ((piece.color === 'w' && r === 6) || (piece.color === 'b' && r === 1)) {
                            let nnr = r + dir * 2;
                            if (!this.board[nnr * 8 + c]) addMove(nnr * 8 + c, 'double_pawn');
                        }
                    }
                }
                // Captures
                for (let dc of [-1, 1]) {
                    let nc = c + dc;
                    if (nc >= 0 && nc <= 7) {
                        let t = nr * 8 + nc;
                        if (this.board[t] && this.board[t].color === opp) {
                            if (nr === 0 || nr === 7) {
                                ['q','r','b','n'].forEach(p => addMove(t, 'promotion_capture', p));
                            } else {
                                addMove(t, 'capture');
                            }
                        } else if (t === this.enPassant) {
                            addMove(t, 'en_passant');
                        }
                    }
                }
            } else if (piece.type === 'n') {
                jump([[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]);
            } else if (piece.type === 'k') {
                jump([[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]);
                // Castling
                if (piece.color === 'w' && r === 7 && c === 4) {
                    if (this.castling.wK && !this.board[61] && !this.board[62] && !this.isSquareAttacked(60, 'b') && !this.isSquareAttacked(61, 'b')) addMove(62, 'castling');
                    if (this.castling.wQ && !this.board[59] && !this.board[58] && !this.board[57] && !this.isSquareAttacked(60, 'b') && !this.isSquareAttacked(59, 'b')) addMove(58, 'castling');
                } else if (piece.color === 'b' && r === 0 && c === 4) {
                    if (this.castling.bK && !this.board[5] && !this.board[6] && !this.isSquareAttacked(4, 'w') && !this.isSquareAttacked(5, 'w')) addMove(6, 'castling');
                    if (this.castling.bQ && !this.board[3] && !this.board[2] && !this.board[1] && !this.isSquareAttacked(4, 'w') && !this.isSquareAttacked(3, 'w')) addMove(2, 'castling');
                }
            } else if (piece.type === 'r') { slide(-1,0); slide(1,0); slide(0,-1); slide(0,1); }
            else if (piece.type === 'b') { slide(-1,-1); slide(-1,1); slide(1,-1); slide(1,1); }
            else if (piece.type === 'q') { slide(-1,0); slide(1,0); slide(0,-1); slide(0,1); slide(-1,-1); slide(-1,1); slide(1,-1); slide(1,1); }
        }

        isSquareAttacked(idx, attackerColor) {
            const r = Math.floor(idx / 8);
            const c = idx % 8;

            // Check knigth attacks
            const knightOffsets = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
            for (let off of knightOffsets) {
                let nr = r + off[0], nc = c + off[1];
                if (nr >= 0 && nr <= 7 && nc >= 0 && nc <= 7) {
                    let p = this.board[nr * 8 + nc];
                    if (p && p.color === attackerColor && p.type === 'n') return true;
                }
            }

            // Ray casts for sliders and kings
            const dirs = [ [-1,0], [1,0], [0,-1], [0,1], [-1,-1], [-1,1], [1,-1], [1,1] ];
            for (let i = 0; i < 8; i++) {
                let dr = dirs[i][0], dc = dirs[i][1];
                for (let step = 1; step < 8; step++) {
                    let nr = r + dr * step, nc = c + dc * step;
                    if (nr < 0 || nr > 7 || nc < 0 || nc > 7) break;
                    let p = this.board[nr * 8 + nc];
                    if (p) {
                        if (p.color === attackerColor) {
                            if (p.type === 'q') return true;
                            if (p.type === 'r' && i < 4) return true;
                            if (p.type === 'b' && i >= 4) return true;
                            if (step === 1 && p.type === 'k') return true;
                            if (step === 1 && p.type === 'p') {
                                if (attackerColor === 'w' && dr === 1 && (dc === -1 || dc === 1)) return true; // White pawn attacks UP rank (lower index)
                                if (attackerColor === 'b' && dr === -1 && (dc === -1 || dc === 1)) return true;
                            }
                        }
                        break; // Blocked by any piece
                    }
                }
            }
            return false;
        }

        getLegalMoves() {
            const pseudoMoves = this.getPseudoLegalMoves(this.turn);
            return pseudoMoves.filter(m => {
                this.makeMove(m);
                const isCheck = this.isKingInCheck(this.turn === 'w' ? 'b' : 'w'); // Opponent's turn after move
                this.undoMove();
                return !isCheck;
            });
        }

        isKingInCheck(color) {
            let kingIdx = this.board.findIndex(p => p && p.color === color && p.type === 'k');
            if (kingIdx === -1) return false; // Should not happen in valid chess
            return this.isSquareAttacked(kingIdx, color === 'w' ? 'b' : 'w');
        }

        makeMove(m) {
            const state = {
                move: m,
                castling: { ...this.castling },
                enPassant: this.enPassant,
                halfMoves: this.halfMoves
            };
            this.history.push(state);

            let p = this.board[m.from];
            if (!p) return; // Prevent crashes on invalid states

            this.board[m.to] = p;
            this.board[m.from] = null;

            this.enPassant = null;
            this.halfMoves++;
            if (p.type === 'p' || m.captured) this.halfMoves = 0;

            if (m.type === 'double_pawn') {
                this.enPassant = m.from + (p.color === 'w' ? -8 : 8);
            } else if (m.type === 'en_passant') {
                this.board[m.to + (p.color === 'w' ? 8 : -8)] = null;
            } else if (m.type === 'castling') {
                if (m.to === 62) { this.board[61] = this.board[63]; this.board[63] = null; } // wK
                else if (m.to === 58) { this.board[59] = this.board[56]; this.board[56] = null; } // wQ
                else if (m.to === 6) { this.board[5] = this.board[7]; this.board[7] = null; } // bK
                else if (m.to === 2) { this.board[3] = this.board[0]; this.board[0] = null; } // bQ
            } else if (m.promo) {
                this.board[m.to] = { type: m.promo, color: p.color };
            }

            // Update castling rights
            if (p.type === 'k') {
                if (p.color === 'w') { this.castling.wK = false; this.castling.wQ = false; }
                else { this.castling.bK = false; this.castling.bQ = false; }
            } else if (p.type === 'r') {
                if (m.from === 56) this.castling.wQ = false;
                if (m.from === 63) this.castling.wK = false;
                if (m.from === 0) this.castling.bQ = false;
                if (m.from === 7) this.castling.bK = false;
            }
            // Capture rooks invalidates castling
            if (m.to === 56) this.castling.wQ = false;
            if (m.to === 63) this.castling.wK = false;
            if (m.to === 0) this.castling.bQ = false;
            if (m.to === 7) this.castling.bK = false;

            this.turn = this.turn === 'w' ? 'b' : 'w';
        }

        undoMove() {
            if (this.history.length === 0) return;
            const state = this.history.pop();
            const m = state.move;
            this.castling = state.castling;
            this.enPassant = state.enPassant;
            this.halfMoves = state.halfMoves;
            this.turn = this.turn === 'w' ? 'b' : 'w';

            let p = this.board[m.to];
            if (m.promo) p = { type: 'p', color: p.color };
            this.board[m.from] = p;
            this.board[m.to] = m.captured || null;

            if (m.type === 'en_passant') {
                this.board[m.to] = null;
                this.board[m.to + (p.color === 'w' ? 8 : -8)] = { type: 'p', color: this.turn === 'w' ? 'b' : 'w' };
            } else if (m.type === 'castling') {
                if (m.to === 62) { this.board[63] = this.board[61]; this.board[61] = null; }
                else if (m.to === 58) { this.board[56] = this.board[59]; this.board[59] = null; }
                else if (m.to === 6) { this.board[7] = this.board[5]; this.board[5] = null; }
                else if (m.to === 2) { this.board[0] = this.board[3]; this.board[3] = null; }
            }
        }

        evaluateBoard() {
            const pieceValues = { 'p': 100, 'n': 320, 'b': 330, 'r': 500, 'q': 900, 'k': 20000 };
            // Simple PST (Piece Square Tables) encouraging center control
            const centerBonus = [
                -20,-10,-10,-10,-10,-10,-10,-20,
                -10,  0,  0,  0,  0,  0,  0,-10,
                -10,  0, 10, 10, 10, 10,  0,-10,
                -10,  0, 10, 20, 20, 10,  0,-10,
                -10,  0, 10, 20, 20, 10,  0,-10,
                -10,  0, 10, 10, 10, 10,  0,-10,
                -10,  0,  0,  0,  0,  0,  0,-10,
                -20,-10,-10,-10,-10,-10,-10,-20,
            ];

            let score = 0;
            for (let i = 0; i < 64; i++) {
                const p = this.board[i];
                if (p) {
                    let val = pieceValues[p.type] + (p.type !== 'k' && p.type !== 'r' ? centerBonus[i] : 0);
                    score += p.color === 'w' ? val : -val;
                }
            }
            return score;
        }
    }

    // --- STREAMING_CHUNK: Implementing AI (Minimax with Alpha-Beta)... ---
    class AI {
        constructor(engine) {
            this.engine = engine;
            this.nodes = 0;
        }

        getBestMove(depth) {
            this.nodes = 0;
            const isMaximizing = this.engine.turn === 'w';
            let bestMove = null;
            let bestValue = isMaximizing ? -Infinity : Infinity;
            
            const legalMoves = this.engine.getLegalMoves();
            if (legalMoves.length === 0) return null;

            // Sort moves to improve alpha-beta pruning (captures first)
            legalMoves.sort((a, b) => (b.captured ? 1 : 0) - (a.captured ? 1 : 0));

            for (let move of legalMoves) {
                this.engine.makeMove(move);
                let value = this.minimax(depth - 1, -Infinity, Infinity, !isMaximizing);
                this.engine.undoMove();

                if (isMaximizing) {
                    if (value > bestValue) { bestValue = value; bestMove = move; }
                } else {
                    if (value < bestValue) { bestValue = value; bestMove = move; }
                }
            }
            console.log(`AI evaluated ${this.nodes} nodes. Best value: ${bestValue}`);
            return bestMove;
        }

        minimax(depth, alpha, beta, isMaximizing) {
            this.nodes++;
            if (depth === 0) return this.engine.evaluateBoard();

            const moves = this.engine.getLegalMoves();
            if (moves.length === 0) {
                if (this.engine.isKingInCheck(this.engine.turn)) return isMaximizing ? -20000 : 20000;
                return 0; // Stalemate
            }

            if (isMaximizing) {
                let maxEval = -Infinity;
                for (let move of moves) {
                    this.engine.makeMove(move);
                    let ev = this.minimax(depth - 1, alpha, beta, false);
                    this.engine.undoMove();
                    maxEval = Math.max(maxEval, ev);
                    alpha = Math.max(alpha, ev);
                    if (beta <= alpha) break;
                }
                return maxEval;
            } else {
                let minEval = Infinity;
                for (let move of moves) {
                    this.engine.makeMove(move);
                    let ev = this.minimax(depth - 1, alpha, beta, true);
                    this.engine.undoMove();
                    minEval = Math.min(minEval, ev);
                    beta = Math.min(beta, ev);
                    if (beta <= alpha) break;
                }
                return minEval;
            }
        }
    }

    // --- STREAMING_CHUNK: Main Game Controller and Rendering Logic... ---
    const engine = new ChessEngine();
    const ai = new AI(engine);
    let playerColor = 'w';
    let aiDifficulty = 3;
    let selectedSquare = null;
    let validMoves = [];
    let lastMoveFrom = null;
    let lastMoveTo = null;
    let isGameOver = false;

    let whiteTime = 300;
    let blackTime = 300;
    let useClock = true;
    let timerInterval = null;

    function formatTime(seconds) {
        let m = Math.floor(seconds / 60);
        let s = Math.floor(seconds % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    }

    function updateClocks() {
        const container = document.getElementById('clock-container');
        if (!useClock) {
            container.style.display = 'none';
            return;
        }
        container.style.display = 'flex';
        
        const wClock = document.getElementById('white-clock');
        const bClock = document.getElementById('black-clock');
        
        wClock.innerText = formatTime(whiteTime);
        bClock.innerText = formatTime(blackTime);
        
        wClock.className = 'clock' + (engine.turn === 'w' && !isGameOver ? ' active' : '') + (whiteTime <= 30 && whiteTime > 0 ? ' danger' : '');
        bClock.className = 'clock' + (engine.turn === 'b' && !isGameOver ? ' active' : '') + (blackTime <= 30 && blackTime > 0 ? ' danger' : '');
    }

    function startTimer() {
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            if (isGameOver || !useClock) return;
            
            if (engine.turn === 'w') {
                whiteTime--;
                if (whiteTime <= 0) { whiteTime = 0; timeOut('Black'); }
            } else {
                blackTime--;
                if (blackTime <= 0) { blackTime = 0; timeOut('White'); }
            }
            updateClocks();
        }, 1000);
    }

    function timeOut(winner) {
        isGameOver = true;
        clearInterval(timerInterval);
        const overlay = document.getElementById('status-overlay');
        const text = document.getElementById('status-text');
        text.innerText = `${winner} wins on time!`;
        text.style.color = '#ff5252';
        overlay.classList.add('visible');
    }

    // Camera and Animation
    let cameraAngle = { x: Math.PI / 2.5, y: 0 };
    let cameraDistance = 13;
    let targetCameraAngle = { ...cameraAngle };
    
    let animatedPieces = []; // { id: 0-63, geom, color, x, y, z, tx, ty, tz, progress }

    // Spider State setup
    let spiders = [];
    for(let i=0; i<12; i++) {
        spiders.push({
            x: (Math.random() > 0.5 ? 1 : -1) * (5 + Math.random() * 5),
            z: (Math.random() > 0.5 ? 1 : -1) * (5 + Math.random() * 5),
            angle: Math.random() * Math.PI * 2,
            speed: 0.003 + Math.random() * 0.007,
            turnSpeed: 0.0,
            legPhase: Math.random() * Math.PI * 2,
            scale: 0.3 + Math.random() * 0.4
        });
    }

    function updateSpiders() {
        spiders.forEach(s => {
            s.angle += s.turnSpeed;
            if (Math.random() < 0.05) s.turnSpeed = (Math.random() - 0.5) * 0.1;
            
            let nx = s.x + Math.sin(s.angle) * s.speed;
            let nz = s.z + Math.cos(s.angle) * s.speed;

            // Constrain spiders to perimeter bounds (bounce off the board edge)
            if ((nx > -4.5 && nx < 4.5 && nz > -4.5 && nz < 4.5) || Math.abs(nx) > 12 || Math.abs(nz) > 12) {
                s.angle += Math.PI + (Math.random() - 0.5); // bounce and add noise
                s.turnSpeed = 0;
            } else {
                s.x = nx;
                s.z = nz;
            }
            s.legPhase += s.speed * 10;
        });
    }

    function getBoardPos(index) {
        const r = Math.floor(index / 8);
        const c = index % 8;
        return [c - 3.5, 0.2, r - 3.5]; // Center around 0
    }

    function updatePieceAnimations() {
        let animating = false;
        animatedPieces.forEach(p => {
            if (p.progress < 1.0) {
                animating = true;
                p.progress += 0.08;
                if (p.progress > 1.0) p.progress = 1.0;
                
                // Smoothstep interpolation + bounce arc
                const t = p.progress;
                const smoothT = t * t * (3 - 2 * t);
                p.x = p.sx + (p.tx - p.sx) * smoothT;
                p.z = p.sz + (p.tz - p.sz) * smoothT;
                
                // Parabolic arc for height
                const arc = Math.sin(t * Math.PI) * 1.5;
                p.y = p.sy + (p.ty - p.sy) * smoothT + arc;
            }
        });
        return animating;
    }

    function renderScene() {
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0.1, 0.1, 0.1, 1.0);
        gl.clearDepth(1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        const aspect = canvas.width / canvas.height;
        const projectionMatrix = Math3D.mat4.create();
        Math3D.mat4.perspective(projectionMatrix, 45 * Math.PI / 180, aspect, 0.1, 100.0);

        // Smooth camera movement
        cameraAngle.x += (targetCameraAngle.x - cameraAngle.x) * 0.1;
        cameraAngle.y += (targetCameraAngle.y - cameraAngle.y) * 0.1;

        const cy = Math.sin(cameraAngle.x) * cameraDistance;
        const cx = Math.cos(cameraAngle.x) * Math.sin(cameraAngle.y) * cameraDistance;
        const cz = Math.cos(cameraAngle.x) * Math.cos(cameraAngle.y) * cameraDistance;

        const viewMatrix = Math3D.mat4.create();
        Math3D.mat4.lookAt(viewMatrix, [cx, cy, cz], [0, 0, 0], [0, 1, 0]);

        gl.useProgram(programInfo.program);
        gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);

        const drawObject = (bufferInfo, pos, color, state, rotY = 0, scale = 1, rotX = 0, rotZ = 0) => {
            const modelViewMatrix = Math3D.mat4.create();
            Math3D.mat4.multiply(modelViewMatrix, viewMatrix, modelViewMatrix);
            Math3D.mat4.translate(modelViewMatrix, modelViewMatrix, pos);
            
            if (rotY !== 0) {
                Math3D.mat4.rotateY(modelViewMatrix, modelViewMatrix, rotY);
            }
            if (rotX !== 0) {
                Math3D.mat4.rotateX(modelViewMatrix, modelViewMatrix, rotX);
            }
            if (rotZ !== 0) {
                Math3D.mat4.rotateZ(modelViewMatrix, modelViewMatrix, rotZ);
            }
            if (scale !== 1) {
                Math3D.mat4.scale(modelViewMatrix, modelViewMatrix, [scale, scale, scale]);
            }

            const normalMatrix = Math3D.mat4.create();
            Math3D.mat4.invert(normalMatrix, modelViewMatrix);
            Math3D.mat4.transpose(normalMatrix, normalMatrix);

            gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix);
            gl.uniformMatrix4fv(programInfo.uniformLocations.normalMatrix, false, normalMatrix);
            gl.uniform4fv(programInfo.uniformLocations.baseColor, color);
            gl.uniform1i(programInfo.uniformLocations.state, state);

            gl.bindBuffer(gl.ARRAY_BUFFER, bufferInfo.position);
            gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);

            gl.bindBuffer(gl.ARRAY_BUFFER, bufferInfo.normal);
            gl.vertexAttribPointer(programInfo.attribLocations.vertexNormal, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(programInfo.attribLocations.vertexNormal);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bufferInfo.indices);
            gl.drawElements(gl.TRIANGLES, bufferInfo.vertexCount, gl.UNSIGNED_SHORT, 0);
        };

        // Draw Board
        let inCheckSq = engine.isKingInCheck(engine.turn) ? 
            engine.board.findIndex(p => p && p.type === 'k' && p.color === engine.turn) : -1;

        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const idx = r * 8 + c;
                const isDark = (r + c) % 2 !== 0;
                const baseColor = isDark ? COLORS.boardDark : COLORS.boardLight;
                
                let state = 0;
                if (idx === selectedSquare) state = 1;
                else if (validMoves.some(m => m.to === idx)) state = 2;
                else if (idx === lastMoveFrom || idx === lastMoveTo) state = 3;
                else if (idx === inCheckSq) state = 4;

                drawObject(Models.board, [c - 3.5, 0, r - 3.5], baseColor, state);
            }
        }

        // Prepare pieces for drawing (sync with board state if not animating)
        let isAnimating = updatePieceAnimations();
        
        if (!isAnimating) {
            animatedPieces = [];
            for (let i = 0; i < 64; i++) {
                const p = engine.board[i];
                if (p) {
                    const pos = getBoardPos(i);
                    animatedPieces.push({
                        idx: i,
                        type: p.type,
                        color: p.color === 'w' ? COLORS.white : COLORS.black,
                        x: pos[0], y: pos[1], z: pos[2], progress: 1.0
                    });
                }
            }
        }

        // Draw Pieces
        animatedPieces.forEach(p => {
            const model = Models[PIECE_TYPES[p.type]];
            drawObject(model, [p.x, p.y, p.z], p.color, p.idx === selectedSquare ? 1 : 0);
        });

        // Update and Draw Spiders
        updateSpiders();
        spiders.forEach(s => {
            let bobY = Math.abs(Math.sin(s.legPhase * 2)) * 0.015; // smooth body bobbing
            let baseRot = s.angle + Math.PI;
            
            // Draw central spider body
            drawObject(Models.spiderBody, [s.x, bobY, s.z], COLORS.spider, 0, baseRot, s.scale);
            
            // Draw and animate 8 legs sequentially
            for (let i = 0; i < 4; i++) {
                let zOffset = -0.15 + i * 0.1;
                
                // Calculate world space position for this leg joint
                let legX = s.x + Math.sin(baseRot) * (zOffset * s.scale);
                let legZ = s.z + Math.cos(baseRot) * (zOffset * s.scale);
                
                // Alternating phase gait (Tetrapod crawling simulation)
                let phaseR = s.legPhase + (i % 2 === 0 ? 0 : Math.PI);
                let rotXR = Math.cos(phaseR) * 0.4; // Swing forward/backward
                let liftR = Math.max(0, Math.sin(phaseR)) * 0.6; // Lift upwards on forward swing
                
                let phaseL = s.legPhase + (i % 2 === 0 ? Math.PI : 0);
                let rotXL = Math.cos(phaseL) * 0.4;
                let liftL = Math.max(0, Math.sin(phaseL)) * 0.6;
                
                drawObject(Models.spiderLegRight, [legX, bobY, legZ], COLORS.spider, 0, baseRot, s.scale, rotXR, liftR);
                drawObject(Models.spiderLegLeft, [legX, bobY, legZ], COLORS.spider, 0, baseRot, s.scale, rotXL, -liftL);
            }
        });

        requestAnimationFrame(renderScene);
    }

    // --- STREAMING_CHUNK: Implementing Interaction and Raycasting... ---
    function unprojectPoint(x, y, z, viewProjInv) {
        const pt = [
            (x / canvas.width) * 2 - 1,
            1 - (y / canvas.height) * 2,
            z * 2 - 1
        ];
        const res = [0,0,0,0];
        res[0] = viewProjInv[0]*pt[0] + viewProjInv[4]*pt[1] + viewProjInv[8]*pt[2] + viewProjInv[12];
        res[1] = viewProjInv[1]*pt[0] + viewProjInv[5]*pt[1] + viewProjInv[9]*pt[2] + viewProjInv[13];
        res[2] = viewProjInv[2]*pt[0] + viewProjInv[6]*pt[1] + viewProjInv[10]*pt[2] + viewProjInv[14];
        res[3] = viewProjInv[3]*pt[0] + viewProjInv[7]*pt[1] + viewProjInv[11]*pt[2] + viewProjInv[15];
        return [res[0]/res[3], res[1]/res[3], res[2]/res[3]];
    }

    function getClickedSquare(e) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const aspect = canvas.width / canvas.height;
        const proj = Math3D.mat4.create();
        Math3D.mat4.perspective(proj, 45 * Math.PI / 180, aspect, 0.1, 100.0);

        const cy = Math.sin(cameraAngle.x) * cameraDistance;
        const cx = Math.cos(cameraAngle.x) * Math.sin(cameraAngle.y) * cameraDistance;
        const cz = Math.cos(cameraAngle.x) * Math.cos(cameraAngle.y) * cameraDistance;
        const view = Math3D.mat4.create();
        Math3D.mat4.lookAt(view, [cx, cy, cz], [0, 0, 0], [0, 1, 0]);

        const viewProj = Math3D.mat4.create();
        Math3D.mat4.multiply(viewProj, proj, view);
        const viewProjInv = Math3D.mat4.create();
        Math3D.mat4.invert(viewProjInv, viewProj);

        const nearPt = unprojectPoint(mouseX, mouseY, 0, viewProjInv);
        const farPt = unprojectPoint(mouseX, mouseY, 1, viewProjInv);

        const dir = [farPt[0]-nearPt[0], farPt[1]-nearPt[1], farPt[2]-nearPt[2]];
        
        // Intersect with plane y=0.2 (top of board)
        if (dir[1] === 0) return null;
        const t = (0.2 - nearPt[1]) / dir[1];
        const ix = nearPt[0] + t * dir[0];
        const iz = nearPt[2] + t * dir[2];

        const c = Math.floor(ix + 4.0);
        const r = Math.floor(iz + 4.0);

        if (c >= 0 && c <= 7 && r >= 0 && r <= 7) return r * 8 + c;
        return null;
    }

    let isDragging = false;
    let lastMouseX = 0, lastMouseY = 0;
    let startX = 0, startY = 0;

    canvas.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = lastMouseX = e.clientX;
        startY = lastMouseY = e.clientY;
    });

    canvas.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const dx = e.clientX - lastMouseX;
        const dy = e.clientY - lastMouseY;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;

        targetCameraAngle.y -= dx * 0.01;
        targetCameraAngle.x += dy * 0.01;
        // Clamp vertical rotation
        targetCameraAngle.x = Math.max(0.1, Math.min(Math.PI / 2 - 0.1, targetCameraAngle.x));
    });

    canvas.addEventListener('mouseup', (e) => {
        isDragging = false;
        if (Math.abs(e.clientX - startX) > 5 || Math.abs(e.clientY - startY) > 5) return; // Was a drag
        
        handleInteraction(e);
    });
    
    // Touch support
    canvas.addEventListener('touchstart', (e) => {
        if(e.touches.length > 0) {
            isDragging = true;
            startX = lastMouseX = e.touches[0].clientX;
            startY = lastMouseY = e.touches[0].clientY;
        }
    });
    
    canvas.addEventListener('touchmove', (e) => {
        if(!isDragging || e.touches.length === 0) return;
        const dx = e.touches[0].clientX - lastMouseX;
        const dy = e.touches[0].clientY - lastMouseY;
        lastMouseX = e.touches[0].clientX;
        lastMouseY = e.touches[0].clientY;
        
        targetCameraAngle.y -= dx * 0.01;
        targetCameraAngle.x += dy * 0.01;
        targetCameraAngle.x = Math.max(0.1, Math.min(Math.PI / 2 - 0.1, targetCameraAngle.x));
    });
    
    canvas.addEventListener('touchend', (e) => {
        isDragging = false;
        // Only trigger click if it wasn't a swipe
        if(e.changedTouches.length > 0) {
            if (Math.abs(e.changedTouches[0].clientX - startX) > 10 || Math.abs(e.changedTouches[0].clientY - startY) > 10) return; // Was a swipe/drag
            handleInteraction(e.changedTouches[0]);
        }
    });

    // --- STREAMING_CHUNK: Game Loop and Flow Control... ---
    
    // --- AUDIO SYSTEM ---
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioContext();

    function playSound(type) {
        // Resume context if browser suspended it (autoplay policy)
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const t = audioCtx.currentTime;
        
        if (type === 'select') {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(600, t);
            osc.frequency.exponentialRampToValueAtTime(300, t + 0.1);
            gain.gain.setValueAtTime(0.4, t);
            gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(t);
            osc.stop(t + 0.1);
        } else if (type === 'move') {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(150, t);
            osc.frequency.exponentialRampToValueAtTime(40, t + 0.15);
            gain.gain.setValueAtTime(0.6, t);
            gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(t);
            osc.stop(t + 0.15);
        } else if (type === 'capture') {
            const osc1 = audioCtx.createOscillator();
            const osc2 = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc1.type = 'square';
            osc2.type = 'sawtooth';
            osc1.frequency.setValueAtTime(150, t);
            osc2.frequency.setValueAtTime(100, t);
            osc1.frequency.exponentialRampToValueAtTime(20, t + 0.25);
            osc2.frequency.exponentialRampToValueAtTime(10, t + 0.25);
            gain.gain.setValueAtTime(0.5, t);
            gain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);
            osc1.connect(gain);
            osc2.connect(gain);
            gain.connect(audioCtx.destination);
            osc1.start(t);
            osc2.start(t);
            osc1.stop(t + 0.25);
            osc2.stop(t + 0.25);
        }
    }

    let pendingPromotionMove = null;

    function handleInteraction(e) {
        if (isGameOver || engine.turn !== playerColor) return;
        
        const sq = getClickedSquare(e);
        if (sq === null) {
            selectedSquare = null;
            validMoves = [];
            return;
        }

        // If clicked on a valid move target
        const move = validMoves.find(m => m.to === sq);
        if (move) {
            if (move.type.startsWith('promotion')) {
                pendingPromotionMove = move;
                document.getElementById('promotion-dialog').style.display = 'block';
                return;
            }
            executeMove(move);
        } else {
            // Select piece
            const p = engine.board[sq];
            if (p && p.color === playerColor) {
                selectedSquare = sq;
                playSound('select');
                validMoves = engine.getLegalMoves().filter(m => m.from === sq);
            } else {
                selectedSquare = null;
                validMoves = [];
            }
        }
    }

    document.querySelectorAll('.promo-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (pendingPromotionMove) {
                pendingPromotionMove.promo = btn.dataset.piece;
                executeMove(pendingPromotionMove);
                pendingPromotionMove = null;
                document.getElementById('promotion-dialog').style.display = 'none';
            }
        });
    });

    function executeMove(move) {
        // Setup animation
        const p = engine.board[move.from];
        const sPos = getBoardPos(move.from);
        const tPos = getBoardPos(move.to);
        
        // Remove captured piece immediately for visual clarity during animation
        if (move.captured || move.type === 'en_passant') {
            const capIdx = move.type === 'en_passant' ? move.to + (p.color === 'w' ? 8 : -8) : move.to;
            animatedPieces = animatedPieces.filter(ap => ap.idx !== capIdx);
            playSound('capture');
        } else {
            playSound('move');
        }

        // Setup the moving piece
        const animPiece = animatedPieces.find(ap => ap.idx === move.from);
        if (animPiece) {
            animPiece.sx = sPos[0]; animPiece.sy = sPos[1]; animPiece.sz = sPos[2];
            animPiece.tx = tPos[0]; animPiece.ty = tPos[1]; animPiece.tz = tPos[2];
            animPiece.progress = 0;
            animPiece.idx = move.to;
            if (move.promo) animPiece.type = move.promo;
        }

        // Castling rook animation
        if (move.type === 'castling') {
            let rFrom, rTo;
            if (move.to === 62) { rFrom = 63; rTo = 61; }
            else if (move.to === 58) { rFrom = 56; rTo = 59; }
            else if (move.to === 6) { rFrom = 7; rTo = 5; }
            else if (move.to === 2) { rFrom = 0; rTo = 3; }
            
            const rAnim = animatedPieces.find(ap => ap.idx === rFrom);
            if (rAnim) {
                const rsPos = getBoardPos(rFrom);
                const rtPos = getBoardPos(rTo);
                rAnim.sx = rsPos[0]; rAnim.sy = rsPos[1]; rAnim.sz = rsPos[2];
                rAnim.tx = rtPos[0]; rAnim.ty = rtPos[1]; rAnim.tz = rtPos[2];
                rAnim.progress = 0;
                rAnim.idx = rTo;
            }
        }

        engine.makeMove(move);
        selectedSquare = null;
        validMoves = [];
        lastMoveFrom = move.from;
        lastMoveTo = move.to;
        document.getElementById('btn-undo').disabled = false;

        updateClocks();
        checkGameState();

        if (!isGameOver && engine.turn !== playerColor) {
            document.getElementById('thinking-indicator').style.opacity = '1';
            setTimeout(makeAIMove, 100); // Give UI time to update
        }
    }

    function makeAIMove() {
        const bestMove = ai.getBestMove(aiDifficulty);
        document.getElementById('thinking-indicator').style.opacity = '0';
        if (bestMove) {
            executeMove(bestMove);
        } else {
            checkGameState(); // Verify stalemate/checkmate
        }
    }

    function checkGameState() {
        const moves = engine.getLegalMoves();
        if (moves.length === 0) {
            isGameOver = true;
            clearInterval(timerInterval);
            const overlay = document.getElementById('status-overlay');
            const text = document.getElementById('status-text');
            if (engine.isKingInCheck(engine.turn)) {
                text.innerText = `${engine.turn === 'w' ? 'Black' : 'White'} wins by Checkmate!`;
                text.style.color = '#ff5252';
            } else {
                text.innerText = 'Draw by Stalemate';
                text.style.color = '#FFD700';
            }
            overlay.classList.add('visible');
        }
    }

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // Dynamic camera distance for mobile (portrait mode)
        if (canvas.height > canvas.width) {
            cameraDistance = 18; // Pull back so the board fits on narrow screens
        } else {
            cameraDistance = 13; // Default for landscape/desktop
        }
    }
    window.addEventListener('resize', resize);
    resize();

    // UI Controls
    document.getElementById('btn-new-game').addEventListener('click', () => {
        engine.reset();
        isGameOver = false;
        lastMoveFrom = null; lastMoveTo = null;
        selectedSquare = null; validMoves = [];
        document.getElementById('status-overlay').classList.remove('visible');
        document.getElementById('btn-undo').disabled = true;
        
        playerColor = document.getElementById('player-color').value;
        aiDifficulty = parseInt(document.getElementById('difficulty-select').value);
        
        const timeControlVal = parseInt(document.getElementById('time-control').value);
        useClock = timeControlVal > 0;
        whiteTime = timeControlVal;
        blackTime = timeControlVal;
        updateClocks();
        startTimer();

        // Orient camera
        targetCameraAngle.y = playerColor === 'w' ? 0 : Math.PI;
        cameraAngle.y = targetCameraAngle.y - 5.5; // Slight animation on start
        
        if (engine.turn !== playerColor) {
            document.getElementById('thinking-indicator').style.opacity = '1';
            setTimeout(makeAIMove, 100);
        }
    });

    document.getElementById('btn-restart-overlay').addEventListener('click', () => {
        document.getElementById('btn-new-game').click();
    });

    document.getElementById('btn-undo').addEventListener('click', () => {
        if (engine.history.length >= 2) {
            engine.undoMove(); // Undo AI
            engine.undoMove(); // Undo Player
            lastMoveFrom = null; lastMoveTo = null;
            isGameOver = false;
            document.getElementById('status-overlay').classList.remove('visible');
            if (engine.history.length === 0) document.getElementById('btn-undo').disabled = true;
            updateClocks();
        }
    });
    
    document.getElementById('player-color').addEventListener('change', (e) => {
        playerColor = e.target.value;
        targetCameraAngle.y = playerColor === 'w' ? 0 : Math.PI;
        if (!isGameOver && engine.turn !== playerColor) {
            document.getElementById('thinking-indicator').style.opacity = '1';
            setTimeout(makeAIMove, 100);
        }
    });
    
    document.getElementById('difficulty-select').addEventListener('change', (e) => {
        aiDifficulty = parseInt(e.target.value);
    });

    // Start
    const initialTimeControl = parseInt(document.getElementById('time-control').value);
    useClock = initialTimeControl > 0;
    whiteTime = initialTimeControl;
    blackTime = initialTimeControl;
    updateClocks();
    startTimer();

    requestAnimationFrame(renderScene);
