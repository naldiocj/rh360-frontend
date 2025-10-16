import { Injectable } from '@angular/core';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
} from 'rxjs';
import { ApiService } from '@core/providers/http/api.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  //   public api: string = '/api/v1';
  //   public base: string = this.api + '/sigpq/funcionarios';

  constructor(private http: HttpClient) {}

  save(form: any): Observable<any> {
    const formData = new FormData();

    formData.append('nome_completo', 'NAldio');
    formData.append('email', 'naldio@gmail.com');

    return this.http
      .post('http://localhost:3333/api/v1/funcionarios', formData)
      .pipe(
        map((response) => {
          return response;
        })
      );
  }
}
