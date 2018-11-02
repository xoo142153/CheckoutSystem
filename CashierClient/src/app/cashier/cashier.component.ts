import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-cashier',
  templateUrl: './cashier.component.html',
  styleUrls: ['./cashier.component.css']
})
export class CashierComponent implements OnInit {
  products: any;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getProduct();
  }

  getProduct() {
    this.http.get('http://localhost:5000/api/values').subscribe(response => {
      this.products = response;
    }, error => {
      console.log(error);
    });
  }

}
