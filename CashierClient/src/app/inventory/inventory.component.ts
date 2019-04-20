import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { delay } from 'rxjs/operators';
import { ReadVarExpr } from '@angular/compiler';
import { FormGroup, FormControl } from '@angular/forms';
import { TouchSequence } from 'selenium-webdriver';

interface Item {
  id: string;
  Name: string;
  price: number;
}

class ItemToAdd {
  Name: string;
  Price: number;
  Quantity: number;
  Photo: string;
  Barcode: number;
  constructor() {}
}

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {
  products: Item;
  itemToAdd: ItemToAdd;
  model: any = {};
  getitemid: any;
  file: any;
  reader: any;
  binaryString: any;
  base64textstring: any;
  newItem: ItemToAdd;

  constructor(private http: HttpClient, private authService: AuthService, private alertify: AlertifyService) { }

  ngOnInit() {
    this.getProducts();
  }

  handleFileInput(event) {
    this.file = event.target.files[0];

    if (this.file) {
      this.reader = new FileReader();

      this.reader.onload = this._handleReaderLoaded.bind(this);

      this.reader.readAsBinaryString(this.file);
    }
  }

  _handleReaderLoaded(readerEvt) {
    this.binaryString =  readerEvt.target.result;
    this.base64textstring = btoa(this.binaryString);
    console.log(btoa(this.binaryString));
  }

  getProducts() {
    this.http.get<Item>('http://localhost:5000/api/values/getProducts').subscribe(response => {
      this.products = response;
    }, error => {
      console.log(error);
    });
  }

  updateProduct() {
    if (this.model.barcode === undefined ) {
    } else {
      if (this.model.barcode.toString().length !== 8) {
        document.getElementById('updateBarcode').style.color = 'red';
        this.alertify.error('Barcode must 8 digits or empty');
        return;
      }
    }

    this.model.Photo = this.base64textstring; console.log('Getting id');
    this.authService.GetItemId(this.model).subscribe(response => {
      console.log('id got');
      this.getitemid = response;
      this.getitemid.price = this.model.price;
      this.getitemid.Quantity = this.model.quantity;
      this.getitemid.Photo = this.model.Photo;
      this.getitemid.Barcode = this.model.barcode;
      console.log('updating');
      this.authService.UpdateItem(this.getitemid).subscribe(async () => {
        console.log('updating complete');
        console.log(this.getitemid);
        this.alertify.success('Item updated');
        // tslint:disable-next-line:no-shadowed-variable
    async function delay(ms: number) {
      return new Promise( resolve => setTimeout(resolve, ms) );
    }

    this.getProducts();
    // await delay(900);
    // this.refresh();
      }, error => {
        this.alertify.error(error);
      });
    });
  }

  resetColour() {
    document.getElementById('addBarcode').style.color = null;
    document.getElementById('updateBarcode').style.color = null;
  }

  addProduct() {
    if (this.model.Name === undefined ) {
      this.alertify.error('Please input a value for Name.');
      return;
    }

    if (this.model.Price === undefined ) {
      this.alertify.error('Please input a value for price.');
      return;
    }

    if (this.model.Quantity === undefined ) {
      this.alertify.error('Please input a value for Quantity.');
      return;
    }

    if (this.model.Barcode === undefined ) {
      this.alertify.error('Please input a value for Barcode.');
      return;
    } if (this.model.Barcode !== undefined) {
      if (this.model.Barcode.toString().length !== 8) {
        document.getElementById('addBarcode').style.color = 'red';
        this.alertify.error('Barcode cannot be less or above 8 digits.');
        return;
      }
    }

    if (this.model.Photo === undefined ) {
      this.alertify.error('Please choose a file for Product Image.');
      return;
    }

    this.newItem = this.model;
    this.newItem.Photo = this.base64textstring;
    this.authService.AddItem(this.newItem).subscribe(async () => {
      this.alertify.success('Item added to database');

      // tslint:disable-next-line:no-shadowed-variable
    async function delay(ms: number) {
      return new Promise( resolve => setTimeout(resolve, ms) );
    }
    this.getProducts();
    this.model.Name = '';
    this.model.Price = '';
    this.model.Barcode = null;
    this.model.Quantity = null;
    this.model.Photo = 'No file chosen';
    }, error => {
      this.alertify.error(error);
    });
  }

  async deleteItem(id) {
    this.authService.DeleteItem(id).subscribe(() => {
    });
    this.alertify.success('Item deleted from database');

    // tslint:disable-next-line:no-shadowed-variable
    async function delay(ms: number) {
      return new Promise( resolve => setTimeout(resolve, ms) );
    }

    await delay(300);
    this.getProducts();
  }

  refresh(): void {
    window.location.reload();
}


  cancel() {
    // this.cancelRegister.emit(false);
  }

}
