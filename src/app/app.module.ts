import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { HttpClientModule } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { GameViewComponent } from './game-view/game-view.component'
import { LobbyViewComponent } from './lobby-view/lobby-view.component'
import { ToolbarComponent } from './toolbar/toolbar.component'
import { HomeViewComponent } from './home-view/home-view.component'

@NgModule({
  declarations: [
    AppComponent,
    GameViewComponent,
    LobbyViewComponent,
    ToolbarComponent,
    HomeViewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
