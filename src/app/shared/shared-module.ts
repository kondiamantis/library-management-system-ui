import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from './navbar/navbar';
import { Layout } from './layout/layout';
import { MenubarModule } from 'primeng/menubar';
import { ScrollTopModule } from 'primeng/scrolltop';
import { RouterModule } from '@angular/router';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';

@NgModule({
  declarations: [
    Navbar,
    Layout,

  ],
  imports: [
    CommonModule,
    MenubarModule,
    ScrollTopModule,
    RouterModule,
    ToolbarModule,
    ButtonModule,
    TooltipModule,
    TagModule
  ],
  exports: [
    Navbar,
    Layout,
    CommonModule,
    RouterModule
  ]
})
export class SharedModule { }
