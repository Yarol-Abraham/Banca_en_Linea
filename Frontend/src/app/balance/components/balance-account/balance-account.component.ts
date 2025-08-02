import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BalanceService } from '../../services/balance.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-balance-account',
  imports: [RouterLink, CommonModule],
  templateUrl: './balance-account.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BalanceAccountComponent {

  accountService = inject(BalanceService);

  accountResource = rxResource({
      params: () => ({}),
      stream: () => {
        return this.accountService.getAccounts();
      }
  });

 }
