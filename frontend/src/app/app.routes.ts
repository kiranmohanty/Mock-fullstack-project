import { Routes } from '@angular/router';
import { GridComponent } from './components/grid/grid.component';

export const routes: Routes = [
  { path: '', redirectTo: '/grid', pathMatch: 'full' },
  { path: 'grid', component: GridComponent },
];
