import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, Observable, BehaviorSubject, merge, of } from 'rxjs';
import { catchError, finalize, first } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../services/base.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  defaultAuth: any = {
    username: '',
    password: '',
    orgcode: ''
  };
  loginForm: FormGroup;

  isLoading$: Observable<boolean>;
  returnUrl: string;
  submited: boolean = false;
  response;

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    public commonService: CommonService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.isLoading$ = this.authService.isLoading$;
  }
  isLoadingForm$ = new BehaviorSubject<boolean>(false);

  ngOnInit(): void {
    this.initForm();
    let returnUrl = this.router.url;
    let indexTicket = returnUrl.indexOf("?ticket=");
    if (indexTicket >= 0) {
      this.submited = true;
      let ticketVal = returnUrl.substring(indexTicket);
      let ticket = ticketVal.replace("?ticket=", "");
      console.log(ticketVal);
      this.authService.auth(ticket).pipe(first()).subscribe(res => {
        if (res) {
          this.router.navigate(['/']);
        }
      });
    }    
  }

  initForm() {
    this.defaultAuth.username = "";
    this.defaultAuth.password = "";
    this.loginForm = this.fb.group({
      username: [
        this.defaultAuth.username,
        Validators.compose([
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(64),
        ]),
      ],
      password: [
        this.defaultAuth.password,
        Validators.compose([
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(64),
        ]),
      ],
    });
  }

  ssoSignIn() {
    window.location.href = environment.ssoURL;
  }

  submit() {
    this.submited = true;
    if (this.loginForm.invalid) {
      return;
    }
    var formControls = this.loginForm.controls;
    const loginSubscr = this.authService
      .login(formControls.username.value, formControls.password.value)
      .pipe(first(), finalize(() => {
        this.submited = false;
      }))
      .subscribe(res => {
        if (res) {
          this.router.navigate(['/']);
        }
      });
    this.unsubscribe.push(loginSubscr);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}