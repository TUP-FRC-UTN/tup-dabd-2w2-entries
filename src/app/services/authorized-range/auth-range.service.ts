import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthDTO } from '../../models/authorization/authorized-range.model';

@Injectable({
  providedIn: 'root',
})
export class AuthRangeService {
  private url = 'http://localhost:8080/auths';

  constructor(private http: HttpClient) {}

  getAuhtByDocNumber(docNumber: number): Observable<AuthDTO[]> {
    const params = new HttpParams().set('docNumber', docNumber.toString());
    return this.http.get<AuthDTO[]>(this.url, { params });
  }
  
  getAllAuths() {
    return this.http.get<AuthDTO[]>(this.url);
  }
}
