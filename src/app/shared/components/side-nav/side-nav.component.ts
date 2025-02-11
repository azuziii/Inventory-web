import { Component, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { Drawer, DrawerModule } from 'primeng/drawer';
import { Ripple } from 'primeng/ripple';
import { StyleClass } from 'primeng/styleclass';

@Component({
  selector: 'app-side-nav',
  imports: [
    DrawerModule,
    ButtonModule,
    Ripple,
    AvatarModule,
    StyleClass,
    RouterLink,
  ],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.css',
})
export class SideNavComponent {
  @ViewChild('drawerRef') drawerRef!: Drawer;

  closeCallback(e: any): void {
    this.drawerRef.close(e);
  }

  visible: boolean = false;
}
