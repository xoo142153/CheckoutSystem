import { Component, OnInit, Pipe, SecurityContext } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AlertifyService } from '../_services/alertify.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Http, Headers, RequestOptions } from '@angular/http';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {WebcamImage, WebcamInitError, WebcamUtil} from 'ngx-webcam';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

interface Item {
  name: string;
  price: number;
  quantity: number;
  photo: string;
}

interface TescoGrocery {
  itemName: string;
  price: number;
  description: string;
}


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-prodCheck',
  templateUrl: './prodCheck.component.html',
  styleUrls: ['./prodCheck.component.css']
})
export class ProdCheckComponent implements OnInit {

  products: any[] = [];
  errors: any[] = [];
  productlink: string;
  product: Item;
  prodid: number;
  prodfind: string;
  translatedProdfind: string;
  filteredProducts: any;
  image: string;
  tesco: any;
  tescoGrocery: TescoGrocery[] = [];
  empty: TescoGrocery[] = [];
  tescoName: string;
  tescoPrice: number;
  tescoDescription: string;
  tescoProd: TescoGrocery;
  tescoSize: number;
  iterator: number;
  avengerss: any;
  binary: any;
  imageUrl: string;
  array: any[] = [];
  output: string;
  testdata: any[] = [];
  b64toBlob: any;
  sourceLang: string;

  constructor(private http: HttpClient, private alertify: AlertifyService, private sanitizer: DomSanitizer, private httpN: Http) {
    this.imageUrl = ''; }

  TescoProducts(findItem) {
    const options = { headers: new HttpHeaders({'Ocp-Apim-Subscription-Key' : 'ba9e3fffcf9443c6a7a0cfc866999c8a'}) };
    while (this.tescoGrocery.length !== 0) {
      this.tescoGrocery.pop();
    }

    this.http.get<any>('https://dev.tescolabs.com/grocery/products/?query=' + findItem + '&offset=0&limit=10', options)
    .subscribe(response => {
      this.tesco = response;
      this.tescoSize = this.tesco.uk.ghs.products.results.length;
      for (let i = 0; i < this.tescoSize; i++)  {
        this.tescoProd = { itemName: this.tesco.uk.ghs.products.results[i].name,
          price: this.tesco.uk.ghs.products.results[i].price,
          description: this.tesco.uk.ghs.products.results[i].description};
        this.tescoGrocery.push(this.tescoProd);
      }

      /*this.tescoGrocery.forEach(element => {
        console.log(element.itemName);
      });*/
    }, error => {
      console.log(error);
    });
  }

  prodCheck() {
    this.products = [];
    this.productlink = 'http://localhost:5000/api/values/getProduct/' + this.prodid;
    this.http.get<Item>(this.productlink).subscribe(response => {
      if (response != null) {
        this.product = response;
        this.image = this.product.photo;
        this.products.push(this.product);
      } else {
        this.errors.push('Error, item not found');
      }
    }, error => {
      this.errors.push('Internal Failure. Please contact Service team.');
    });
  }

  prodFind() {
    // find language
    this.http.get<any>('https://translation.googleapis.com/language/translate/v2/detect/?q=' + this.prodfind
     + '&key=AIzaSyBNAJCmYwb9b0JvmP65BZLoEsgV_EknTdM')
    .subscribe(response => {
      this.sourceLang = response.data.detections[0][0].language;
      if (response.data.detections[0][0].language !== 'en') {
        this.http.get<any>('https://translation.googleapis.com/language/translate/v2/?q='
        + this.prodfind + '&source=' + response.data.detections[0][0].language + '&target=en&key=AIzaSyBNAJCmYwb9b0JvmP65BZLoEsgV_EknTdM')
        .subscribe(response2 => {
          this.translatedProdfind = response2.data.translations[0].translatedText;
          this.http.get<Item>('http://localhost:5000/api/values/filterProducts/'  + this.translatedProdfind).subscribe(response3 => {
      this.filteredProducts = response3;
      this.TescoProducts(this.translatedProdfind);
    }, error => {
      console.log(error);
    });
        }, error => {
          console.log(error);
        });
      } else {
        this.translatedProdfind = this.prodfind;
        this.TescoProducts(this.translatedProdfind);

      }
    }, error => {
      console.log(error);
    });

    // translate


  }

  public ngOnInit(): void {
  }
}
