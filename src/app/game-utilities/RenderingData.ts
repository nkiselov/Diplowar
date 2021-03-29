import { ResourceLoader } from "./ResourceLoader"
import { WebGlUtils } from "./WebGlUtils"
import { base64ArrayBuffer } from './base64'
export class RenderingData{
    resourceSrcs:string[]
    structureImages:[HTMLImageElement,HTMLImageElement][]
    unitImages:[HTMLImageElement,HTMLImageElement][]
    shader:WebGLProgram

    constructor(
        resourceSrcs: string[], 
        structureImages: [HTMLImageElement,HTMLImageElement][], 
        unitImages: [HTMLImageElement,HTMLImageElement][], 
        shader: WebGLProgram
    ) {
        this.resourceSrcs = resourceSrcs
        this.structureImages = structureImages
        this.unitImages = unitImages
        this.shader = shader
    }
}

export class RenderingDataCooker{
    resourceSrcs:string[]
    structureImages:[HTMLImageElement,HTMLImageElement][]
    unitImages:[HTMLImageElement,HTMLImageElement][]
    shaderSrcs:[string,string]
    shader?:WebGLProgram
    dataRaw:RenderingDataRaw
    gl?:WebGLRenderingContext

    onLoad:(data:RenderingData)=>void
    onError:(err:Error)=>void
    resourcesCooked:number
    resourcesExpected:number
    shadersLoaded:number

    constructor(dataRaw:RenderingDataRaw, gl:WebGLRenderingContext, onLoad:(data:RenderingData)=>void, onError:(err:Error)=>void){
        this.resourceSrcs = new Array(dataRaw.resourceBlobs.length)
        this.structureImages = new Array(dataRaw.structureBlobs.length)
        for(var i=0; i<this.structureImages.length; i++){
            this.structureImages[i] = {} as [HTMLImageElement,HTMLImageElement]
        }
        this.unitImages = new Array(dataRaw.unitBlobs.length)
        for(var i=0; i<this.unitImages.length; i++){
            this.unitImages[i] = {} as [HTMLImageElement,HTMLImageElement]
        }
        this.dataRaw = dataRaw
        this.shaderSrcs = {} as [string,string]
        
        this.onLoad = onLoad
        this.onError = onError
        this.shadersLoaded = 0
        this.resourcesCooked = 0
        this.resourcesExpected = 2 * (dataRaw.structureBlobs.length + dataRaw.unitBlobs.length) + 2 + dataRaw.resourceBlobs.length
        this.gl = gl
        for(var i=0; i<this.dataRaw.resourceBlobs.length; i++){
            let finalI = i
            let blob = this.dataRaw.resourceBlobs[i]
            blob.arrayBuffer().then((buffer:ArrayBuffer)=>
                this.resourceCooked('data:' + blob.type + ';base64,'+ base64ArrayBuffer(buffer),RenderingDataResourceType.RESOURCRE_IMAGE,finalI))
        }
        for(var i=0; i<this.dataRaw.structureBlobs.length; i++){
            let finalI = i
            let blob1 = this.dataRaw.structureBlobs[i][0]
            blob1.arrayBuffer().then((buffer:ArrayBuffer)=>{
                let img = document.createElement('img')
                img.src = 'data:' + blob1.type + ';base64,'+ base64ArrayBuffer(buffer)
                img.onload = (evnt)=>this.resourceCooked(evnt.target,RenderingDataResourceType.STRUCTURE_IMAGE_BACK,finalI)
            }).catch(this.onError)
            let blob2 = this.dataRaw.structureBlobs[i][1]
            blob2.arrayBuffer().then((buffer:ArrayBuffer)=>{
                let img = document.createElement('img')
                img.src = 'data:' + blob2.type + ';base64,'+ base64ArrayBuffer(buffer)
                img.onload = (evnt)=>this.resourceCooked(evnt.target,RenderingDataResourceType.STRUCTURE_IMAGE,finalI)
            }).catch(this.onError)
        }
        for(var i=0; i<this.dataRaw.unitBlobs.length; i++){
            let finalI = i
            let blob1 = this.dataRaw.unitBlobs[i][0]
            blob1.arrayBuffer().then((buffer:ArrayBuffer)=>{
                let img = document.createElement('img')
                img.src = 'data:' + blob1.type + ';base64,'+ base64ArrayBuffer(buffer)
                img.onload = (evnt)=>this.resourceCooked(evnt.target,RenderingDataResourceType.UNIT_IMAGE_BACK,finalI)
            }).catch(this.onError)
            let blob2 = this.dataRaw.unitBlobs[i][1]
            blob2.arrayBuffer().then((buffer:ArrayBuffer)=>{
                let img = document.createElement('img')
                img.src = 'data:' + blob2.type + ';base64,'+ base64ArrayBuffer(buffer)
                img.onload = (evnt)=>this.resourceCooked(evnt.target,RenderingDataResourceType.UNIT_IMAGE,finalI)
            }).catch(this.onError)
        }
        this.dataRaw.shaderBlobs[0].text().then((str:string)=>this.resourceCooked(str,RenderingDataResourceType.SHADER_VERT,0))
        this.dataRaw.shaderBlobs[1].text().then((str:string)=>this.resourceCooked(str,RenderingDataResourceType.SHADER_FRAG,0))
    }

