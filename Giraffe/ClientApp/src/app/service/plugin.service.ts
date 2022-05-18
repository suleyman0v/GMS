import { Injectable } from '@angular/core';
declare var $: any;

declare var renderCalendar: any;
declare var getStackIcon: any;
declare var dayjs: any;
declare var tinymce: any;
declare var utils: any;
@Injectable({
  providedIn: 'root'
})
export class PluginService {
  constructor() { }

  setBulkActions(e): void {
    var checkboxBulkAction = $(e);
    setTimeout(() => {
      let bulkActions = $(checkboxBulkAction.data('checkbox-actions'));
      let replacedElement = $(checkboxBulkAction.data('checkbox-replaced-element'));
      bulkActions.addClass('d-none');
      replacedElement.removeClass('d-none');
      let rowCheckboxes;
      rowCheckboxes = $(checkboxBulkAction.data('checkbox-body')).find('.checkbox-bulk-select-target');
      checkboxBulkAction.off().on('click', function () {
        rowCheckboxes = $(checkboxBulkAction.data('checkbox-body')).find('.checkbox-bulk-select-target');
        if (checkboxBulkAction.attr('indeterminate') === 'indeterminate') {
          bulkActions.addClass('d-none');
          replacedElement.removeClass('d-none');
          checkboxBulkAction.prop('indeterminate', false).attr('indeterminate', false);
          checkboxBulkAction.prop('checked', false).attr('checked', false);
          rowCheckboxes.prop('checked', false).attr('checked', false);
          rowCheckboxes.each(function (i, v) {
            var $this = $(v);
            $('#' + $this[0].id).parents('tr').removeClass('bg-gray');
          });
        }
        else {
          bulkActions.toggleClass('d-none');
          replacedElement.toggleClass('d-none');
          if (checkboxBulkAction.attr('checked')) {
            checkboxBulkAction.prop('checked', false).attr('checked', false);
          } else {
            checkboxBulkAction.prop('checked', true).attr('checked', true);
          }
          rowCheckboxes.each(function (i, v) {
            var $this = $(v);
            if ($this.attr('checked')) {
              $this.prop('checked', false).attr('checked', false);
              $('#' + $this[0].id).parents('tr').removeClass('bg-gray');
            } else {
              $this.prop('checked', true).attr('checked', true);
              $('#' + $this[0].id).parents('tr').removeClass('bg-gray');
            }
          });
        }
      });
      $(checkboxBulkAction.data('checkbox-body')).on('click', function () {
        rowCheckboxes = $(checkboxBulkAction.data('checkbox-body')).find('.checkbox-bulk-select-target');
        rowCheckboxes.off().on('click', function (e) {
          let $this = $(e.target);
          if ($this.attr('checked')) {
            $this.prop('checked', false).attr('checked', false);
            $('#' + $this[0].id).parents('tr').removeClass('bg-gray');
          } else {
            $this.prop('checked', true).attr('checked', true);
            $('#' + $this[0].id).parents('tr').addClass('bg-gray');
          }
          rowCheckboxes.each(function (i, v) {
            let $elem = $(v);
            if ($elem.attr('checked')) {
              checkboxBulkAction.prop('indeterminate', true).attr('indeterminate', 'indeterminate');
              bulkActions.removeClass('d-none');
              replacedElement.addClass('d-none');
              return false;
            }
            if (i === checkboxBulkAction.length) {
              checkboxBulkAction.prop('indeterminate', false).attr('indeterminate', false);
              checkboxBulkAction.prop('checked', false).attr('checked', false);
              bulkActions.addClass('d-none');
              replacedElement.removeClass('d-none');
            }
            return true;
          });
        })
      });
    }, 100);
  }
  getBulkActions(e, type): any {
    let _array = [];
    let checkboxBulkAction = $(e);
    let rowCheckboxes = $(checkboxBulkAction.data('checkbox-body')).find('.checkbox-bulk-select-target');
    rowCheckboxes.each(function (i, v) {
      let $this = $(v);
      let id = $this[0].id.replace(type, '')
      if ($this.attr('checked')) {
        _array.push(id);
      }
    });
    return _array;
  }
  setCalendar(events): void {
    //var events = [{
    //  title: 'asd',
    //  start: "2020-11-01 10:00:00",
    //  end: "2020-11-03 16:00:00",
    //  description: "Boston Harbor Now in partnership with the Friends of Christopher Columbus Park, the Wharf District Council and the City of Boston is proud to announce the New Year's Eve Midnight Harbor Fireworks! This beloved nearly 40-year old tradition is made possible by the generous support of local waterfront organizations and businesses and the support of the City of Boston and the Office of Mayor Marty Walsh.",
    //  className: 'bg-soft-success',
    //  location: 'Boston Harborwalk, Christopher Columbus Park, </br> Boston, MA 02109, United States',
    //  organizer: 'Boston Harbor Now',
    //  schedules: []
    //}];
    var Selectors = {
      ACTIVE: '.active',
      CALENDAR: 'appCalendar',
      CALENDAR_TITLE: '.calendar-title',
      NAVBAR_VERTICAL_TOGGLE: '.navbar-vertical-toggle',
      EVENT_DETAILS_MODAL: '#eventDetails',
      EVENT_DETAILS_MODAL_CONTENT: '#eventDetails .modal-content',
      DATA_EVENT: '[data-event]',
      DATA_CALENDAR_VIEW: '[data-fc-view]',
      DATA_VIEW_TITLE: '[data-view-title]',
      INPUT_TITLE: '[name="title"]'
    };
    var Events = {
      CLICK: 'click',
      NAVBAR_VERTICAL_TOGGLE: 'navbar.vertical.toggle',
      SHOWN_BS_MODAL: 'shown.bs.modal',
      SUBMIT: 'submit'
    };
    var DataKeys = {
      EVENT: 'event'
    };
    var ClassNames = {
      ACTIVE: 'active'
    };
    var eventList = events.reduce(function (acc, val) {
      return val.schedules ? acc.concat(val.schedules.concat(val)) : acc.concat(val);
    }, []);
    var updateTitle = function updateTitle(title) {
      return $(Selectors.CALENDAR_TITLE).text(title);
    };
    var calendarEl = document.getElementById(Selectors.CALENDAR);
    if (calendarEl) {
      var calendar = renderCalendar(calendarEl, {
        headerToolbar: false,
        dayMaxEvents: 2,
        height: 800,
        stickyHeaderDates: false,
        views: {
          week: {
            eventLimit: 3
          }
        },
        eventTimeFormat: {
          hour: 'numeric',
          minute: '2-digit',
          omitZeroMinute: true,
          meridiem: true
        },
        events: eventList,
        eventClick: function eventClick(info) {
          if (info.event.url) {
            window.open(info.event.url, '_blank');
            info.jsEvent.preventDefault();
          } else {
            var template = getTemplate(info);
            console.log(template)
            $(Selectors.EVENT_DETAILS_MODAL_CONTENT).html(template);
            $(Selectors.EVENT_DETAILS_MODAL).modal('show');
          }
        },
        dateClick: function dateClick(info) {
          //$(Selectors.ADD_EVENT_MODAL).modal('show');
          ///* eslint-disable-next-line */

          //var flatpickr = document.querySelector("#addEvent [name='startDate']")._flatpickr;

          //flatpickr.setDate([info.dateStr]);
        }
      });
      updateTitle(calendar.currentData.viewTitle);
      $(document).on(Events.CLICK, Selectors.DATA_EVENT, function (_ref) {
        var currentTarget = _ref.currentTarget;
        var type = $(currentTarget).data(DataKeys.EVENT);
        switch (type) {
          case 'prev':
            calendar.prev();
            updateTitle(calendar.currentData.viewTitle);
            break;
          case 'next':
            calendar.next();
            updateTitle(calendar.currentData.viewTitle);
            break;
          case 'today':
            calendar.today();
            break;
          default:
            calendar.today();
            break;
        }
      });
      $(document).on('click', Selectors.DATA_CALENDAR_VIEW, function (e) {
        e.preventDefault();
        var el = $(e.currentTarget);
        var text = el.text();
        el.parent().find('.active').removeClass(ClassNames.ACTIVE);
        el.addClass('active');
        $(Selectors.DATA_VIEW_TITLE).text(text);
        calendar.changeView(el.data('fc-view'));
        updateTitle(calendar.currentData.viewTitle);
      });
    }
    var getTemplate = function getTemplate(info) {
      return "\n  <div class=\"modal-header px-card bg-light border-0 flex-between-center\">\n" +
        "<div>\n <h5 class=\"mb-0\">" + info.event.title + "</h5>\n " + (info.event.extendedProps.organizer ?
          "<p class=\"mb-0 fs--1 mt-1\">\n by " + "<a href=\"#!\">" + info.event.extendedProps.organizer + "</a>\n </p>" : '') + "\n </div>\n \n " +
        "<button class=\"close fs-0 px-card\" data-dismiss=\"modal\" aria-label=\"Close\">\n <span class=\"fas fa-times\"></span>\n    </button>\n  </div>\n  " +
        "<div class=\"modal-body px-card pb-card pt-1 fs--1\">\n    " + (info.event.extendedProps.description ? "\n <div class=\"media mt-3\">\n " + getStackIcon('fas fa-align-left') + "\n <div class=\"media-body\">\n <h6>Description</h6>\n <p class=\"mb-0\">\n \n " + info.event.extendedProps.description.split(' ').slice(0, 30).join(' ') + "\n </p>\n </div>\n </div>\n " : '') + " \n   " +
        " <div class=\"media mt-3\">\n " + getStackIcon('fas fa-calendar-check') + "\n <div class=\"media-body\">\n <h6>Start Date and Time</h6>\n <p class=\"mb-1\">\n " + (dayjs && dayjs(info.event.start).format('dddd, MMMM D, YYYY, h:mm A')) + " \n            " + (info.event.end ? " <br/>" + (dayjs && dayjs(info.event.end).subtract(1, 'day').format('dddd, MMMM D, YYYY, h:mm A')) : '') + "\n          </p>\n      </div>\n    </div>\n    " + (info.event.extendedProps.location ? "\n          <div class=\"media mt-3\">\n            " + getStackIcon('fas fa-map-marker-alt') + "\n            <div class=\"media-body\">\n                <h6>Location</h6>\n                <div class=\"mb-1\">" + info.event.extendedProps.location + "</div>\n            </div>\n          </div>\n        " : '') + "\n    " + (info.event.extendedProps.schedules ? "\n          <div class=\"media mt-3\">\n          " + getStackIcon('fas fa-clock') + "\n          <div class=\"media-body\">\n              <h6>Schedule</h6>\n              \n              <ul class=\"list-unstyled timeline mb-0\">\n                " + info.event.extendedProps.schedules.map(function (schedule) {
          return "<li>" + schedule.title + "</li>";
        }).join('') + "\n              </ul>\n          </div>\n        " : '') + "\n    </div>\n  </div>\n  <div class=\"modal-footer d-flex justify-content-end bg-light px-card border-top-0\">\n    <a href=\"pages/event-create.html\" class=\"btn btn-falcon-default btn-sm\">\n <span class=\"fas fa-pencil-alt fs--2 mr-2\"></span> Edit\n    </a>\n    <a href='pages/event-detail.html' class=\"btn btn-falcon-primary btn-sm\">\n      See more details\n      <span class=\"fas fa-angle-right fs--2 ml-1\"></span>\n    </a>\n  </div\n  ";
    };
  }

