import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Chart } from 'chart.js';

interface Item {
  id: string;
  Name: string;
  price: number;
}

interface Transaction {
  id: string;
  Items: string;
  TotalPrice: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  LineChart = [];
  transaction: any;
  test: string;
  names = ['yes'];

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.getProducts();
  }

  displayLineChart() {
    this.LineChart = new Chart('barChart', {
      type: 'bar',
      data: {
        labels: this.names,
        datasets: [{
          label: 'Number of Items Sold in Months',
          data: [0, 2, 4, 10, 5],
          fill: true,
          lineTension: 0.2,
          borderColor: 'red',
          borderWidth: 1
        }]
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            scaleBeginAtZero: true
          }
        }],
      }
    });
  }

  getProducts() {
    this.http.get<Transaction>('http://localhost:5000/api/values/getTransactions').subscribe(response => {
      this.transaction = response;
      this.transaction.forEach(element => {
        this.names.push(element.items);
      });
      this.displayLineChart();

    }, error => {
      console.log(error);
    });
  }

}
