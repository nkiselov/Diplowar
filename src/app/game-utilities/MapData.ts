export class MapRegion{
    name:string
    connections:number[]
    resources:number[]
    triangles:Uint16Array
    vertices:Float32Array

    constructor(
        name: string, 
        connections: number[], 
        resources: number[], 
        triangles: Uint16Array, 
        vertices: Float32Array
    ) {
        this.name = name
        this.connections = connections
        this.resources = resources
        this.triangles = triangles
        this.vertices = vertices
    }
}

export class MapData{
    regions:MapRegion[]

    constructor(regions: MapRegion[]) {
        this.regions = regions
    }
}

export class MapDataRaw{
    names:string[]
    regionTypes:number[]
    connections:number[][]
    resources:number[][]
    regions:number[]
    vertices:[number,number][]

    constructor(
        names: string[], 
        regionTypes: number[], 
        connections: number[][], 
        resources: number[][], 
        regions: number[], 
        vertices: [number,number][]
    ) {
        this.names = names
        this.regionTypes = regionTypes
        this.connections = connections
        this.resources = resources
        this.regions = regions
        this.vertices = vertices
    }
}