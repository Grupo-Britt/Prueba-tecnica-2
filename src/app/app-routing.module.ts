import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BillingPageComponent } from './pages/billing-page/billing-page.component';

const routes: Routes = [
  {path: 'factura', component: BillingPageComponent},
  {path: '', component: BillingPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
