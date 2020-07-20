import { NgModule } from "@angular/core";
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { NotfoundComponent } from './notfound/notfound.component';

import { PipesModule } from '../pipes/pipes.module';
import { HeaderComponent } from './header/header.component';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { SidebarComponent } from './sidebar/sidebar.component';


@NgModule({
    imports: [
        RouterModule,
        CommonModule,
        PipesModule
    ],
    declarations: [
        NotfoundComponent,
        HeaderComponent,
        BreadcrumbsComponent,
        SidebarComponent
    ],
    exports: [
        NotfoundComponent,
        HeaderComponent,
        BreadcrumbsComponent,
        SidebarComponent
    ]
})
export class SharedModule { }