    resourceCooked(resource:any, type:RenderingDataResourceType, index:number){
        let bitmap = resource as HTMLImageElement
        let str = resource as string
        try{
            switch(type){
                case RenderingDataResourceType.RESOURCRE_IMAGE:
                    if(str == null){
                        throw new Error('Expected string, but recieved ' + (typeof resource))
                    }
                    this.resourceSrcs[index] = str
                    break
                case RenderingDataResourceType.STRUCTURE_IMAGE_BACK:
                    if(bitmap == null){
                        throw new Error('Expected HTMLImageElement, but recieved ' + (typeof resource))
                    }
                    this.structureImages[index][0] = bitmap
                    break
                case RenderingDataResourceType.STRUCTURE_IMAGE:
                    if(bitmap == null){
                        throw new Error('Expected HTMLImageElement, but recieved ' + (typeof resource))
                    }
                    this.structureImages[index][1] = bitmap
                    break
                case RenderingDataResourceType.UNIT_IMAGE_BACK:
                    if(bitmap == null){
                        throw new Error('Expected HTMLImageElement, but recieved ' + (typeof resource))
                    }
                    this.unitImages[index][0] = bitmap
                    break
                case RenderingDataResourceType.UNIT_IMAGE:
                    if(bitmap == null){
                        throw new Error('Expected HTMLImageElement, but recieved ' + (typeof resource))
                    }
                    this.unitImages[index][1] = bitmap
                    break
                case RenderingDataResourceType.SHADER_VERT:
                    if(str == null){
                        throw new Error('Expected string, but recieved ' + (typeof resource))
                    }
                    this.shaderSrcs[0] = str
                    this.shadersLoaded+=1
                    break
                case RenderingDataResourceType.SHADER_FRAG:
                    if(str == null){
                        throw new Error('Expected string, but recieved ' + (typeof resource))
                    }
                    this.shaderSrcs[1] = str
                    this.shadersLoaded+=1
                    break
            }
            this.resourcesCooked+=1
            if(this.shadersLoaded == 2){
                if(this.gl == null){
                    throw new Error('Rendering context is null')
                }
                this.shader = WebGlUtils.initShaderProgram(this.gl,[WebGlUtils.loadShader(this.gl,this.gl.VERTEX_SHADER,this.shaderSrcs[0]),WebGlUtils.loadShader(this.gl,this.gl.FRAGMENT_SHADER,this.shaderSrcs[1])])
            }
            if(this.resourcesCooked == this.resourcesExpected){
                if(this.shader == null){
                    throw new Error('Shader program is null')
                }
                this.onLoad(new RenderingData(this.resourceSrcs,this.structureImages,this.unitImages,this.shader))
            }
        }catch(err){
            this.onError(err)
        }
    }
}

export class RenderingDataRaw{
    resourceBlobs:Blob[]
    structureBlobs:[Blob,Blob][]
    unitBlobs:[Blob,Blob][]
    shaderBlobs:[Blob,Blob]

    constructor(
        resourceBlobs: Blob[], 
        structureBlobs: [Blob,Blob][], 
        unitBlobs: [Blob,Blob][], 
        shaderBlobs: [Blob,Blob]
    ) {
        this.resourceBlobs = resourceBlobs
        this.structureBlobs = structureBlobs
        this.unitBlobs = unitBlobs
        this.shaderBlobs = shaderBlobs
    }
}

export class RenderingDataSpecification{
    resourceURIs:string[]
    structureURIs:[string,string][]
    unitURIs:[string,string][]
    shaderURIs:[string,string]

    constructor(
        resourceURIs: string[], 
        structureURIs: [string,string][], 
        unitURIs: [string,string][], 
        shaderURIs: [string,string]
    ) {
        this.resourceURIs = resourceURIs
        this.structureURIs = structureURIs
        this.unitURIs = unitURIs
        this.shaderURIs = shaderURIs
    }
}

