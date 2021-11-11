import * as d3 from 'd3';

//palette
// rgb(250, 185, 61); 
// rgb(82, 149, 164);
// rgb(203, 56, 53);
// rgb(82, 149, 164);
// rgb(239, 152, 146);
// rgb(65, 54, 45);
const testContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 750 750" width="20" height="20">
<path
  fill="#FFDC00"
  d="M513.5 598.8c13.9-25.1 23.6-52.7 28.4-82.1-36.4 41.7-88.6 69.2-147.3 73.1l-.1.1c-24 17.3-50.4 29.9-77.8 37.8-86 24.8-182.4 3.4-250.2-64.4-6.9-6.9-13.3-14.1-19.2-21.5.7 1.4 1.5 2.9 2.2 4.3C93.7 631.5 170 697.6 262.4 728.3c9.4 1.1 19.1 1.7 28.8 1.7 95.8 0 179-53 222.3-131.2z"
/>
<path
  fill="#005CA8"
  d="M165.5 389.9c-.3-4.8-.5-9.7-.5-14.6 0-54.1 20-103.6 53-141.4 0-.1 0-.3.1-.4.1-.4.2-.9.2-1.3.2-1.5.5-2.9.8-4.4.1-.3.1-.7.2-1 .3-1.7.7-3.4 1-5.1v-.1C241.5 122.5 319.5 44 419.2 24.5c25-4.4 50.6-5.4 76-3C458.9 9.7 420.2 3.3 380 3.3c-59.9 0-116.4 14.1-166.5 39.3-7.4 5.9-14.6 12.3-21.5 19.1-89.4 89.5-98.1 228.8-26.5 328.2z"
/>
<path
  fill="#04BAEE"
  d="M156.6 508.9c25.1 13.9 52.7 23.6 82 28.4-41.7-36.4-69.1-88.7-73.1-147.3-71.6-99.4-63-238.7 26.5-328.2 6.9-6.9 14-13.2 21.5-19.1-.9.5-1.8.9-2.8 1.4C124.6 88.1 57.9 164.7 27 257.7c-1.1 9.5-1.7 19.1-1.7 28.8 0 95.8 53 179.1 131.3 222.4z"
/>
<path
  fill="#A1C517"
  d="M316.6 627.7c27.4-7.9 53.8-20.5 77.8-37.8l.1-.1c-4.8.3-9.7.5-14.6.5-54.1 0-103.6-20-141.4-53-29.3-4.8-57-14.5-82-28.4C78.3 465.6 25.3 382.3 25.3 286.5c0-9.8.6-19.4 1.7-28.8-.5 1.5-1 3-1.4 4.4C14.2 297.8 8 335.9 8 375.3c0 59.8 14.1 116.4 39.2 166.5 5.9 7.4 12.3 14.6 19.2 21.5 67.8 67.8 164.2 89.2 250.2 64.4z"
/>
<path
  fill="#A61680"
  d="M712.8 208.9c-5.9-7.4-12.3-14.6-19.2-21.5-67.7-67.7-164.1-89.1-250-64.4-27.5 7.9-54 20.6-78.1 37.9 4.8-.3 9.6-.5 14.5-.5 54.1 0 103.6 20 141.3 53 29.3 4.8 57 14.5 82.1 28.4 78.3 43.3 131.3 126.5 131.2 222.3 0 9.8-.6 19.4-1.7 28.8l1.8-5.4C746 452.1 752 414.4 752 375.3c0-59.8-14.1-116.3-39.2-166.4z"
/>
<path
  fill="#5C2482"
  d="M419.2 24.5c-99.7 19.4-177.7 98-198.8 197.1v.1c-.4 1.7-.7 3.4-1 5.1-.1.3-.1.7-.2 1-.3 1.5-.5 2.9-.8 4.4-.1.4-.2.9-.2 1.3 0 .1 0 .3-.1.4 36.4-41.7 88.7-69.2 147.4-73.1 24.1-17.4 50.6-30 78.1-37.9 85.9-24.7 182.3-3.3 250 64.4 6.9 6.9 13.3 14.1 19.2 21.5-.9-1.8-1.8-3.6-2.8-5.4-44.3-84.8-120.4-150.5-212.5-181.1-.8-.3-1.6-.5-2.4-.8-25.3-2.4-50.9-1.4-75.9 3z"
/>
<path
  fill="#F29100"
  d="M632.2 438.3c-7.9-27.3-20.5-53.6-37.8-77.5.3 4.8.5 9.7.5 14.6 0 54.1-20 103.6-53 141.4-4.8 29.3-14.5 57-28.4 82.1C470.2 677 387 730 291.2 730c-9.7 0-19.4-.6-28.8-1.7 1.3.4 2.6.9 4 1.3 35.8 11.5 74 17.7 113.6 17.7 59.8 0 116.4-14.1 166.5-39.2 7.4-5.9 14.6-12.3 21.5-19.2 67.9-67.9 89.2-164.5 64.2-250.6z"
/>
<path
  fill="#E3032E"
  d="M603.4 241.8c-25.1-13.9-52.7-23.6-82.1-28.4 41.7 36.4 69.2 88.7 73.1 147.4 17.2 23.9 29.8 50.2 37.8 77.5 25 86.1 3.7 182.8-64.2 250.7-6.9 6.9-14.1 13.3-21.5 19.2 2.6-1.3 5.1-2.6 7.7-3.9 83.8-44.4 148.5-120 178.9-211.2 1.1-9.5 1.7-19.1 1.7-28.8-.1-96-53.1-179.2-131.4-222.5z"
/>
</svg>`;

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
    
    if (!d.isTreatment && !d.isSequenced && ['PRESERVED_SPECIMEN', 'FOSSIL_SPECIMEN', 'LIVING_SPECIMEN'].includes(d.type)) {
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
