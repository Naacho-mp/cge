import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Api } from '../../services/api.service';

@Component({
  selector: 'app-cliente-data',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './cliente-data.html',
  styleUrl: './cliente-data.css',
  standalone: true
})
export class ClienteData {
  form: FormGroup;
  estados = ['Activo', 'Inactivo'];
  esEdicion = false;
  id_cliente: string | null = null;

  constructor(
    private fb: FormBuilder,
    private api: Api,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      rut: ['', Validators.required],
      nombre_razon: ['', Validators.required],
      email_contacto: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      direccion_facturacion: ['', Validators.required],
      estado: ['Activo', Validators.required]
    });

    // detecta edición via ?id=...
    this.route.queryParams.subscribe(params => {
      this.id_cliente = params['id'] || null;
      this.esEdicion = !!this.id_cliente;
      if (this.esEdicion) {
        this.api.getCliente(this.id_cliente!).subscribe((c: any) => {
          c.estado = c.estado === 'activo' ? 'Activo' : 'Inactivo';
          this.form.patchValue(c);
        });
      }
    });
  }

  guardar() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const payload = { ...this.form.value, estado: this.form.value.estado.toLowerCase() };

    const req$ = this.esEdicion
      ? this.api.updateCliente(this.id_cliente!, payload)
      : this.api.createCliente(payload);

    req$.subscribe({
      next: () => this.router.navigate(['/inicio/listadoCliente'])
    });
  }
}

