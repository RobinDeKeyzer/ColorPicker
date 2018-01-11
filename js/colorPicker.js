;(function(factory) {
  if (typeof define === "function" && define.amd) {
    define(["jquery"], function (jQuery) {
      return factory(jQuery, document, window, navigator);
    });
  } else if (typeof exports === "object") {
    factory(require("jquery"), document, window, navigator);
  } else {
    factory(jQuery, document, window, navigator);
  }
} (function ($, document, window, navigator) {
  const ColorPicker = function (input, options) {
    this.VERSION = "1.0";
    this.input = input;
    this.selectedColor = '';

    options = options || {};

    // default config
    let config = {
      html: true,
      placement: 'bottom',
      trigger: 'focus',
      colors: [
        'black',
        'white'
      ],
      defaultColor: '',
      inputReadonly: false,
      inputHide: false
    };

    // check if base element is input
    if (this.input.nodeName !== "INPUT") {
      console && console.warn && console.warn("Base element should be &lt;input&gt;!", $this.input);
    }

    // js config extends default config
    $.extend(config, options);
    this.options = config;

    this.init();
  };

  ColorPicker.prototype = {
    init: function() {
      this.initSelectedColor();

      this.append();
    },
    initSelectedColor: function() {
      this.selectedColor = this.input.value;

      if (this.selectedColor === '') {
        this.selectedColor = this.options.defaultColor;
      }

      if (this.selectedColor === '' && this.options.colors.length > 0) {
        this.selectedColor = this.options.colors[0];
      }
    },
    append: function () {
      this.setInputReadonly();
      this.hideInput();
      this.addColorPickerButton();
      this.addColorPickerPopover();
    },
    setInputReadonly: function() {
      $(this.input).prop("readonly", this.options.inputReadonly);
    },
    hideInput: function() {
      if (this.options.inputHide) {
        $(this.input)
          .css("width", 0)
          .css("margin", 0)
          .css("padding", 0)
          .css("border", 0);
      }
    },
    addColorPickerButton: function() {
      const self = this;

      $(this.input).after('<span class="color colorIcon">' +
        '  <div class="colorButton">' +
        '    <div class="colorButtonInner" style="background-color: ' + this.selectedColor + '"></div>' +
        '  </div>' +
        '</span>');

      const colorIcon = $(this.input).next('span.colorIcon');
      colorIcon.on("click", function() {
        $(self.input).focus();
      });
      if (this.options.inputHide) {
        colorIcon
          .css("right", "unset")
          .css("left", "3px");
      }
    },
    changeColorPickerButtonColor: function() {
      const self = this;
      $(self.input).parent().find('span.colorIcon').find('div.colorButtonInner')[0].style.backgroundColor = self.selectedColor;
    },
    addColorPickerPopover: function() {
      const self = this;
      this.createColorsPopover();

      $(this.input)
        .on("focus", function() {
          $('div.colors').find('div.colorButton').each(function() {
            const colorButton = $(this);
            colorButton.on("click", function() {
              self.input.value = self.getHexBackgroundColor($(this).find('div.colorButtonInner')[0]);
              self.initSelectedColor();
              self.changeColorPickerButtonColor();
              self.reinitColorsPopover();
            });
          })
        })
        .on("change", function() {
          self.initSelectedColor();
          self.changeColorPickerButtonColor();
          self.reinitColorsPopover();
        });
    },
    createColorsPopover: function() {
      $(this.input).popover({
        content: this.createColorsPopoverContent(),
        html: this.options.html,
        placement: this.options.placement,
        trigger: this.options.trigger
      });
    },
    createColorsPopoverContent: function() {
      const self = this;

      let colorsPopoverContent = '<div class="colors">';
      this.options.colors.forEach(function(color) {
        colorsPopoverContent += '<span class="color">' +
          '  <div class="colorButton' + (self.selectedColor === color ? ' active' : '') + '">' +
          '    <div class="colorButtonInner" style="background-color: ' + color + ';"></div>' +
          '  </div>' +
          '</span>';
      });
      colorsPopoverContent += '</div>';

      return colorsPopoverContent;
    },
    reinitColorsPopover: function() {
      const self = this;

      $(self.input).popover('destroy');
      setTimeout(function () {
        self.createColorsPopover();
      }, 200);
    },
    getHexBackgroundColor: function(element) {
      const color = element.style.backgroundColor;

      if (color.match(/\d+/g)) {
        const rgb = color.match(/\d+/g);
        return '#' + ('0' + parseInt(rgb[0], 10).toString(16)).slice(-2) + ('0' + parseInt(rgb[1], 10).toString(16)).slice(-2) + ('0' + parseInt(rgb[2], 10).toString(16)).slice(-2);
      }

      return color;
    }
  };

  $.fn.colorPicker = function (options) {
    return this.each(function() {
      if (!$.data(this, "colorPicker")) {
        $.data(this, "colorPicker", new ColorPicker(this, options));
      }
    });
  };
}));
