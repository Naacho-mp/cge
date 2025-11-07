import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Api } from '../../services/api.service';
import { of, switchMap, tap, catchError } from 'rxjs';

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

  // catálogos
  clientes: any[] = [];
  medidores: any[] = [];
  cargandoMedidores = false;

  // opcional
  mensaje: string | null = null;

  constructor(
    private fb: FormBuilder,
    private api: Api,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      // 🔹 primero el cliente; con esto cargamos los medidores
      id_cliente: ['', Validators.required],
      // 🔹 el medidor se elige desde la lista filtrada por cliente
      id_medidor: ['', Validators.required],

      anio: [new Date().getFullYear(), [Validators.required, Validators.min(2000), Validators.max(2100)]],
      mes: [new Date().getMonth() + 1, [Validators.required, Validators.min(1), Validators.max(12)]],
      lectura_kwh: [0, [Validators.required, Validators.min(0)]],
      observacion: ['']
    });
  }

  ngOnInit() {
    // 1) Cargar clientes de entrada
    this.api.getClientes().subscribe({
      next: (rows) => (this.clientes = rows ?? []),
      error: () => (this.clientes = [])
    });

    // 2) Cuando cambia el cliente ⇒ cargar medidores de ese cliente
    this.form.get('id_cliente')!.valueChanges.pipe(
      tap(() => {
        this.cargandoMedidores = true;
        this.medidores = [];
        this.form.get('id_medidor')!.reset('');
      }),
      switchMap((idCliente: string) => {
        if (!idCliente) return of([]);
        return this.api.getMedidores({ cliente_id: idCliente }).pipe(
          catchError(() => of([]))
        );
      }),
      tap(() => (this.cargandoMedidores = false))
    ).subscribe((lista: any[]) => {
      this.medidores = lista || [];
      // autoselección si hay solo un medidor
      if (this.medidores.length === 1) {
        this.form.get('id_medidor')!.setValue(this.medidores[0].id_medidor);
      }
    });

    // 3) Modo edición: ?id=123 ⇒ cargar lectura y resolver cliente/medidor
    this.route.queryParams.pipe(
      switchMap(params => {
        const id = params['id'];
        if (!id) return of(null);
        this.esEdicion = true;
        this.id_lectura = id;
        return this.api.getLectura(id).pipe(catchError(() => of(null)));
      }),
      // con la lectura cargada, necesitamos su medidor ⇒ cliente
      switchMap((lec: any) => {
        if (!lec) return of(null);
        // parchamos lo que ya tenemos (anio, mes, lectura_kwh, observación)
        this.form.patchValue({
          anio: lec.anio,
          mes: lec.mes,
          lectura_kwh: lec.lectura_kwh ?? 0,
          observacion: lec.observacion ?? ''
        }, { emitEvent: false });

        // intentar obtener el medidor para saber su cliente
        if (this.api.getMedidor) {
          return this.api.getMedidor(lec.id_medidor).pipe(
            tap((m: any) => {
              // setear cliente ⇒ gatilla carga de medidores
              this.form.get('id_cliente')!.setValue(m.id_cliente);
            }),
            // guardamos el id_medidor para setearlo después de cargar la lista
            switchMap((m: any) => {
              return this.api.getMedidores({ cliente_id: m.id_cliente }).pipe(
                tap((lista: any[]) => {
                  this.medidores = lista || [];
                  this.form.get('id_medidor')!.setValue(lec.id_medidor);
                }),
                catchError(() => of(null))
              );
            }),
            catchError(() => {
              // fallback: si no existe getMedidor en el service
              return this.api.getMedidores().pipe(
                tap((lista: any[]) => {
                  this.medidores = lista || [];
                  const medidor = (lista || []).find((x: any) => x.id_medidor === lec.id_medidor);
                  if (medidor) {
                    this.form.get('id_cliente')!.setValue(medidor.id_cliente);
                    this.form.get('id_medidor')!.setValue(lec.id_medidor);
                  }
                }),
                catchError(() => of(null))
              );
            })
          );
        } else {
          // fallback sin getMedidor
          return this.api.getMedidores().pipe(
            tap((lista: any[]) => {
              this.medidores = lista || [];
              const medidor = (lista || []).find((x: any) => x.id_medidor === lec.id_medidor);
              if (medidor) {
                this.form.get('id_cliente')!.setValue(medidor.id_cliente);
                this.form.get('id_medidor')!.setValue(lec.id_medidor);
              }
            }),
            catchError(() => of(null))
          );
        }
      })
    ).subscribe();
  }

  guardar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      console.warn('Formulario de lectura inválido:', this.form.value);
      return;
    }

    this.guardando = true;
    const body = this.form.getRawValue();

    const req$ = (this.esEdicion && this.id_lectura)
      ? this.api.updateLectura(this.id_lectura, body)
      : this.api.createLectura(body);

    req$.subscribe({
      next: () => {
        // silencioso: sin alert; navegar al listado si lo tienes
        this.router.navigate(['/inicio/listadoLecturas']);
      },
      error: (e) => {
        console.error('No se pudo guardar la lectura:', e);
      },
      complete: () => (this.guardando = false)
    });
  }

  volverListado() {
    // ajusta la ruta si tu listado es otra
    this.router.navigate(['/inicio/listadoLecturas']);
  }
}




