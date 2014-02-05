var jsonp = require('jsonp');
var gens = require('gens');

function *listen(el, evType) {
  while (true)
    yield function(cb) {
      var fire = function(ev) {
        el.removeEventListener(evType, fire);
        cb(null, ev);
      }
      el.addEventListener(evType, fire);
    }
}

function *listen(el, evType) {
  var waiting;
  el.addEventListener(evType, function(ev) {
    if (waiting !== undefined) {
      waiting(null, ev);
      waiting = undefined;
    }
  });
  while (true)
    yield function(cb) {
      waiting = cb;
    }
}

function fetch(url) {
  return jsonp.bind(null, url);
}

function render(el, items) {
  var items = items.map(function(item) {
    return '<li>' + item + '</li>';
  });
  el.innerHTML = '<ul>' + items.join('');  + '</ul>';
}

function go(gen) {
  gens(gen)(function(err) { if (err) throw err; });
}

go(function*() {
  var results = document.getElementById('results');
  var query = document.getElementById('query');
  var clicks = listen(document.getElementById('search'), 'click');

  while (true) {
    yield clicks.next().value; // wait for 'click' event

    var url = 'http://en.wikipedia.org/w/api.php' +
      '?action=opensearch&format=json&search=' +
      encodeURIComponent(query.value);

    var data = yield fetch(url);
    render(results, data[1]);
  }
});
