import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class Api {
  constructor(private http: HttpClient) {}

  // Clientes
  getClientes() { return this.http.get<any[]>('/api/clientes'); }
  getCliente(id: string) { return this.http.get<any>(`/api/clientes/${id}`); }
  createCliente(data: any) { return this.http.post<any>('/api/clientes', data); }
  updateCliente(id: string, data: any) { return this.http.put<any>(`/api/clientes/${id}`, data); }
  deleteCliente(id: string) { return this.http.delete(`/api/clientes/${id}`); }

  // Medidores
  getMedidores(params?: { cliente_id?: string | number }) {
  return this.http.get<any[]>('/api/medidores', { params: params as any });
}

  getMedidor(id: string) { return this.http.get<any>(`/api/medidores/${id}`); }
  createMedidor(data: any) { return this.http.post<any>('/api/medidores', data); }
  updateMedidor(id: string, data: any) { return this.http.put<any>(`/api/medidores/${id}`, data); }
  deleteMedidor(id: string) { return this.http.delete(`/api/medidores/${id}`); }

  // Lecturas
  getLecturas() { return this.http.get<any[]>('/api/lecturas'); }
  getLectura(id: string) { return this.http.get<any>(`/api/lecturas/${id}`); }
  createLectura(data: any) { return this.http.post<any>('/api/lecturas', data); }
  updateLectura(id: string, data: any) { return this.http.put<any>(`/api/lecturas/${id}`, data); }
  deleteLectura(id: string) { return this.http.delete(`/api/lecturas/${id}`); }

  verificaLecturaMes(id_medidor: string, anio: number, mes: number) {
    const params = new HttpParams().set('id_medidor', id_medidor).set('anio', anio).set('mes', mes);
    return this.http.get<boolean>('/api/lecturas/existe', { params });
  }
  ultimaLectura(id_medidor: string) { return this.http.get<any>(`/api/lecturas/ultima/${id_medidor}`); }

  // Boletas (solo “crear/generar” según pauta)
  getBoletas() { return this.http.get<any[]>('/api/boletas'); }
generarBoleta(datos: any) {
  const { id_cliente, anio, mes } = datos;
  return this.http.post(`/api/boletas/generar`, null, {
    params: { cliente_id: id_cliente, anio, mes, modo: 'mensual' }
  });
}
  getBoleta(id: string) { return this.http.get<any>(`/api/boletas/${id}`); }
  getConsumo(clienteId: number | string, anio: number, mes: number) {
  return this.http.get<{ kwh_total: number }>('/api/boletas/consumo', {
    params: { cliente_id: clienteId, anio, mes }
  });
}

}

