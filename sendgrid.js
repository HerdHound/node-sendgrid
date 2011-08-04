/**
 * node-sendgrid
 * SengGrid SMTP API headers library
 * 
 * Copyright (c)2011, by Branko Vukelic <branko@herdhound.com>
 * All rights reserved.
 * Released under MIT license (see LICENSE)
 *
 */

var sendgrid = exports;
var _ = require('underscore');
var Headers;

/**
 * PRIVATE UTILITY FUNCTIONS
 */

function addTo(to, headers) {
  headers.to = headers.to || [];
  if (_.isString(to)) {
    headers.to.push(to);
  } else if (_.isArray(to)) {
    headers.to = to;
  }
}

function addSubVal(key, val, headers) {
  headers.sub = headers.sub || {};
  if (_.isString(val)) {
    headers.sub[key] = [val];
  } else if (_.isArray(val)) {
    headers.sub[key] = val;
  }
}

function addSubObj(sub, headers) {
  headers.sub = headers.sub || {};
  // Shallow-copy properties from sub to headers.sub
  _.extend(headers.sub, sub);
}

function setUniqueArgs(obj, headers) {
  headers.unique_args = obj;
}

function setCategory(category, headers) {
  if (_.isString(category)) {
    headers.category = category;
  }
}

function addFilterSetting(filter, setting, val, headers) {
  headers.filters = headers.filters || {};
  headers.filters[filter] = headers.filters[filter] || {};
  headers.filters[filter].settings = headers.filters[filter].settings || {};
  headers.filters[filter].settings[setting] = val;
}

function addFilterSettings(filter, settings, headers) {
  _.keys(settings).forEach(function(setting) {
    addFilterSettings(filter, setting, settings[setting], headers);
  });
}

/**
 * PUBLIC FUNCTIONALITY
 */

/**
 * sendgrid.Headers() -> Object
 *
 * Constructor for headers objects. Headers constructor takes a single 
 * parameter, which is an object containing the defaults.
 *
 * Default header settings are:
 *
 * - ``to``: additional recipients, either single email or an array of emails
 * - ``sub``: object contianing key-value pairs of substitution variables
 * - ``unique``: object containing key-value pairs of unique args
 * - ``category``: category to which the message should be logged
 * - ``filters``: filter-settings pairs mapping filter name to settings object
 *
 * @param defaults, default header settings
 * @api public
 */
sendgrid.Headers = Headers = function(defaults) {
  this.headers = {};

  if (defaults) {
    addTo(defaults.to, this.headers);
    addSubObj(defaults.sub, this.headers);
    setUniqueArgs(defaults.unique, this.headers);
    setCategory(defaults.category, this.headers);
    if (defaults.filters) {
      _.keys(defaults.filters).forEach(function(filter) {
        addFilterSettings(filter, defaults.filters[filter], this.headers);
      });
    }
  }
};

/**
 * sendgrid.Headers.toString() -> String
 *
 * JSON representation of SendGrid SMTP API headers.
 *
 * @api public
 */
Headers.prototype.toString = function() {
  return JSON.stringify(this.headers);
};

/**
 * sendgrid.Headers.addTo(to) -> undefined
 *
 * Sets the ``to`` headers.
 *
 * @param to, single email address or array of addresses
 * @api public
 */
Headers.prototype.addTo = function(to) {
  addTo(to, this.headers);
};

/**
 * sendgrid.Headers.addSubVal(key, val) -> undefined
 *
 * Sets the substitution variables. In the message body, developer can embed 
 * placeholders in the ``<% placeholderName %>`` format, and the substituion
 * key-value pairs are used to replace those variables.
 *
 * If the val is an array, there should be exactly one array member per 
 * recipient.
 *
 * @param key, the key name to use in variable substitution
 * @param val, value that replaces the placeholder
 * @api public
 */
Headers.prototype.addSubVal = function(key, val) {
  addSubVal(key, val, this.headers);
};

/**
 * sendgrid.Headers.setUniqueArgs(args) -> undefined
 *
 * Sets the unique arg values.
 *
 * @param arg, key-value pairs of args and their values
 * @api public
 */
Headers.prototype.setUniqueArgs = function(args) {
  setUniqueArgs(args, this.headers);
};

/**
 * sendgrid.Headers.setCategory(category) -> undefined
 *
 * Sets the category under which the email will be logged.
 *
 * @param category, category name
 * @api public
 */
Headers.prototype.setCategory = function(category) {
  setCategory(category, this.headers);
};

/**
 * sendgrid.Headers.addFilterSetting(filter, setting, val) -> undefined
 *
 * Modifies or sets filter settings.
 *
 * Filters and their settings are listed on SendGrid documentation page at
 * http://docs.sendgrid.com/documentation/api/smtp-api/filter-settings/
 *
 * @param filter, name of the filter
 * @param setting, name of the setting
 * @param val, setting value
 * @api public
 */
Headers.prototype.addFilterSetting = function(filter, setting, val) {
  addFilterSetting(filter, setting, val, this.headers);
};
