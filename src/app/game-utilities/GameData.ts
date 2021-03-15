import { MilitaryType } from "./Game"

export class GameRegion{
    owner:number
    unit:MilitaryType
    unitOwner:number
    structures:boolean[]

    constructor(
        owner: number, 
        unit: MilitaryType, 
        unitOwner: number, 
        structures: boolean[]
    ) {
        this.owner = owner
        this.unit = unit
        this.unitOwner = unitOwner
        this.structures = structures
    }
}

export class GameData{
    regions:GameRegion[]

    constructor(regions: GameRegion[]) {
        this.regions = regions
    }
}