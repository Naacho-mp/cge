import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Api } from '../../services/api.service';

@Component({
  selector: 'app-listado-cliente',
  imports: [CommonModule, RouterModule],
  templateUrl: './listado-cliente.html',
  styleUrl: './listado-cliente.css',
  standalone: true
})
export class ListadoCliente implements OnInit {

  clientes: any[] = [];        // lista de clientes
  loading = true;              // estado de carga
  error = '';                  // mensaje de error si falla la API

  constructor(private api: Api, private router: Router) {}

  ngOnInit() {
    this.cargarClientes();
  }

  cargarClientes() {
    this.loading = true;
    this.api.getClientes().subscribe({
      next: (data: any[]) => {
        this.clientes = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'No se pudieron cargar los clientes';
        this.loading = false;
      }
    });
  }

  editar(id: number) {
  this.router.navigate(['/inicio/cliente'], { queryParams: { id } });
}

  eliminar(id: string) {
    if (confirm('¿Seguro que deseas eliminar este cliente?')) {
      this.api.deleteCliente(id).subscribe({
        next: () => this.cargarClientes(),
        error: () => alert('Error al eliminar cliente')
      });
    }
  }

  nuevo() {
  this.router.navigate(['/inicio/cliente']);
}

}
