"use strict";

function stackTraces() {
  var $on = $('#test-controls .stack-traces').click(function() {
    $.cookie('test-stack-traces', $on.is(':checked') ? 'true' : 'false')
    setFromCookie()
  })
  setFromCookie()

  function setFromCookie() {
    var on = $.cookie('test-stack-traces') === 'true'
    if (on) $on.attr('checked', 'checked')
    chai.Assertion.includeStack = on
  }
}

function bail() {
  var $bail = $('#test-controls .bail').click(function() {
    $.cookie('test-bail', $bail.is(':checked') ? 'true' : 'false')
    setFromCookie()
  })
  setFromCookie()

  function setFromCookie() {
    var bail = $.cookie('test-bail') === 'true'
    if (bail) {
      $bail.attr('checked', 'checked')
    }
  }
}

function speed() {
  var $speed = $('#test-controls .speed')
  var originals = {
    setInterval: window.setInterval,
    bacon: {
      later: Bacon.later,
      eventStream: {
        throttle: Bacon.EventStream.prototype.throttle,
        debounce: Bacon.EventStream.prototype.debounce
      },
      property: {
        throttle: Bacon.Property.prototype.throttle,
        debounce: Bacon.Property.prototype.debounce
      }
    },
    _: {
      throttle: _.throttle
    },
    autocomplete: $.fn.autocomplete,
    fxSpeed: $.fx.speeds,
    animate: $.fn.animate,
    slideDown: $.fn.slideDown,
    slideUp: $.fn.slideUp,
    fadeIn: $.fn.fadeIn,
    fadeOut: $.fn.fadeOut
  }
  hashContains('slow') ? slow() : setFromCookie()

  $speed.click(function() {
    $.cookie('test-speed', $speed.is(':checked') ? 'fast' : 'slow')
    setFromCookie()
  })

  setFromCookie()

  function setFromCookie() {
    var mode = $.cookie('test-speed')
    if (mode === 'slow') { slow() } else { fast() }
  }

  function fast() {
    $speed.attr('checked', 'checked')
    r2.autosave.defaultThrottle = 1
    window.setInterval = function(fn, ms) {
      return originals.setInterval.call(window, fn, 1)
    }
    Bacon.later = function(delay, value) { return originals.bacon.later(1, value) }
    Bacon.EventStream.prototype.throttle = function(ms) { return originals.bacon.eventStream.throttle.call(this, 1) }
    Bacon.EventStream.prototype.debounce = function(ms) { return originals.bacon.eventStream.debounce.call(this, 1) }
    Bacon.Property.prototype.throttle = function(ms) { return originals.bacon.property.throttle.call(this, 1) }
    Bacon.Property.prototype.debounce = function(ms) { return originals.bacon.property.debounce.call(this, 1) }
    $.fn.autocomplete = function(opts) {
      return originals.autocomplete.call(this, _.extend({delay: 1}, opts))
    }
    $.fx.speeds = {_default: 1, fast: 1, slow: 1}
    $.fn.animate = overrideAnimate(originals.animate)
    $.fn.slideDown = overrideAnimSpeed(originals.slideDown)
    $.fn.slideUp = overrideAnimSpeed(originals.slideUp)
    $.fn.fadeIn = overrideAnimSpeed(originals.fadeIn)
    $.fn.fadeOut = overrideAnimSpeed(originals.fadeOut)
    _.throttle = function(fn, ms) { return originals._.throttle.call(this, fn, 1)}

    function overrideAnimate(originalFn) {
      return function() {
        var args = Array.prototype.slice.call(arguments)
        if (args[1] && args[1].duration !== undefined) {
          args[1].duration = 1
        } else if (args[1] == 'slow' || args[1] == 'fast') {
          args[1] = 1
        }
        return originalFn.apply(this, args)
      }
    }

    function overrideAnimSpeed(originalFn) {
      return function(num) {
        var argOffset = (num !== undefined && typeof num == 'number') ? 1 : 0
        var args = [1].concat(Array.prototype.slice.call(arguments, argOffset))
        return originalFn.apply(this, args)
      }
    }
  }

  function slow() {
    $speed.removeAttr('checked')
    window.setInterval = originals.setInterval
    Bacon.later = originals.bacon.later
    Bacon.EventStream.prototype.throttle = originals.bacon.eventStream.throttle
    Bacon.EventStream.prototype.debounce = originals.bacon.eventStream.debounce
    Bacon.Property.prototype.throttle = originals.bacon.property.throttle
    Bacon.Property.prototype.debounce = originals.bacon.property.debounce
    $.fn.autocomplete = originals.autocomplete
    $.fx.speeds = originals.fxSpeed
    $.fn.animate = originals.animate
    $.fn.slideDown = originals.slideDown
    $.fn.slideUp = originals.slideUp
    $.fn.fadeIn = originals.fadeIn
    $.fn.fadeOut = originals.fadeOut
  }
}