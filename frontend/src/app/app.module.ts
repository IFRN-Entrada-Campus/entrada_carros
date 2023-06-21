import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NoopAnimationPlayer } from '@angular/animations';

import { AppComponent } from './app.component';
import { ListaComponent } from './lista/lista.component';
import { FormsComponent } from './forms/forms.component';
import { DadosService } from './dados.service';

/* Imports do primeng  */
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { HttpClientModule } from '@angular/common/http';
import { InputNumberModule } from 'primeng/inputnumber';


@NgModule({
  declarations: [
    AppComponent,
    ListaComponent,
    FormsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    InputTextModule,
    FormsModule,
    CheckboxModule,
    TableModule,
    ButtonModule,
    HttpClientModule,
    InputNumberModule
  ],
  providers: [DadosService],
  bootstrap: [AppComponent]
})
export class AppModule { }
