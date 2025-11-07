import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Api } from '../../services/api.service';

@Component({
  selector: 'app-listado-lecturas',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './listado-lecturas.html',
  styleUrl: './listado-lecturas.css'
})
export class ListadoLecturas {
  lecturas: any[] = [];
  cargando = false;
  error = '';

  constructor(private api: Api) {
    this.cargarLecturas();
  }

  cargarLecturas() {
    this.cargando = true;
    this.api.getLecturas().subscribe({
      next: (data) => {
        this.lecturas = data;
        this.cargando = false;
      },
      error: (err) => {
        this.error = 'No se pudieron cargar las lecturas.';
        this.cargando = false;
      }
    });
  }

  eliminar(id: string) {
    if (confirm('¿Seguro que deseas eliminar esta lectura?')) {
      this.api.deleteLectura(id).subscribe({
        next: () => this.cargarLecturas(),
        error: () => alert('Error al eliminar lectura')
      });
    }
  }

  nuevo() {
    window.location.href = '/inicio/lectura';
  }
}
