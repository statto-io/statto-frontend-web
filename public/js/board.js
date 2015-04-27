$(function() {

  // --- counters ---

  // create all the graphs
  $('.graph-c').each(function(i, el) {

    var $el = $(el)

    // get the info as a csv file (less syntactic overhead than a *.json)
    d3
      .csv('/stats/c/' + $el.data('name') + '.csv?from=' + $el.data('from') + '&to=' + $el.data('to'))
      .row(function(d) {
        // munge the data into something MetricsGraphics uses
        return {
          ts: d.ts,
          date: new Date(+d.ts),
          v: +d.v,
        };
      })
      .get(function(err, data) {
        var id = $el.data('id');

        // modify away!
        MG.data_graphic({
          title       : $el.data('title'),
          description : $el.data('desc'),
          // line, histogram
          chart_type  : 'line',
          // binned      : true,
          // bins        : Math.floor(data.length / 4),
          data        : data,
          width       : 960,
          height      : 375,
          target      : '#graph-' + id,
          x_accessor  : 'date',
          y_accessor  : 'v',
          // animate_on_load : true,
          // for count, then missing is zero
          // missing_is_hidden : true,
          // don't do basis, cardinal, monotone, step, bundle.
          // For each graph type do:
          // * counter - linear
          // * gauge   - (a smooth one)
          interpolate : 'cardinal',
        });
      })
    ;
  });

  // --- gauges ---
  // ToDo

  // --- timers / histograms ---
  // ToDo

  // --- sets ---
  // ToDo

});
