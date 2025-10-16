import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class canActivateValidation {
  public state:RouterStateSnapshot ={
    url: '',
    root: new ActivatedRouteSnapshot
  }

  public route:ActivatedRouteSnapshot = {
    url: [],
    params: {},
    queryParams: {},
    fragment: null,
    data: {},
    outlet: '',
    component: null,
    routeConfig: null,
    root: new ActivatedRouteSnapshot,
    parent: null,
    firstChild: null,
    children: [],
    pathFromRoot: [],
    paramMap: {
      has: function (name: string): boolean {
        throw new Error('Function not implemented.');
      },
      get: function (name: string): string | null {
        throw new Error('Function not implemented.');
      },
      getAll: function (name: string): string[] {
        throw new Error('Function not implemented.');
      },
      keys: []
    },
    queryParamMap: {
      has: function (name: string): boolean {
        throw new Error('Function not implemented.');
      },
      get: function (name: string): string | null {
        throw new Error('Function not implemented.');
      },
      getAll: function (name: string): string[] {
        throw new Error('Function not implemented.');
      },
      keys: []
    }
  }
  constructor() {}


  getState(){
    return this.state 
  }

  getRoute(code:any ){
    this.route.data = code
    return  this.route

  }

}
  
