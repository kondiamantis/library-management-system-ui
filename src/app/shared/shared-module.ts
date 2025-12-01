import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Navbar } from './navbar/navbar';
import { Layout } from './layout/layout';
import { MenubarModule } from 'primeng/menubar';
import { MenuModule } from 'primeng/menu';
import { ScrollTopModule } from 'primeng/scrolltop';
import { RouterModule } from '@angular/router';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@NgModule({
  declarations: [
    Navbar,
    Layout,

  ],
  imports: [
    CommonModule,
    FormsModule,
    MenubarModule,
    MenuModule,
    ScrollTopModule,
    RouterModule,
    ToolbarModule,
    ButtonModule,
    TooltipModule,
    TagModule,
    DialogModule,
    FloatLabelModule,
    InputTextModule,
    TextareaModule,
    ToastModule
  ],
  exports: [
    Navbar,
    Layout,
    CommonModule,
    RouterModule
  ],
  providers: [
    MessageService
  ]
})
export class SharedModule { }
