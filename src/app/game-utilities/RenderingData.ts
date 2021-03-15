import { ResourceLoader } from "@angular/compiler"

export class RenderingData{
    resourceImages:ImageData[]
    backgroundTextures:WebGLTexture[]
    program:WebGLProgram
}

export class RenderingDataRaw{
    resourceImages:ImageData[]
    backgroundTextures:ImageData[]
    stuctureImages:ImageData[]
    unitImages:ImageData[]

    constructor(
        resourceImages: ImageData[], 
        backgroundTextures: ImageData[], 
        stuctureImages: ImageData[], 
        unitImages: ImageData[]
    ) {
        this.resourceImages = resourceImages
        this.backgroundTextures = backgroundTextures
        this.stuctureImages = stuctureImages
        this.unitImages = unitImages
    }
}

export class RenderingDataSpecification{
    resourceImages:string[]
    backgroundTextures:string[]
    stuctureImages:string[]
    unitImages:string[]
    shaders:[string,string]

    constructor(
        resourceImages: string[], 
        backgroundTextures: string[], 
        stuctureImages: string[], 
        unitImages: string[],
        shaders:[string,string]
    ) {
        this.resourceImages = resourceImages
        this.backgroundTextures = backgroundTextures
        this.stuctureImages = stuctureImages
        this.unitImages = unitImages
        this.shaders = shaders
    }
}

export class RenderingDataLoader{
    resourceImages:ImageData[]
    backgroundTextures:ImageData[]
    stuctureImages:ImageData[]
    unitImages:ImageData[]

    specification:RenderingDataSpecification

    onLoad:(data:RenderingDataRaw)=>void
    resourcesLoaded:number
    resourcesExpected:number
    loader:ResourceLoader

    constructor(specification:RenderingDataSpecification, loader:ResourceLoader, onLoad:(data:RenderingDataRaw)=>void){
        this.resourceImages = new Array<ImageData>(specification.resourceImages.length)
        this.backgroundTextures = new Array<ImageData>(specification.backgroundTextures.length)
        this.stuctureImages = new Array<ImageData>(specification.stuctureImages.length)
        this.unitImages = new Array<ImageData>(specification.unitImages.length)

        this.specification = specification

        this.onLoad = onLoad
        this.resourcesLoaded = 0
        this.resourcesExpected = specification.resourceImages.length + specification.backgroundTextures.length + specification.stuctureImages.length + specification.unitImages.length
        this.loader = loader
    }

    
}


export enum RenderingDataResourceType{
    RESOURCRE_IMAGE = 0,
    BACKGROUND_IMAGE = 1,
    STRUCTURE_IMAGE = 2,
    UNIT_IMAGE = 3
}