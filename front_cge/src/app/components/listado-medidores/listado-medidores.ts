import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Api } from '../../services/api.service';

@Component({
  selector: 'app-listado-medidores',
  imports: [CommonModule, RouterModule],
  templateUrl: './listado-medidores.html',
  styleUrl: './listado-medidores.css',
  standalone: true
})
export class ListadoMedidores implements OnInit {

  medidores: any[] = [];       // lista de medidores
  loading = true;              // estado de carga
  error = '';                  // mensaje de error si falla la API

  constructor(private api: Api, private router: Router) {}

  ngOnInit() {
    this.cargarMedidores();
  }

  cargarMedidores() {
    this.loading = true;
    this.api.getMedidores().subscribe({
      next: (data: any[]) => {
        this.medidores = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'No se pudieron cargar los medidores';
        this.loading = false;
      }
    });
  }

 editar(id: number) {
  this.router.navigate(['/inicio/medidor'], { queryParams: { id } });
}
  eliminar(id: string) {
    if (confirm('¿Seguro que deseas eliminar este medidor?')) {
      this.api.deleteMedidor(id).subscribe({
        next: () => this.cargarMedidores(),
        error: () => alert('Error al eliminar medidor')
      });
    }
  }

  nuevo() {
  this.router.navigate(['/inicio/medidor']);
}

}

