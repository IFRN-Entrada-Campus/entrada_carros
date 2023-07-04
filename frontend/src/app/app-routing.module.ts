import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListaComponent } from './lista/lista.component';
import { FormsComponent } from './forms/forms.component';
import { MqttComponent } from './mqtt/mqtt.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
    { path:'lista', component: ListaComponent, canActivate: [AuthGuard] },
    { path:'forms', component: FormsComponent, canActivate: [AuthGuard] },
    { path:'', component: ListaComponent, canActivate: [AuthGuard] },
    { path:'mqtt', component: MqttComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }