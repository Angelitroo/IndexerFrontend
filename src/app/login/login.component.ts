import { Component, OnInit } from '@angular/core';
import { IonicModule, ToastController } from "@ionic/angular";
import { Router, RouterLink } from "@angular/router";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs/operators';
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    RouterLink,
    ReactiveFormsModule,
    CommonModule
  ]
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  isLoading = false;
  isRegistro: boolean = false;
  paises: string[] = [
    'España', 'Francia', 'Alemania', 'Italia', 'Reino Unido', 'Portugal', 'Bélgica',
    'Países Bajos', 'Suecia', 'Noruega', 'Dinamarca', 'Finlandia', 'Suiza', 'Austria',
    'Polonia', 'República Checa', 'Hungría', 'Rumanía', 'Bulgaria'
  ];


  private apiUrl = 'http://localhost:8080/auth/login';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private toastController: ToastController,
    private authService: AuthService
  ) {

    this.loginForm = this.fb.group({

      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit() { }

  cambioRegistro() {
    this.isRegistro = !this.isRegistro;
  }


  async presentToast(message: string, color: 'success' | 'danger' = 'danger') {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'bottom',
      color: color
    });
    toast.present();
  }

  login() {
    if (this.loginForm.invalid) {
      this.presentToast('Por favor, completa todos los campos correctamente.');
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const credentials = this.loginForm.value;

    this.http.post<any>(this.apiUrl, credentials)
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          this.presentToast('Inicio de sesión exitoso!', 'success');

          if(this.authService.esAdmin()) {
            this.router.navigateByUrl('/paneladmin');
          }
          else {
            this.router.navigateByUrl('/principal');
          }
        },

        error: (error: HttpErrorResponse) => {
          console.error('Login failed:', error);

          let errorMessage = 'Error de inicio de sesión. Inténtalo de nuevo.';
          if (error.status === 401 || error.status === 403) {
            errorMessage = 'Credenciales incorrectas. Verifica tu correo y contraseña.';
          } else if (error.status === 0) {
            errorMessage = 'No se pudo conectar al servidor. Verifica tu conexión o que el servidor esté corriendo.';
          } else if (error.error && typeof error.error === 'string') {
            errorMessage = error.error;
          } else if (error.error && error.error.message) {
            errorMessage = error.error.message;
          }

          this.presentToast(errorMessage, 'danger');
        }
      });
  }
}
