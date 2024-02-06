import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, Observable, BehaviorSubject, merge, of } from 'rxjs';
import { catchError, finalize, first } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../services/base.service';
import { environment } from 'src/environments/environment';
import { CanhBaoGiamSatService } from '../../services/canhbaogiamsat.service';

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
    public service: CanhBaoGiamSatService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.isLoading$ = this.authService.isLoading$;
  }
  isLoadingForm$ = new BehaviorSubject<boolean>(false);

  ngOnInit(): void {
    this.initForm();
    // let returnUrl = this.router.url;

    // let indexTicket = returnUrl.indexOf("paramTicket=");
    // console.log(indexTicket)
    // if (indexTicket >= 0) {
    //   this.submited = true;
    //   let ticketVal = returnUrl.substring(indexTicket);
    //   let ticket = ticketVal.replace("paramTicket=", "");
    //   console.log(ticket);
    //   this.authService.auth(ticket).pipe(first()).subscribe(res => {
    //     if (res) {
    //       this.router.navigate(['/']);
    //     }
    //   });
    // }    

    this.route.params.subscribe(params => {
      const param = params['paramticket']; // Thay 'paramName' bằng tên tham số bạn đặt trong route
      if(param != null){

        this.authService.auth(param).pipe(first()).subscribe(res => {
          if (res) {
            this.router.navigate(['/']);
          }
        });
      }
      
      // Sau khi lấy được giá trị, bạn có thể sử dụng paramValue ở đây
      console.log(param); // Ví dụ: In giá trị tham số ra console
    });
  
}

save() {

  this.service.downloadApk().subscribe((data: Blob) => {
    const blob = new Blob([data], { type: 'application/vnd.android.package-archive' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'app-release.apk';
    link.click();
  });
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