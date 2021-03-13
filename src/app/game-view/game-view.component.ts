import { ViewChild, ElementRef, Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Map, RegionType } from '../game-utilities/Map'
@Component({
  selector: 'app-game-view',
  templateUrl: './game-view.component.html',
  styleUrls: ['./game-view.component.scss']
})

export class GameViewComponent implements OnInit {

  @ViewChild('gameCanvas') el?:ElementRef;

  constructor(private http: HttpClient) { }
  
  ngOnInit(): void {
    
  }

  ngAfterViewInit() {
    console.log('l');
    this.http.get('/public/shaders',{responseType: 'text'}).subscribe({
        next: data => {
          console.log(data);
        },
        error: error => {
            console.error('There was an error!', error);
        }
    })
    // let canvas = this.el?.nativeElement;
    // let mapVertices:[number,number][] = [[0.1,0.1],[0.1,0.5],[0.1,0.9],[0.3,0.6],[0.6,0.1],[0.6,0.5],[0.5,0.6],[0.5,0.9],[0.6,0.6],[0.6,0.9],[0.9,0.1],[0.9,0.5],[0.9,0.6],[0.9,0.9]];
    // let mapRegions = [new Int32Array([0,1,3,6,5,4]), new Int32Array([1,2,7,6,3]), new Int32Array([4,10,11,5]), new Int32Array([6,5,11,12,8]), new Int32Array([6,8,9,7]), new Int32Array([8,9,13,12])];
    // let mapRegionTypes = new Int32Array([RegionType.Water, RegionType.Land, RegionType.Land, RegionType.Desert, RegionType.Mountains, RegionType.Mountains]);
    // let map = new Map(mapVertices,mapRegions,mapRegionTypes,
  }
}
