;
(function() {
  function Tablesum(el, options) {
    if (!(this instanceof Tablesum)) return new Tablesum(el, options);

    if (!el || el.tagName !== 'TABLE') {
      throw new Error('Element must be a table');
    }
    this.init(el, options || {});
  }

  var strategies = [{
    name: 'usd',
    pattern: function(item) {
      return item.match(/^[-+]?[£\x24Û¢´€]\d+\s*([,\.]\d{0,2})/)
    },
    unformat: function(item) {
      return +item.replace(/[^\-?0-9.]/g, '');
    },
    format: function(number) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(number);
    },
    initial: 0,
    sum: function(a, b) {
      return +a + +b;
    }
  }, {
    name: 'number',
    pattern: function(item) {
      return item.match(/^[-+]?(\d)*-?([,\.]){0,1}-?(\d)+([E,e][\-+][\d]+)?%?$/);
    },
    unformat: function(item) {
      return +item.replace(/[^\-?0-9.]/g, '');
    },
    format: function(number) {
      return number.toFixed(2)
    },
    initial: 0,
    sum: function(a, b) {
      return +a + +b;
    }
  }];

  var getInnerText = function(el) {
    return el.getAttribute('data-sum') || el.textContent || el.innerText || '';
  };


  Tablesum.prototype = {

    init: function(el, options) {
      var that = this,
        firstRow

      that.table = el;
      that.thead = false;
      that.options = options;

      if (el.rows && el.rows.length > 0) {
        if (el.tHead && el.tHead.rows.length > 0) {
          for (let i = 0; i < el.tHead.rows.length; i++) {
            if (el.tHead.rows[i].getAttribute('data-sum-method') === 'thead') {
              firstRow = el.tHead.rows[i];
              break;
            }
          }
          if (!firstRow) {
            firstRow = el.tHead.rows[el.tHead.rows.length - 1];
          }
          that.thead = true;
        } else {
          firstRow = el.rows[0];
        }
      }

      if (!firstRow) return;

      var footer = el.createTFoot();

      var row = footer.insertRow(0);

      for (let i = 0; i < firstRow.cells.length; i++) {
        let cell = row.insertCell()

        if (firstRow.cells[i].getAttribute('data-sum-method') === 'none') continue;

        let texts = [];
        for (let j = 0; j < that.table.tBodies.length; j++) {
          for (let k = 0; k < that.table.tBodies[j].rows.length; k++) {
            let row = that.table.tBodies[j].rows[k];

            let item = row.cells[i];
            texts.push(getInnerText(item).trim())
          }
        }
        let strategy = strategies.find(function(strategy) {
          return texts.every(strategy.pattern)
        })
        if (!strategy) continue;
        let values = texts.map(function(text) {
          return strategy.unformat(text)
        }).filter(function(value) {
          return value
        })
        if (values.length != 0) {
          cell.innerText = strategy.format(values.reduce(strategy.sum, strategy.initial))
        }

      }
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Tablesum;
  } else {
    window.Tablesum = Tablesum;
  }
})();
