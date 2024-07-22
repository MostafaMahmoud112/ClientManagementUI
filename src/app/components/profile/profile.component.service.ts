import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = 'https://localhost:7282/api/Clients';

  constructor(private http: HttpClient) { }
  saveChanges(formData: any): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }
  getClients(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
  deleteClient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
