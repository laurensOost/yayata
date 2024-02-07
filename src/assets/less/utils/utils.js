module.exports = {
  install: function(less, pluginManager, functions) {
    functions.add('color-yiq', function(color, dark, light, threshold) {
      const yiq = (color.rgb[0] * 299 + color.rgb[1] * 587 + color.rgb[2] * 114) * .001;
      return yiq >= threshold.value ? dark : light;
    });
  }
}
