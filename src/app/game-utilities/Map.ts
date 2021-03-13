 import {WebGlUtils} from './WebGlUtils'

 export enum RegionType {
    Water = 0,
    Land = 1,
    Desert = 2,
    Mountains = 3,
}

 export class Map{
     vertices:[number,number][];
     regions:Int32Array[];
     regionTypes:Int32Array;
     shaderProgram:WebGLProgram;

     constructor(vertices:[number,number][], regions:Int32Array[], regionTypes:Int32Array, shaderPogram:WebGLProgram){
         this.vertices = vertices;
         this.regions = regions;
         this.regionTypes = regionTypes;
         this.shaderProgram = shaderPogram;
     }

     drawBackground(canvas:HTMLCanvasElement){
        // Initialize the GL context
        const gl = canvas.getContext("webgl");
        // Only continue if WebGL is available and working
        if (gl === null) {
          alert("Unable to initialize WebGL. Your browser or machine may not support it.");
          return;
        }
      
        const vsSource = `
            
        `;
        const fsSource = `
        precision highp float;
        varying vec4 vPos;
            void main() {
            gl_FragColor = vPos+vec4(1,1,1,0);
            }
        `;
        let shd = [WebGlUtils.loadShader(gl,gl.VERTEX_SHADER,vsSource),WebGlUtils.loadShader(gl,gl.FRAGMENT_SHADER,fsSource)];
        console.log(shd);
        const shaderProgram = WebGlUtils.initShaderProgram(gl, shd);
        const programInfo = {
            program: shaderProgram,
            attribLocations: {
                vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
            },
            uniformLocations: {
                projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
                modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
            },
        };
        gl.clearColor(0.0, 0.0, 0.0, 0.5);
        //gl.clearDepth(1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.bindBuffer(gl.ARRAY_BUFFER, Map.initBuffers(gl).position);
        gl.vertexAttribPointer(
            programInfo.attribLocations.vertexPosition,
            2,
            gl.FLOAT,
            false,
            0,
            0);
        gl.enableVertexAttribArray(
            programInfo.attribLocations.vertexPosition);
        gl.useProgram(programInfo.program);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
     }

     drawBorders(canvas:HTMLCanvasElement){

     }

     static positions = [
        -1.0,  1.0,
         1.0,  1.0,
        -1.0, -1.0,
         1.0, -1.0,
      ];

     static initBuffers(gl:WebGLRenderingContext) {

        // Create a buffer for the square's positions.
      
        const positionBuffer = gl.createBuffer();
      
        // Select the positionBuffer as the one to apply buffer
        // operations to from here out.
      
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      
        // Now create an array of positions for the square.
      
        
      
        // Now pass the list of positions into WebGL to build the
        // shape. We do this by creating a Float32Array from the
        // JavaScript array, then use it to fill the current buffer.
      
        gl.bufferData(gl.ARRAY_BUFFER,
                      new Float32Array(Map.positions),
                      gl.STATIC_DRAW);
      
        return {
          position: positionBuffer,
        };
      }
 }