import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SendVisitor, Visitor } from '../models/visitor.model';


interface PaginatedResponse<T> {
  items: T[];
  total_elements: number;
}


@Injectable({
  providedIn: 'root',
})
export class VisitorService {
  private apiUrl = 'http://localhost:8080/visitors';

  constructor(private http: HttpClient) {}

  getVisitors(page: number = 0, size: number = 10): Observable<Visitor[]> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Visitor[]>(this.apiUrl , { params });
  }

  getVisitorPaginated(page: number = 0, size: number = 10): Observable<PaginatedResponse<Visitor>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PaginatedResponse<Visitor>>(this.apiUrl+'/paginated' , { params });
  }

  getVisitor(visitorId: number): Observable<Visitor> {
    return this.http.get<Visitor>(`${this.apiUrl}/${visitorId}`);
  }

  upsertVisitor(visitor: SendVisitor): Observable<Visitor> {
    return this.http.put<Visitor>(this.apiUrl , visitor);
  }

  deleteVisitor(visitorId: number): Observable<Visitor> {
    return this.http.delete<Visitor>(`${this.apiUrl}/deactivate/${visitorId}`);
  }
}
