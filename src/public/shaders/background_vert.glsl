attribute vec4 vertexPosition;

varying vec4 vPos;

void main() {
    vPos = vertexPosition;
    gl_Position = vertexPosition;
}