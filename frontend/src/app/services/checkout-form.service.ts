import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckoutFormService {
  
  private countryApiUrl = 'http://localhost:8080/api/countries-states';

  constructor(private httpClient : HttpClient) { }


  getCreditCardMonths(startMonth: number): Observable<number[]>{
    let data: number[] = [];
    for(let theMonth=startMonth; theMonth<=12; theMonth++){
      data.push(theMonth);
    }

    return of(data);
  }

  getCreditCardYear():Observable<number[]>{
    let data: number[] = [];

    const startYear = new Date().getFullYear();
    const endYear = startYear+10;
    for(let theYear=startYear; theYear<=endYear; theYear++){
      data.push(theYear);
    }
    return of(data);
  }

   // Fetch all countries
   getCountries(): Observable<any> {
    return this.httpClient.get<any>(this.countryApiUrl);
      
  }

}
