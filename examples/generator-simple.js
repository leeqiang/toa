'use strict';
// **Github:** https://github.com/thunks/toa
//
// **License:** MIT

var Toa = require('../index');
var app = Toa(function* (Thunk) {
  this.body = yield 'Hello World!\n-- ' + this.config.poweredBy;
});

app.config = {
  poweredBy: 'Test'
};

app.listen(3000);
