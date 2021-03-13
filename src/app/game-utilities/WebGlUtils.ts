export class WebGlUtils{
    static loadShader(gl:WebGLRenderingContext, type:GLenum, source:string) : WebGLShader{
        const shader = gl.createShader(type);
        if(shader != null){
            gl.shaderSource(shader, source);
        
            gl.compileShader(shader);
        
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                let errMessage = 'An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader);
                gl.deleteShader(shader);
                throw new Error(errMessage);
            }
        
            return shader;
        }else{
            throw new Error('An error occurred creating shader');
        }
    }

    static initShaderProgram(gl:WebGLRenderingContext, shaders:WebGLShader[]) : WebGLProgram {
        const shaderProgram = gl.createProgram();
        if(shaderProgram !=null){
            for(var shader of shaders){
                console.log(shader);
                gl.attachShader(shaderProgram,shader);
            }
            gl.linkProgram(shaderProgram);
        
            if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
                throw new Error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
            }
        
            return shaderProgram;
        }else{
            throw new Error('An error occurred creating shader program');
        }
    }

    static runShaderProgram(gl:WebGLRenderingContext, program:WebGLProgram){
        
    }
}