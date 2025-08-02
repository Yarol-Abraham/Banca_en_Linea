import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { BalanceService } from '../../services/balance.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-balance-card',
  imports: [RouterLink, CommonModule],
  templateUrl: './balance-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BalanceCardComponent { 

  accountService = inject(BalanceService);

  cardResource = rxResource({
      params: () => ({}),
      stream: () => {
        return this.accountService.getCards();
      }
  });

}
