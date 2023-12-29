import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthComponent} from './auth.component';
import {LoginComponent} from './login/login.component';
import {LogoutComponent} from './logout/logout.component';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [      
      {
        path: 'login',
        redirectTo: 'auth/login'        
      }, 
      {
        path: 'login',
        component: LoginComponent,
        data: { returnUrl: window.location.pathname, ticket: ''}
      },      
      {
        path: 'login/:paramticket',
        component: LoginComponent,
      }, 
      {
        path: 'logout',
        component: LogoutComponent
      }
      
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class AuthRoutingModule {}