  setRaty(elementid, score: number): void {
    var ratings = $('#' + elementid);
    if (ratings.length) {
      ratings.each(function (index, value) {
        var $this = $(value);
        var options = $.extend({
          cancel: true,
          starHalf: 'star-half-png text-warning',
          starOff: 'star-off-png text-300',
          starOn: 'star-on-png text-warning',
          starType: 'span',
          size: 30,
          score: score,
        }, $this.data('options'));
        $(value).raty(options);
      });
    }
  }
  setTinymce(elementid, html: string) {
    var tinymces = $('#' + elementid);
    if (tinymces.length) {
      if (tinymce) {
        tinymce.remove()
        tinymce.execCommand('mceRemoveControl', true, '.editable');
      }
      tinymce.init({
        selector: '#' + elementid,
        height: '30vh',
        menubar: false,
        mobile: {
          theme: 'silver',
          menubar: true,
          toolbar: 'undo redo bold italic underline styleselect'
        },
        statusbar: false,
        plugins: 'link,image,lists,table,media',
        toolbar: 'styleselect | bold italic link bullist numlist image blockquote table media undo redo',
        setup: function (editor) {
          editor.on('init', function (e) {
            editor.setContent(html);
          });
        }
      });
    }
  }
  getTinymce(elementid): any {
    return tinymce.get(elementid).getContent();
  }
  setNavbar() {
    var $navbar = $('.navbar-theme');

    if ($navbar.length) {
      var windowHeight = utils.$window.height();
      utils.$window.scroll(function () {
        var scrollTop = utils.$window.scrollTop();
        var alpha = scrollTop / windowHeight * 2;
        alpha >= 1 && (alpha = 1);
        $navbar.css({
          'background-color': "rgba(11, 23, 39, " + alpha + ")"
        });
      }); // Fix navbar background color [after and before expand]

      var classList = $navbar.attr('class').split(' ');
      var breakpoint = classList.filter(function (c) {
        return c.indexOf('navbar-expand-') >= 0;
      })[0].split('navbar-expand-')[1];
      utils.$window.resize(function () {
        if (utils.$window.width() > utils.breakpoints[breakpoint]) {
          return $navbar.removeClass('bg-dark');
        }

        if (!$navbar.find('.navbar-toggler').hasClass('collapsed')) {
          return $navbar.addClass('bg-dark');
        }

        return null;
      }); // Top navigation background toggle on mobile

      $navbar.on('show.bs.collapse hide.bs.collapse', function (e) {
        $(e.currentTarget).toggleClass('bg-dark');
      });
    }
  }
  openFile(dataurl, filename, type) {
    if (type.match(/^.*jpg$/) || type.match(/^.*png$/) || type.match(/^.*jpeg$/)) {
      window.open(dataurl);
    }
    else {
      var a = document.createElement("a");
      a.href = dataurl;
      a.setAttribute("download", filename);
      a.click();
    }
  }
  downloadFile(dataurl, filename) {
    var a = document.createElement("a");
    a.href = dataurl;
    a.setAttribute("download", filename);
    a.click();
  }
  compareObjects(object1, object2, delKeys) {
    let keys1 = Object.keys(object1);
    for (let key of keys1) {
      let delk = delKeys.find(x => x == key) == undefined ? true : false;
      if (JSON.stringify(object1[key]) != JSON.stringify(object2[key]) && delk) {
        return true;
      }
    }
    return false;
  }
  mouserOverVertical(): void {
    var Selector = {
      NAVBAR_VERTICAL_COLLAPSE: '#navbarVerticalCollapse',   //
      NAVBAR_VERTICAL_COLLAPSED: '.navbar-vertical-collapsed',   //
    };
    var ClassName = {
      NAVBAR_VERTICAL_COLLAPSE_HOVER: 'navbar-vertical-collapsed-hover'//
    };
    var $navbarVerticalCollapse = $(Selector.NAVBAR_VERTICAL_COLLAPSE);
    $navbarVerticalCollapse.hover(function (e) {
      setTimeout(function () {
        if ($(e.currentTarget).is(':hover')) {
          $(Selector.NAVBAR_VERTICAL_COLLAPSED).addClass(ClassName.NAVBAR_VERTICAL_COLLAPSE_HOVER);
        }
      }, 100);
    }, function () {
      $(Selector.NAVBAR_VERTICAL_COLLAPSED).removeClass(ClassName.NAVBAR_VERTICAL_COLLAPSE_HOVER);
    });
  }
  saveByteArray(reportName, byte) {
    var blob = new Blob([byte], { type: "application/pdf" });
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    var fileName = reportName;
    link.download = fileName;
    link.click();
  };
  base64ToArrayBuffer(base64) {
    var binaryString = window.atob(base64);
    var binaryLen = binaryString.length;
    var bytes = new Uint8Array(binaryLen);
    for (var i = 0; i < binaryLen; i++) {
      var ascii = binaryString.charCodeAt(i);
      bytes[i] = ascii;
    }
    return bytes;
  }
  viewPDF(data, h, w) {
    var sampleArr = this.base64ToArrayBuffer(data);
    var blob = new Blob([sampleArr], { type: "application/pdf" });
    var link = window.URL.createObjectURL(blob);
    window.open(link,'_blank');
  }
  downloadPDF(data, name) {
    var sampleArr = this.base64ToArrayBuffer(data);
    this.saveByteArray(name, sampleArr);
  }

}
