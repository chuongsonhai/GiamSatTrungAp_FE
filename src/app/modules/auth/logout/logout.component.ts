import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
})
export class LogoutComponent implements OnInit {
  
  constructor(private router: Router, private authService: AuthenticationService) {
    this.authService.logout();    
    this.router.navigate(['/auth/login']);
  }

  ngOnInit(): void {}
}
