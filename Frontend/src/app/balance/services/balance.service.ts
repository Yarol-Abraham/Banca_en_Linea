import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { AccountResponse } from '../interfaces/balance.interfaces';
import { CardResponse } from '../interfaces/card.interfaces';
import { MovementResponse, TransferResponse } from '../interfaces/movement.interfaces';

@Injectable({providedIn: 'root'})
export class BalanceService {
    
    private baseUrl = environment.baseUrl;
    private httpClient = inject(HttpClient);

    getAccounts(): Observable<AccountResponse> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.httpClient.get<AccountResponse>(`${this.baseUrl}/accounts`, {headers });
    }

    getCards(): Observable<CardResponse> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.httpClient.get<CardResponse>(`${this.baseUrl}/accounts/cards`, {headers });
    }

    getMovements(accountId: string): Observable<MovementResponse> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.httpClient.get<MovementResponse>(`${this.baseUrl}/accounts/${accountId}/movements`, {headers });
    }

    createTransfer(data: object) : Observable<TransferResponse> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.httpClient.post<TransferResponse>(`${this.baseUrl}/accounts/transfer`, data, {
            headers
         });
    }


}