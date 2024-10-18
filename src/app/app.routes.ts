import { Routes } from '@angular/router';
import { VisitorListComponent } from './visitor/features/visitor-list/visitor-list.component';
import { VisitorFormComponent } from './visitor/features/visitor-form/visitor-form.component';

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
        path: '',
        redirectTo: '/visitors',
        pathMatch: 'full',
      }
];
