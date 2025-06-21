!function (i) {
  "use strict";

  if ("function" == typeof define && define.amd) {
    define(["jquery"], i);
  } else if ("undefined" != typeof exports) {
    module.exports = i(require("jquery"));
  } else {
    i(jQuery);
  }
}(function (i) {
  "use strict";

  var e = window.Slick || {};
  (e = function () {
    var e = 0;
    return function (t, o) {
      var s;
      var n = this;
      n.defaults = {
        accessibility: true,
        adaptiveHeight: false,
        appendArrows: i(t),
        appendDots: i(t),
        arrows: true,
        asNavFor: null,
        prevArrow: "<button class=\"slick-prev\" aria-label=\"Previous\" type=\"button\">Previous</button>",
        nextArrow: "<button class=\"slick-next\" aria-label=\"Next\" type=\"button\">Next</button>",
        autoplay: false,
        autoplaySpeed: 3e3,
        centerMode: false,
        centerPadding: "50px",
        cssEase: "ease",
        customPaging: function (e, t) {
          return i("<button type=\"button\" />").text(t + 1);
        },
        dots: false,
        dotsClass: "slick-dots",
        draggable: true,
        easing: "linear",
        edgeFriction: .35,
        fade: false,
        focusOnSelect: false,
        focusOnChange: false,
        infinite: true,
        initialSlide: 0,
        lazyLoad: "ondemand",
        mobileFirst: false,
        pauseOnHover: true,
        pauseOnFocus: true,
        pauseOnDotsHover: false,
        respondTo: "window",
        responsive: null,
        rows: 1,
        rtl: false,
        slide: "",
        slidesPerRow: 1,
        slidesToShow: 1,
        slidesToScroll: 1,
        speed: 500,
        swipe: true,
        swipeToSlide: false,
        touchMove: true,
        touchThreshold: 5,
        useCSS: true,
        useTransform: true,
        variableWidth: false,
        vertical: false,
        verticalSwiping: false,
        waitForAnimate: true,
        zIndex: 1e3
      };
      n.initials = {
        animating: false,
        dragging: false,
        autoPlayTimer: null,
        currentDirection: 0,
        currentLeft: null,
        currentSlide: 0,
        direction: 1,
        $dots: null,
        listWidth: null,
        listHeight: null,
        loadIndex: 0,
        $nextArrow: null,
        $prevArrow: null,
        scrolling: false,
        slideCount: null,
        slideWidth: null,
        $slideTrack: null,
        $slides: null,
        sliding: false,
        slideOffset: 0,
        swipeLeft: null,
        swiping: false,
        $list: null,
        touchObject: {},
        transformsEnabled: false,
        unslicked: false
      };
      i.extend(n, n.initials);
      n.activeBreakpoint = null;
      n.animType = null;
      n.animProp = null;
      n.breakpoints = [];
      n.breakpointSettings = [];
      n.cssTransitions = false;
      n.focussed = false;
      n.interrupted = false;
      n.hidden = "hidden";
      n.paused = true;
      n.positionProp = null;
      n.respondTo = null;
      n.rowCount = 1;
      n.shouldClick = true;
      n.$slider = i(t);
      n.$slidesCache = null;
      n.transformType = null;
      n.transitionType = null;
      n.visibilityChange = "visibilitychange";
      n.windowWidth = 0;
      n.windowTimer = null;
      s = i(t).data("slick") || {};
      n.options = i.extend({}, n.defaults, o, s);
      n.currentSlide = n.options.initialSlide;
      n.originalSettings = n.options;
      if (undefined !== document.mozHidden) {
        n.hidden = "mozHidden";
        n.visibilityChange = "mozvisibilitychange";
      } else if (undefined !== document.webkitHidden) {
        n.hidden = "webkitHidden";
        n.visibilityChange = "webkitvisibilitychange";
      }
      n.autoPlay = i.proxy(n.autoPlay, n);
      n.autoPlayClear = i.proxy(n.autoPlayClear, n);
      n.autoPlayIterator = i.proxy(n.autoPlayIterator, n);
      n.changeSlide = i.proxy(n.changeSlide, n);
      n.clickHandler = i.proxy(n.clickHandler, n);
      n.selectHandler = i.proxy(n.selectHandler, n);
      n.setPosition = i.proxy(n.setPosition, n);
      n.swipeHandler = i.proxy(n.swipeHandler, n);
      n.dragHandler = i.proxy(n.dragHandler, n);
      n.keyHandler = i.proxy(n.keyHandler, n);
      n.instanceUid = e++;
      n.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/;
      n.registerBreakpoints();
      n.init(true);
    };
  }()).prototype.activateADA = function () {
    this.$slideTrack.find(".slick-active").attr({
      "aria-hidden": "false"
    }).find("a, input, button, select").attr({
      tabindex: "0"
    });
  };
  e.prototype.addSlide = e.prototype.slickAdd = function (e, t, o) {
    var s = this;
    if ("boolean" == typeof t) {
      o = t;
      t = null;
    } else if (t < 0 || t >= s.slideCount) {
      return false;
    }
    s.unload();
    if ("number" == typeof t) {
      if (0 === t && 0 === s.$slides.length) {
        i(e).appendTo(s.$slideTrack);
      } else if (o) {
        i(e).insertBefore(s.$slides.eq(t));
      } else {
        i(e).insertAfter(s.$slides.eq(t));
      }
    } else if (true === o) {
      i(e).prependTo(s.$slideTrack);
    } else {
      i(e).appendTo(s.$slideTrack);
    }
    s.$slides = s.$slideTrack.children(this.options.slide);
    s.$slideTrack.children(this.options.slide).detach();
    s.$slideTrack.append(s.$slides);
    s.$slides.each(function (e, t) {
      i(t).attr("data-slick-index", e);
    });
    s.$slidesCache = s.$slides;
    s.reinit();
  };
  e.prototype.animateHeight = function () {
    var i = this;
    if (1 === i.options.slidesToShow && true === i.options.adaptiveHeight && false === i.options.vertical) {
      var e = i.$slides.eq(i.currentSlide).outerHeight(true);
      i.$list.animate({
        height: e
      }, i.options.speed);
    }
  };
  e.prototype.animateSlide = function (e, t) {
    var o = {};
    var s = this;
    s.animateHeight();
    if (true === s.options.rtl && false === s.options.vertical) {
      e = -e;
    }
    if (false === s.transformsEnabled) {
      if (false === s.options.vertical) {
        s.$slideTrack.animate({
          left: e
        }, s.options.speed, s.options.easing, t);
      } else {
        s.$slideTrack.animate({
          top: e
        }, s.options.speed, s.options.easing, t);
      }
    } else if (false === s.cssTransitions) {
      if (true === s.options.rtl) {
        s.currentLeft = -s.currentLeft;
      }
      i({
        animStart: s.currentLeft
      }).animate({
        animStart: e
      }, {
        duration: s.options.speed,
        easing: s.options.easing,
        step: function (i) {
          i = Math.ceil(i);
          if (false === s.options.vertical) {
            o[s.animType] = "translate(" + i + "px, 0px)";
            s.$slideTrack.css(o);
          } else {
            o[s.animType] = "translate(0px," + i + "px)";
            s.$slideTrack.css(o);
          }
        },
        complete: function () {
          if (t) {
            t.call();
          }
        }
      });
    } else {
      s.applyTransition();
      e = Math.ceil(e);
      if (false === s.options.vertical) {
        o[s.animType] = "translate3d(" + e + "px, 0px, 0px)";
      } else {
        o[s.animType] = "translate3d(0px," + e + "px, 0px)";
      }
      s.$slideTrack.css(o);
      if (t) {
        setTimeout(function () {
          s.disableTransition();
          t.call();
        }, s.options.speed);
      }
    }
  };
  e.prototype.getNavTarget = function () {
    var e = this;
    var t = e.options.asNavFor;
    if (t && null !== t) {
      t = i(t).not(e.$slider);
    }
    return t;
  };
  e.prototype.asNavFor = function (e) {
    var t = this.getNavTarget();
    if (null !== t && "object" == typeof t) {
      t.each(function () {
        var t = i(this).slick("getSlick");
        if (!t.unslicked) {
          t.slideHandler(e, true);
        }
      });
    }
  };
  e.prototype.applyTransition = function (i) {
    var e = this;
    var t = {};
    if (false === e.options.fade) {
      t[e.transitionType] = e.transformType + " " + e.options.speed + "ms " + e.options.cssEase;
    } else {
      t[e.transitionType] = "opacity " + e.options.speed + "ms " + e.options.cssEase;
    }
    if (false === e.options.fade) {
      e.$slideTrack.css(t);
    } else {
      e.$slides.eq(i).css(t);
    }
  };
  e.prototype.autoPlay = function () {
    var i = this;
    i.autoPlayClear();
    if (i.slideCount > i.options.slidesToShow) {
      i.autoPlayTimer = setInterval(i.autoPlayIterator, i.options.autoplaySpeed);
    }
  };
  e.prototype.autoPlayClear = function () {
    var i = this;
    if (i.autoPlayTimer) {
      clearInterval(i.autoPlayTimer);
    }
  };
  e.prototype.autoPlayIterator = function () {
    var i = this;
    var e = i.currentSlide + i.options.slidesToScroll;
    if (!(i.paused || i.interrupted || i.focussed)) {
      if (false === i.options.infinite) {
        if (1 === i.direction && i.currentSlide + 1 === i.slideCount - 1) {
          i.direction = 0;
        } else if (0 === i.direction) {
          e = i.currentSlide - i.options.slidesToScroll;
          if (i.currentSlide - 1 == 0) {
            i.direction = 1;
          }
        }
      }
      i.slideHandler(e);
    }
  };
  e.prototype.buildArrows = function () {
    var e = this;
    if (true === e.options.arrows) {
      e.$prevArrow = i(e.options.prevArrow).addClass("slick-arrow");
      e.$nextArrow = i(e.options.nextArrow).addClass("slick-arrow");
      if (e.slideCount > e.options.slidesToShow) {
        e.$prevArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex");
        e.$nextArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex");
        if (e.htmlExpr.test(e.options.prevArrow)) {
          e.$prevArrow.prependTo(e.options.appendArrows);
        }
        if (e.htmlExpr.test(e.options.nextArrow)) {
          e.$nextArrow.appendTo(e.options.appendArrows);
        }
        if (true !== e.options.infinite) {
          e.$prevArrow.addClass("slick-disabled").attr("aria-disabled", "true");
        }
      } else {
        e.$prevArrow.add(e.$nextArrow).addClass("slick-hidden").attr({
          "aria-disabled": "true",
          tabindex: "-1"
        });
      }
    }
  };
  e.prototype.buildDots = function () {
    var e;
    var t;
    var o = this;
    if (true === o.options.dots) {
      o.$slider.addClass("slick-dotted");
      t = i("<ul />").addClass(o.options.dotsClass);
      for (e = 0; e <= o.getDotCount(); e += 1) {
        t.append(i("<li />").append(o.options.customPaging.call(this, o, e)));
      }
      o.$dots = t.appendTo(o.options.appendDots);
      o.$dots.find("li").first().addClass("slick-active");
    }
  };
  e.prototype.buildOut = function () {
    var e = this;
    e.$slides = e.$slider.children(e.options.slide + ":not(.slick-cloned)").addClass("slick-slide");
    e.slideCount = e.$slides.length;
    e.$slides.each(function (e, t) {
      i(t).attr("data-slick-index", e).data("originalStyling", i(t).attr("style") || "");
    });
    e.$slider.addClass("slick-slider");
    e.$slideTrack = 0 === e.slideCount ? i("<div class=\"slick-track\"/>").appendTo(e.$slider) : e.$slides.wrapAll("<div class=\"slick-track\"/>").parent();
    e.$list = e.$slideTrack.wrap("<div class=\"slick-list\"/>").parent();
    e.$slideTrack.css("opacity", 0);
    if (!(true !== e.options.centerMode && true !== e.options.swipeToSlide)) {
      e.options.slidesToScroll = 1;
    }
    i("img[data-lazy]", e.$slider).not("[src]").addClass("slick-loading");
    e.setupInfinite();
    e.buildArrows();
    e.buildDots();
    e.updateDots();
    e.setSlideClasses("number" == typeof e.currentSlide ? e.currentSlide : 0);
    if (true === e.options.draggable) {
      e.$list.addClass("draggable");
    }
  };
  e.prototype.buildRows = function () {
    var i;
    var e;
    var t;
    var o;
    var s;
    var n;
    var r;
    var l = this;
    o = document.createDocumentFragment();
    n = l.$slider.children();
    if (l.options.rows > 1) {
      r = l.options.slidesPerRow * l.options.rows;
      s = Math.ceil(n.length / r);
      for (i = 0; i < s; i++) {
        var d = document.createElement("div");
        for (e = 0; e < l.options.rows; e++) {
          var a = document.createElement("div");
          for (t = 0; t < l.options.slidesPerRow; t++) {
            var c = i * r + (e * l.options.slidesPerRow + t);
            if (n.get(c)) {
              a.appendChild(n.get(c));
            }
          }
          d.appendChild(a);
        }
        o.appendChild(d);
      }
      l.$slider.empty().append(o);
      l.$slider.children().children().children().css({
        width: 100 / l.options.slidesPerRow + "%",
        display: "inline-block"
      });
    }
  };
  e.prototype.checkResponsive = function (e, t) {
    var o;
    var s;
    var n;
    var r = this;
    var l = false;
    var d = r.$slider.width();
    var a = window.innerWidth || i(window).width();
    if ("window" === r.respondTo) {
      n = a;
    } else if ("slider" === r.respondTo) {
      n = d;
    } else if ("min" === r.respondTo) {
      n = Math.min(a, d);
    }
    if (r.options.responsive && r.options.responsive.length && null !== r.options.responsive) {
      s = null;
      for (o in r.breakpoints) if (r.breakpoints.hasOwnProperty(o)) {
        if (false === r.originalSettings.mobileFirst) {
          if (n < r.breakpoints[o]) {
            s = r.breakpoints[o];
          }
        } else if (n > r.breakpoints[o]) {
          s = r.breakpoints[o];
        }
      }
      if (null !== s) {
        if (null !== r.activeBreakpoint) {
          if (s !== r.activeBreakpoint || t) {
            r.activeBreakpoint = s;
            if ("unslick" === r.breakpointSettings[s]) {
              r.unslick(s);
            } else {
              r.options = i.extend({}, r.originalSettings, r.breakpointSettings[s]);
              if (true === e) {
                r.currentSlide = r.options.initialSlide;
              }
              r.refresh(e);
            }
            l = s;
          }
        } else {
          r.activeBreakpoint = s;
          if ("unslick" === r.breakpointSettings[s]) {
            r.unslick(s);
          } else {
            r.options = i.extend({}, r.originalSettings, r.breakpointSettings[s]);
            if (true === e) {
              r.currentSlide = r.options.initialSlide;
            }
            r.refresh(e);
          }
          l = s;
        }
      } else if (null !== r.activeBreakpoint) {
        r.activeBreakpoint = null;
        r.options = r.originalSettings;
        if (true === e) {
          r.currentSlide = r.options.initialSlide;
        }
        r.refresh(e);
        l = s;
      }
      if (!(e || false === l)) {
        r.$slider.trigger("breakpoint", [r, l]);
      }
    }
  };
  e.prototype.changeSlide = function (e, t) {
    var o;
    var s;
    var n;
    var r = this;
    var l = i(e.currentTarget);
    if (l.is("a")) {
      e.preventDefault();
    }
    if (!l.is("li")) {
      l = l.closest("li");
    }
    n = r.slideCount % r.options.slidesToScroll != 0;
    o = n ? 0 : (r.slideCount - r.currentSlide) % r.options.slidesToScroll;
    switch (e.data.message) {
      case "previous":
        s = 0 === o ? r.options.slidesToScroll : r.options.slidesToShow - o;
        if (r.slideCount > r.options.slidesToShow) {
          r.slideHandler(r.currentSlide - s, false, t);
        }
        break;
      case "next":
        s = 0 === o ? r.options.slidesToScroll : o;
        if (r.slideCount > r.options.slidesToShow) {
          r.slideHandler(r.currentSlide + s, false, t);
        }
        break;
      case "index":
        var d = 0 === e.data.index ? 0 : e.data.index || l.index() * r.options.slidesToScroll;
        r.slideHandler(r.checkNavigable(d), false, t);
        l.children().trigger("focus");
        break;
      default:
        return;
    }
  };
  e.prototype.checkNavigable = function (i) {
    var e;
    var t;
    e = this.getNavigableIndexes();
    t = 0;
    if (i > e[e.length - 1]) {
      i = e[e.length - 1];
    } else {
      for (var o in e) {
        if (i < e[o]) {
          i = t;
          break;
        }
        t = e[o];
      }
    }
    return i;
  };
  e.prototype.cleanUpEvents = function () {
    var e = this;
    if (e.options.dots && null !== e.$dots) {
      i("li", e.$dots).off("click.slick", e.changeSlide).off("mouseenter.slick", i.proxy(e.interrupt, e, true)).off("mouseleave.slick", i.proxy(e.interrupt, e, false));
      if (true === e.options.accessibility) {
        e.$dots.off("keydown.slick", e.keyHandler);
      }
    }
    e.$slider.off("focus.slick blur.slick");
    if (true === e.options.arrows && e.slideCount > e.options.slidesToShow) {
      if (e.$prevArrow) {
        e.$prevArrow.off("click.slick", e.changeSlide);
      }
      if (e.$nextArrow) {
        e.$nextArrow.off("click.slick", e.changeSlide);
      }
      if (true === e.options.accessibility) {
        if (e.$prevArrow) {
          e.$prevArrow.off("keydown.slick", e.keyHandler);
        }
        if (e.$nextArrow) {
          e.$nextArrow.off("keydown.slick", e.keyHandler);
        }
      }
    }
    e.$list.off("touchstart.slick mousedown.slick", e.swipeHandler);
    e.$list.off("touchmove.slick mousemove.slick", e.swipeHandler);
    e.$list.off("touchend.slick mouseup.slick", e.swipeHandler);
    e.$list.off("touchcancel.slick mouseleave.slick", e.swipeHandler);
    e.$list.off("click.slick", e.clickHandler);
    i(document).off(e.visibilityChange, e.visibility);
    e.cleanUpSlideEvents();
    if (true === e.options.accessibility) {
      e.$list.off("keydown.slick", e.keyHandler);
    }
    if (true === e.options.focusOnSelect) {
      i(e.$slideTrack).children().off("click.slick", e.selectHandler);
    }
    i(window).off("orientationchange.slick.slick-" + e.instanceUid, e.orientationChange);
    i(window).off("resize.slick.slick-" + e.instanceUid, e.resize);
    i("[draggable!=true]", e.$slideTrack).off("dragstart", e.preventDefault);
    i(window).off("load.slick.slick-" + e.instanceUid, e.setPosition);
  };
  e.prototype.cleanUpSlideEvents = function () {
    var e = this;
    e.$list.off("mouseenter.slick", i.proxy(e.interrupt, e, true));
    e.$list.off("mouseleave.slick", i.proxy(e.interrupt, e, false));
  };
  e.prototype.cleanUpRows = function () {
    var i;
    var e = this;
    if (e.options.rows > 1) {
      (i = e.$slides.children().children()).removeAttr("style");
      e.$slider.empty().append(i);
    }
  };
  e.prototype.clickHandler = function (i) {
    if (false === this.shouldClick) {
      i.stopImmediatePropagation();
      i.stopPropagation();
      i.preventDefault();
    }
  };
  e.prototype.destroy = function (e) {
    var t = this;
    t.autoPlayClear();
    t.touchObject = {};
    t.cleanUpEvents();
    i(".slick-cloned", t.$slider).detach();
    if (t.$dots) {
      t.$dots.remove();
    }
    if (t.$prevArrow && t.$prevArrow.length) {
      t.$prevArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display", "");
      if (t.htmlExpr.test(t.options.prevArrow)) {
        t.$prevArrow.remove();
      }
    }
    if (t.$nextArrow && t.$nextArrow.length) {
      t.$nextArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display", "");
      if (t.htmlExpr.test(t.options.nextArrow)) {
        t.$nextArrow.remove();
      }
    }
    if (t.$slides) {
      t.$slides.removeClass("slick-slide slick-active slick-center slick-visible slick-current").removeAttr("aria-hidden").removeAttr("data-slick-index").each(function () {
        i(this).attr("style", i(this).data("originalStyling"));
      });
      t.$slideTrack.children(this.options.slide).detach();
      t.$slideTrack.detach();
      t.$list.detach();
      t.$slider.append(t.$slides);
    }
    t.cleanUpRows();
    t.$slider.removeClass("slick-slider");
    t.$slider.removeClass("slick-initialized");
    t.$slider.removeClass("slick-dotted");
    t.unslicked = true;
    if (!e) {
      t.$slider.trigger("destroy", [t]);
    }
  };
  e.prototype.disableTransition = function (i) {
    var e = this;
    var t = {
      [e.transitionType]: ""
    };
    if (false === e.options.fade) {
      e.$slideTrack.css(t);
    } else {
      e.$slides.eq(i).css(t);
    }
  };
  e.prototype.fadeSlide = function (i, e) {
    var t = this;
    if (false === t.cssTransitions) {
      t.$slides.eq(i).css({
        zIndex: t.options.zIndex
      });
      t.$slides.eq(i).animate({
        opacity: 1
      }, t.options.speed, t.options.easing, e);
    } else {
      t.applyTransition(i);
      t.$slides.eq(i).css({
        opacity: 1,
        zIndex: t.options.zIndex
      });
      if (e) {
        setTimeout(function () {
          t.disableTransition(i);
          e.call();
        }, t.options.speed);
      }
    }
  };
  e.prototype.fadeSlideOut = function (i) {
    var e = this;
    if (false === e.cssTransitions) {
      e.$slides.eq(i).animate({
        opacity: 0,
        zIndex: e.options.zIndex - 2
      }, e.options.speed, e.options.easing);
    } else {
      e.applyTransition(i);
      e.$slides.eq(i).css({
        opacity: 0,
        zIndex: e.options.zIndex - 2
      });
    }
  };
  e.prototype.filterSlides = e.prototype.slickFilter = function (i) {
    var e = this;
    if (null !== i) {
      e.$slidesCache = e.$slides;
      e.unload();
      e.$slideTrack.children(this.options.slide).detach();
      e.$slidesCache.filter(i).appendTo(e.$slideTrack);
      e.reinit();
    }
  };
  e.prototype.focusHandler = function () {
    var e = this;
    e.$slider.off("focus.slick blur.slick").on("focus.slick blur.slick", "*", function (t) {
      t.stopImmediatePropagation();
      var o = i(this);
      setTimeout(function () {
        if (e.options.pauseOnFocus) {
          e.focussed = o.is(":focus");
          e.autoPlay();
        }
      }, 0);
    });
  };
  e.prototype.getCurrent = e.prototype.slickCurrentSlide = function () {
    return this.currentSlide;
  };
  e.prototype.getDotCount = function () {
    var i = this;
    var e = 0;
    var t = 0;
    var o = 0;
    if (true === i.options.infinite) {
      if (i.slideCount <= i.options.slidesToShow) {
        ++o;
      } else {
        for (; e < i.slideCount;) {
          ++o;
          e = t + i.options.slidesToScroll;
          t += i.options.slidesToScroll <= i.options.slidesToShow ? i.options.slidesToScroll : i.options.slidesToShow;
        }
      }
    } else if (true === i.options.centerMode) {
      o = i.slideCount;
    } else if (i.options.asNavFor) {
      for (; e < i.slideCount;) {
        ++o;
        e = t + i.options.slidesToScroll;
        t += i.options.slidesToScroll <= i.options.slidesToShow ? i.options.slidesToScroll : i.options.slidesToShow;
      }
    } else {
      o = 1 + Math.ceil((i.slideCount - i.options.slidesToShow) / i.options.slidesToScroll);
    }
    return o - 1;
  };
  e.prototype.getLeft = function (i) {
    var e;
    var t;
    var o;
    var s;
    var n = this;
    var r = 0;
    n.slideOffset = 0;
    t = n.$slides.first().outerHeight(true);
    if (true === n.options.infinite) {
      if (n.slideCount > n.options.slidesToShow) {
        n.slideOffset = n.slideWidth * n.options.slidesToShow * -1;
        s = -1;
        if (true === n.options.vertical && true === n.options.centerMode) {
          if (2 === n.options.slidesToShow) {
            s = -1.5;
          } else if (1 === n.options.slidesToShow) {
            s = -2;
          }
        }
        r = t * n.options.slidesToShow * s;
      }
      if (n.slideCount % n.options.slidesToScroll != 0 && i + n.options.slidesToScroll > n.slideCount && n.slideCount > n.options.slidesToShow) {
        if (i > n.slideCount) {
          n.slideOffset = (n.options.slidesToShow - (i - n.slideCount)) * n.slideWidth * -1;
          r = (n.options.slidesToShow - (i - n.slideCount)) * t * -1;
        } else {
          n.slideOffset = n.slideCount % n.options.slidesToScroll * n.slideWidth * -1;
          r = n.slideCount % n.options.slidesToScroll * t * -1;
        }
      }
    } else if (i + n.options.slidesToShow > n.slideCount) {
      n.slideOffset = (i + n.options.slidesToShow - n.slideCount) * n.slideWidth;
      r = (i + n.options.slidesToShow - n.slideCount) * t;
    }
    if (n.slideCount <= n.options.slidesToShow) {
      n.slideOffset = 0;
      r = 0;
    }
    if (true === n.options.centerMode && n.slideCount <= n.options.slidesToShow) {
      n.slideOffset = n.slideWidth * Math.floor(n.options.slidesToShow) / 2 - n.slideWidth * n.slideCount / 2;
    } else if (true === n.options.centerMode && true === n.options.infinite) {
      n.slideOffset += n.slideWidth * Math.floor(n.options.slidesToShow / 2) - n.slideWidth;
    } else if (true === n.options.centerMode) {
      n.slideOffset = 0;
      n.slideOffset += n.slideWidth * Math.floor(n.options.slidesToShow / 2);
    }
    e = false === n.options.vertical ? i * n.slideWidth * -1 + n.slideOffset : i * t * -1 + r;
    if (true === n.options.variableWidth) {
      o = n.slideCount <= n.options.slidesToShow || false === n.options.infinite ? n.$slideTrack.children(".slick-slide").eq(i) : n.$slideTrack.children(".slick-slide").eq(i + n.options.slidesToShow);
      e = true === n.options.rtl ? o[0] ? -1 * (n.$slideTrack.width() - o[0].offsetLeft - o.width()) : 0 : o[0] ? -1 * o[0].offsetLeft : 0;
      if (true === n.options.centerMode) {
        o = n.slideCount <= n.options.slidesToShow || false === n.options.infinite ? n.$slideTrack.children(".slick-slide").eq(i) : n.$slideTrack.children(".slick-slide").eq(i + n.options.slidesToShow + 1);
        e = true === n.options.rtl ? o[0] ? -1 * (n.$slideTrack.width() - o[0].offsetLeft - o.width()) : 0 : o[0] ? -1 * o[0].offsetLeft : 0;
        e += (n.$list.width() - o.outerWidth()) / 2;
      }
    }
    return e;
  };
  e.prototype.getOption = e.prototype.slickGetOption = function (i) {
    return this.options[i];
  };
  e.prototype.getNavigableIndexes = function () {
    var i;
    var e = this;
    var t = 0;
    var o = 0;
    var s = [];
    for (false === e.options.infinite ? i = e.slideCount : (t = -1 * e.options.slidesToScroll, o = -1 * e.options.slidesToScroll, i = 2 * e.slideCount); t < i;) {
      s.push(t);
      t = o + e.options.slidesToScroll;
      o += e.options.slidesToScroll <= e.options.slidesToShow ? e.options.slidesToScroll : e.options.slidesToShow;
    }
    return s;
  };
  e.prototype.getSlick = function () {
    return this;
  };
  e.prototype.getSlideCount = function () {
    var e;
    var t;
    var o = this;
    t = true === o.options.centerMode ? o.slideWidth * Math.floor(o.options.slidesToShow / 2) : 0;
    return true === o.options.swipeToSlide ? (o.$slideTrack.find(".slick-slide").each(function (s, n) {
      if (n.offsetLeft - t + i(n).outerWidth() / 2 > -1 * o.swipeLeft) {
        e = n;
        return false;
      }
    }), Math.abs(i(e).attr("data-slick-index") - o.currentSlide) || 1) : o.options.slidesToScroll;
  };
  e.prototype.goTo = e.prototype.slickGoTo = function (i, e) {
    this.changeSlide({
      data: {
        message: "index",
        index: parseInt(i)
      }
    }, e);
  };
  e.prototype.init = function (e) {
    var t = this;
    if (!i(t.$slider).hasClass("slick-initialized")) {
      i(t.$slider).addClass("slick-initialized");
      t.buildRows();
      t.buildOut();
      t.setProps();
      t.startLoad();
      t.loadSlider();
      t.initializeEvents();
      t.updateArrows();
      t.updateDots();
      t.checkResponsive(true);
      t.focusHandler();
    }
    if (e) {
      t.$slider.trigger("init", [t]);
    }
    if (true === t.options.accessibility) {
      t.initADA();
    }
    if (t.options.autoplay) {
      t.paused = false;
      t.autoPlay();
    }
  };
  e.prototype.initADA = function () {
    var e = this;
    var t = Math.ceil(e.slideCount / e.options.slidesToShow);
    var o = e.getNavigableIndexes().filter(function (i) {
      return i >= 0 && i < e.slideCount;
    });
    e.$slides.add(e.$slideTrack.find(".slick-cloned")).attr({
      "aria-hidden": "true",
      tabindex: "-1"
    }).find("a, input, button, select").attr({
      tabindex: "-1"
    });
    if (null !== e.$dots) {
      e.$slides.not(e.$slideTrack.find(".slick-cloned")).each(function (t) {
        var s = o.indexOf(t);
        i(this).attr({
          role: "tabpanel",
          id: "slick-slide" + e.instanceUid + t,
          tabindex: -1
        });
        if (-1 !== s) {
          i(this).attr({
            "aria-describedby": "slick-slide-control" + e.instanceUid + s
          });
        }
      });
      e.$dots.attr("role", "tablist").find("li").each(function (s) {
        var n = o[s];
        i(this).attr({
          role: "presentation"
        });
        i(this).find("button").first().attr({
          role: "tab",
          id: "slick-slide-control" + e.instanceUid + s,
          "aria-controls": "slick-slide" + e.instanceUid + n,
          "aria-label": s + 1 + " of " + t,
          "aria-selected": null,
          tabindex: "-1"
        });
      }).eq(e.currentSlide).find("button").attr({
        "aria-selected": "true",
        tabindex: "0"
      }).end();
    }
    var s = e.currentSlide;
    for (var n = s + e.options.slidesToShow; s < n; s++) {
      e.$slides.eq(s).attr("tabindex", 0);
    }
    e.activateADA();
  };
  e.prototype.initArrowEvents = function () {
    var i = this;
    if (true === i.options.arrows && i.slideCount > i.options.slidesToShow) {
      i.$prevArrow.off("click.slick").on("click.slick", {
        message: "previous"
      }, i.changeSlide);
      i.$nextArrow.off("click.slick").on("click.slick", {
        message: "next"
      }, i.changeSlide);
      if (true === i.options.accessibility) {
        i.$prevArrow.on("keydown.slick", i.keyHandler);
        i.$nextArrow.on("keydown.slick", i.keyHandler);
      }
    }
  };
  e.prototype.initDotEvents = function () {
    var e = this;
    if (true === e.options.dots) {
      i("li", e.$dots).on("click.slick", {
        message: "index"
      }, e.changeSlide);
      if (true === e.options.accessibility) {
        e.$dots.on("keydown.slick", e.keyHandler);
      }
    }
    if (true === e.options.dots && true === e.options.pauseOnDotsHover) {
      i("li", e.$dots).on("mouseenter.slick", i.proxy(e.interrupt, e, true)).on("mouseleave.slick", i.proxy(e.interrupt, e, false));
    }
  };
  e.prototype.initSlideEvents = function () {
    var e = this;
    if (e.options.pauseOnHover) {
      e.$list.on("mouseenter.slick", i.proxy(e.interrupt, e, true));
      e.$list.on("mouseleave.slick", i.proxy(e.interrupt, e, false));
    }
  };
  e.prototype.initializeEvents = function () {
    var e = this;
    e.initArrowEvents();
    e.initDotEvents();
    e.initSlideEvents();
    e.$list.on("touchstart.slick mousedown.slick", {
      action: "start"
    }, e.swipeHandler);
    e.$list.on("touchmove.slick mousemove.slick", {
      action: "move"
    }, e.swipeHandler);
    e.$list.on("touchend.slick mouseup.slick", {
      action: "end"
    }, e.swipeHandler);
    e.$list.on("touchcancel.slick mouseleave.slick", {
      action: "end"
    }, e.swipeHandler);
    e.$list.on("click.slick", e.clickHandler);
    i(document).on(e.visibilityChange, i.proxy(e.visibility, e));
    if (true === e.options.accessibility) {
      e.$list.on("keydown.slick", e.keyHandler);
    }
    if (true === e.options.focusOnSelect) {
      i(e.$slideTrack).children().on("click.slick", e.selectHandler);
    }
    i(window).on("orientationchange.slick.slick-" + e.instanceUid, i.proxy(e.orientationChange, e));
    i(window).on("resize.slick.slick-" + e.instanceUid, i.proxy(e.resize, e));
    i("[draggable!=true]", e.$slideTrack).on("dragstart", e.preventDefault);
    i(window).on("load.slick.slick-" + e.instanceUid, e.setPosition);
    i(e.setPosition);
  };
  e.prototype.initUI = function () {
    var i = this;
    if (true === i.options.arrows && i.slideCount > i.options.slidesToShow) {
      i.$prevArrow.show();
      i.$nextArrow.show();
    }
    if (true === i.options.dots && i.slideCount > i.options.slidesToShow) {
      i.$dots.show();
    }
  };
  e.prototype.keyHandler = function (i) {
    var e = this;
    if (!i.target.tagName.match("TEXTAREA|INPUT|SELECT")) {
      if (37 === i.keyCode && true === e.options.accessibility) {
        e.changeSlide({
          data: {
            message: true === e.options.rtl ? "next" : "previous"
          }
        });
      } else if (39 === i.keyCode && true === e.options.accessibility) {
        e.changeSlide({
          data: {
            message: true === e.options.rtl ? "previous" : "next"
          }
        });
      }
    }
  };
  e.prototype.lazyLoad = function () {
    function e(e) {
      i("img[data-lazy]", e).each(function () {
        var e = i(this);
        var t = i(this).attr("data-lazy");
        var o = i(this).attr("data-srcset");
        var s = i(this).attr("data-sizes") || n.$slider.attr("data-sizes");
        var r = document.createElement("img");
        r.onload = function () {
          e.animate({
            opacity: 0
          }, 100, function () {
            if (o) {
              e.attr("srcset", o);
              if (s) {
                e.attr("sizes", s);
              }
            }
            e.attr("src", t).animate({
              opacity: 1
            }, 200, function () {
              e.removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading");
            });
            n.$slider.trigger("lazyLoaded", [n, e, t]);
          });
        };
        r.onerror = function () {
          e.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error");
          n.$slider.trigger("lazyLoadError", [n, e, t]);
        };
        r.src = t;
      });
    }
    var t;
    var o;
    var s;
    var n = this;
    if (true === n.options.centerMode) {
      if (true === n.options.infinite) {
        s = (o = n.currentSlide + (n.options.slidesToShow / 2 + 1)) + n.options.slidesToShow + 2;
      } else {
        o = Math.max(0, n.currentSlide - (n.options.slidesToShow / 2 + 1));
        s = n.options.slidesToShow / 2 + 1 + 2 + n.currentSlide;
      }
    } else {
      o = n.options.infinite ? n.options.slidesToShow + n.currentSlide : n.currentSlide;
      s = Math.ceil(o + n.options.slidesToShow);
      if (true === n.options.fade) {
        if (o > 0) {
          o--;
        }
        if (s <= n.slideCount) {
          s++;
        }
      }
    }
    t = n.$slider.find(".slick-slide").slice(o, s);
    if ("anticipated" === n.options.lazyLoad) {
      var r = o - 1;
      var l = s;
      var d = n.$slider.find(".slick-slide");
      for (var a = 0; a < n.options.slidesToScroll; a++) {
        if (r < 0) {
          r = n.slideCount - 1;
        }
        t = (t = t.add(d.eq(r))).add(d.eq(l));
        r--;
        l++;
      }
    }
    e(t);
    if (n.slideCount <= n.options.slidesToShow) {
      e(n.$slider.find(".slick-slide"));
    } else if (n.currentSlide >= n.slideCount - n.options.slidesToShow) {
      e(n.$slider.find(".slick-cloned").slice(0, n.options.slidesToShow));
    } else if (0 === n.currentSlide) {
      e(n.$slider.find(".slick-cloned").slice(-1 * n.options.slidesToShow));
    }
  };
  e.prototype.loadSlider = function () {
    var i = this;
    i.setPosition();
    i.$slideTrack.css({
      opacity: 1
    });
    i.$slider.removeClass("slick-loading");
    i.initUI();
    if ("progressive" === i.options.lazyLoad) {
      i.progressiveLazyLoad();
    }
  };
  e.prototype.next = e.prototype.slickNext = function () {
    this.changeSlide({
      data: {
        message: "next"
      }
    });
  };
  e.prototype.orientationChange = function () {
    var i = this;
    i.checkResponsive();
    i.setPosition();
  };
  e.prototype.pause = e.prototype.slickPause = function () {
    var i = this;
    i.autoPlayClear();
    i.paused = true;
  };
  e.prototype.play = e.prototype.slickPlay = function () {
    var i = this;
    i.autoPlay();
    i.options.autoplay = true;
    i.paused = false;
    i.focussed = false;
    i.interrupted = false;
  };
  e.prototype.postSlide = function (e) {
    var t = this;
    if (!t.unslicked) {
      t.$slider.trigger("afterChange", [t, e]);
      t.animating = false;
      if (t.slideCount > t.options.slidesToShow) {
        t.setPosition();
      }
      t.swipeLeft = null;
      if (t.options.autoplay) {
        t.autoPlay();
      }
      if (true === t.options.accessibility) {
        t.initADA();
        if (t.options.focusOnChange) {
          i(t.$slides.get(t.currentSlide)).attr("tabindex", 0).focus();
        }
      }
    }
  };
  e.prototype.prev = e.prototype.slickPrev = function () {
    this.changeSlide({
      data: {
        message: "previous"
      }
    });
  };
  e.prototype.preventDefault = function (i) {
    i.preventDefault();
  };
  e.prototype.progressiveLazyLoad = function (e) {
    e = e || 1;
    var t;
    var o;
    var s;
    var n;
    var r;
    var l = this;
    var d = i("img[data-lazy]", l.$slider);
    if (d.length) {
      t = d.first();
      o = t.attr("data-lazy");
      s = t.attr("data-srcset");
      n = t.attr("data-sizes") || l.$slider.attr("data-sizes");
      (r = document.createElement("img")).onload = function () {
        if (s) {
          t.attr("srcset", s);
          if (n) {
            t.attr("sizes", n);
          }
        }
        t.attr("src", o).removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading");
        if (true === l.options.adaptiveHeight) {
          l.setPosition();
        }
        l.$slider.trigger("lazyLoaded", [l, t, o]);
        l.progressiveLazyLoad();
      };
      r.onerror = function () {
        if (e < 3) {
          setTimeout(function () {
            l.progressiveLazyLoad(e + 1);
          }, 500);
        } else {
          t.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error");
          l.$slider.trigger("lazyLoadError", [l, t, o]);
          l.progressiveLazyLoad();
        }
      };
      r.src = o;
    } else {
      l.$slider.trigger("allImagesLoaded", [l]);
    }
  };
  e.prototype.refresh = function (e) {
    var t;
    var o;
    var s = this;
    o = s.slideCount - s.options.slidesToShow;
    if (!s.options.infinite && s.currentSlide > o) {
      s.currentSlide = o;
    }
    if (s.slideCount <= s.options.slidesToShow) {
      s.currentSlide = 0;
    }
    t = s.currentSlide;
    s.destroy(true);
    i.extend(s, s.initials, {
      currentSlide: t
    });
    s.init();
    if (!e) {
      s.changeSlide({
        data: {
          message: "index",
          index: t
        }
      }, false);
    }
  };
  e.prototype.registerBreakpoints = function () {
    var e;
    var t;
    var o;
    var s = this;
    var n = s.options.responsive || null;
    if ("array" === i.type(n) && n.length) {
      s.respondTo = s.options.respondTo || "window";
      for (e in n) {
        o = s.breakpoints.length - 1;
        if (n.hasOwnProperty(e)) {
          for (t = n[e].breakpoint; o >= 0;) {
            if (s.breakpoints[o] && s.breakpoints[o] === t) {
              s.breakpoints.splice(o, 1);
            }
            o--;
          }
          s.breakpoints.push(t);
          s.breakpointSettings[t] = n[e].settings;
        }
      }
      s.breakpoints.sort(function (i, e) {
        return s.options.mobileFirst ? i - e : e - i;
      });
    }
  };
  e.prototype.reinit = function () {
    var e = this;
    e.$slides = e.$slideTrack.children(e.options.slide).addClass("slick-slide");
    e.slideCount = e.$slides.length;
    if (e.currentSlide >= e.slideCount && 0 !== e.currentSlide) {
      e.currentSlide = e.currentSlide - e.options.slidesToScroll;
    }
    if (e.slideCount <= e.options.slidesToShow) {
      e.currentSlide = 0;
    }
    e.registerBreakpoints();
    e.setProps();
    e.setupInfinite();
    e.buildArrows();
    e.updateArrows();
    e.initArrowEvents();
    e.buildDots();
    e.updateDots();
    e.initDotEvents();
    e.cleanUpSlideEvents();
    e.initSlideEvents();
    e.checkResponsive(false, true);
    if (true === e.options.focusOnSelect) {
      i(e.$slideTrack).children().on("click.slick", e.selectHandler);
    }
    e.setSlideClasses("number" == typeof e.currentSlide ? e.currentSlide : 0);
    e.setPosition();
    e.focusHandler();
    e.paused = !e.options.autoplay;
    e.autoPlay();
    e.$slider.trigger("reInit", [e]);
  };
  e.prototype.resize = function () {
    var e = this;
    if (i(window).width() !== e.windowWidth) {
      clearTimeout(e.windowDelay);
      e.windowDelay = window.setTimeout(function () {
        e.windowWidth = i(window).width();
        e.checkResponsive();
        if (!e.unslicked) {
          e.setPosition();
        }
      }, 50);
    }
  };
  e.prototype.removeSlide = e.prototype.slickRemove = function (i, e, t) {
    var o = this;
    i = "boolean" == typeof i ? true === (e = i) ? 0 : o.slideCount - 1 : true === e ? --i : i;
    if (o.slideCount < 1 || i < 0 || i > o.slideCount - 1) {
      return false;
    }
    o.unload();
    if (true === t) {
      o.$slideTrack.children().remove();
    } else {
      o.$slideTrack.children(this.options.slide).eq(i).remove();
    }
    o.$slides = o.$slideTrack.children(this.options.slide);
    o.$slideTrack.children(this.options.slide).detach();
    o.$slideTrack.append(o.$slides);
    o.$slidesCache = o.$slides;
    o.reinit();
  };
  e.prototype.setCSS = function (i) {
    var e;
    var t;
    var o = this;
    var s = {};
    if (true === o.options.rtl) {
      i = -i;
    }
    e = "left" == o.positionProp ? Math.ceil(i) + "px" : "0px";
    t = "top" == o.positionProp ? Math.ceil(i) + "px" : "0px";
    s[o.positionProp] = i;
    if (false === o.transformsEnabled) {
      o.$slideTrack.css(s);
    } else {
      s = {};
      if (false === o.cssTransitions) {
        s[o.animType] = "translate(" + e + ", " + t + ")";
        o.$slideTrack.css(s);
      } else {
        s[o.animType] = "translate3d(" + e + ", " + t + ", 0px)";
        o.$slideTrack.css(s);
      }
    }
  };
  e.prototype.setDimensions = function () {
    var i = this;
    if (false === i.options.vertical) {
      if (true === i.options.centerMode) {
        i.$list.css({
          padding: "0px " + i.options.centerPadding
        });
      }
    } else {
      i.$list.height(i.$slides.first().outerHeight(true) * i.options.slidesToShow);
      if (true === i.options.centerMode) {
        i.$list.css({
          padding: i.options.centerPadding + " 0px"
        });
      }
    }
    i.listWidth = i.$list.width();
    i.listHeight = i.$list.height();
    if (false === i.options.vertical && false === i.options.variableWidth) {
      i.slideWidth = Math.ceil(i.listWidth / i.options.slidesToShow);
      i.$slideTrack.width(Math.ceil(i.slideWidth * i.$slideTrack.children(".slick-slide").length));
    } else if (true === i.options.variableWidth) {
      i.$slideTrack.width(5e3 * i.slideCount);
    } else {
      i.slideWidth = Math.ceil(i.listWidth);
      i.$slideTrack.height(Math.ceil(i.$slides.first().outerHeight(true) * i.$slideTrack.children(".slick-slide").length));
    }
    var e = i.$slides.first().outerWidth(true) - i.$slides.first().width();
    if (false === i.options.variableWidth) {
      i.$slideTrack.children(".slick-slide").width(i.slideWidth - e);
    }
  };
  e.prototype.setFade = function () {
    var e;
    var t = this;
    t.$slides.each(function (o, s) {
      e = t.slideWidth * o * -1;
      if (true === t.options.rtl) {
        i(s).css({
          position: "relative",
          right: e,
          top: 0,
          zIndex: t.options.zIndex - 2,
          opacity: 0
        });
      } else {
        i(s).css({
          position: "relative",
          left: e,
          top: 0,
          zIndex: t.options.zIndex - 2,
          opacity: 0
        });
      }
    });
    t.$slides.eq(t.currentSlide).css({
      zIndex: t.options.zIndex - 1,
      opacity: 1
    });
  };
  e.prototype.setHeight = function () {
    var i = this;
    if (1 === i.options.slidesToShow && true === i.options.adaptiveHeight && false === i.options.vertical) {
      var e = i.$slides.eq(i.currentSlide).outerHeight(true);
      i.$list.css("height", e);
    }
  };
  e.prototype.setOption = e.prototype.slickSetOption = function () {
    var e;
    var t;
    var o;
    var s;
    var n;
    var r = this;
    var l = false;
    if ("object" === i.type(arguments[0])) {
      o = arguments[0];
      l = arguments[1];
      n = "multiple";
    } else if ("string" === i.type(arguments[0])) {
      o = arguments[0];
      s = arguments[1];
      l = arguments[2];
      if ("responsive" === arguments[0] && "array" === i.type(arguments[1])) {
        n = "responsive";
      } else if (undefined !== arguments[1]) {
        n = "single";
      }
    }
    if ("single" === n) {
      r.options[o] = s;
    } else if ("multiple" === n) {
      i.each(o, function (i, e) {
        r.options[i] = e;
      });
    } else if ("responsive" === n) {
      for (t in s) if ("array" !== i.type(r.options.responsive)) {
        r.options.responsive = [s[t]];
      } else {
        for (e = r.options.responsive.length - 1; e >= 0;) {
          if (r.options.responsive[e].breakpoint === s[t].breakpoint) {
            r.options.responsive.splice(e, 1);
          }
          e--;
        }
        r.options.responsive.push(s[t]);
      }
    }
    if (l) {
      r.unload();
      r.reinit();
    }
  };
  e.prototype.setPosition = function () {
    var i = this;
    i.setDimensions();
    i.setHeight();
    if (false === i.options.fade) {
      i.setCSS(i.getLeft(i.currentSlide));
    } else {
      i.setFade();
    }
    i.$slider.trigger("setPosition", [i]);
  };
  e.prototype.setProps = function () {
    var i = this;
    var e = document.body.style;
    i.positionProp = true === i.options.vertical ? "top" : "left";
    if ("top" === i.positionProp) {
      i.$slider.addClass("slick-vertical");
    } else {
      i.$slider.removeClass("slick-vertical");
    }
    if (!(undefined === e.WebkitTransition && undefined === e.MozTransition && undefined === e.msTransition)) {
      if (true === i.options.useCSS) {
        i.cssTransitions = true;
      }
    }
    if (i.options.fade) {
      if ("number" == typeof i.options.zIndex) {
        if (i.options.zIndex < 3) {
          i.options.zIndex = 3;
        }
      } else {
        i.options.zIndex = i.defaults.zIndex;
      }
    }
    if (undefined !== e.OTransform) {
      i.animType = "OTransform";
      i.transformType = "-o-transform";
      i.transitionType = "OTransition";
      if (undefined === e.perspectiveProperty && undefined === e.webkitPerspective) {
        i.animType = false;
      }
    }
    if (undefined !== e.MozTransform) {
      i.animType = "MozTransform";
      i.transformType = "-moz-transform";
      i.transitionType = "MozTransition";
      if (undefined === e.perspectiveProperty && undefined === e.MozPerspective) {
        i.animType = false;
      }
    }
    if (undefined !== e.webkitTransform) {
      i.animType = "webkitTransform";
      i.transformType = "-webkit-transform";
      i.transitionType = "webkitTransition";
      if (undefined === e.perspectiveProperty && undefined === e.webkitPerspective) {
        i.animType = false;
      }
    }
    if (undefined !== e.msTransform) {
      i.animType = "msTransform";
      i.transformType = "-ms-transform";
      i.transitionType = "msTransition";
      if (undefined === e.msTransform) {
        i.animType = false;
      }
    }
    if (undefined !== e.transform && false !== i.animType) {
      i.animType = "transform";
      i.transformType = "transform";
      i.transitionType = "transition";
    }
    i.transformsEnabled = i.options.useTransform && null !== i.animType && false !== i.animType;
  };
  e.prototype.setSlideClasses = function (i) {
    var e;
    var t;
    var o;
    var s;
    var n = this;
    t = n.$slider.find(".slick-slide").removeClass("slick-active slick-center slick-current").attr("aria-hidden", "true");
    n.$slides.eq(i).addClass("slick-current");
    if (true === n.options.centerMode) {
      var r = n.options.slidesToShow % 2 == 0 ? 1 : 0;
      e = Math.floor(n.options.slidesToShow / 2);
      if (true === n.options.infinite) {
        if (i >= e && i <= n.slideCount - 1 - e) {
          n.$slides.slice(i - e + r, i + e + 1).addClass("slick-active").attr("aria-hidden", "false");
        } else {
          o = n.options.slidesToShow + i;
          t.slice(o - e + 1 + r, o + e + 2).addClass("slick-active").attr("aria-hidden", "false");
        }
        if (0 === i) {
          t.eq(t.length - 1 - n.options.slidesToShow).addClass("slick-center");
        } else if (i === n.slideCount - 1) {
          t.eq(n.options.slidesToShow).addClass("slick-center");
        }
      }
      n.$slides.eq(i).addClass("slick-center");
    } else if (i >= 0 && i <= n.slideCount - n.options.slidesToShow) {
      n.$slides.slice(i, i + n.options.slidesToShow).addClass("slick-active").attr("aria-hidden", "false");
    } else if (t.length <= n.options.slidesToShow) {
      t.addClass("slick-active").attr("aria-hidden", "false");
    } else {
      s = n.slideCount % n.options.slidesToShow;
      o = true === n.options.infinite ? n.options.slidesToShow + i : i;
      if (n.options.slidesToShow == n.options.slidesToScroll && n.slideCount - i < n.options.slidesToShow) {
        t.slice(o - (n.options.slidesToShow - s), o + s).addClass("slick-active").attr("aria-hidden", "false");
      } else {
        t.slice(o, o + n.options.slidesToShow).addClass("slick-active").attr("aria-hidden", "false");
      }
    }
    if (!("ondemand" !== n.options.lazyLoad && "anticipated" !== n.options.lazyLoad)) {
      n.lazyLoad();
    }
  };
  e.prototype.setupInfinite = function () {
    var e;
    var t;
    var o;
    var s = this;
    if (true === s.options.fade) {
      s.options.centerMode = false;
    }
    if (true === s.options.infinite && false === s.options.fade && (t = null, s.slideCount > s.options.slidesToShow)) {
      o = true === s.options.centerMode ? s.options.slidesToShow + 1 : s.options.slidesToShow;
      for (e = s.slideCount; e > s.slideCount - o; e -= 1) {
        t = e - 1;
        i(s.$slides[t]).clone(true).attr("id", "").attr("data-slick-index", t - s.slideCount).prependTo(s.$slideTrack).addClass("slick-cloned");
      }
      for (e = 0; e < o + s.slideCount; e += 1) {
        t = e;
        i(s.$slides[t]).clone(true).attr("id", "").attr("data-slick-index", t + s.slideCount).appendTo(s.$slideTrack).addClass("slick-cloned");
      }
      s.$slideTrack.find(".slick-cloned").find("[id]").each(function () {
        i(this).attr("id", "");
      });
    }
  };
  e.prototype.interrupt = function (i) {
    var e = this;
    if (!i) {
      e.autoPlay();
    }
    e.interrupted = i;
  };
  e.prototype.selectHandler = function (e) {
    var t = this;
    var o = i(e.target).is(".slick-slide") ? i(e.target) : i(e.target).parents(".slick-slide");
    var s = parseInt(o.attr("data-slick-index"));
    if (!s) {
      s = 0;
    }
    if (t.slideCount <= t.options.slidesToShow) {
      t.slideHandler(s, false, true);
    } else {
      t.slideHandler(s);
    }
  };
  e.prototype.slideHandler = function (i, e, t) {
    var o;
    var s;
    var n;
    var r;
    var l;
    var d = null;
    var a = this;
    e = e || false;
    if (!(true === a.animating && true === a.options.waitForAnimate || true === a.options.fade && a.currentSlide === i)) {
      if (false === e) {
        a.asNavFor(i);
      }
      o = i;
      d = a.getLeft(o);
      r = a.getLeft(a.currentSlide);
      a.currentLeft = null === a.swipeLeft ? r : a.swipeLeft;
      if (false === a.options.infinite && false === a.options.centerMode && (i < 0 || i > a.getDotCount() * a.options.slidesToScroll)) {
        if (false === a.options.fade) {
          o = a.currentSlide;
          if (true !== t) {
            a.animateSlide(r, function () {
              a.postSlide(o);
            });
          } else {
            a.postSlide(o);
          }
        }
      } else if (false === a.options.infinite && true === a.options.centerMode && (i < 0 || i > a.slideCount - a.options.slidesToScroll)) {
        if (false === a.options.fade) {
          o = a.currentSlide;
          if (true !== t) {
            a.animateSlide(r, function () {
              a.postSlide(o);
            });
          } else {
            a.postSlide(o);
          }
        }
      } else {
        if (a.options.autoplay) {
          clearInterval(a.autoPlayTimer);
        }
        s = o < 0 ? a.slideCount % a.options.slidesToScroll != 0 ? a.slideCount - a.slideCount % a.options.slidesToScroll : a.slideCount + o : o >= a.slideCount ? a.slideCount % a.options.slidesToScroll != 0 ? 0 : o - a.slideCount : o;
        a.animating = true;
        a.$slider.trigger("beforeChange", [a, a.currentSlide, s]);
        n = a.currentSlide;
        a.currentSlide = s;
        a.setSlideClasses(a.currentSlide);
        if (a.options.asNavFor && (l = (l = a.getNavTarget()).slick("getSlick")).slideCount <= l.options.slidesToShow) {
          l.setSlideClasses(a.currentSlide);
        }
        a.updateDots();
        a.updateArrows();
        if (true === a.options.fade) {
          if (true !== t) {
            a.fadeSlideOut(n);
            a.fadeSlide(s, function () {
              a.postSlide(s);
            });
          } else {
            a.postSlide(s);
          }
          return void a.animateHeight();
        }
        if (true !== t) {
          a.animateSlide(d, function () {
            a.postSlide(s);
          });
        } else {
          a.postSlide(s);
        }
      }
    }
  };
  e.prototype.startLoad = function () {
    var i = this;
    if (true === i.options.arrows && i.slideCount > i.options.slidesToShow) {
      i.$prevArrow.hide();
      i.$nextArrow.hide();
    }
    if (true === i.options.dots && i.slideCount > i.options.slidesToShow) {
      i.$dots.hide();
    }
    i.$slider.addClass("slick-loading");
  };
  e.prototype.swipeDirection = function () {
    var i;
    var e;
    var t;
    var o;
    var s = this;
    i = s.touchObject.startX - s.touchObject.curX;
    e = s.touchObject.startY - s.touchObject.curY;
    t = Math.atan2(e, i);
    if ((o = Math.round(180 * t / Math.PI)) < 0) {
      o = 360 - Math.abs(o);
    }
    return o <= 45 && o >= 0 ? false === s.options.rtl ? "left" : "right" : o <= 360 && o >= 315 ? false === s.options.rtl ? "left" : "right" : o >= 135 && o <= 225 ? false === s.options.rtl ? "right" : "left" : true === s.options.verticalSwiping ? o >= 35 && o <= 135 ? "down" : "up" : "vertical";
  };
  e.prototype.swipeEnd = function (i) {
    var e;
    var t;
    var o = this;
    o.dragging = false;
    o.swiping = false;
    if (o.scrolling) {
      o.scrolling = false;
      return false;
    }
    o.interrupted = false;
    o.shouldClick = !(o.touchObject.swipeLength > 10);
    if (undefined === o.touchObject.curX) {
      return false;
    }
    if (true === o.touchObject.edgeHit) {
      o.$slider.trigger("edge", [o, o.swipeDirection()]);
    }
    if (o.touchObject.swipeLength >= o.touchObject.minSwipe) {
      switch (t = o.swipeDirection()) {
        case "left":
        case "down":
          e = o.options.swipeToSlide ? o.checkNavigable(o.currentSlide + o.getSlideCount()) : o.currentSlide + o.getSlideCount();
          o.currentDirection = 0;
          break;
        case "right":
        case "up":
          e = o.options.swipeToSlide ? o.checkNavigable(o.currentSlide - o.getSlideCount()) : o.currentSlide - o.getSlideCount();
          o.currentDirection = 1;
      }
      if ("vertical" != t) {
        o.slideHandler(e);
        o.touchObject = {};
        o.$slider.trigger("swipe", [o, t]);
      }
    } else if (o.touchObject.startX !== o.touchObject.curX) {
      o.slideHandler(o.currentSlide);
      o.touchObject = {};
    }
  };
  e.prototype.swipeHandler = function (i) {
    var e = this;
    if (!(false === e.options.swipe || "ontouchend" in document && false === e.options.swipe || false === e.options.draggable && -1 !== i.type.indexOf("mouse"))) {
      e.touchObject.fingerCount = i.originalEvent && undefined !== i.originalEvent.touches ? i.originalEvent.touches.length : 1;
      e.touchObject.minSwipe = e.listWidth / e.options.touchThreshold;
      if (true === e.options.verticalSwiping) {
        e.touchObject.minSwipe = e.listHeight / e.options.touchThreshold;
      }
      switch (i.data.action) {
        case "start":
          e.swipeStart(i);
          break;
        case "move":
          e.swipeMove(i);
          break;
        case "end":
          e.swipeEnd(i);
      }
    }
  };
  e.prototype.swipeMove = function (i) {
    var e;
    var t;
    var o;
    var s;
    var n;
    var r;
    var l = this;
    n = undefined !== i.originalEvent ? i.originalEvent.touches : null;
    return !(!l.dragging || l.scrolling || n && 1 !== n.length) && (e = l.getLeft(l.currentSlide), l.touchObject.curX = undefined !== n ? n[0].pageX : i.clientX, l.touchObject.curY = undefined !== n ? n[0].pageY : i.clientY, l.touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(l.touchObject.curX - l.touchObject.startX, 2))), r = Math.round(Math.sqrt(Math.pow(l.touchObject.curY - l.touchObject.startY, 2))), !l.options.verticalSwiping && !l.swiping && r > 4 ? (l.scrolling = true, false) : (true === l.options.verticalSwiping && (l.touchObject.swipeLength = r), t = l.swipeDirection(), undefined !== i.originalEvent && l.touchObject.swipeLength > 4 && (l.swiping = true, i.preventDefault()), s = (false === l.options.rtl ? 1 : -1) * (l.touchObject.curX > l.touchObject.startX ? 1 : -1), true === l.options.verticalSwiping && (s = l.touchObject.curY > l.touchObject.startY ? 1 : -1), o = l.touchObject.swipeLength, l.touchObject.edgeHit = false, false === l.options.infinite && (0 === l.currentSlide && "right" === t || l.currentSlide >= l.getDotCount() && "left" === t) && (o = l.touchObject.swipeLength * l.options.edgeFriction, l.touchObject.edgeHit = true), false === l.options.vertical ? l.swipeLeft = e + o * s : l.swipeLeft = e + o * (l.$list.height() / l.listWidth) * s, true === l.options.verticalSwiping && (l.swipeLeft = e + o * s), true !== l.options.fade && false !== l.options.touchMove && (true === l.animating ? (l.swipeLeft = null, false) : void l.setCSS(l.swipeLeft))));
  };
  e.prototype.swipeStart = function (i) {
    var e;
    var t = this;
    t.interrupted = true;
    if (1 !== t.touchObject.fingerCount || t.slideCount <= t.options.slidesToShow) {
      t.touchObject = {};
      return false;
    }
    if (undefined !== i.originalEvent && undefined !== i.originalEvent.touches) {
      e = i.originalEvent.touches[0];
    }
    t.touchObject.startX = t.touchObject.curX = undefined !== e ? e.pageX : i.clientX;
    t.touchObject.startY = t.touchObject.curY = undefined !== e ? e.pageY : i.clientY;
    t.dragging = true;
  };
  e.prototype.unfilterSlides = e.prototype.slickUnfilter = function () {
    var i = this;
    if (null !== i.$slidesCache) {
      i.unload();
      i.$slideTrack.children(this.options.slide).detach();
      i.$slidesCache.appendTo(i.$slideTrack);
      i.reinit();
    }
  };
  e.prototype.unload = function () {
    var e = this;
    i(".slick-cloned", e.$slider).remove();
    if (e.$dots) {
      e.$dots.remove();
    }
    if (e.$prevArrow && e.htmlExpr.test(e.options.prevArrow)) {
      e.$prevArrow.remove();
    }
    if (e.$nextArrow && e.htmlExpr.test(e.options.nextArrow)) {
      e.$nextArrow.remove();
    }
    e.$slides.removeClass("slick-slide slick-active slick-visible slick-current").attr("aria-hidden", "true").css("width", "");
  };
  e.prototype.unslick = function (i) {
    var e = this;
    e.$slider.trigger("unslick", [e, i]);
    e.destroy();
  };
  e.prototype.updateArrows = function () {
    var i = this;
    Math.floor(i.options.slidesToShow / 2);
    if (true === i.options.arrows && i.slideCount > i.options.slidesToShow && !i.options.infinite) {
      i.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false");
      i.$nextArrow.removeClass("slick-disabled").attr("aria-disabled", "false");
      if (0 === i.currentSlide) {
        i.$prevArrow.addClass("slick-disabled").attr("aria-disabled", "true");
        i.$nextArrow.removeClass("slick-disabled").attr("aria-disabled", "false");
      } else if (i.currentSlide >= i.slideCount - i.options.slidesToShow && false === i.options.centerMode) {
        i.$nextArrow.addClass("slick-disabled").attr("aria-disabled", "true");
        i.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false");
      } else if (i.currentSlide >= i.slideCount - 1 && true === i.options.centerMode) {
        i.$nextArrow.addClass("slick-disabled").attr("aria-disabled", "true");
        i.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false");
      }
    }
  };
  e.prototype.updateDots = function () {
    var i = this;
    if (null !== i.$dots) {
      i.$dots.find("li").removeClass("slick-active").end();
      i.$dots.find("li").eq(Math.floor(i.currentSlide / i.options.slidesToScroll)).addClass("slick-active");
    }
  };
  e.prototype.visibility = function () {
    var i = this;
    if (i.options.autoplay) {
      if (document[i.hidden]) {
        i.interrupted = true;
      } else {
        i.interrupted = false;
      }
    }
  };
  i.fn.slick = function () {
    var i;
    var t;
    var o = this;
    var s = arguments[0];
    var n = Array.prototype.slice.call(arguments, 1);
    var r = o.length;
    for (i = 0; i < r; i++) {
      if ("object" == typeof s || undefined === s) {
        o[i].slick = new e(o[i], s);
      } else {
        t = o[i].slick[s].apply(o[i].slick, n);
      }
      if (undefined !== t) {
        return t;
      }
    }
    return o;
  };
});