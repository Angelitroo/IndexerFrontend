import { Component, OnInit } from '@angular/core';
import { IonicModule, ToastController } from "@ionic/angular";
import { Router, RouterLink } from "@angular/router";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs/operators';
import { AuthService } from "../services/auth.service";
import { addIcons } from "ionicons";
import {flagOutline, lockClosedOutline, mailOutline, personCircleOutline, personOutline} from "ionicons/icons";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    RouterLink,
    ReactiveFormsModule,
    CommonModule,
    FormsModule
  ]
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  registroForm: FormGroup;
  isLoading = false;
  isRegistro: boolean = false;
  paises: string[] = [
    'España', 'Francia', 'Alemania', 'Italia', 'Reino Unido', 'Portugal', 'Bélgica',
    'Países Bajos', 'Suecia', 'Noruega', 'Dinamarca', 'Finlandia', 'Suiza', 'Austria',
    'Polonia', 'República Checa', 'Hungría', 'Rumanía', 'Bulgaria'
  ];
  modo: boolean = true;
  imagePath: string = '';

  private loginApiUrl = 'http://localhost:8080/auth/login';
  private registroApiUrl = 'http://localhost:8080/auth/registro';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private toastController: ToastController,
    private authService: AuthService
  ) {
    addIcons({
      'person-circle-outline': personCircleOutline,
      'flag-outline': flagOutline,
      'mail-outline': mailOutline,
      'lock-closed-outline': lockClosedOutline,
      'person-outline': personOutline
    });

    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });

    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      pais: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      imagen: ['']
    });
  }

  ngOnInit() {
    const modoGuardado = localStorage.getItem('modo');
    if (modoGuardado !== null) {
      this.modo = JSON.parse(modoGuardado);
    } else {
      this.modo = true;
    }
  }

  cambioRegistro() {
    this.isRegistro = !this.isRegistro;
    if (this.isRegistro) {
      this.loginForm.reset();
    } else {
      this.registroForm.reset();
    }
    this.isLoading = false;
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

    this.http.post<any>(this.loginApiUrl, credentials)
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          if (response && response.token) {
            localStorage.setItem('authToken', response.token);
            console.log('Token stored in localStorage:', response.token);
          } else {
            console.error('Login response did not contain a token field. Response:', response);
            this.presentToast('Error: No se recibió token del servidor.', 'danger');
            return;
          }

          this.presentToast('Inicio de sesión exitoso!', 'success');

          if (this.authService.esAdmin()) {
            this.router.navigateByUrl('/paneladmin');
          } else {
            this.router.navigateByUrl('/principal');
          }
        },
        error: (error: HttpErrorResponse) => {
          console.error('Login failed:', error);
          let errorMessage = 'Error de inicio de sesión. Inténtalo de nuevo.';
          if (error.status === 401 || error.status === 403) {
            errorMessage = 'Credenciales incorrectas. Verifica tu usuario y contraseña.';
          } else if (error.status === 0) {
            errorMessage = 'No se pudo conectar al servidor. Verifica tu conexión o que el servidor esté corriendo.';
          } else if (error.error && typeof error.error === 'string') {
            errorMessage = error.error;
          } else if (error.error && error.error.message) {
            errorMessage = error.error.message;
          } else if (error.error && error.error.mensaje) {
            errorMessage = error.error.mensaje;
          }
          this.presentToast(errorMessage, 'danger');
        }
      });
  }

  registro() {
    if (this.registroForm.invalid) {
      this.presentToast('Por favor, completa todos los campos correctamente para el registro.');
      this.registroForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const registroData = this.registroForm.value;

    this.http.post<string>(this.registroApiUrl, registroData, { responseType: 'text' as 'json' })
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (responseMessage) => {
          console.log('Registro successful:', responseMessage);
          this.presentToast(responseMessage, 'success');
          this.isRegistro = false;
          this.loginForm.reset();
          this.registroForm.reset();
        },
        error: (error: HttpErrorResponse) => {
          console.error('Registro failed:', error);
          let errorMessage = 'Error en el registro. Inténtalo de nuevo.';
          if (error.error && typeof error.error === 'string') {
            errorMessage = error.error;
          } else if (error.status === 0) {
            errorMessage = 'No se pudo conectar al servidor. Verifica tu conexión o que el servidor esté corriendo.';
          } else if (error.error && error.error.message) {
            errorMessage = error.error.message;
          } else if (error.error && error.error.mensaje) {
            errorMessage = error.error.mensaje;
          }
          this.presentToast(errorMessage, 'danger');
        }
      });
  }
}
