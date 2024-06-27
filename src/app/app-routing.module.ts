import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { CharaterComponentComponent } from './components/character-component/character-component.component';
import { CharacterListComponent } from './components/character-component/character-list/character-list.component';

const routes: Routes = [
  {
    path: '', 
    component: CharacterListComponent, 
    children: [
      {
        path: 'character-list', component: CharacterListComponent
      },
    ]
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
