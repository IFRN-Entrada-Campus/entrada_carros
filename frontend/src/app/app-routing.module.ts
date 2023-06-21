import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListaComponent } from './lista/lista.component';
import { FormsComponent } from './forms/forms.component';

const routes: Routes = [
    { path:'lista', component: ListaComponent },
    { path:'forms', component: FormsComponent },
    { path:'', component: ListaComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }