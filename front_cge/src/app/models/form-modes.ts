export interface clientes {
  id_cliente: string;
  rut: string;
  nombre_razon: string;
  email_contacto: string;
  telefono: string;
  direccion_facturacion: string;
  estado: string;
}
export interface medidores {
  id_medidor: string;
  codigo_medidor: string;
  id_cliente: string;
  direccion_suministro: string;
  estado: string;

}
export interface lecturas {
  id_lectura: string;
  id_medidor: string;
  anio: number;
  mes: number;
  lectura_kwh: number;
  observacion: null;

}
export interface boletas {
  id_boleta: string;
  id_cliente: string;
  anio: number;
  mes: number;
  kwh_total: number;
  tarifa_base: number;
  cargos: number;
  iva: number;
  total: number;
  estado: string;

}
