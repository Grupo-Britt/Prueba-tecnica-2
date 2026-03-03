import { ProductList } from './../../models/product';
import { BillingService } from './../../services/billing.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-billing-page',
  templateUrl: './billing-page.component.html',
  styleUrls: ['./billing-page.component.css'],
})
export class BillingPageComponent implements OnInit {
  formBill!: FormGroup;
  sendBill!: string;
  sendDate!: string;
  formDetail!: FormGroup;
  productList!: ProductList;
  billingList!: any;
  message!: string;
  total: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private billingService: BillingService
  ) {
    this.formBill = this.formBuilder.group({
      billNumber: [''],
      date: [''],
    });

    this.formDetail = this.formBuilder.group({
      qty: [''],
      articleCode: [''],
    });
  }

  ngOnInit(): void {
    this.getProductList();
  }

  public save(): void {
    this.sendBill = this.formBill.get('billNumber')?.value;
    this.sendDate = this.formBill.get('date')?.value;

    this.billingService.createBill(this.sendBill, this.sendDate).subscribe({
      next: (res: any) => {
        this.message = res.ALERTA;
        this.formBill.reset();
        this.getBillingList();
      },
      error:(error) => {
        console.error(error);
        this.message = error.error;
      }
    }
    );
  }

  public getProductList(): void {
    this.billingService.getProductList().subscribe({
      next:(res: ProductList) => {
        this.productList = res;
      },
      error:(error) => {
        console.error(error);
        this.message = error.error;
      }
    });
  }

  public sendNewLine(): void {
    let qty = this.formDetail.get('qty')?.value;
    let code = this.formDetail.get('articleCode')?.value;

    this.billingService.createNewLine(this.sendBill, code, qty).subscribe({
      next: (res: any) => {
        this.message = res.ALERTA;
        this.getBillingList();
        this.formDetail.reset();
      },
      error: (error) => {
        console.error(error);
        this.message = error.error;
      },
    });
  }

  public getBillingList(): void {
    this.billingService.getBillingLis(this.sendBill).subscribe({
      next:(res: any) => {
        this.billingList = res;
        this.total = this.sumTotal(res);
      },
      error: (error) => {
        console.error(error);
        this.message = error.error;
      },
    });
  }

  public removeLine(line: number, billNumber: string): void {
    this.billingService.removeNewLine(line, billNumber).subscribe({
      next: (res: any) => {
        this.message = res.ALERTA;
        this.getBillingList();
      },
      error: (error) => {
        console.error(error);
        this.message = error.error;
      },
    });
  }

  private sumTotal(bill: any): number {
    let suma = 0;

    bill.DETALLES.forEach(
      (element: any) => (suma += element.TOTAL_LINEA)
    );
    return suma;
  }
}
