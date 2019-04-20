import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { text } from '@angular/core/src/render3/instructions';
import { Identifiers, ThrowStmt } from '@angular/compiler';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { e } from '@angular/core/src/render3';
import { TouchSequence } from 'selenium-webdriver';

interface Item {
  id: string;
  name: string;
  price: number;
}

interface Cart {
  itemId: string;
  product: Item[];
}

declare var $: any;

@Component({
  selector: 'app-cashier',
  templateUrl: './cashier.component.html',
  styleUrls: ['./cashier.component.css']
})

export class CashierComponent implements OnInit {

  takePaymentResult: string;

  private _options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

  products: Item;
  errors: any[] = [];
  product: Item;
  basket: any[] = [];
  productlink: string;
  checkoutlink: string;
  paylink: string;
  availibility: string;
  totalprice = 0;
  change = 0;
  i = 0;
  stronk;
  given;

  sendValues(): void {
  // check for item availibility
  this.addToBasket(this.stronk);
}

  constructor(private http: HttpClient, private authService: AuthService, private alertify: AlertifyService) { }

  // tslint:disable-next-line:member-ordering
  headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });


  ngOnInit() {
    this.getProducts();
    $(document).ready(function() {
      $('#stronk').bind('input', function() {
        // NOTE: uncomment since i will be using 8 digit/length ID. Keeping it at 1 for now.
        const maxLength = $(this).attr('maxlength'); //
        if (8 === $(this).val().length) { //
          $('#addProd').trigger('click');
        }
      });
    });

    $(document).ready(function() {
      $('#addProd').click(function () {
     if (this.id === 'addProd') {
      $('#stronk').val('');
     }
    });
    });

    $(document).ready(function() {
      $('#checkoutTxt').bind('input', function() {
          $('#checkoutBasket').trigger('click');
      });
    });
  }

  takePayment(productName: string, amount: number, token: any) {
    const body = {
        tokenId: token.id,
        productName: productName,
        amount: amount
    };
    const bodyString = JSON.stringify(body);
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });

    this.http.post('http://localhost:5000/api/auth/Charge', bodyString, this._options )
        .toPromise()
        .then((res) => {
            console.log('it worked');
        })
        .catch((error) => {
            this.takePaymentResult = error.message;
        });

        this.authService.purchaseBasket(this.basket).subscribe(() => {
          this.alertify.success('Transaction complete');
          this.emptyB();
        }, error => {
          this.alertify.error(error);
        });
      }

      openCheckout(productName: string, amount: number, tokenCallback) {
        const handler = (<any>window).StripeCheckout.configure({
            key: 'pk_test_mu35XF4NyYYQmzGVCXJP3pIk',
            locale: 'auto',
            token: tokenCallback
        });

        handler.open({
            name: 'Our Shop',
            description: productName,
            zipCode: false,
            currency: 'eur',
            amount: amount,
            panelLabel: 'Pay {{amount}}',
            allowRememberMe: false
        });
    }

    buyCart() {
      this.openCheckout('Receipt', (this.totalprice * 100), (token: any) => this.takePayment('Receipt', (this.totalprice * 100), token));
  }


  getProducts() {
    this.http.get<Item>('http://localhost:5000/api/values/getProducts').subscribe(response => {
      this.products = response;
    }, error => {
      console.log(error);
    });
  }

  addToBasket(id) {
    this.productlink = 'http://localhost:5000/api/values/getProduct/' + id;
    this.http.get<Item>(this.productlink).subscribe(response => {
    if (response != null) {
      this.product = response;
      this.basket.push(this.product);
      console.log(this.product.price);
      this.totalprice += (this.product.price);
    } else {
      this.errors.push('Error trying to add product id: ' + id);
    }
    }, error => {
      console.log(error);
    });
  }

  deleteFromBasket(id) {
    for (let i = this.basket.length - 1; i >= 0 ; i--) { // reverse for loop
      if (this.basket[i]['id'] === id) {
        this.totalprice -= this.basket[i].price; // decrease total price upon deleting from basket
        this.basket.splice(i, 1); // take off product from basket
        break; // once it finds the first, it will delete it and end.
      }
    }
  }

  emptyB() {
    this.basket.forEach(items => {
      this.deleteFromBasket(items.id);
    });
    this.basket.forEach(items => {
      this.deleteFromBasket(items.id);
    });
    this.basket.forEach(items => {
      this.deleteFromBasket(items.id);
    });
  }

  /*getAvailability(id) {
    this.availibility = 'http://localhost:5000/api/values/getProduct/' + id;
    this.http.get<number>(this.availibility).subscribe(response => {})
  }*/

  getChange() {
    this.checkoutlink = 'http://localhost:5000/api/values/getChange/' + this.totalprice + '/' + this.given;
    this.http.get<number>(this.checkoutlink).subscribe(response => {
      this.change = response;
    }, error => {
      console.log(error);
    });
  }

  emptyBasket() {
    const emptyBasket: any = {};
    this.basket = emptyBasket;
  }

  async Checkout() {
    this.getChange();
    const item = this.basket[0];
    console.log(this.basket);

    if (this.change >= 0) {
      this.authService.purchaseBasket(this.basket).subscribe(() => {
        this.alertify.success('Transaction complete');
      }, error => {
        this.alertify.error(error);
      });
    } else {
      this.alertify.error('Insufficient funds.');
    }

    this.emptyB();

  }

  refresh(): void {
    window.location.reload();
}
}
