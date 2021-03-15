import { ViewChild, ElementRef, Component, OnInit } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Map, MapDataDirect, RegionType } from '../game-utilities/Map'
import { Game, GameLoader, GameDataDirect, MilitaryType, Region, ResourceType } from '../game-utilities/Game'
@Component({
  selector: 'app-game-view',
  templateUrl: './game-view.component.html',
  styleUrls: ['./game-view.component.scss']
})

export class GameViewComponent implements OnInit {

  @ViewChild('gameCanvas') el?:ElementRef

  constructor(private http: HttpClient) { 

  }
  
  game?:Game
  gameCreator?:GameLoader
  canvas?:HTMLCanvasElement
  gl?:WebGLRenderingContext
  ngOnInit(): void {
    
  }

  ngAfterViewInit() {
    this.canvas = this.el?.nativeElement
    let gl = this.canvas?.getContext('webgl')
    if(gl != null){
      this.gl = gl
        this.gameCreator = new GameLoader(gl,(() => {
          let _this = this
          return function(game:Game) {
            _this.onGameCreated(game)
          }
        })() )
    }
    this.loadResource('/public/shaders/background_vert.glsl',(data:string) =>{
      this.gameCreator?.resourceLoad(ResourceType.BACKGROUND_VERT,data)
    })
    this.loadResource('/public/shaders/background_frag.glsl',(data:string) =>{
      this.gameCreator?.resourceLoad(ResourceType.BACKGROUND_FRAG,data)
    })
    this.loadResource('/public/shaders/region_vert.glsl',(data:string) =>{
      this.gameCreator?.resourceLoad(ResourceType.REGION_VERT,data)
    })
    this.loadResource('/public/shaders/region_frag.glsl',(data:string) =>{
      this.gameCreator?.resourceLoad(ResourceType.REGION_FRAG,data)
    })
    let mapVertices:[number,number][] = [[0.1,0.1],[0.1,0.5],[0.1,0.9],[0.3,0.6],[0.6,0.1],[0.6,0.5],[0.5,0.6],[0.5,0.9],[0.6,0.6],[0.6,0.9],[0.9,0.1],[0.9,0.5],[0.9,0.6],[0.9,0.9]]
    let mapRegions = [new Int32Array([0,1,3,6,5,4]), new Int32Array([1,2,7,6,3]), new Int32Array([4,10,11,5]), new Int32Array([6,5,11,12,8]), new Int32Array([6,8,9,7]), new Int32Array([8,9,13,12])]
    let mapRegionTypes = new Int32Array([RegionType.Water, RegionType.Land, RegionType.Land, RegionType.Desert, RegionType.Mountains, RegionType.Mountains])
    this.gameCreator?.resourceLoad(ResourceType.MAP_DATA,new MapDataDirect(mapVertices,mapRegions,mapRegionTypes))
    this.gameCreator?.resourceLoad(ResourceType.GAME_DATA,new GameDataDirect([
      new Region('Goblin Sea',0,0,MilitaryType.NONE),
      new Region('Trotte Plains',1,1,MilitaryType.ARMY),
      new Region('Goland Hills',2,2,MilitaryType.ARMY),
      new Region('Kreep Dessert',0,0,MilitaryType.NONE),
      new Region('Reagal Mountains',0,0,MilitaryType.NONE),
      new Region('Icy Mountains',0,0,MilitaryType.NONE)
  ]))
  }

  onGameCreated(game:Game){
    this.game = game
    if(this.canvas != null){
        game.map.drawBackground(this.canvas, game.backgroundProgram)
    }
  }

  loadResource(resource:string, onLoad:(data:string)=>void){
    this.http.get(resource,{responseType: 'text'}).subscribe({
      next: onLoad,
      error: error => {
          this.onError(error.message)
      }
    })
  }

  onError(descripion:string) {
    alert(descripion)
    console.log(descripion)
  }
}
