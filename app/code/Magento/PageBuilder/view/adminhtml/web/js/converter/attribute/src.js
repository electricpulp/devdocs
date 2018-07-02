/*eslint-disable */
define(["Magento_PageBuilder/js/config", "Magento_PageBuilder/js/utils/image", "Magento_PageBuilder/js/utils/url"], function (_config, _image, _url) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * @api
   */
  var Src =
  /*#__PURE__*/
  function () {
    function Src() {}

    var _proto = Src.prototype;

    /**
     * Convert value to internal format
     *
     * @param value string
     * @returns {string | object}
     */
    _proto.fromDom = function fromDom(value) {
      if (!value) {
        return "";
      }

      return (0, _image.decodeUrl)(value);
    };
    /**
     * Convert value to knockout format
     *
     * @param name string
     * @param data Object
     * @returns {string}
     */


    _proto.toDom = function toDom(name, data) {
      var value = data[name];

      if (value[0] === undefined || value[0].url === undefined) {
        return "";
      }

      var imageUrl = value[0].url;
      var mediaUrl = (0, _url.convertUrlToPathIfOtherUrlIsOnlyAPath)(_config.getConfig("media_url"), imageUrl);
      var mediaPath = imageUrl.split(mediaUrl);
      return "{{media url=" + mediaPath[1] + "}}";
    };

    return Src;
  }();

  return Src;
});
//# sourceMappingURL=src.js.map
