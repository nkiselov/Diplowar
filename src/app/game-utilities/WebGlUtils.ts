export class WebGlUtils{
    static loadShader(gl:WebGLRenderingContext, type:GLenum, source:string) : WebGLShader{
        const shader = gl.createShader(type)
        if(shader != null){
            gl.shaderSource(shader, source)
        
            gl.compileShader(shader)
        
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                let errMessage = 'An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader)
                gl.deleteShader(shader)
                throw new Error(errMessage)
            }
        
            return shader
        }else{
            throw new Error('An error occurred creating shader')
        }
    }

    static initShaderProgram(gl:WebGLRenderingContext, shaders:WebGLShader[]) : WebGLProgram {
        const shaderProgram = gl.createProgram()
        if(shaderProgram !=null){
            for(var shader of shaders){
                gl.attachShader(shaderProgram,shader)
            }
            gl.linkProgram(shaderProgram)
        
            if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
                throw new Error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram))
            }
        
            return shaderProgram
        }else{
            throw new Error('An error occurred creating shader program')
        }
    }

    static runShaderProgram(gl:WebGLRenderingContext, programInfo:ProgramInfo, vertices:Float32Array, indices:Uint16Array){
        let vertexBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
        gl.vertexAttribPointer(
            programInfo.vertexPosition,
            2,
            gl.FLOAT,
            false,
            0,
            0)
        gl.enableVertexAttribArray(
            programInfo.vertexPosition)

        let indexBuffer = gl.createBuffer()

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)

        gl.useProgram(programInfo.program)
        gl.drawElements(gl.TRIANGLE_STRIP, indices.length, gl.UNSIGNED_SHORT, 0)
    }
}

export class ProgramInfo{
    vertexPosition:number
    program: WebGLProgram

    constructor(vertexPosition:number, program: WebGLProgram){
        this.vertexPosition = vertexPosition
        this.program = program
    }
}