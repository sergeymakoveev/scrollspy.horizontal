/* ========================================================================
 * Bootstrap: scrollspy.horizontal.js v3.1.0
 * http://getbootstrap.com/javascript/#scrollspyhorizontal
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {

  'use strict';

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpyHorizontal(element, options) {
      var process  = $.proxy(this.process, this);

      this.$element       = $(element).is('body') ? $(window) : $(element);
      this.$body          = $('body');
      this.$scrollElement = this.$element.on({ 'scroll.bs.scroll-spy-horizontal.data-api' : process });
      this.options        = $.extend({}, ScrollSpyHorizontal.DEFAULTS, options);
      this.selector       = ( this.options.target ||
                              ($(element).attr('href') || '').replace(/.*(?=#[^\s]+$)/, '') || //strip for ie7
                              '' ) + ' .nav li > a';
      this.offsets        = $([]);
      this.targets        = $([]);
      this.activeTarget   = null;

      this.refresh();
      this.process();
  };

  ScrollSpyHorizontal.DEFAULTS = {
      offset: 10
  };

  ScrollSpyHorizontal.prototype.refresh = function () {

      this.offsets = $([]);
      this.targets = $([]);

      var self = this,
          offsetMethod = $.isWindow(this.$element.get(0)) ? 'offset' : 'position',
          $targets = this.$body
                         .find(this.selector)
                         .map(function () {
                            var $el   = $(this),
                                href  = $el.data('target') ||
                                        $el.attr('href'),
                                $href = /^#\w/.test(href) &&
                                        $(href);

                            return ( $href &&
                                     $href.length &&
                                     [[ $href[offsetMethod]().left + (!$.isWindow(self.$scrollElement.get(0)) && self.$scrollElement.scrollLeft()),
                                        href ]] ) || null;
                          })
                         .sort(function (a, b) { return a[0] - b[0]; })
                         .each(function () {
                            self.offsets.push(this[0]);
                            self.targets.push(this[1]);
                          });
  };

  ScrollSpyHorizontal.prototype.process = function () {

      var scrollLeft   = this.$scrollElement.scrollLeft() + this.options.offset,
          scrollWidth  = this.$scrollElement[0].scrollWidth ||
                         this.$body[0].scrollWidth,
          maxScroll    = scrollWidth - this.$scrollElement.width(),
          offsets      = this.offsets,
          targets      = this.targets,
          activeTarget = this.activeTarget,
          i;

      if( scrollLeft >= maxScroll )
          return activeTarget != ( i=targets.last()[0] ) &&
                 this.activate(i);

      for(i = offsets.length; i--;) {
          if( scrollLeft    >= offsets[i] &&
              (!offsets[i+1] || scrollLeft <= offsets[i+1]) )
              return activeTarget != targets[i] &&
                     this.activate(targets[i]);
      }
  };

  ScrollSpyHorizontal.prototype.activate = function (target) {

      this.activeTarget = target;

      $( this.selector ).parents('.active')
                        .removeClass('active');

      var selector = this.selector + '[data-target="' + target + '"],' +
                     this.selector + '[href="' + target + '"]',
          active = $(selector).parents('li')
                              .addClass('active');

      if( active.parent('.dropdown-menu').length )
          active = active.closest('li.dropdown')
                         .addClass('active');

      active.trigger('activate.bs.scrollspyhorizontal');
  }


  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  var old = $.fn.scrollspyhorizontal;

  $.fn.scrollspyhorizontal = function (option) {
      return this.each( function () { var $this   = $(this),
                                          data    = $this.data('bs.scrollspyhorizontal'),
                                          options = typeof option == 'object' && option;

                                      if(!data )
                                          $this.data('bs.scrollspyhorizontal', (data = new ScrollSpyHorizontal(this, options)));
                                      if( typeof option == 'string' )
                                          data[option]();
                                      else if( $.isFunction(option) )
                                               option(data);
        });
  }

  $.fn.scrollspyhorizontal.Constructor = ScrollSpyHorizontal;


  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspyhorizontal.noConflict = function () {
      $.fn.scrollspyhorizontal = old;
      return this;
  }


  // SCROLLSPY DATA-API
  // ==================

  $(window).on({ load : function () {
      $('[data-spy="scrollhorizontal"]').each(function () {
          var $spy = $(this);
          $spy.scrollspyhorizontal($spy.data());
      });
  }});

}(jQuery);
