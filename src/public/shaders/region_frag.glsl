precision highp float;

varying vec4 vPos;

void main() {
    gl_FragColor = vPos+vec4(1,1,1,0);
}