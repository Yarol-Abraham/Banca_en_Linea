import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BalanceService } from '../../services/balance.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-balance-movement',
  imports: [CommonModule],
  templateUrl: './balance-movement.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BalanceMovementComponent { 

  private route = inject(ActivatedRoute);
  fromAccount: string = this.route.snapshot.paramMap.get('fromAccount') || '';

  accountService = inject(BalanceService);
  
  movementsResource = rxResource({
    params: () => ({ fromAccount: this.fromAccount }),
    stream: ({ params }) => {
      return this.accountService.getMovements(params.fromAccount);
    }    
  })


}
