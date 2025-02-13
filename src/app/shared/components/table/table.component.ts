import { CommonModule } from '@angular/common';
import { Component, Input, output } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { Menu } from 'primeng/menu';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { TableModule } from 'primeng/table';
import { Column } from './model/Column.model';

@Component({
  selector: 'app-table',
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    Menu,
    BadgeModule,
    OverlayBadgeModule,
  ],
  standalone: true,
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
})
export class TableComponent {
  constructor(private router: Router) {}
  onAdd = output();

  items: MenuItem[] = [];

  @Input({ required: true }) cols!: Column[];
  @Input({ required: true }) data!: any[];
  onEdit = output();

  first = 0;

  rows = 10;

  next() {
    this.first = this.first + this.rows;
  }

  prev() {
    this.first = this.first - this.rows;
  }

  reset() {
    this.first = 0;
  }

  pageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }

  isLastPage(): boolean {
    return this.data ? this.first + this.rows >= this.data.length : true;
  }

  isFirstPage(): boolean {
    return this.data ? this.first === 0 : true;
  }

  setMenuItem(targetRow: any) {
    if (!targetRow) {
      this.items = [];
      return;
    }

    this.items = [
      {
        label: 'Options',
        items: [
          {
            label: 'Edit',
            badge: targetRow?.errors?.length || '',
            badgeStyleClass: 'p-badge-danger',
            icon: 'pi pi-pencil',
            command: () => {
              this.onEdit.emit(targetRow.id);
            },
          },
          {
            label: 'Download',
            icon: 'pi pi-download',
          },
        ],
      },
    ];
  }
}
