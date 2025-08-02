import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthResponse, User } from '../interfaces/auth.interfaces';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';


type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';

@Injectable({providedIn: 'root'})
export class AuthService {
    
    private router = inject(Router);
    private _authStatus = signal<AuthStatus>('checking');
    private _user = signal<User|null>(null);
    private _token = signal<string|null>(null);

    private baseUrl = environment.baseUrl;
    private httpClient = inject(HttpClient);

    checkStatusAutenticated = rxResource({
        stream : () => this.checkStatus()
    })

    authStatus = computed<AuthStatus>(() => {
        if(this._authStatus() == 'checking'){
            return 'checking';
        }   

        if(this._user() ){
            return 'authenticated';
        }

        return 'not-authenticated';
    });

    user = computed<User|null>(()=> this._user() );
    token =  computed<string|null>(()=> this._token());

    login(email: string, password: string) : Observable<boolean> {
        return this.httpClient.post<AuthResponse>(`${this.baseUrl}/auth/login`,{
            email,
            password
        })
        .pipe(
            tap(resp => {
                this._authStatus.set('authenticated');
                this._user.set(resp.user);
                this._token.set(resp.token);
                localStorage.setItem('token', resp.token);
            }),
            map(() => true),
            catchError( (error: any ) => {
                this._authStatus.set('not-authenticated');
                this._user.set(null);
                this._token.set(null);
                return of(false);
            })
        );
    }

    checkStatus() : Observable<boolean> {

        const token  = localStorage.getItem('token');

        if(!token){
            this.logout();
            return of(false);
        }

        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.httpClient.get<AuthResponse>(`${this.baseUrl}/auth/validate-token`, {headers })
        .pipe(
            tap(resp => {
                console.log("resp", resp);
                this._authStatus.set('authenticated');
                this._user.set(resp.user);
                this._token.set(resp.token);
                localStorage.setItem('token', resp.token);
            }),
            map(() => true),
            catchError( (error: any ) => {
                this.logout();
                return of(false);
            })
        );
    }

    logout() {
        this._authStatus.set('not-authenticated');
        this._user.set(null);
        this._token.set(null);
        localStorage.removeItem('token');
        this.router.navigate(['/login'])

    }

}