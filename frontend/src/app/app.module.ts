import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MqttModule } from 'ngx-mqtt';

import { AppComponent } from './app.component';
import { ListaComponent } from './lista/lista.component';
import { FormsComponent } from './forms/forms.component';
import { DadosService } from './dados.service';
import { MqttComponent } from './mqtt/mqtt.component';

/* Imports do primeng  */
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { HttpClientModule } from '@angular/common/http';
import { InputNumberModule } from 'primeng/inputnumber';
import { LoginComponent } from './login/login.component';



@NgModule({
  declarations: [
    AppComponent,
    ListaComponent,
    FormsComponent,
    MqttComponent,
    LoginComponent
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
    InputNumberModule,
    MqttModule.forRoot({
      hostname: 'test.mosquitto.org',
      port: 8883,
      protocol: 'wss'
    }),
  ],
  providers: [DadosService],
  bootstrap: [AppComponent]
})
export class AppModule { }
