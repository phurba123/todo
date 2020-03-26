import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user/user.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
let DashboardModule = class DashboardModule {
};
DashboardModule = tslib_1.__decorate([
    NgModule({
        declarations: [UserComponent],
        imports: [
            CommonModule,
            RouterModule,
            FormsModule
        ]
    })
], DashboardModule);
export { DashboardModule };
//# sourceMappingURL=dashboard.module.js.map