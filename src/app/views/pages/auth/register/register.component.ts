import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';
import { LocalstorageService } from '../services/localstorage.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class RegisterComponent implements OnInit {

  passwordVisible: boolean = false
  registerFormGroup!: FormGroup;
  
  isSubmitted: boolean = false;
  authError: boolean = false;
  authMessage:string = 'Email or Password are wrong';
  constructor(
    private _formBuilder: FormBuilder,
    private _auth: AuthService,
    private _localstorageService: LocalstorageService,
    private _toast: ToastrService,
    private _router: Router
  ) { }
  initRegisterForm() {
    this.registerFormGroup = this._formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }
  onSubmit() {
    this.isSubmitted = true;

    if (this.registerFormGroup.invalid) return;

    this._auth.register(this.registerForm.name.value,this.registerForm.email.value, this.registerForm.password.value).subscribe({
      next: (user) => {
        this.authError = false;
        this._localstorageService.setToken(user.token);
        this._auth.startRefreshTokenTimer();
        this._toast.success('Congrats! You are registered');
        this._router.navigate(['/auth']);
      },
      error: (error: HttpErrorResponse) => {
        console.log(error)
        this.authError = true;
        if (error.status !== 400) {
          this.authMessage = error.message;
        }
        this._toast.error(`There was an error: ${error.message}`);
      }
    });
  }


  get registerForm() {
    return this.registerFormGroup.controls;
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
    this.initRegisterForm()
  }
}
