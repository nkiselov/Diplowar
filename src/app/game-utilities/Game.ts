import { WebGlUtils, ProgramInfo} from './WebGlUtils'

const vertexAttributeName = 'vertexPosition'

export class GameLoader{

    canvas:HTMLCanvasElement
    gl:WebGLRenderingContext
    backgroundVert?:WebGLShader
    backgroundFrag?:WebGLShader
    backgroundProgram?:ProgramInfo
    regionVert?:WebGLShader
    regionFrag?:WebGLShader
    regionProgram?:ProgramInfo
    
    gameData?:GameData
    mapData?:MapData

    resourcesLoaded:number
    onAllResourcesLoaded:(game: Game) => void

    constructor(canvas:HTMLCanvasElement, onAllResourcesLoaded:(game: Game) => void){
        let gl = canvas.getContext('webgl')
        if(gl != null){
            this.gl = gl
        }else{
            throw new Error('Could not initialize webgl context')
        }
        this.canvas = canvas
        this.onAllResourcesLoaded = onAllResourcesLoaded
        this.resourcesLoaded = 0
    }

    resourceLoad(type:LoadResourceType, resource:any){
        if(this.resourcesLoaded == 63){
            throw new Error('Trying to load an already loaded resource: type = '+type)
        }
        var shaderText:string
        switch(type){
            case LoadResourceType.BACKGROUND_VERT:
                shaderText = resource as string
                if(shaderText == null){
                    throw new Error('An error occurred reading shader: background vertex shader')
                }
                this.backgroundVert = WebGlUtils.loadShader(this.gl,this.gl.VERTEX_SHADER,shaderText)
                break
            case LoadResourceType.BACKGROUND_FRAG:
                shaderText = resource as string
                if(shaderText == null){
                    throw new Error('An error occurred reading shader: background fragment shader')
                }
                this.backgroundFrag = WebGlUtils.loadShader(this.gl,this.gl.FRAGMENT_SHADER,shaderText)
                break
            case LoadResourceType.REGION_VERT:
                shaderText = resource as string
                if(shaderText == null){
                    throw new Error('An error occurred reading shader: region vertex shader')
                }
                this.regionVert = WebGlUtils.loadShader(this.gl,this.gl.VERTEX_SHADER,shaderText)
                break
            case LoadResourceType.REGION_FRAG:
                shaderText = resource as string
                if(shaderText == null){
                    throw new Error('An error occurred reading shader: region fragment shader')
                }
                this.regionFrag = WebGlUtils.loadShader(this.gl,this.gl.FRAGMENT_SHADER,shaderText)
                break
            case LoadResourceType.MAP_DATA:
                let mapData = resource as MapData
                if(mapData == null){
                    throw new Error('An error occurred reading map data')
                }
                this.map = new Map(mapData)
                break
            case LoadResourceType.GAME_DATA:
                let gameData = resource as GameData
                if(gameData == null){
                    throw new Error('An error occurred reading map data')
                }
                this.gameData = gameData.getData()
                break
        }
        this.resourcesLoaded |= type
        if(this.resourcesLoaded == (this.resourcesLoaded | (ResourceType.BACKGROUND_FRAG | ResourceType.BACKGROUND_VERT)) && this.backgroundProgram == null){
            if(this.backgroundFrag != null && this.backgroundVert != null){
                let program = WebGlUtils.initShaderProgram(this.gl,[this.backgroundVert,this.backgroundFrag])
                this.backgroundProgram = new ProgramInfo(this.gl.getAttribLocation(program,vertexAttributeName),program)
            }else{
                throw new Error('An error occurred accessing background shaders')
            }
        }
        if(this.resourcesLoaded == (this.resourcesLoaded | (ResourceType.REGION_FRAG | ResourceType.REGION_VERT)) && this.regionProgram == null){
            if(this.regionFrag != null && this.regionVert != null){
                let program = WebGlUtils.initShaderProgram(this.gl,[this.regionVert,this.regionFrag])
                this.regionProgram = new ProgramInfo(this.gl.getAttribLocation(program,vertexAttributeName),program)
            }else{
                throw new Error('An error occurred accessing region shaders')
            }
        }
        if(this.resourcesLoaded == 63){
            if(this.backgroundProgram != null && this.regionProgram!= null && this.gameData != null && this.map != null){
                this.onAllResourcesLoaded(new Game(this.gl,this.backgroundProgram,this.regionProgram,this.gameData,this.map))
            }else{
                throw new Error('An error occurred accessing game properties')
            }
        }
    }
}

export class Game{
    gl:WebGLRenderingContext
    renderingProgram:ProgramInfo
    gameData:GameData
    mapData:MapData
}

export enum LoadResourceType{
    SHADER_VERT = 1,
    SHADER_FRAG = 2,
    MAP_DATA = 4,
    GAME_DATA = 8
}
export enum MilitaryType{
    NONE = 0,
    ARMY = 1,
    FLEET = 2
}

export enum ResourceType{
    X = 0,
    Y = 1,
    Z = 2
}