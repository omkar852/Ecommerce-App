import { state } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CheckoutFormService } from '../../services/checkout-form.service';
import { CustomValidators } from '../../validators/custom-validators';
import { CartService } from '../../services/cart.service';

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

  constructor(private formBuilder : FormBuilder, private checkoutFormService: CheckoutFormService, private cartService: CartService){}

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2),CustomValidators.notOnlyWhitespace]),
        email: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9._+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      shippingAddress: this.formBuilder.group({
        street: ['', [Validators.required,  CustomValidators.notOnlyWhitespace]],
        city: ['', [Validators.required,  CustomValidators.notOnlyWhitespace]],
        state: [''],
        country: ['', [Validators.required]],
        zipCode: ['', [Validators.required,  CustomValidators.notOnlyWhitespace]],
      }),
      billingAddress: this.formBuilder.group({
        street: ['', [Validators.required,  CustomValidators.notOnlyWhitespace]],
        city: ['', [Validators.required,  CustomValidators.notOnlyWhitespace]],
        state: [''],
        country: ['', [Validators.required]],
        zipCode: ['', [Validators.required,  CustomValidators.notOnlyWhitespace]],
      }),
      creditCard: this.formBuilder.group({
        cardType: ['', [Validators.required]],
        nameOnCard: ['', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]],
        cardNumber: ['',  [Validators.required ,Validators.pattern('[0-9]{16}')]],
        securityCode: ['', [Validators.required, Validators.pattern('[0-9]{3}')]],
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
    this.reviewCartDetails();

  }
  reviewCartDetails() {
    this.cartService.totalQuantity.subscribe(
      data=> this.totalQuantity = data
    );
    
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );

  }


  get firstName(){ return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName(){ return this.checkoutFormGroup.get('customer.lastName'); }
  get email(){ return this.checkoutFormGroup.get('customer.email'); }
  get shippingAddressStreet(){ return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingAddressCity(){ return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingAddressCountry(){ return this.checkoutFormGroup.get('shippingAddress.country'); }
  get shippingAddressState(){ return this.checkoutFormGroup.get('shippingAddress.state'); }
  get shippingAddressZipCode(){ return this.checkoutFormGroup.get('shippingAddress.zipCode'); }
  get billingAddressStreet(){ return this.checkoutFormGroup.get('billingAddress.street'); }
  get billingAddressCity(){ return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingAddressCountry(){ return this.checkoutFormGroup.get('billingAddress.country'); }
  get billingAddressState(){ return this.checkoutFormGroup.get('billingAddress.state'); }
  get billingAddressZipCode(){ return this.checkoutFormGroup.get('billingAddress.zipCode'); }
  get creditCardType(){ return this.checkoutFormGroup.get('creditCard.cardType');}
  get creditCardNameOnCard(){ return this.checkoutFormGroup.get('creditCard.nameOnCard');}
  get creditCardNumber(){ return this.checkoutFormGroup.get('creditCard.cardNumber');}
  get creditCardSecurityCode(){ return this.checkoutFormGroup.get('creditCard.securityCode');}

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

      // this is to reset the form value of start month
    // needed when we move from future year to current year
      if (creditCardFormGroup.value['expirationMonth']< startMonth){
        creditCardFormGroup.get('expirationMonth')?.setValue(startMonth);
      }
    }
    else{
      startMonth = 1;
    }

    this.checkoutFormService.getCreditCardMonths(startMonth).subscribe(
      data=> this.creditCardMonths = data
    );

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
      this.shippingAddressStates = selectedCountry.states? selectedCountry.states : [];

      const stateControl = shippingAddressFormGroup.get('state');
      if (this.shippingAddressStates.length > 0){
        stateControl?.setValidators(Validators.required);
      }
      else{
        stateControl?.clearValidators();
        console.log("No states found");
      }
      stateControl?.setValue('');
      stateControl?.updateValueAndValidity();

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
      this.billingAddressStates = selectedCountry.states? selectedCountry.states : [];

      const stateControl = billingAddressFormGroup.get('state');
      if (this.billingAddressStates.length > 0){
        stateControl?.setValidators(Validators.required);
      }
      else{
        stateControl?.clearValidators();
        console.log("No states found");
      }
      stateControl?.setValue('');
      stateControl?.updateValueAndValidity();
    }
    else{
      this.billingAddressStates = [];
    }
  }

  // onSubmit(){
  //   if(this.checkoutFormGroup.invalid){
  //     this.checkoutFormGroup.markAllAsTouched();
  //   }

  //   // console.log(this.checkoutFormGroup.value)
  //   console.log(this.checkoutFormGroup);
  // }


  // CHATGPT CODE TO SCROLL INTO INVALID FORM CONTROL
  onSubmit() {
    if (this.checkoutFormGroup.invalid) {
      // Mark all controls as touched to display validation errors
      this.checkoutFormGroup.markAllAsTouched();
      
      // Find the first invalid control
      const firstInvalidControl = document.querySelector(
        '.ng-invalid[formControlName]'
      ) as HTMLElement;
  
      if (firstInvalidControl) {
        // Scroll the first invalid control into view and set focus
        firstInvalidControl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstInvalidControl.focus();
      }
    } else {
      // Form is valid, handle submission logic here
      console.log('Form submitted successfully:', this.checkoutFormGroup.value);
    }
  }
  


}
