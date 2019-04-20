import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule} from '@angular/common/http';
import { FormsModule} from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { CashierComponent } from './cashier/cashier.component';
import { NavComponent } from './nav/nav.component';
import { AuthService } from './_services/auth.service';
import { RegisterComponent } from './register/register.component';
import { ErrorInterceptorProvider } from './_services/error.interceptor';
import { AlertifyService } from './_services/alertify.service';
import { MemberListComponent } from './member-list/member-list.component';
import { ListsComponent } from './lists/lists.component';
import { InventoryComponent } from './inventory/inventory.component';
import { appRoutes } from './routes';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { HomescreenComponent } from './homescreen/homescreen.component';
import { AuthGuard } from './_guards/auth.guard';
import { ProdCheckComponent } from './prodCheck/prodCheck.component';
import { TransactionsComponent } from './Transactions/Transactions.component';
import {WebcamModule} from 'ngx-webcam';
import { HttpModule } from '@angular/http';
import { ProdCheckImageComponent } from './prodCheckImage/prodCheckImage.component';

@NgModule({
   declarations: [
      AppComponent,
      CashierComponent,
      NavComponent,
      RegisterComponent,
      MemberListComponent,
      ListsComponent,
      InventoryComponent,
      DashboardComponent,
      ChatbotComponent,
      HomescreenComponent,
      ProdCheckComponent,
      TransactionsComponent,
      ProdCheckImageComponent
   ],
   imports: [
      BrowserModule,
      HttpClientModule,
      FormsModule,
      BsDropdownModule.forRoot(),
      RouterModule.forRoot(appRoutes),
      WebcamModule,
      HttpModule
   ],
   providers: [
      AuthService,
      ErrorInterceptorProvider,
      AlertifyService,
      AuthGuard
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
