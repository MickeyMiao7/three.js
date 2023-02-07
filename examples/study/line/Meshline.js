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
            // this.positions.push(p.x, p.y, p.z);

            this.previous.push(p.x, p.y, p.z);
            this.previous.push(p.x, p.y, p.z);

            if (i > 0) {
              this.next.push(p.x, p.y, p.z);
              this.next.push(p.x, p.y, p.z);
            }

            // debug
            // this.positions.push(p.x - 1, p.y - 1, p.z);
            // this.positions.push(p.x + 1, p.y - 1, p.z);
            this.side.push(1, -1);

            const index = i * 2;

            if (i < this.pointTotal - 1) {
                this.indexes.push(index, index + 1, index + 2);
                // this.indexes.push(index + 2, index + 1, index + 3);
            }
        }

        const end = points[this.pointTotal - 1];
        this.next.push(end.x, end.y, end.z);
        this.next.push(end.x, end.y, end.z);


        for (let i = 0; i < this.pointTotal; i ++) {
            
            // this.indexes.push(index, index + 1, index + 2);
            // this.indexes.push(index, index + 1, index + 2);
        }

        console.log(this.positions, this.indexes)
        this.setAttribute('position', new THREE.Float32BufferAttribute(this.positions, 3));
        // this.setAttribute('next', new THREE.Float32BufferAttribute(this.next, 3));
        // this.setAttribute('previous', new THREE.Float32BufferAttribute(this.previous, 3));

        this.setIndex(new THREE.Uint16BufferAttribute(this.indexes, 1));
        // this.setAttribute('uv', new Float32Array(this.uvs));
        // this.setAttribute('width', new Float32Array(this.width));
        // this.setAttribute('side', new Float32Array(this.width));
    }


}


const vert = `
    // attribute vec3 previous;';
    // attribute vec3 next;';

    attribute float next;
    attribute float previous;
    attribute float side;
    attribute float width;

    varying vec2 vUV;
    varying vec4 vColor;

    void main() {
        vColor = vec4(0., 1., 1., 0.);

        mat4 mvpMatrix = projectionMatrix * modelViewMatrix;
        gl_Position = mvpMatrix * vec4( position, 1.0 );
        // vec4 prevPos = mvpMatrix * vec4( ) ;
    }
`;

const frag = `
    varying vec2 vUV;
    varying vec4 vColor;

    void main() {
        vec4 color = vec4(vColor);
        gl_FragColor = color;
    }
`;


export class MeshlineMaterial extends THREE.ShaderMaterial {
    constructor(parameters) {
        super({
            uniforms: {},
            vertexShader: vert,
            fragmentShader: frag
        });
    }
}