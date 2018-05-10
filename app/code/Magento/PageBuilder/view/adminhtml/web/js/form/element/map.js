/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/*eslint-disable vars-on-top, strict */

define([
    'Magento_Ui/js/form/element/abstract',
    'https://maps.googleapis.com/maps/api/js?key=AIzaSyCw10cOO31cpxb2bcwnHPHKtxov8oUbxJw'
], function (AbstractField) {
    'use strict';

    var google = window.google || {};

    return AbstractField.extend({
        defaults: {
            elementTmpl: 'Magento_PageBuilder/form/element/map',
            map: false,
            marker: false
        },

        /**
         * Render the map into the field
         *
         * @param {HTMLElement} element
         */
        renderMap: function (element) {
            // Get the start value and convert the value into an array
            var startValue = this.value(),
                mapOptions;

            if (typeof startValue === 'string' && startValue !== '') {
                startValue = JSON.parse(startValue);
            }

            mapOptions = {
                zoom: startValue.zoom ? parseInt(startValue.zoom, 10) : 8,
                center: new google.maps.LatLng(
                    startValue.lat ? startValue.lat : 30.2672,
                    startValue.lng ? startValue.lng : -97.7431
                ),
                scrollwheel: false,
                disableDoubleClickZoom: false,
                // mapTypeId: google.maps.MapTypeId.ROADMAP,
                mapTypeControl: true,
                mapTypeControlOptions: {
                    style: google.maps.MapTypeControlStyle.DEFAULT
                },
                navigationControl: true,
                navigationControlOptions: {
                    style: google.maps.NavigationControlStyle.DEFAULT
                }
            };

            // Create the map
            this.map = new google.maps.Map(element, mapOptions);

            // Add marker if there is a start value
            if (this.value()) {
                this.addMarker(startValue.lat, startValue.lng);
            }

            // After click, add and update both Lat and Lng.
            google.maps.event.addListener(this.map, 'click', this.onClick.bind(this));
            google.maps.event.addListener(this.map, 'dblclick', this.onDblClick.bind(this));
            this.map.addListener('zoom_changed', this.onZoomChange.bind(this));
            google.maps.event.trigger(this.marker, 'click');
        },

        /**
         * Adds a map marker
         *
         * @param {String} lat
         * @param {String} lng
         */
        addMarker: function (lat, lng) {
            this.marker = new google.maps.Marker({
                draggable: true,
                map: this.map,
                position: new google.maps.LatLng(lat, lng)
            });
            google.maps.event.addListener(this.marker, 'dragend', this.onDragEnd.bind(this));
        },

        /**
         * Event for drag end to update value
         */
        onDragEnd: function () {
            this.value(this.exportValue());
        },

        /**
         * Event for click to update marker, delayed by 300ms in case of double click
         *
         * @param {Event} event
         */
        onClick: function (event) {
            this.clickTimer = setTimeout(function () {
                if (!this.marker) {
                    this.addMarker(event.latLng.lat(), event.latLng.lng());
                }
                this.value(this.exportValue(event.latLng));
            }.bind(this), 300);
        },

        /**
         * Event for double click to prevent call from single click
         */
        onDblClick: function () {
            clearTimeout(this.clickTimer);
        },

        /**
         * Event for on zoom change to update zoom value
         */
        onZoomChange: function () {
            this.value(this.exportValue());
        },

        /**
         * Callback after an update to map
         */
        onUpdate: function () {
            this._super();
            var content = this.value(),
                latLng,
                zoom;

            if (!this.map || this.value() === '' || this.value() === this.exportValue()) {
                return;
            }

            if (typeof this.value() === 'string' && this.value() !== '') {
                content = JSON.parse(this.value());
            }

            latLng = new google.maps.LatLng(content.lat, content.lng);
            zoom = content.zoom;

            if (typeof zoom !== 'number') {
                zoom = parseInt(zoom, 10);
            }
            this.marker.setPosition(latLng);
            this.map.setZoom(zoom);
            this.map.setCenter(latLng);
        },

        /**
         * Returns current lat, lng, and zoom level as a single string
         *
         * @param {Object} latLng
         * @return {Object}
         */
        exportValue: function (latLng) {
            var position = this.marker ?
                this.marker.getPosition() : new google.maps.LatLng(this.map.center.lat(), this.map.center.lng()),
                curLatLng = latLng ? latLng : position;

            return JSON.stringify({
                lat: curLatLng.lat(),
                lng: curLatLng.lng(),
                zoom: this.map.getZoom()
            });
        }
    });
});