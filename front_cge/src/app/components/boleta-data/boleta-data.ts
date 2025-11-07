import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Api } from '../../services/api.service';
import html2pdf from 'html2pdf.js';
import { combineLatest, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, startWith, switchMap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-boleta-data',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './boleta-data.html',
  styleUrl: './boleta-data.css'
})
export class BoletaData {
  form: FormGroup;
  guardando = false;
  mensaje: string | null = null;
  clientes: any[] = []; // 🔹 Lista de clientes para el selector

  readonly TARIFA_KWH = 150;
  readonly CARGO_FIJO = 2000;
  readonly IVA_PORC = 0.19;

  @ViewChild('boletaPDF', { static: false }) boletaPDF!: ElementRef;

  constructor(private fb: FormBuilder, private api: Api) {
    this.form = this.fb.group({
      id_cliente: ['', Validators.required],
      anio: [new Date().getFullYear(), Validators.required],
      mes: [new Date().getMonth() + 1, [Validators.required, Validators.min(1), Validators.max(12)]],
      kwh_total: [0, [Validators.required, Validators.min(0)]],
      tarifa_base: [{ value: 0, disabled: true }],
      cargos: [{ value: this.CARGO_FIJO, disabled: true }],
      iva: [{ value: 0, disabled: true }],
      total_pagar: [{ value: 0, disabled: true }],
      estado: [{ value: 'Emitida', disabled: true }]
    });

    // 🔹 Cargar lista de clientes desde el backend
    this.cargarClientes();

    // 🔹 Auto-cálculo de totales
    this.form.get('kwh_total')?.valueChanges.subscribe(() => this.recalcularTotal());

    // 🔹 Auto consumo (id_cliente, anio, mes)
    this.wireAutoConsumo();

    this.recalcularTotal();
  }

  /** 🔹 Obtiene clientes del backend */
  cargarClientes() {
    this.api.getClientes().subscribe({
      next: (data) => (this.clientes = data),
      error: () => (this.clientes = [])
    });
  }

  /** 🔹 Escucha cambios de cliente/año/mes y obtiene consumo */
  private wireAutoConsumo() {
    const idCtrl = this.form.get('id_cliente')!;
    const anioCtrl = this.form.get('anio')!;
    const mesCtrl = this.form.get('mes')!;

    combineLatest([
      idCtrl.valueChanges.pipe(startWith(idCtrl.value)),
      anioCtrl.valueChanges.pipe(startWith(anioCtrl.value)),
      mesCtrl.valueChanges.pipe(startWith(mesCtrl.value))
    ])
      .pipe(
        debounceTime(400),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
        switchMap(([id, anio, mes]) => {
          if (!id || !anio || !mes) return of({ kwh_total: 0 });
          return this.api.getConsumo(id, Number(anio), Number(mes))
            .pipe(catchError(() => of({ kwh_total: 0 })));
        })
      )
      .subscribe(({ kwh_total }) => {
        this.form.get('kwh_total')?.setValue(kwh_total, { emitEvent: true });
        this.recalcularTotal();
      });
  }

  recalcularTotal() {
    const kwh = Number(this.form.get('kwh_total')?.value || 0);
    const tarifa_base = kwh * this.TARIFA_KWH;
    const cargos = this.CARGO_FIJO;
    const iva = (tarifa_base + cargos) * this.IVA_PORC;
    const total = tarifa_base + cargos + iva;

    this.form.patchValue({
      tarifa_base: Math.round(tarifa_base),
      cargos: Math.round(cargos),
      iva: Math.round(iva),
      total_pagar: Math.round(total)
    }, { emitEvent: false });
  }

  generar() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.guardando = true;

    const datos = { ...this.form.getRawValue(), estado: 'Emitida' };

    this.api.generarBoleta(datos).subscribe({
      next: () => {
        this.mensaje = 'Boleta generada correctamente.';
        setTimeout(() => this.mensaje = null, 2500);
      },
      error: () => {
        this.mensaje = 'Error al generar la boleta.';
        setTimeout(() => this.mensaje = null, 3000);
      },
      complete: () => this.guardando = false
    });
  }

  generarPDF() {
    if (!this.boletaPDF) return;
    const el = this.boletaPDF.nativeElement;
    const { id_cliente, mes, anio } = this.form.getRawValue();

    html2pdf().set({
      margin: 0.5,
      filename: `boleta_${id_cliente}_${mes}_${anio}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    }).from(el).save();
  }
}

