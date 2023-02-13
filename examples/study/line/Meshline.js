import * as THREE from 'three';

export class Meshline extends THREE.BufferGeometry  {
    pointTotal = 0;
    points = [];
    positions = [];
    previous = [];
    next = [];
    width = [];
    uvs = [];
    indexes = [];
    side = [];

    constructor(parameters) {
        super(parameters);
    }

    setGeometry(points) {
        this.points = points;
        this.pointTotal = points.length;

        const start = points[0];

        this.previous.push(start.x, start.y, start.z);
        this.previous.push(start.x, start.y, start.z);

        for (let i = 0; i < this.pointTotal; i ++) {
            const p = points[i];
            this.positions.push(p.x, p.y, p.z);
            this.positions.push(p.x, p.y, p.z);

            this.previous.push(p.x, p.y, p.z);
            this.previous.push(p.x, p.y, p.z);

            if (i > 0) {
              this.next.push(p.x, p.y, p.z);
              this.next.push(p.x, p.y, p.z);
        }

            this.side.push(1, -1);

            const index = i * 2;

            if (i < this.pointTotal - 1) {
                this.indexes.push(index, index + 1, index + 2);
                this.indexes.push(index + 2, index + 1, index + 3);
            }
        }

        const end = points[this.pointTotal - 1];
        this.next.push(end.x, end.y, end.z);
        this.next.push(end.x, end.y, end.z);


        this.setAttribute('position', new THREE.Float32BufferAttribute(this.positions, 3));
        this.setAttribute('next', new THREE.Float32BufferAttribute(this.next, 3));
        this.setAttribute('previous', new THREE.Float32BufferAttribute(this.previous, 3));
        this.setAttribute('side', new THREE.Float32BufferAttribute(this.side, 1));
        // this.setAttribute('width', new THREE.Float32BufferAttribute([1], 1));

        this.setIndex(new THREE.Uint16BufferAttribute(this.indexes, 1));
        // this.setAttribute('uv', new Float32Array(this.uvs));
        // this.setAttribute('width', new Float32Array(this.width));
        // this.setAttribute('side', new Float32Array(this.width));
    }


}


const vert = `
    attribute vec3 previous;
    attribute vec3 next;

    attribute float side;
    attribute float width;

    varying vec2 vUV;
    varying vec4 vColor;

    void main() {
        vColor = vec4(0., 1., 1., 0.);

        mat4 mvpMatrix = projectionMatrix * modelViewMatrix;

        vec4 currentPosition = mvpMatrix * vec4(position, 1.);
        vec4 prevPosition = mvpMatrix * vec4(previous, 1.);
        vec4 nextPosition = mvpMatrix * vec4(next, 1.);

        vec2 dir;
        
        if (nextPosition == currentPosition) {
            dir = normalize(
                vec2(currentPosition) - vec2(prevPosition)
            );
        } else if (currentPosition == prevPosition) {
            dir = normalize(
                vec2(nextPosition) - vec2(currentPosition)
            );

        } else {
            vec2 dir1 = normalize(
                vec2(currentPosition - prevPosition)
            );
            vec2 dir2 = normalize(
                vec2(nextPosition - currentPosition)
            );

            dir = normalize(dir1 + dir2);
        }

        vec4 normal = vec4(-dir.y, dir.x, 0., 1.);
        gl_Position = currentPosition;
        gl_Position.xy += normal.xy * side * 1. * .5;
    }
`;

const frag = `
    varying vec2 vUV;
    varying vec4 vColor;

    void main() {
        vec4 color = vec4(vColor);
        // gl_FragColor = color;
        gl_FragColor = vec4(1.);
    }
`;


export class MeshlineMaterial extends THREE.ShaderMaterial {
    constructor(parameters) {
        super({
            uniforms: {
                resolution: { value: new THREE.Vector2(1, 1) },
                lineWidth: { value: 1 },
                map: { value: null },
                useMap: { value: 0 },
                alphaMap: { value: null },
                useAlphaMap: { value: 0 },
                color: { value: new THREE.Color(0xffffff) },
                opacity: { value: 1 },
                resolution: { value: new THREE.Vector2(1, 1) },
                sizeAttenuation: { value: 1 },
                dashArray: { value: 0 },
                dashOffset: { value: 0 },
                dashRatio: { value: 0.5 },
                useDash: { value: 0 },
                visibility: { value: 1 },
                alphaTest: { value: 0 },
                repeat: { value: new THREE.Vector2(1, 1) },
            },
            wireframe: true,
            vertexShader: vert,
            fragmentShader: frag
        });
    }
}