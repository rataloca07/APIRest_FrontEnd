import { Injectable } from '@angular/core';
import { formatDate, registerLocaleData, DatePipe } from '@angular/common';
import localeES from '@angular/common/locales/es'
//import { CLIENTES } from './clientes.json';
import { Observable, throwError } from 'rxjs';
import { Cliente } from './cliente.model.js';
import { HttpClient, HttpHeaders, HttpRequest, HttpEvent } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Region } from './region.model.js';

@Injectable()
export class ClienteService {
    private urlEndPoint: string = 'http://localhost:8080/api/clientes';
    private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

    constructor(private http: HttpClient,
        private router: Router) {

    }
    getClientes(page: number): Observable<Cliente[]> {
        //  return of(CLIENTES);
        // return this.http.get<Cliente[]>(this.urlEndPoint);
        return this.http.get(this.urlEndPoint + '/page/' + page).pipe(
            // map(response => response as Cliente[])
            /* map(response => {
                 let clientes = response as Cliente[];
                 return clientes.map(cliente => {*/
            map((response: any) => {
                (response.content as Cliente[]).map(cliente => {
                    cliente.nombre = cliente.nombre.toUpperCase();
                    //let datePipe = new DatePipe('es');
                    //  cliente.createAt = datePipe.transform(cliente.createAt,'EEEE dd, MMMM yyyy');//fullDate
                    // cliente.createAt = formatDate(cliente.createAt, 'EEEE dd, MMMM yyyy', 'en-US');//una letra más, 
                    //nombre abreviado o completo
                    return cliente;
                });
                return response;
            })
        );
    }


    getRegiones():Observable<Region[]>{
        return this.http.get<Region[]>(`${this.urlEndPoint}/regiones`);

    }



    //  create(cliente:Cliente):Observable<Cliente>{
    create(cliente: Cliente): Observable<any> {
        //return this.http.post<Cliente>(this.urlEndPoint,cliente,{headers:this.httpHeaders}).pipe(
        return this.http.post<any>(this.urlEndPoint, cliente, { headers: this.httpHeaders }).pipe(
            catchError(e => {
                if (e.status == 400) {
                    return throwError(e);
                }

                console.error(e.error.mensaje);
                swal.fire(e.error.mensaje, e.error.error, 'error');
                return throwError(e);
            })
        );

    }

    getCliente(id): Observable<Cliente> {
        return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
            catchError(e => {
                this.router.navigate(['/clientes']);
                console.error(e.error.mensaje);
                swal.fire(e.error.mensaje, 'Error al buscar cliente', 'error');
                return throwError(e);
            })
        );
    }

    update(cliente: Cliente): Observable<any> {
        return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`, cliente, { headers: this.httpHeaders }).pipe(
            catchError(e => {
                if (e.status == 400) {
                    return throwError(e);
                }
                console.error(e.error.mensaje);
                swal.fire(e.error.mensaje, e.error.error, 'error');
                return throwError(e);
            })
        );

    }

    delete(id: number): Observable<Cliente> {
        return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`, { headers: this.httpHeaders }).pipe(
            catchError(e => {
                console.error(e.error.mensaje);
                swal.fire(e.error.error, e.error.mensaje, 'error');
                return throwError(e);
            })
        );

    }

   // subirFoto(archivo: File, id): Observable<Cliente> {
    subirFoto(archivo: File, id): Observable<HttpEvent<{}>> {
        let formData = new FormData();
        formData.append('archivo', archivo);
        formData.append('id', id);
        //Para ver la barra de progreso
        const req = new HttpRequest('POST', `${this.urlEndPoint}/upload`, formData, {
            reportProgress: true
          });
        
        return this.http.request(req);

        /*.pipe(
            map((response: any) => response.cliente as Cliente),
            catchError(e => {
                console.error(e.error.mensaje);
                swal.fire(e.error.error, e.error.mensaje, 'error');
                return throwError(e);
            })
        )*/
    }

}