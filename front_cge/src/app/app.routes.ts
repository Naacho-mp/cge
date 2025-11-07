import { Routes } from '@angular/router';
import {ClienteData} from './components/cliente-data/cliente-data';
import {LecturaData} from './components/lectura-data/lectura-data';
import {MedidorData} from './components/medidor-data/medidor-data';
import {Home} from './pages/home/home';
import {BoletaData} from './components/boleta-data/boleta-data';
import {ListadoCliente} from './components/listado-cliente/listado-cliente';
import {ListadoMedidores} from './components/listado-medidores/listado-medidores';


export const routes: Routes = [
  {path: '', redirectTo: 'inicio', pathMatch: 'full'},

  {
    path: 'inicio',
    component: Home,
    children: [
      {path: '', redirectTo:'inicio', pathMatch: 'full'},
      {path: 'cliente', component: ClienteData},
      {path: 'lectura', component: LecturaData},
      {path: 'medidor', component: MedidorData},
      {path: 'boleta', component: BoletaData},
      {path: 'listadoCliente', component: ListadoCliente},
      {path: 'listadoMedidor', component: ListadoMedidores},

    ]
  },

  {path: '**', redirectTo: 'inicio'}
];
