import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { LocalstorageService } from '../services/localstorage.service';
import { ToastrService } from 'ngx-toastr';
import { ToastService } from '../../services/toast.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ]
})



export class LoginComponent  {
  passwordVisible: boolean = false
  loginFormGroup!: FormGroup;
  isSubmitted: boolean = false;
  authError: boolean = false;
  authMessage:string = 'Email or Password are wrong';
  isPhoneLogin: boolean = false;
  
  constructor(
    private _formBuilder: FormBuilder,
    private _auth: AuthService,
    private _localstorageService: LocalstorageService,
    private _toast: ToastrService,
    private toast: ToastService,
    private _router: Router
  ) {}

  initLoginForm() {
    this.loginFormGroup = this._formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(/^\d+$|^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      password: ['', Validators.required]
    });

  }
  
  onSubmit() {
    const loadingToast = this.toast.loading('Logging in...');
    this.isPhoneLogin = /^\d+$/.test(this.loginForm.email.value);

    this.isSubmitted = true;

    if (this.loginFormGroup.invalid) return;

    this._auth.login(this.loginForm.email.value, this.loginForm.password.value, this.isPhoneLogin).subscribe({
      next: (user) => {
        // Remove loading toast
        this._toast.clear(loadingToast.toastId);
        
        this.authError = false;
        this._localstorageService.setToken(user.token);
        this._auth.startRefreshTokenTimer();
        this._toast.success('Welcome back!', 'Login Successful');
        this._router.navigate(['/products']);
      },
      error: (error) => {
        // Remove loading toast
        this._toast.clear(loadingToast.toastId);
        
        this.authError = true;
        if (error.status === 401) {
          this.authMessage = 'Invalid credentials';
        } else {
          this.authMessage = `Login failed: ${error.message}`;
        }
        this._toast.error(this.authMessage);
      }
    });
  }

  get loginForm() {
    return this.loginFormGroup.controls;
  }
  /*
    ----------------------------------------
    ========== visibility Toggle ===========
    ----------------------------------------
  */
  visibilityToggle() {
    if (this.passwordVisible == false) {
      this.passwordVisible = true
    }
    else {
      this.passwordVisible = false
    }
  }

  ngOnInit(): void {
    this.initLoginForm()
  }

}


