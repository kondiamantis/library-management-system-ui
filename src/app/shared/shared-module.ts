import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from './navbar/navbar';
import { Layout } from './layout/layout';
import { MenubarModule } from 'primeng/menubar';
import { ScrollTopModule } from 'primeng/scrolltop';
import { RouterModule } from '@angular/router';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';

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
    ButtonModule
  ],
  exports: [
    Navbar,
    Layout,
    CommonModule,
    RouterModule
  ]
})
export class SharedModule { }
