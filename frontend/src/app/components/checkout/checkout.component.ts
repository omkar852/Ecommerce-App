import { state } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CheckoutFormService } from '../../services/checkout-form.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit{


  checkoutFormGroup!: FormGroup;
  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries : any[] = [];
  billingAddressStates: any[] = [];
  shippingAddressStates: any[] = [];

  constructor(private formBuilder : FormBuilder, private checkoutFormService: CheckoutFormService){}

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: ['']
      }),
      shippingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: [''],
      }),
      billingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: [''],
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: [''],
      })
    });

    // fetching the credit card months and years from the checkout form service
    const startMonth = new Date().getMonth() + 1;
    this.checkoutFormService.getCreditCardMonths(startMonth).subscribe(
      data => this.creditCardMonths = data
    );

    this.checkoutFormService.getCreditCardYear().subscribe(
      data => this.creditCardYears = data
    );

    this.fetchCountries();

  }

  copyShippingAddressToBillingAddress(event: Event) {
    // if(event.target)
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked){
      this.checkoutFormGroup.controls['billingAddress'].setValue(this.checkoutFormGroup.controls['shippingAddress'].value);
      this.billingAddressStates = this.shippingAddressStates;
    }
    else{
      this.checkoutFormGroup.controls['billingAddress'].reset();
      this.checkoutFormGroup.controls['billingAddress'].get('country')?.setValue('');
      this.checkoutFormGroup.controls['billingAddress'].get('state')?.setValue('');
      this.billingAddressStates = [];
    }
  }

  handleMonthsAndYears(){
    const creditCardFormGroup = this.checkoutFormGroup.controls['creditCard'];

    const currentYear = new Date().getFullYear();
    const selectedYear = creditCardFormGroup.value['expirationYear'];

    let startMonth: number;

    if (selectedYear==currentYear){
      startMonth = new Date().getMonth() + 1;
    }
    else{
      startMonth = 1;
    }

    this.checkoutFormService.getCreditCardMonths(startMonth).subscribe(
      data=> this.creditCardMonths = data
    );

    // this is to reset the form value of start month
    // needed when we move from future year to current year
    if(selectedYear==currentYear){
      creditCardFormGroup.get('expirationMonth')?.setValue(startMonth);
    }

  }

  fetchCountries(){
    this.checkoutFormService.getCountries().subscribe(
      (response) => {
        this.countries = response.data;
      }, 
      (error) => {
        console.log("Error fetching countries: ", error);
      }
    )
  }

  onShippingCountryChange(){
    const shippingAddressFormGroup = this.checkoutFormGroup.controls['shippingAddress'];
    const selectedCountry = shippingAddressFormGroup.value['country'];
    

    if (selectedCountry){
      this.shippingAddressStates = selectedCountry.states;
      shippingAddressFormGroup.get('state')?.setValue('');
    }
    else{
      this.shippingAddressStates = [];
      // console.log(this.shippingAddressStates);
    }
  }

  onBillingCountryChange(){
    const billingAddressFormGroup = this.checkoutFormGroup.controls['billingAddress'];
    const selectedCountry = billingAddressFormGroup.value['country'];


    if (selectedCountry){
      this.billingAddressStates = selectedCountry.states;
      billingAddressFormGroup.get('state')?.setValue('');
    }
    else{
      this.billingAddressStates = [];
    }
  }

  onSubmit(){
    console.log(this.checkoutFormGroup.value)
  }


}
