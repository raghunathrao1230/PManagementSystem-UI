import { HttpErrorResponse } from "@angular/common/http";
import { ErrorHandler, Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    constructor()
    {

    }
    handleError(error:any) {
        
        if (error instanceof HttpErrorResponse) {
            console.error('Backend returned status code: ', error.status);
            console.error('Response body:', error.message);          	  
        } else {            	          
            console.error('An error occurred:', error.message);          
        }   
        alert('something has gone wrong');
    }
  }