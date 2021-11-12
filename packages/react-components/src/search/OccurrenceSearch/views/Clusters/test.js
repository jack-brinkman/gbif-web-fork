import * as d3 from 'd3';

export function highlightNode({element, key, remove}) {
  const svg = d3.select(element);
  svg
    .selectAll(".node")
    .attr("data-highlight", (d, index, list) => {
      if (!key && list[index].attributes['data-highlight']) {
        return 'false';
      }
      if (d.name === '' + key) return 'true';
      return undefined;
    });
}

export default function test({ element, links_data, nodes_data, onNodeClick }) {
  // this is forked from https://bl.ocks.org/puzzler10/4438752bb93f45dc5ad5214efaa12e4a and modified to my needs

  // i think i might rather wnt to use another force as in this example https://observablehq.com/@d3/disjoint-force-directed-graph

  // filtering nodes https://bl.ocks.org/denisemauldin/cdd667cbaf7b45d600a634c8ae32fae5

  // https://observablehq.com/@john-guerra/force-in-a-box
  // might be interesting as a way to make the graphs fill the rectangular area available

  // bounding box on nodes
  // https://tomroth.com.au/fdg-bounding-box/

  // http://jsfiddle.net/Bull/4btFx/1/
  // different symbols per node

  // run first version without animating it
  // https://stackoverflow.com/questions/47510853/how-to-disable-animation-in-a-force-directed-graph

  // linear gradients on connecting lines
  // https://stackoverflow.com/questions/42874203/linear-gradient-across-svg-line

  //create somewhere to put the force directed graph
  const svg = d3.select(element);
  const width = element.clientWidth;
  const height = element.clientHeight;


  svg.selectAll("*").remove();

  var radius = 10,
    side = 2 * radius * Math.cos(Math.PI / 4);

  //set up the simulation and add forces  
  var simulation = d3.forceSimulation()
    .nodes(nodes_data);

  var link_force = d3.forceLink(links_data)
     .distance(function(d) {
       if (d.target.type === 'IMAGE') return radius;
       if (d.target.type === 'SEQUENCE') return radius;
       if (d.target.type === 'TYPE') return radius;
       return d.source.publishingOrgKey !== d.target.publishingOrgKey ? 50 : 25;
      })
    // .strength(0.1)
    .id(function (d) { return d.name; });

  var charge_force = d3.forceManyBody()
    .strength(-50);

  simulation
    .force("links", link_force)
    .force("charge_force", charge_force)
    // .force("x", d3.forceX(width / 2))
    // .force("y", d3.forceY(height / 2));
    .force('x', d3.forceX(width/2).strength(.05))
    .force('y', d3.forceY(height/2).strength(.1));

  //add tick instructions: 
  simulation.on("tick", tickActions);

  //add encompassing group for the zoom 
  var g = svg.append("g")
    .attr("class", "everything");

  //draw lines for the links 
  var link = g.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(links_data)
    .enter().append("line")
    .attr("stroke-width", 2)
    .style("stroke", linkColour);

  // attaching events to links
  // https://stackoverflow.com/questions/19132118/d3js-force-directed-mouseover-on-line-link-doesnt-work-properly
  // link.on("mouseover", function () { d3.select(this).style("stroke", "red"); });
  // link.on("mouseleave", function () { d3.select(this).style("stroke", "pink"); });


  //draw circles for the nodes 
  var node = g.append("g")
    .attr("class", "nodes")
    .selectAll(".node")
    .data(nodes_data)
    .enter()
    .append("g")
    .attr("class", "node")
    .classed("fixed", d => d.fx !== undefined);

  node.append("circle")
    .attr("r", d => {
      if (d.type === 'IMAGE') return 5;
      if (d.type === 'SEQUENCE') return 5;
      if (d.type === 'TYPE') return 5;
      return radius
    })
    // .attr("fill", circleColour)
    .attr("class", circleClass);
    // node.html(testContent);
    // var innerSVG = node.append("svg")
    // innerSVG
    //   .attr("y", -10)
    //   .append("text")
    //   .attr("y", 10)
    //   .text("this text is in the inner SVG");

  // https://stackoverflow.com/questions/20913869/wrap-text-within-circle
  node.append("foreignObject")
    .attr("class", "nodeContent-wrapper")
    // .attr('x', function (d) { return -(side / 2) })
    // .attr('y', function (d) { return -(side / 2) })
    .attr('x', function (d) { return -radius })
    .attr('y', function (d) { return -radius })
    .attr('width', radius*2) // used to be side instead of radius
    .attr('height', radius*2)
    .append("xhtml:div")
    .attr("class", "nodeContent")
    .html(function (d) { return `<div class="nodeContent-info" style="background: #333; color: white; position: absolute; right: 0; bottom: 0;">${d.title || d.name}</div></div>` });

  //add zoom capabilities 
  //https://observablehq.com/@d3/delaunay-find-zoom
  let transform;
  const zoom = d3.zoom().on("zoom", e => {
    g.attr("transform", (transform = e.transform));
    g.style("stroke-width", 3 / Math.sqrt(transform.k));
    //    nodes.attr("r", 3 / Math.sqrt(transform.k));
  });

  svg
    .call(zoom)
    .call(zoom.transform, d3.zoomIdentity)

  /** Functions **/

  //Dimensions that could be intersting to show.
  // occurrenceFeature: specimen, holotype, sequenced, treatment, hasMedia, hasLocation, hasDate
  // always: isCapped, isEntry
  function circleClass(d) {
    let str = 'node-circle ';
    if (d.capped) {
      str += 'node-capped '
    }
    if (d.isEntry) {
      str += 'node-entry '
    }
    if (d.type === 'SEQUENCE') {
      str += 'node-sequence ';
    }
    if (d.type === 'IMAGE') {
      str += 'node-image ';
    }
    if (d.isTreatment) {
      str += 'node-treatment ';
    }
    if (d.type === 'TYPE') {
      str += 'node-type ';
    }
    
    if (['PRESERVED_SPECIMEN', 'FOSSIL_SPECIMEN', 'LIVING_SPECIMEN'].includes(d.type)) {
      str += 'node-specimen ';
    }
    return str;
  }
  function circleColour(d) {
    if (d.capped) {
      return 'tomato';
    }
    if (d.isEntry) {
      return "blue";
    }
    if (d.type == "CITATION") {
      return "tomato";
    } else if (d.type === "PUBLISHER") {
      return "deepskyblue";
    } else if (d.isSequenced) {
      return "yellow";
    } else if (d.isTreatment) {
      return "orange";
    } else {
      return "pink";
    }
  }

  //Function to choose the line colour and thickness 
  //If the link type is "A" return green 
  //If the link type is "E" return red 
  function linkColour(d) {
    try {
      if (d.source.publishingOrgKey !== d.target.publishingOrgKey) {
        return 'pink';
      } else {
        return 'deepskyblue';
      }
      //let index = parseInt(d.source.name) % 13;
      return "pink";//colorPool[index];
    } catch (err) {
      console.log(err.message);
      return 'purple';
    }
  }

  node.call(drag).on("click", click);

  function click(event, d) {
    console.log(d.name);
    onNodeClick({ key: d.name })
    // delete d.fx;
    // delete d.fy;
    // d3.select(this).classed("fixed", false);
    // simulation.alpha(1).restart();
  }

  node.call(drag(simulation));

  //https://observablehq.com/@d3/sticky-force-layout?collection=@d3/d3-drag
  function clamp(x, lo, hi) {
    return x;
    return x < lo ? lo : x > hi ? hi : x;
  }

  function drag(simulation) {
    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  }

  function tickActions() {
    //update circle positions each tick of the simulation 
    /*       node
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });*/
    node.attr("transform", function (d) {
      // const x = Math.max(radius, Math.min(width - radius, d.x));
      // const y = Math.max(radius, Math.min(height - radius, d.y));
      // return "translate(" + x + "," + y + ")";
      return "translate(" + d.x + "," + d.y + ")";
    });

    //update link positions 
    link
      .attr("x1", function (d) { return d.source.x; })
      .attr("y1", function (d) { return d.source.y; })
      .attr("x2", function (d) { return d.target.x; })
      .attr("y2", function (d) { return d.target.y; });
  }


  // zoom fit http://bl.ocks.org/TWiStErRob/b1c62730e01fe33baa2dea0d0aa29359
  // https://stackoverflow.com/questions/16236600/d3-js-force-layout-auto-zoom-scale-after-loading
  function lapsedZoomFit(ticks, transitionDuration) {
    for (var i = ticks || 200; i > 0; --i) simulation.tick();
    simulation.stop();
    zoomFit(undefined, transitionDuration);
  }

  function zoomFit(paddingPercent, transitionDuration) {
    var bounds = svg.node().getBBox();
    var parent = svg.node().parentElement;
    var fullWidth = parent.clientWidth,
      fullHeight = parent.clientHeight;
    var width = bounds.width,
      height = bounds.height;
    var midX = bounds.x + width / 2,
      midY = bounds.y + height / 2;
    if (width == 0 || height == 0) return; // nothing to fit
    var scale = (paddingPercent || 0.75) / Math.max(width / fullWidth, height / fullHeight);
    var translate = [fullWidth / 2 - scale * midX, fullHeight / 2 - scale * midY];

    console.trace("zoomFit", translate, scale);
    var transform = d3.zoomIdentity
      .translate(translate[0], translate[1])
      .scale(scale);

    svg
      .transition()
      .duration(transitionDuration || 0) // milliseconds
      .call(zoom.transform, transform);
  }

  console.log('test');
  globalThis.lapsedZoomFit = lapsedZoomFit;
  // lapsedZoomFit(undefined, 0);

  // ideasfor server side rendering this 
  // https://gist.github.com/danioyuan/d776a8034b64ceaa80bb
}
