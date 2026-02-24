import { BillingList } from './../../models/billing';
import { ProductList } from './../../models/product';
import { BillingService } from './../../services/billing.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  billingList!: BillingList;
  message!: string;
  total: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private billingService: BillingService
  ) {
    this.formBill = this.formBuilder.group({
      billNumber: ['', Validators.required],
      date: ['', Validators.required],
    });

    this.formDetail = this.formBuilder.group({
      qty: ['', Validators.required],
      articleCode: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getProductList();
  }

  get formsBill() {
    return this.formBill.controls;
  }

  get formsDetail() {
    return this.formDetail.controls;
  }

  save(): void {
    this.sendBill = this.formBill.get('billNumber')?.value;
    this.sendDate = this.formBill.get('date')?.value;

    this.billingService.createBill(this.sendBill, this.sendDate).subscribe({
      next: (res) => {
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

  getProductList(): void {
    this.billingService.getProductList().subscribe({
      next:(res) => {
        this.productList = res;
      },
      error:(error) => {
        console.error(error);
        this.message = error.error;
      }
    });
  }

  sendNewLine(): void {
    let qty = this.formDetail.get('qty')?.value;
    let code = this.formDetail.get('articleCode')?.value;

    this.billingService.createNewLine(this.sendBill, code, qty).subscribe({
      next: (res) => {
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

  getBillingList(): void {
    this.billingService.getBillingLis(this.sendBill).subscribe({
      next:(res) => {
        this.billingList = res;
        this.total = this.sumTotal(res);
      },
      error: (error) => {
        console.error(error);
        this.message = error.error;
      },
    });
  }

  removeLine(line: number, billNumber: string): void {
    this.billingService.removeNewLine(line, billNumber).subscribe({
      next: (res) => {
        this.message = res.ALERTA;
        this.getBillingList();
      },
      error: (error) => {
        console.error(error);
        this.message = error.error;
      },
    });
  }

  sumTotal(bill: BillingList) {
    let suma = 0;
    bill.DETALLES.forEach(
      (element) => (suma += element.TOTAL_LINEA)
    );
    return suma;
  }
}
