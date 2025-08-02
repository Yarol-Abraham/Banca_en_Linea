import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { BalanceService } from '../../../balance/services/balance.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-transfer-account',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './transfer-account.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransferAccountComponent { 

  selectedOption = '';
  selectedType = ''; 
  hasConfirm =  signal(false);
  hasError = signal(false);

  fomrbuilder = inject(FormBuilder);
  transferForm = this.fomrbuilder.group({
    fromAccountNumber: ['', [ Validators.required ]],
    toAccountNumber: ['', [ Validators.required ]],
    amount: ['', [ Validators.required ]],
    description: ['', [ Validators.required ]],
  })

  accountService = inject(BalanceService);

  accountResource = rxResource({
      params: () => ({}),
      stream: () => {
        return this.accountService.getAccounts();
      }
  });

  onOptionChange(event: Event) {
    const valor = (event.target as HTMLSelectElement).value;
    this.selectedOption = valor;
    let item = this.accountResource.value()?.data.filter(el => el.accountNumber = valor) || [];
    if(item.length > 0){
      this.selectedType = `${item[0].balance}`;
    }
    console.log('Seleccionado:', valor);
  }
 
  showErrorSimple() {
    this.hasError.set(true);
      setTimeout(()=> {
        this.hasError.set(false);
      }, 2000);
  }

   showConfirmSimple() {
    this.hasConfirm.set(true);
      setTimeout(()=> {
        this.hasConfirm.set(false);
      }, 2000);
  }

  onSubmit() {

     if(this.transferForm.invalid){
      this.showErrorSimple();
      return;
    }
    this.accountService.createTransfer(this.transferForm.value).subscribe( (response) => {
        if(response.status){
          this.showConfirmSimple();
        }
        this.selectedType = '';
        this.transferForm.reset({
          description: '',
          amount: '',
          toAccountNumber: ''
      });

    });
  }



}
