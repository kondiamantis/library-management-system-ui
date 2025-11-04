import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from './navbar/navbar';
import { Layout } from './layout/layout';



@NgModule({
  declarations: [
    Navbar,
    Layout,

  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
