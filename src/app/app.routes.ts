import { Routes } from '@angular/router';
import { VisitorListComponent } from './old/visitor/features/visitor-list/visitor-list.component';
import { VisitorFormComponent } from './old/visitor/features/visitor-form/visitor-form.component';
import { QrComponent } from './old/qr/features/qr/qr.component';
import { AuthorizedRangeFormComponent } from './old/authorization/features/authorized-range-form/authorized-range-form.component';
import { AccessQueryComponent } from './old/accesses/features/access-query/access-query.component';
import { ListAuthComponent } from './old/authorization/features/list-auth/list-auth.component';
import {AuthorizedFormComponent} from "./old/authorization/features/authorized-form/authorized-form.component";
import {HomeComponent} from "./components/commons/home/home.component";
import {AccessFormComponent} from "./components/accesses/access-form/access-form.component";
import {AuthFormComponent} from "./components/authorizations/auth-form/auth-form.component";
import {AuthListComponent} from "./components/authorizations/auth-list/auth-list.component";
import {AccessListComponent} from "./components/accesses/access-list/access-list.component";
import {EntityFormComponent} from "./components/entity/entity-form/entity-form.component";
import {EntityListComponent} from "./components/entity/entity-list/entity-list.component";

export const routes: Routes = [
  {
    path: 'qr',
    component: QrComponent,
  },
  {
    path: 'access/form',
    component: AccessFormComponent,
  },
  {
    path: 'access/list',
    component: AccessListComponent,
  },
  {
    path: 'auth/form',
    component: AuthFormComponent,
  },
  {
    path: 'auth/list',
    component: AuthListComponent,
  },
  {
    path: 'entity/form',
    component: EntityFormComponent,
  },
  {
    path: 'entity/list',
    component: EntityListComponent,
  },
  { path: 'home', component: HomeComponent, /* canActivate: [authGuard] */ },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];
