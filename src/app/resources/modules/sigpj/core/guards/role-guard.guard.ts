import { Injectable, OnInit, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';



@Injectable({
  providedIn: 'root'
})
export class SigpjRoleGuard implements CanActivate {


  get rolePermission(){
    return localStorage.getItem('role_permission')
  }

  get userPermissions() {
    return localStorage.getItem('user_permission')
  }


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):
    boolean{
      
      // if(this.rolePermission?.match(route.data['permission']) 
      // || this.userPermissions?.match(route.data['permission'])){
       
        return true
      // }
      // window.alert("Acesso negado!")
      // return false;
    
  }


}
