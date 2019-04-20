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
  selector: 'app-prodCheckImage',
  templateUrl: './prodCheckImage.component.html',
  styleUrls: ['./prodCheckImage.component.css']
})
export class ProdCheckImageComponent implements OnInit {

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
  tags: any[] = [];
  testdata: any[] = [];
  b64toBlob: any;
  sourceLang: string;
  counter = 1;
  // toggle webcam on/off
  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
  public videoOptions: MediaTrackConstraints = {
    // width: {ideal: 1024},
    // height: {ideal: 576}
  };
  // tslint:disable-next-line:max-line-length
  private url = 'https://northeurope.api.cognitive.microsoft.com/vision/v1.0/analyze?visualFeatures=Tags&language=en';

  public errorsM: WebcamInitError[] = [];

  // latest snapshot
  public webcamImage: WebcamImage = null;

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean|string> = new Subject<boolean|string>();


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

  get imgBase64() {
    return this.sanitizer.bypassSecurityTrustUrl('data:image/png;base64,' + this.image);
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
    this.http.get<Item>('http://localhost:5000/api/values/filterProducts/'  + this.prodfind).subscribe(response3 => {
      this.filteredProducts = response3;
      this.TescoProducts(this.prodfind);
    }, error => {
      console.log(error);
    });
  }

  public ngOnInit(): void {
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });
  }

  public triggerSnapshot(): void {
    this.trigger.next();
  }

  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  public handleInitError(error: WebcamInitError): void {
    this.errorsM.push(error);
  }


  public handleImage(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;
    this.getPersonAge();
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  _base64ToArrayBuffer(base64) {
    const binary_string =  window.atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array( len );
    for (let i = 0; i < len; i++)        {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}
  getPersonAge() { // imageUrl: string

  const options = { headers: new Headers({ 'Content-Type' : 'application/octet-stream',
  'Ocp-Apim-Subscription-Key': '31200edb317d416ea5ab432402ecf697' }) };

    this.httpN.post(this.url, this._base64ToArrayBuffer(this.webcamImage.imageAsBase64) , options)
    .map(data => data.json())// .do(result => console.log(result))
    .subscribe(data => {
      this.tags = data.tags;
    });
  }
}
