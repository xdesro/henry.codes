// JS Goes here - ES6 supported
import $ from 'jquery';
import Barba from 'barba.js';
import {TweenMax, Power2, TimelineMax} from 'gsap';

Barba.Pjax.start();
Barba.Prefetch.init();
const FadeTransition = Barba.BaseTransition.extend({
  start: function() {
    // This function is automatically called as soon the Transition starts
    // this.newContainerLoading is a Promise for the loading of the new container
    // (Barba.js also comes with an handy Promise polyfill!)
    // As soon the loading is finished and the old page is faded out, let's fade the new page */
    Promise
      .all([this.newContainerLoading, this.fadeOut()])
      .then(this.fadeIn.bind(this));
  },

  fadeOut: function() {
    // this.oldContainer is the HTMLElement of the old Container
    return $(this.oldContainer).animate({opacity: 0}).promise();
  },

  fadeIn: function() {
    // this.newContainer is the HTMLElement of the new Container
    // At this stage newContainer is on the DOM (inside our #barba-container and with visibility: hidden)
    // Please note, newContainer is available just after newContainerLoading is resolved!
    var _this = this;
    var $el = $(this.newContainer);

    $(this.oldContainer).hide();

    $el.css({
      visibility : 'visible',
      opacity : 0
    });

    $el.animate({opacity: 1}, 400, function() {
      // Do not forget to call .done() as soon your transition is finished!
      // .done() will automatically remove from the DOM the old Container
      _this.done();
      $('hero:first-of-type > .hero-body').addClass('active');
    });
  }
});

Barba.Pjax.getTransition = function() {
  return FadeTransition;
};
if ($('main').hasClass('home')) {
  const homepageColumns = $('.hero-body > .container > .columns:not(#homepage-icons)').toArray();
  const homepageIcons = $('#homepage-icons > .column > .columns >.column').toArray();

  const homepageTimeline = new TimelineMax({delay: 0.5});

  homepageColumns.forEach((currentValue, index, array) => {
    if (index < homepageColumns.length) {
      homepageTimeline.fromTo(currentValue, 0.2, {
        opacity: 0,
        y: 20
      }, {
        opacity: 1,
        y: 0
      });
    } else {
      homepageTimeline.fromTo(currentValue, 0, {
        opacity: 0,
        y: 20
      }, {
        opacity: 1,
        y: 0
      });
    }
  });
  homepageIcons.forEach((currentValue, index, array) => {
    homepageTimeline.fromTo(currentValue, 0.1, {
      opacity: 0,
      y: 20
    }, {
      opacity: 1,
      y: 0
    });
  });
}
