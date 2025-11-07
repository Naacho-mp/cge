import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Api } from '../../services/api.service';

@Component({
  selector: 'app-lectura-data',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './lectura-data.html',
  styleUrl: './lectura-data.css'
})
export class LecturaData {
  form: FormGroup;
  esEdicion = false;
  id_lectura: string | null = null;
  guardando = false;

  // 👇 opcional: si NO quieres mensajes en pantalla, puedes borrar esta línea y cualquier uso de `mensaje`
  mensaje: string | null = null;

  constructor(
    private fb: FormBuilder,
    private api: Api,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      id_medidor: ['', Validators.required],
      anio: [new Date().getFullYear(), [Validators.required, Validators.min(2000), Validators.max(2100)]],
      mes: [new Date().getMonth() + 1, [Validators.required, Validators.min(1), Validators.max(12)]],
      lectura_kwh: [0, [Validators.required, Validators.min(0)]],
      observacion: ['']
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.esEdicion = true;
        this.id_lectura = id;
        this.api.getLectura(id).subscribe({
          next: (l) => this.form.patchValue(l),
          error: (e) => console.error('No se pudo cargar la lectura:', e)
        });
      }
    });
  }

  guardar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      // silencioso: no mostramos alertas
      console.warn('Formulario de lectura inválido:', this.form.value);
      return;
    }

    this.guardando = true;
    const body = this.form.value;

    const req$ = (this.esEdicion && this.id_lectura)
      ? this.api.updateLectura(this.id_lectura, body)
      : this.api.createLectura(body);

    req$.subscribe({
      next: () => {
        // ✅ modo silencioso: solo navegamos
        // Si quieres feedback visual, descomenta 3 líneas siguientes y añade el *ngIf en el HTML.
        // this.mensaje = this.esEdicion ? 'Lectura actualizada' : 'Lectura registrada';
        // setTimeout(() => this.mensaje = null, 2500);
        this.router.navigate(['/inicio/listadoLecturas']); // ajusta si usas un listado de lecturas
      },
      error: (e) => {
        // silencioso: solo log
        console.error('No se pudo guardar la lectura:', e);
      },
      complete: () => (this.guardando = false)
    });
  }

  volverListado() {
    this.router.navigate(['/inicio/lectura']); // o a tu ruta de listado si la tienes separada
  }
}



