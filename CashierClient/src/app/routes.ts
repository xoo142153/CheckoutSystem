import { Routes } from '@angular/router';
import { CashierComponent } from './cashier/cashier.component';
import { MemberListComponent } from './member-list/member-list.component';
import { InventoryComponent } from './inventory/inventory.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RegisterComponent } from './register/register.component';
import { HomescreenComponent } from './homescreen/homescreen.component';
import { ProdCheckComponent } from './prodCheck/prodCheck.component';
import { ProdCheckImageComponent } from './prodCheckImage/prodCheckImage.component';
import { TransactionsComponent } from './Transactions/Transactions.component';
import { AuthGuard } from './_guards/auth.guard';

export const appRoutes: Routes = [ // ordering matters here. it goes from top to bottom
    {path: 'home', component: HomescreenComponent},
    {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [AuthGuard],
        children: [
    {path: 'cashier', component: CashierComponent},
    {path: 'members', component: MemberListComponent },
    {path: 'inventory', component: InventoryComponent},
    {path: 'dashboard', component: DashboardComponent},
    {path: 'register', component: RegisterComponent},
        ]
    },
    {path: 'transactions', component: TransactionsComponent},
    {path: 'prodCheck', component: ProdCheckComponent},
    {path: 'prodCheckImage', component: ProdCheckImageComponent},
    {path: '**', redirectTo: 'home', pathMatch: 'full'}
];
