# Tablesum
Automatic table footers in pure JavaScript. With love to [Tablesort](https://github.com/tristen/tablesort).

### Quick start

Add the one file to your project. This project doesn't support npm yet but a pull request would be appreciated!

``` html
<script src='tablesum.js'></script>

<script>
  new Tablesum(document.getElementById('table-id'));
</script>
```

This will add a `tfoot` element to your table, with a cell for each column's sum.

To sum a different number than the content of the cell, you can use the `data-sum` attribute. 

```html
<td data-sum="5">5 cars</td>
````

To ignore a column, use the `data-sum-method` with a value of `none` in the header.

```html
<td data-sum-method="none">6</td>
```

### Contributing

Tablesum supports summing decimal numbers and US dollars. More summing strategies would be appreciated!

### Licence

MIT

### Bugs?

[Create an issue](https://github.com/khanlou/Tablesum/issues)
