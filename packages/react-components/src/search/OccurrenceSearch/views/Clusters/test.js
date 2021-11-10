import * as d3 from 'd3';

export default function test({ element, links_data, nodes_data, onNodeClick }) {
  // this is forked from https://bl.ocks.org/puzzler10/4438752bb93f45dc5ad5214efaa12e4a and modified to my needs

  // i think i might rather wnt to use another force as in this example https://observablehq.com/@d3/disjoint-force-directed-graph

  // filtering nodes https://bl.ocks.org/denisemauldin/cdd667cbaf7b45d600a634c8ae32fae5

  //create somewhere to put the force directed graph
  var svg = d3.select(element),
    width = +svg.attr("width"),
    height = +svg.attr("height");

  svg.selectAll("*").remove();

  var radius = 5,
    side = 4 * radius * Math.cos(Math.PI / 4);

  //set up the simulation and add forces  
  var simulation = d3.forceSimulation()
    .nodes(nodes_data);

  var link_force = d3.forceLink(links_data)
    //  .distance(function(d) {return d*.5})
    // .strength(0.1)
    .id(function (d) { return d.name; });

  var charge_force = d3.forceManyBody()
    .strength(-30);

  var center_force = d3
    .forceCenter(width / 2, height / 2);

  simulation
  .force("links", link_force)
    .force("charge_force", charge_force)
    //.force("center_force", center_force)
    .force("x", d3.forceX(width / 2))
    .force("y", d3.forceY(height / 2))
    
    ;


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
    .attr("r", radius)
    .attr("fill", circleColour);

  // https://stackoverflow.com/questions/20913869/wrap-text-within-circle
  node.append("foreignObject")
    .attr('x', function (d) { return -(side / 2) })
    .attr('y', function (d) { return -(side / 2) })
    .attr('width', side)
    .attr('height', side)
    .append("xhtml:div")
    .attr("class", "nodeContent")
    .html(function (d) { return `<div style="text-overflow: ellipsis; overflow: hiddenx;">${d.title || d.name}<div><div class="nodeContent-info" style="background: #333; color: white; position: absolute; right: 0; bottom: 0;">test</div></div>` });


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

  //Function to choose what color circle we have
  //Let's return blue for males and red for females
  function circleColour(d) {
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
      let index = parseInt(d.source.name) % 13;
      return "pink";//colorPool[index];
    } catch (err) {
      console.log(err.message);
      return 'purple';
    }
  }

  node.call(drag).on("click", click);

  function click(event, d) {
    console.log(d.name);
    onNodeClick({key: d.name})
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
    node.attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; });

    //update link positions 
    link
      .attr("x1", function (d) { return d.source.x; })
      .attr("y1", function (d) { return d.source.y; })
      .attr("x2", function (d) { return d.target.x; })
      .attr("y2", function (d) { return d.target.y; });
  }



  // ideasfor server side rendering this 
  // https://gist.github.com/danioyuan/d776a8034b64ceaa80bb
}