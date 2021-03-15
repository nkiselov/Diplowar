import {WebGlUtils, ProgramInfo} from './WebGlUtils'

const colorUniformName = ''

export class Map{
    vertices:[number,number][]
    regions:Int32Array[]
    regionTypes:Int32Array

    constructor(mapData:MapData){
        let data = mapData.getData()
        this.vertices = data[0]
        this.regions = data[1]
        this.regionTypes = data[2]
    }

    drawBackground(canvas:HTMLCanvasElement, programInfo:ProgramInfo){
        // Initialize the GL context
        const gl = canvas.getContext("webgl")
        // Only continue if WebGL is available and working
        if (gl === null) {
        throw new Error("Unable to initialize WebGL. Your browser or machine may not support it.")
        }
        console.log(gl)
        gl.enable(gl.DEPTH_TEST)
        gl.clearDepth(1.0)
        gl.depthFunc(gl.LEQUAL)
        WebGlUtils.runShaderProgram(gl,programInfo,new Float32Array([-1.0,  1.0,
            1.0,  1.0,
        -1.0, -1.0,
            1.0, -1.0]),new Uint16Array([0,1,2]))
        WebGlUtils.runShaderProgram(gl,programInfo,new Float32Array([-1.0,  1.0,
            1.0,  1.0,
            -1.0, -1.0,
            1.0, -1.0]),new Uint16Array([0,1,3]))
    }

    drawBorders(canvas:HTMLCanvasElement){

    }
}