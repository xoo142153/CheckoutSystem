import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';

interface Transaction {
  id: number;
  items: number;
  totalPrice: number;
  date: string;
  time: string;
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-Transactions',
  templateUrl: './Transactions.component.html',
  styleUrls: ['./Transactions.component.css']
})
export class TransactionsComponent implements OnInit {
  transactions: Transaction;

  constructor(private http: HttpClient, private authService: AuthService,  private alertify: AlertifyService) { }


  ngOnInit() {
    this.getTransactions();
  }

  getTransactions() {
    this.http.get<Transaction>('http://localhost:5000/api/values/getTransactions').subscribe(response => {
      this.transactions = response;
    }, error => {
      console.log(error);
    });
  }

  async deleteTransaction(id) {
    this.authService.DeleteTransaction(id).subscribe(() => {
    }
    );
    this.alertify.success('Item deleted from database');
     // tslint:disable-next-line:no-shadowed-variable
     async function delay(ms: number) {
      return new Promise( resolve => setTimeout(resolve, ms) );
    }

    await delay(300);
    this.getTransactions();

  }

}
