import * as THREE from 'three';

export class Meshline extends THREE.BufferGeometry  {
    pointTotal = 0;
    points = [];
    positions = [];
    width = [];
    uvs = [];


    constructor(parameters) {
        super(parameters);
    }

    setGeometry(points) {
        this.points = points;
        this.pointTotal = points.length;

        // for (let i = 0; i < points.length; i ++) {
        //     const p = points[i];
        //     this.positions.push(p.x, p.y, p.z);
        //     this.positions.push(p.x, p.y, p.z);
        // }
        this.positions.push(0);
        this.positions.push(1);
        this.positions.push(0);

        this.positions.push(-1);
        this.positions.push(-1);
        this.positions.push(0);

        this.positions.push(1);
        this.positions.push(-1);
        this.positions.push(0);


        this.setAttribute('position', new THREE.Float32BufferAttribute(this.positions, 3));
        // this.setAttribute('uv', new Float32Array(this.uvs));
        // this.setAttribute('width', new Float32Array(this.width));
        // this.setAttribute('side', new Float32Array(this.width));
    }


}


const vert = `
    // attribute vec3 previous;';
    // attribute vec3 next;';

    attribute float side;
    attribute float width;

    varying vec2 vUV;
    varying vec4 vColor;

    void main() {
        vColor = vec4(0., 1., 1., 0.);

        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
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