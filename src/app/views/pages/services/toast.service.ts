import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor(private toastr: ToastrService) {}

  success(message: string, title: string = 'Success') {
    this.toastr.success(message, title, {
      progressBar: true,
      progressAnimation: 'increasing',
      timeOut: 3000,
      closeButton: true,
      positionClass: 'toast-top-right',
      tapToDismiss: true,
      enableHtml: true
    });
  }

  error(message: string, title: string = 'Error') {
    this.toastr.error(message, title, {
      progressBar: true,
      progressAnimation: 'increasing',
      timeOut: 4000,
      closeButton: true,
      positionClass: 'toast-top-right',
      tapToDismiss: true,
      enableHtml: true
    });
  }

  warning(message: string, title: string = 'Warning') {
    this.toastr.warning(message, title, {
      progressBar: true,
      progressAnimation: 'increasing',
      timeOut: 3500,
      closeButton: true,
      positionClass: 'toast-top-right',
      tapToDismiss: true
    });
  }

  info(message: string, title: string = 'Info') {
    this.toastr.info(message, title, {
      progressBar: true,
      progressAnimation: 'increasing',
      timeOut: 3000,
      closeButton: true,
      positionClass: 'toast-top-right',
      tapToDismiss: true
    });
  }

  loading(message: string = 'Loading...') {
    return this.toastr.info(message, '', {
      progressBar: true,
      progressAnimation: 'increasing',
      timeOut: 0,
      closeButton: false,
      positionClass: 'toast-top-right',
      tapToDismiss: false,
      disableTimeOut: true
    });
  }
} 