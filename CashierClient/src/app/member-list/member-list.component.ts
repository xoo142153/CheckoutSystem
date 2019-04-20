import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertifyService } from '../_services/alertify.service';

interface User {
  username: string;
}

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  users: User;
  deletedUser: any;

  constructor(private http: HttpClient, private alertify: AlertifyService) { }

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.http.get<User>('http://localhost:5000/api/values/getUsers').subscribe(response => {
      this.users = response;
    }, error => {
      console.log(error);
    });
  }

  deleteUser(id) {
    this.http.delete<Boolean>('http://localhost:5000/api/auth/deleteUser/' + id).subscribe(response => {
      this.alertify.success('Successfully removed');
      this.getUsers();
    }, error => {
      this.alertify.error(error);
    });
  }

  refresh(): void {
    window.location.reload();
}

}
