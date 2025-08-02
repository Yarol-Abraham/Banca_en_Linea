import { Routes } from "@angular/router";
import { MainLayoutComponent } from "../layouts/main-layout/main-layout.component";
import { HomePageComponent } from "../pages/home-page/home-page.component";
import { AuthPageComponent } from "../pages/auth-page/auth-page.component";
import { BalanceAccountComponent } from "../balance/components/balance-account/balance-account.component";
import { BalanceCardComponent } from "../balance/components/balance-card/balance-card.component";
import { BalanceMovementComponent } from "../balance/components/balance-movement/balance-movement.component";
import { TransferAccountComponent } from "../transfer/components/transfer-account/transfer-account.component";

const storeFrontRoutes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            {
                path: '',
                component: HomePageComponent
            },
            {
                path: 'login',
                component: AuthPageComponent
            },
            {
                path: 'accounts',
                component: BalanceAccountComponent
            },
            {
                path: 'cards',
                component: BalanceCardComponent
            },
            {
                path: 'movements/:fromAccount',
                component: BalanceMovementComponent
            },
             {
                path: 'transfer',
                component: TransferAccountComponent
            },
            {
                path: '**',
                redirectTo: 'login'
            }
        ]
    }
]

export default storeFrontRoutes;
