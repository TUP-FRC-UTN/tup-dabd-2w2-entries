import { Routes } from '@angular/router';
import { VisitorListComponent } from './visitor/features/visitor-list/visitor-list.component';
import { VisitorFormComponent } from './visitor/features/visitor-form/visitor-form.component';
import { AccessFormComponent } from './accesses/features/access-form/access-form.component';
import { ListAuthComponent } from './authorization/features/list-auth/list-auth.component';
import { AccessQueryComponent } from './accesses/features/access-query/access-query.component';
import { AuthorizedRangeFormComponent } from './authorization/features/authorized-range-form/authorized-range-form.component';
import { QrFormComponent } from './qr/features/qr-form/qr-form.component';
import { AuthorizedFormComponent } from './authorization/features/authorized-form/authorized-form.component';

export const routes: Routes = [
  {
    path: 'visitors',
    component: VisitorListComponent,
  },
  {
    path: 'visitor/add',
    component: VisitorFormComponent,
  },
  {
    path: 'visitor/edit/:id',
    component: VisitorFormComponent,
  },
  {
    path: 'qr',
    component: QrFormComponent,
  },
  {
    path: 'register-range',
    component: AuthorizedRangeFormComponent,
  },
  {
    path: 'access-query',
    component: AccessQueryComponent,
  },
  {
    path: 'new/auth',
    component: AuthorizedFormComponent,
  },
  {
    path: 'auth-list',
    component: ListAuthComponent,
  },
  {
    path: 'access-form',
    component: AccessFormComponent,
  },
  {
    path: '',
    redirectTo: '/visitors',
    pathMatch: 'full',
  },
];
