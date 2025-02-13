import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { Toolbar } from 'primeng/toolbar';
import { filter, map, mergeMap, Observable } from 'rxjs';
import { SideNavComponent } from '../side-nav/side-nav.component';

@Component({
  selector: 'app-header',
  imports: [Toolbar, ButtonModule, SideNavComponent, AsyncPipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  constructor(
    protected readonly route: Router,
    private readonly activatedRoute: ActivatedRoute,
  ) {}

  items: MenuItem[] | undefined;
  title$!: Observable<string>;

  ngOnInit() {
    this.title$ = this.route.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((_) => this.activatedRoute),
      map((route) => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      mergeMap((route) => route.data),
      map((data) => data['title']),
    );

    this.items = [
      {
        label: 'Update',
        icon: 'pi pi-refresh',
      },
      {
        label: 'Delete',
        icon: 'pi pi-times',
      },
    ];
  }
}
