import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Product, ProductList } from '../models/product';
import { BillingList } from '../models/billing';

@Injectable({
  providedIn: 'root',
})
export class BillingService {
  constructor(private http: HttpClient) {}

  getProductList(): Observable<ProductList> {
    return this.http.get<ProductList>(
      `${environment.apiUrl}method=BuscarProducto&token=${environment.token}`
    );
  }

  createBill(billNumber: string, date: string): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}method=CreaFactura&token=${environment.token}&numero_factura=${billNumber}&fecha=${date}`,
      null
    );
  }

  createNewLine(billNumber: string, articleCode: string, qty: number) {
    return this.http.post<any>(
      `${environment.apiUrl}method=AgregaDetalle&token=${environment.token}&codigo_articulo=${articleCode}&cantidad=${qty}&numero_factura=${billNumber}`,
      null
    );
  }

  getBillingLis(billNumber: string): Observable<BillingList> {
    return this.http.get<BillingList>(
      `${environment.apiUrl}method=ObtieneFactura&token=${environment.token}&numero_factura=${billNumber}`
    );
  }

  removeNewLine(line: number, billNumber: string): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}method=BorrarDetalle&token=${environment.token}&linea=${line}&numero_factura=${billNumber}`,
      null
    );
  }
}
