import { ViewChild, ElementRef, Component, OnInit } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { RenderingData, RenderingDataCooker, RenderingDataLoader, RenderingDataRaw, RenderingDataSpecification } from '../game-utilities/RenderingData'
import { HttpResourceLoader } from '../game-utilities/ResourceLoader'
import { ProgramInfo, WebGlUtils } from '../game-utilities/WebGlUtils'
import { isGeneratedFile } from '@angular/compiler/src/aot/util'

@Component({
  selector: 'app-game-view',
  templateUrl: './game-view.component.html',
  styleUrls: ['./game-view.component.scss']
})

export class GameViewComponent implements OnInit {

  @ViewChild('gameCanvas') elc?:ElementRef
  @ViewChild('image') eli?:ElementRef

  constructor(private http: HttpClient) { 

  }
  
  canvas?:HTMLCanvasElement
  ngOnInit(): void {
    
  }

  ngAfterViewInit() {
    this.canvas = this.elc?.nativeElement
    let loader = new RenderingDataLoader(new RenderingDataSpecification(['/public/standardResourcePack/Hardsoftacids.png'],[],[['/favicon.ico','/favicon.ico']],['/public/shaders/region_vert.glsl','/public/shaders/region_frag.glsl']),new HttpResourceLoader(this.http), (data)=>this.onLoad(data),this.onError)
  //   let gl = this.canvas?.getContext('webgl')
  //   if(gl != null){
  //     this.gl = gl
  //       this.gameCreator = new GameLoader(gl,(() => {
  //         let _this = this
  //         return function(game:Game) {
  //           _this.onGameCreated(game)
  //         }
  //       })() )
  //   }
  //   this.loadResource('/public/shaders/background_vert.glsl',(data:string) =>{
  //     this.gameCreator?.resourceLoad(ResourceType.BACKGROUND_VERT,data)
  //   })
  //   this.loadResource('/public/shaders/background_frag.glsl',(data:string) =>{
  //     this.gameCreator?.resourceLoad(ResourceType.BACKGROUND_FRAG,data)
  //   })
  //   this.loadResource('/public/shaders/region_vert.glsl',(data:string) =>{
  //     this.gameCreator?.resourceLoad(ResourceType.REGION_VERT,data)
  //   })
  //   this.loadResource('/public/shaders/region_frag.glsl',(data:string) =>{
  //     this.gameCreator?.resourceLoad(ResourceType.REGION_FRAG,data)
  //   })
  //   let mapVertices:[number,number][] = [[0.1,0.1],[0.1,0.5],[0.1,0.9],[0.3,0.6],[0.6,0.1],[0.6,0.5],[0.5,0.6],[0.5,0.9],[0.6,0.6],[0.6,0.9],[0.9,0.1],[0.9,0.5],[0.9,0.6],[0.9,0.9]]
  //   let mapRegions = [new Int32Array([0,1,3,6,5,4]), new Int32Array([1,2,7,6,3]), new Int32Array([4,10,11,5]), new Int32Array([6,5,11,12,8]), new Int32Array([6,8,9,7]), new Int32Array([8,9,13,12])]
  //   let mapRegionTypes = new Int32Array([RegionType.Water, RegionType.Land, RegionType.Land, RegionType.Desert, RegionType.Mountains, RegionType.Mountains])
  //   this.gameCreator?.resourceLoad(ResourceType.MAP_DATA,new MapDataDirect(mapVertices,mapRegions,mapRegionTypes))
  //   this.gameCreator?.resourceLoad(ResourceType.GAME_DATA,new GameDataDirect([
  //     new Region('Goblin Sea',0,0,MilitaryType.NONE),
  //     new Region('Trotte Plains',1,1,MilitaryType.ARMY),
  //     new Region('Goland Hills',2,2,MilitaryType.ARMY),
  //     new Region('Kreep Dessert',0,0,MilitaryType.NONE),
  //     new Region('Reagal Mountains',0,0,MilitaryType.NONE),
  //     new Region('Icy Mountains',0,0,MilitaryType.NONE)
  // ]))
  }

  // onGameCreated(game:Game){
  //   this.game = game
  //   if(this.canvas != null){
  //       game.map.drawBackground(this.canvas, game.backgroundProgram)
  //   }
  // }

  // loadResource(resource:string, onLoad:(data:string)=>void){
  //   this.http.get(resource,{responseType: 'text'}).subscribe({
  //     next: onLoad,
  //     error: error => {
  //         this.onError(error.message)
  //     }
  //   })
  // }

  onError(err:Error) {
    throw err
  }
  canvas3d?:HTMLCanvasElement
  gl?:WebGLRenderingContext

  onLoad(data:RenderingDataRaw){
    console.log(data)
      this.canvas3d = document.createElement('canvas')
      this.canvas3d.width = 2000
      this.canvas3d.height = 1000
      this.gl = this.canvas3d?.getContext('webgl') as WebGLRenderingContext
      if(this.gl == null){
        this.onError(new Error('WebGlContext is null'))
        return
      }
      let cooker = new RenderingDataCooker(data,this.gl,(data) => this.onLoadFinal(data),this.onError)
  }

  onLoadFinal(data:RenderingData){
    console.log(data)
    let ctx = this.canvas?.getContext('2d')
    if(ctx == null){
      return
    }
    if(this.gl == null){
      return
    }
    if(this.canvas3d == null){
      return
    }
    let programInfo = new ProgramInfo(this.gl.getAttribLocation(data.shader,'vertexPosition'),data.shader)
    WebGlUtils.runShaderProgram(this.gl,programInfo,new Float32Array([-1.0,  1.0,
                  1.0,  1.0,
                  -1.0, -1.0,
                  1.0, -1.0]),new Uint16Array([0,1,3,0,2,3]) )
      
    ctx.drawImage(data.unitImages[0][0],0,0)
    ctx.drawImage(this.canvas3d,0,0)
    let img = this.eli?.nativeElement as HTMLImageElement
    if (img != null){
      console.log(data.resourceSrcs[0])
      img.src = data.resourceSrcs[0]
    }
  }
}
