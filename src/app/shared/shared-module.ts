import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from './navbar/navbar';
import { Layout } from './layout/layout';
import { MenubarModule } from 'primeng/menubar';
import { ScrollTopModule } from 'primeng/scrolltop';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    Navbar,
    Layout,

  ],
  imports: [
    CommonModule,
    MenubarModule,
    ScrollTopModule,
    RouterModule
  ],
  exports: [
    Navbar,
    Layout,
    CommonModule,
    RouterModule
  ]
})
export class SharedModule { }
