import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from './navbar/navbar';
import { Layout } from './layout/layout';
import { MenubarModule } from 'primeng/menubar';



@NgModule({
  declarations: [
    Navbar,
    Layout,

  ],
  imports: [
    CommonModule,
    MenubarModule
  ],
  exports: [
    Navbar,
    Layout,
    CommonModule
  ]
})
export class SharedModule { }
