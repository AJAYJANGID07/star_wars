import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CharaterComponentComponent } from './components/character-component/character-component.component';
import { CharacterListComponent } from './components/character-component/character-list/character-list.component';

@NgModule({
  declarations: [
    AppComponent,
    CharaterComponentComponent,
    CharacterListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
