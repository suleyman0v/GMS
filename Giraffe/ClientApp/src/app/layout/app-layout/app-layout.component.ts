import { Component, OnInit } from '@angular/core';
import { ReqResService } from '../../service/req-res.service';
import { AuthService } from '../../service/auth/auth.service'
import { PluginService } from '../../service/plugin.service';
declare var $: any;

@Component({
    selector: 'app-layout',
    templateUrl: './app-layout.component.html',
    styleUrls: ['./app-layout.component.css']
})
export class AppLayoutComponent implements OnInit {
    favoritetMenus: any;
    menus: any;
    toggleButtonTitle: string;
    public _authService;
    constructor(private reqRes: ReqResService, private authService: AuthService, private pluginService: PluginService) {
        this._authService = this.authService;
    }
    ngOnInit(): void {
        this.getFavoritetMenus();
        this.getMenus();
        setTimeout(function () {
            $("span.fs-4").each(function () {
                $(this).removeClass('fs-4');
                $(this).children().addClass('fs-4');
            });
        }, 100);
        //$('#submenu-Leads').on('click', function () {
        //    console.log('sikk')
        //    $('.nav-link').collapse('hide');
        //});
        //$('#navbar-nav > li').click(function (e) {
        //    console.log('sikk')
        //    e.stopPropagation()
        //    var parent = $(this)
        //    $(this).find('ul').each(function () {
        //        if ($(this).is(':visible')) {
        //            $(this).hide()
        //        } else {
        //            if ($(this).parent().is(parent)) {
        //                $(this).show()
        //            }
        //        }
        //    })
        //    $(this).siblings().children('ul').hide()
        //})
        let vertCollapseOpe = $('html').hasClass('navbar-vertical-collapsed');
        $(".navbar-vertical-toggle").mouseenter(function () {
            if (vertCollapseOpe) {
                $('.navbar-vertical-toggle').tooltip('hide')
                    .attr('data-original-title', 'Expand menu')
                    .tooltip('show');
            }
            else {
                $('.navbar-vertical-toggle').tooltip('hide')
                    .attr('data-original-title', 'Collapse menu')
                    .tooltip('show');
            }

        });
        $('.navbar-vertical-toggle').click(function () {
            setTimeout(function () {
                vertCollapseOpe = $('html').hasClass('navbar-vertical-collapsed');
                if (vertCollapseOpe) {
                    $('.navbar-vertical-toggle').tooltip('hide')
                        .attr('data-original-title', 'Expand menu')
                        .tooltip('show');
                }
                else {
                    $('.navbar-vertical-toggle').tooltip('hide')
                        .attr('data-original-title', 'Collapse menu')
                        .tooltip('show');
                }
            })
        });
        this.pluginService.mouserOverVertical();
    }
    getFavoritetMenus() {
        this.reqRes.getData('/Layout/GetFavoritetMenus').subscribe(data => {
            this.favoritetMenus = data;
        },
            error => {
                console.log(error)
            })
    }
    closeNavBar(ope) {
        if (ope == 1) {
            $("#navbar-nav > li").each(function () {
                let ul = $(this).find('ul');
                if (ul.first().attr('id') != undefined) {
                    $('#' + ul.first().attr('id')).collapse('hide');
                }
            });
        }

        if (window.innerWidth < 1199) { $('#navbarVerticalCollapse').toggleClass('show'); }
    }
    getMenus() {
        this.reqRes.getData('/Layout/GetMenus').subscribe(data => {
          this.menus = data;
        },
            error => {
                console.log(error)
            })
    }
    menuOperation(menuid, submenuid, favoritetope) {
        let menuIndex = this.menus.findIndex(item => item.id == menuid);
        let submenuIndex = this.menus[menuIndex].submenus.findIndex(item => item.id == submenuid);
        this.menus[menuIndex].submenus[submenuIndex].favoritetope = favoritetope == 0 ? 1 : 0;

        let objmenu: any = {};
        objmenu.id = submenuid;
        objmenu.ope = favoritetope == 0 ? 'INS' : 'DEL';

        this.reqRes.postData('/Layout/MenuOperation', objmenu).subscribe(data => {
            this.getFavoritetMenus();
        }, error => { console.log(error) })
    }
    logOut() {
        this._authService.logout();
    }
}
