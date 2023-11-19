import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormEstudanteComponent } from './pages/form-estudante/form-estudante.component';
import { ListaEstudanteComponent } from './pages/lista-estudante/lista-estudante.component';

const routes: Routes = [
  { path: '', component: ListaEstudanteComponent },
  {
    path: 'cadastrar-estudante',
    component: FormEstudanteComponent,
  },
  {
    path: 'editar-estudante/:id',
    component: FormEstudanteComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
