import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EstudantesService {
  private apiUrl = 'http://localhost:3000/estudantes';

  constructor(private http: HttpClient) {}

  buscarEstudantes(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  buscarEstudante(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  criarEstudante(estudante: any): Observable<any> {
    estudante.matricula = this.gerarNumeroMatricula();
    return this.http.post(this.apiUrl, estudante);
  }

  private gerarNumeroMatricula(): number {
    // Gera um número entre 100000 e 999999
    return Math.floor(100000 + Math.random() * 900000);
  }

  atualizarEstudante(id: number, estudante: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, estudante);
  }

  excluirEstudante(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
