import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CharaterComponentComponent } from './components/dashboard/dashboard.component';
import { CharacterListComponent } from './components/dashboard/user-list/user-list.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CharacterDetailsComponent } from './components/dashboard/user-details/user-details.component';
import { CustomHeaderComponent } from './shared/custom-header/custom-header.component';
import { NgxLoadingModule } from "ngx-loading";

@NgModule({
  declarations: [
    AppComponent,
    CharaterComponentComponent,
    CharacterListComponent,
    CharacterDetailsComponent,
    CustomHeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgxLoadingModule.forRoot({}),
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
