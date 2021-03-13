import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { GameViewComponent } from './game-view/game-view.component';
import { HomeViewComponent } from './home-view/home-view.component';

const routes: Routes = [
  { path: '', component: HomeViewComponent },
  { path: 'game', component: GameViewComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
