import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Menu } from 'src/app/_models/menu';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { DynamicAsideMenuConfig } from '../../configs/dynamic-aside-menu.config';

@Injectable({
  providedIn: 'root'
})
export class DynamicAsideMenuService {

  constructor(public auth: AuthenticationService) {
    this.loadMenu();
  }

  // Here you able to load your menu from server/data-base/localStorage
  // Default => from DynamicAsideMenuConfig
  public loadMenu() {
    var menuConfig = DynamicAsideMenuConfig;
    const user = this.auth.currentUserValue;
    if (user !== null || !user) {
      var roles = user.Roles;
      var permisioncodes = [];
      roles.forEach(p => {
        p.Permissions.forEach(pr => {
          if (permisioncodes.indexOf(pr) < 0)
            permisioncodes.push(pr);
        });
      });
      this._menus = Object.assign(new Array<Menu>(), []);
      menuConfig.items.forEach(data => {
        var menu = Object.assign(new Menu(), data);
        var isSysAdmin = roles.find(r => r.isSysadmin);
        if (isSysAdmin && isSysAdmin !== undefined) {
          this._menus.push(menu);
        } else {
          var permission = permisioncodes.find(permenu => menu.permission.indexOf(permenu) >= 0);
          if (permission && permission !== undefined) {
            var listMenu = menu.submenu.filter(p => permisioncodes.indexOf(p.permission) < 0);
            for (let i = 0; i < listMenu.length; i++) {
              var item = listMenu[i];
              var index = menu.submenu.findIndex(m => m.page === item.page);
              menu.submenu.splice(index, 1);
            }
            if (menu.submenu.length > 0)
              this._menus.push(menu);
          }
        }
      });
      this._items$.next(this._menus);
    }
  }

  _menus: Menu[] = [];
  protected _items$ = new BehaviorSubject<Menu[]>([]);
  get items$() {
    return this._items$.asObservable();
  }
}
