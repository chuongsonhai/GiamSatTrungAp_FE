import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../../../../../core';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { UserModel } from 'src/app/_models/usermodel';
import { of } from 'rxjs';

@Component({
  selector: 'app-user-offcanvas',
  templateUrl: './user-offcanvas.component.html',
  styleUrls: ['./user-offcanvas.component.scss'],
})
export class UserOffcanvasComponent implements OnInit {
  _user$: UserModel;
  extrasUserOffcanvasDirection = 'offcanvas-right';  

  constructor(private layout: LayoutService, private auth: AuthenticationService) {}

  get user$() {
    return of(this._user$);
  }
  ngOnInit(): void {
    this._user$ = this.auth.currentUserValue;
    this.extrasUserOffcanvasDirection = `offcanvas-${this.layout.getProp(
      'extras.user.offcanvas.direction'
    )}`;
  }

  logout() {
    this.auth.logout();
    document.location.reload();
  }
}