export class RenderingDataLoader{
    resourceBlobs:Blob[]
    structureBlobs:[Blob,Blob][]
    unitBlobs:[Blob,Blob][]
    shaderBlobs:[Blob,Blob]

    specification:RenderingDataSpecification

    onLoad:(data:RenderingDataRaw)=>void
    onError:(err:Error)=>void
    resourcesLoaded:number
    resourcesExpected:number

    constructor(specification:RenderingDataSpecification, loader:ResourceLoader, onLoad:(data:RenderingDataRaw)=>void, onError:(err:Error)=>void){
        this.resourceBlobs = new Array<Blob>(specification.resourceURIs.length)
        this.structureBlobs = new Array<[Blob,Blob]>(specification.structureURIs.length)
        for(var i=0; i<this.structureBlobs.length; i++){
            this.structureBlobs[i] = {} as [Blob,Blob]
        }
        this.unitBlobs = new Array<[Blob,Blob]>(specification.unitURIs.length)
        for(var i=0; i<this.unitBlobs.length; i++){
            this.unitBlobs[i] = {} as [Blob,Blob]
        }
        this.shaderBlobs = {} as [Blob,Blob]

        this.specification = specification

        this.onLoad = onLoad
        this.onError = onError
        this.resourcesLoaded = 0
        this.resourcesExpected = 2 * (specification.structureURIs.length + specification.unitURIs.length) + 2 + specification.resourceURIs.length
        for(var i=0; i<this.specification.resourceURIs.length; i++){
            let finalI = i
            loader.load(this.specification.resourceURIs[i],(blob)=>this.resourceLoaded(blob,RenderingDataResourceType.RESOURCRE_IMAGE,finalI),this.onError)
        }
        for(var i=0; i<this.specification.structureURIs.length; i++){
            let finalI = i
            loader.load(this.specification.structureURIs[i][0],(blob)=>this.resourceLoaded(blob,RenderingDataResourceType.STRUCTURE_IMAGE_BACK,finalI),this.onError)
            loader.load(this.specification.structureURIs[i][1],(blob)=>this.resourceLoaded(blob,RenderingDataResourceType.STRUCTURE_IMAGE,finalI),this.onError)
        }
        for(var i=0; i<this.specification.unitURIs.length; i++){
            let finalI = i
            loader.load(this.specification.unitURIs[i][0],(blob)=>this.resourceLoaded(blob,RenderingDataResourceType.UNIT_IMAGE_BACK,finalI),this.onError)
            loader.load(this.specification.unitURIs[i][1],(blob)=>this.resourceLoaded(blob,RenderingDataResourceType.UNIT_IMAGE,finalI),this.onError)
        }
        loader.load(this.specification.shaderURIs[0],(blob)=>this.resourceLoaded(blob,RenderingDataResourceType.SHADER_VERT,0),this.onError)
        loader.load(this.specification.shaderURIs[1],(blob)=>this.resourceLoaded(blob,RenderingDataResourceType.SHADER_FRAG,0),this.onError)
    }

    resourceLoaded(blob:Blob, type:RenderingDataResourceType, index:number){
        try{
            switch(type){
                case RenderingDataResourceType.RESOURCRE_IMAGE:
                    this.resourceBlobs[index] = blob
                    break
                case RenderingDataResourceType.STRUCTURE_IMAGE_BACK:
                    this.structureBlobs[index][0] = blob
                    break
                case RenderingDataResourceType.STRUCTURE_IMAGE:
                    this.structureBlobs[index][1] = blob
                    break
                case RenderingDataResourceType.UNIT_IMAGE_BACK:
                    this.unitBlobs[index][0] = blob
                    break
                case RenderingDataResourceType.UNIT_IMAGE:
                    this.unitBlobs[index][1] = blob
                    break
                case RenderingDataResourceType.SHADER_VERT:
                    this.shaderBlobs[0] = blob
                    break
                case RenderingDataResourceType.SHADER_FRAG:
                    this.shaderBlobs[1] = blob
                    break
            }
            this.resourcesLoaded+=1
            if(this.resourcesLoaded == this.resourcesExpected){
                this.onLoad(new RenderingDataRaw(this.resourceBlobs,this.structureBlobs,this.unitBlobs,this.shaderBlobs))
            }
        }catch(err){
            this.onError(err)
        }
    }
}


export enum RenderingDataResourceType{
    RESOURCRE_IMAGE = 0,
    STRUCTURE_IMAGE_BACK = 1,
    STRUCTURE_IMAGE = 2,
    UNIT_IMAGE_BACK = 3,
    UNIT_IMAGE = 4,
    SHADER_VERT = 5,
    SHADER_FRAG = 6
}