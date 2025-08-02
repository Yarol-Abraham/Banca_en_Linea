import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-page',
  imports: [ReactiveFormsModule],
  templateUrl: './auth-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class AuthPageComponent { 

  fomrbuilder = inject(FormBuilder);
  hasError = signal(false);
  isPosting = signal(false);
  router = inject(Router);
  authService = inject(AuthService);

  loginForm = this.fomrbuilder.group({
    email: ['', [ Validators.required, Validators.email ]],
    password: ['', [ Validators.required, Validators.minLength(4) ]]
  })

  showErrorSimple() {
    this.hasError.set(true);
      setTimeout(()=> {
        this.hasError.set(false);
      }, 2000);
  }

  onSubmit() {
    if(this.loginForm.invalid){
      this.showErrorSimple();
      return;
    }

    const { email = '', password = '' } = this.loginForm.value;

    this.authService.login(email!, password!).subscribe( (isAuthenticated) => {
        if(isAuthenticated) {
          this.router.navigateByUrl('/');
          return;
        }
    });
  }

}
