'use strict';

// get from https://github.com/koajs/koa/tree/master/lib

/**
 * Module dependencies.
 */

var util = require('util');
var createError = require('http-errors');
var httpAssert = require('http-assert');
var delegate = require('delegates');
var statuses = require('statuses');
var assert = require('assert');
var EventEmitter = require('events').EventEmitter;

module.exports = Context;

function Context(config) {
  EventEmitter.call(this);
  this.config = config;
}

util.inherits(Context, EventEmitter);

/**
* Context prototype.
*/

var proto = Context.prototype;

/**
 * util.inspect() implementation, which
 * just returns the JSON output.
 *
 * @return {Object}
 * @api public
 */

proto.inspect = function () {
  return this.toJSON();
};

/**
 * Return JSON representation.
 *
 * Here we explicitly invoke .toJSON() on each
 * object, as iteration will otherwise fail due
 * to the getters and cause utilities such as
 * clone() to fail.
 *
 * @return {Object}
 * @api public
 */

proto.toJSON = function () {
  return {
    config: this.config,
    request: this.request.toJSON(),
    response: this.response.toJSON(),
    originalUrl: this.originalUrl,
    req: '<original node req>',
    res: '<original node res>',
    socket: '<original node socket>'
  };
};

/**
 * Similar to .throw(), adds assertion.
 *
 *    this.assert(this.user, 401, 'Please login!');
 *
 * See: https://github.com/jshttp/http-assert
 *
 * @param {Mixed} test
 * @param {Number} status
 * @param {String} message
 * @api public
 */

proto.assert = httpAssert;

/**
 * Throw an error with `msg` and optional `status`
 * defaulting to 500. Note that these are user-level
 * errors, and the message may be exposed to the client.
 *
 *    this.throw(403)
 *    this.throw('name required', 400)
 *    this.throw(400, 'name required')
 *    this.throw('something exploded')
 *    this.throw(new Error('invalid'), 400);
 *    this.throw(400, new Error('invalid'));
 *
 * See: https://github.com/jshttp/http-errors
 *
 * @param {String|Number|Error} err, msg or status
 * @param {String|Number|Error} [err, msg or status]
 * @param {Object} [props]
 * @api public
 */

proto.throw = function () {
  throw createError.apply(null, arguments);
};

/**
 * Response delegation.
 */

delegate(proto, 'response')
  .method('attachment')
  .method('redirect')
  .method('remove')
  .method('vary')
  .method('set')
  .access('status')
  .access('message')
  .access('body')
  .access('length')
  .access('type')
  .access('lastModified')
  .access('etag')
  .getter('headerSent')
  .getter('writable');

/**
 * Request delegation.
 */

delegate(proto, 'request')
  .method('acceptsLanguages')
  .method('acceptsEncodings')
  .method('acceptsCharsets')
  .method('accepts')
  .method('get')
  .method('is')
  .access('querystring')
  .access('idempotent')
  .access('socket')
  .access('search')
  .access('method')
  .access('query')
  .access('path')
  .access('url')
  .getter('subdomains')
  .getter('protocol')
  .getter('host')
  .getter('hostname')
  .getter('header')
  .getter('headers')
  .getter('secure')
  .getter('stale')
  .getter('fresh')
  .getter('ips')
  .getter('ip');
