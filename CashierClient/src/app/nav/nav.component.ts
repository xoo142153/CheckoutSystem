import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { HttpClient } from '@angular/common/http';
import { AlertifyService } from '../_services/alertify.service';
import { Router, RouterLink } from '@angular/router';
import { delay } from 'rxjs/operators';

interface User {
  username: string;
  role: string;
}

declare var $: any;

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};
  registerMode = false;
  adminString: string;
  userlink: string;
  role: string;
  users: User;
  lastAdmin: any;
  lastCustomer: any;
  constructor(protected authService: AuthService, private http: HttpClient, private alertify: AlertifyService, private router: Router) { }

  ngOnInit() {
  }

  registerToggle() {
    this.registerMode = !this.registerMode;
  }

  login() {
    this.authService.login(this.model).subscribe(next => {
      this.alertify.success('Logged in.');
      this.test();
    }, error => {
      this.alertify.success(error);
    }, () => {
      this.router.navigate(['/cashier']);
      return;
    });
  }

  loggedIn() {
    return this.authService.loggedIn();
  }

  logout() {
    this.role = null;
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.clear();
    this.alertify.message('Logged out.');
    this.router.navigate(['home']);
  }

  isAdmin() {
    try {
      if (localStorage.getItem('ROLE').toUpperCase() === 'ADMIN') {
        return true;
      }
      return false;
    }  catch {
      console.log('ERROR IN FINDING ROLE');
      return false;
    }
  }

  test() {

    // tslint:disable-next-line:prefer-const
    const name = this.authService.decodedToken.unique_name;
    this.userlink = 'http://localhost:5000/api/auth/getRole/' + name.toString();
    this.http.get<boolean>(this.userlink).subscribe(response => {
      if (response === true) {
        console.log('ROLE:' + response);
        localStorage.setItem('ROLE', 'ADMIN');
      } else if (response === false)  {
        console.log('ROLE:' + 'BUG');
        localStorage.setItem('ROLE', 'Staff');
      }
    }, error => {
      console.log(error);
    });
  }

  test2() {
    return this.role;
  }

  getRole() {
    const name = this.authService.decodedToken.unique_name;
    this.userlink = 'http://localhost:5000/api/auth/getRole/' + name.toString();
    this.http.get<boolean>(this.userlink).subscribe(response => {
      if (response === true) {
        this.role = 'ADMIN';
      }
      if (response != null) {
        if (response === true) {
          this.role = 'ADMIN';
        } else {
          this.role = 'unknown';
        }
      } else if (response === true) {
        this.role = 'ADMIN';
      } else {
        this.role = 'unknown';
      }
    }, error => {
      this.role = 'noResponse';
      console.log(error);
    });
    console.log(this.role);
  }
}
