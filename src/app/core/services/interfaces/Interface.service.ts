import { Observable } from 'rxjs';
 
export default interface InterfaceService {
    listarUm(id: any): Observable<any>;
    listarTodos(filtro: any): Observable<any>;
    registar(formulario: any): Observable<any>;
    editar(formulario: any, id: any): Observable<any>;
    eliminar(id: any): Observable<any>;
}