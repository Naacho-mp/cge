import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Api } from '../../services/api.service';

@Component({
  selector: 'app-medidor-data',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './medidor-data.html',
  styleUrl: './medidor-data.css',
  standalone: true
})
export class MedidorData {
  form: FormGroup;
  estados = ['Activo', 'Inactivo'];
  esEdicion = false;
  id_medidor: string | null = null;

  constructor(
    private fb: FormBuilder,
    private api: Api,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      codigo_medidor: ['', Validators.required],
      id_cliente: ['', Validators.required],
      direccion_suministro: ['', Validators.required],
      estado: ['Activo', Validators.required]
    });

    this.route.queryParams.subscribe(params => {
      this.id_medidor = params['id'] || null;
      this.esEdicion = !!this.id_medidor;
      if (this.esEdicion) {
        this.api.getMedidor(this.id_medidor!).subscribe((m: any) => {
          m.estado = m.estado === 'activo' ? 'Activo' : 'Inactivo';
          this.form.patchValue(m);
        });
      }
    });
  }

  guardar() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const payload = { ...this.form.value, estado: this.form.value.estado.toLowerCase() };

    const req$ = this.esEdicion
      ? this.api.updateMedidor(this.id_medidor!, payload)
      : this.api.createMedidor(payload);

    req$.subscribe({
      next: () => this.router.navigate(['/inicio/listadoMedidor'])
    });
  }
}
