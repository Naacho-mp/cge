import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule, FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-cliente-data',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cliente-data.html',
  styleUrl: './cliente-data.css',
  standalone: true
})
export class ClienteData {

  form: FormGroup;

  estados =['Activo', 'Inactivo'];

  constructor(private formBuilder: FormBuilder) {

    this.form = this.formBuilder.group({
      rut: [''],
      nombre_razon: [''],
      email_contacto: [''],
      telefono: [''],
      direccion_facturacion: [''],
      estado: [''],
    });
  }


}
