(this["webpackJsonponiqua-fitboard"]=this["webpackJsonponiqua-fitboard"]||[]).push([[0],{124:function(a,t,e){"use strict";e.r(t);var s,i=e(0),n=e.n(i),r=e(35),o=e.n(r),c=(e(89),e(15)),l=e(43),d=e(44),h=e(45),u=e(78),b=e(77),j=(e(90),e(141)),O=e(148),m=e(142),p=e(143),g=e(11),f=e.n(g),v=e(133),D=e(134),C=e(135),x=e(136),k=e(137),w=e(138),y=e(139),L=e(140),P=e(144),U=e(145),S=e(146),T=e(147),N=e(58),_=e(60),A=e(61),M=e(62),E=e(59),I=e(30),H=e(63),F=e(2),K=e(6);!function(a){a.KM="km",a.MILES="miles"}(s||(s={}));var R=function(a){Object(u.a)(e,a);var t=Object(b.a)(e);function e(a){var i;return Object(d.a)(this,e),(i=t.call(this,a)).brisbaneOfficeCords=new g.LatLng(-27.466898152285882,153.02916564215533),i.denverOfficeCords=new g.LatLng(39.627924473980165,f.a.Util.wrapNum(-104.89594227315469,[0,360],!0)),i.midPoint={lat:5.405980169474166,lng:f.a.Util.wrapNum(-156.74269746105844,[0,360],!0)},i.australiaProgressLine=void 0,i.usProgressLine=void 0,i.data=void 0,i.map=void 0,i.totalDistance_km=i.brisbaneOfficeCords.distanceTo(i.denverOfficeCords)/1e3,i.totalDistance_miles=.621371*i.totalDistance_km,i.mapCreated=function(a){new f.a.polyline([i.brisbaneOfficeCords,i.denverOfficeCords],{weight:8,opacity:.3,color:"#ee5396"}).addTo(a),i.map=a,fetch("/api/dashboard").then((function(a){a.json().then((function(a){i.data=a,i.updateStats(i.state.distanceUnit)}))}))},i.state={dataLoading:!0,overallData:[],usData:[],australiaData:[],tableData:[],areaOverallData:[],areaUsData:[],areaAustraliaData:[],areaChartData:[],donutChartOptions:e.getDonutChartOptions(!0),areaChartOptions:e.getAreaChartOptions(!0),donutChartData:[],distanceUnit:s.KM,tableHeaders:i.getTableHeaders(s.KM),selectedContentIndex:0},i}return Object(h.a)(e,[{key:"getProgressPoint",value:function(a,t,e,s){var i=f.a.GeometryUtil.angle(a,t,e),n=f.a.GeometryUtil.destination(t,i,s);return f.a.GeometryUtil.closestOnSegment(a,[n.lat,f.a.Util.wrapNum(n.lng,[0,360],!0)],t,e)}},{key:"changeDistanceUnit",value:function(a){this.setState({distanceUnit:a,dataLoading:!0,donutChartOptions:e.getDonutChartOptions(!0)}),this.updateStats(a)}},{key:"updateStats",value:function(a){var t,i;if(this.data&&this.map){var n=this.data.australia.totalDistance_km,r=this.data.us.totalDistance_km,o=a==s.KM,c=o?this.data.australia.totalDistance_km:this.data.australia.totalDistance_miles,d=o?this.data.us.totalDistance_km:this.data.us.totalDistance_miles,h=o?this.totalDistance_km:this.totalDistance_miles,u="distance_".concat(a),b=this.getProgressPoint(this.map,this.brisbaneOfficeCords,this.denverOfficeCords,1e3*n),j=this.getProgressPoint(this.map,this.denverOfficeCords,this.brisbaneOfficeCords,1e3*r);this.australiaProgressLine||(this.australiaProgressLine=new f.a.polyline([this.brisbaneOfficeCords,[b.lat,f.a.Util.wrapNum(b.lng,[0,360],!0)]],{weight:5,color:"#6929c4"}).addTo(this.map)),null===(t=this.australiaProgressLine)||void 0===t||t.bindPopup("Australia Progress: ".concat(c.toFixed(2))),this.usProgressLine||(this.usProgressLine=new f.a.polyline([this.denverOfficeCords,[j.lat,f.a.Util.wrapNum(j.lng,[0,360],!0)]],{weight:5,color:"#1192e8"}).addTo(this.map)),null===(i=this.usProgressLine)||void 0===i||i.bindPopup("US Progress: ".concat(d.toFixed(2)));var O=function(a,t){return a.date>t.date?1:t.date>a.date?-1:0},m=this.data.us.raw.map((function(a){return{group:a.name,date:new Date(a.date),value:a[u]}})).sort(O),p=this.data.australia.raw.map((function(a){return{group:a.name,date:new Date(a.date),value:a[u]}})).sort(O);p.forEach((function(a){"ravi"===a.group&&console.log(a)}));var g=[].concat(Object(l.a)(p),Object(l.a)(m)).sort(O),v=function(a,t){return a[u]<t[u]?1:t[u]<a[u]?-1:0},D=[].concat(Object(l.a)(this.data.us.individual),Object(l.a)(this.data.australia.individual)).sort(v);this.setState({dataLoading:!1,overallData:D,tableData:D,usData:this.data.us.individual.sort(v),australiaData:this.data.australia.individual.sort(v),tableHeaders:this.getTableHeaders(a),donutChartData:[{group:"US",value:d},{group:"Australia",value:c},{group:"Remaining",value:h-(c+d)}],donutChartOptions:e.getDonutChartOptions(!1),areaUsData:m,areaAustraliaData:p,areaOverallData:g,areaChartData:g,areaChartOptions:e.getAreaChartOptions(!1),selectedContentIndex:0})}}},{key:"getTableHeaders",value:function(a){return[{key:"name",header:"Name"},{key:"date",header:"Latest Date"},{key:"distance_".concat(a),header:"Distance"},{key:"time",header:"Time (min)"}]}},{key:"render",value:function(){var a=this;return Object(K.jsxs)("div",{className:"main-content",children:[Object(K.jsxs)(v.a,{"aria-label":"Oniqua fit board",children:[Object(K.jsx)(D.a,{}),Object(K.jsx)(C.a,{href:"#",prefix:"Oniqua",children:"Fit-board"}),Object(K.jsx)(x.a,{children:Object(K.jsx)(k.a,{"aria-label":"",children:Object(K.jsxs)(w.a,{"aria-label":"Distance Unit",menuLinkName:"Distance Unit (".concat(this.state.distanceUnit,")"),children:[Object(K.jsx)(y.a,{href:"#",onClick:function(){return a.changeDistanceUnit(s.KM)},children:s.KM}),Object(K.jsx)(y.a,{href:"#",onClick:function(){return a.changeDistanceUnit(s.MILES)},children:s.MILES})]})})})]}),Object(K.jsxs)(L.a,{children:[Object(K.jsxs)("div",{className:"aggregates",children:[Object(K.jsx)("div",{children:Object(K.jsx)("h2",{children:"Australia to US Challenge"})}),Object(K.jsx)("div",{className:"chart",children:Object(K.jsx)(H.DonutChart,{data:this.state.donutChartData,options:this.state.donutChartOptions})}),Object(K.jsxs)(j.a,{zoomControl:!1,dragging:!1,worldCopyJump:!0,className:"map",center:this.midPoint,zoom:2.5,whenCreated:this.mapCreated,minZoom:2.5,maxZoom:2.5,children:[Object(K.jsx)(O.a,{noWrap:!1,attribution:"Map tiles by Carto, under CC BY 3.0. Data by OpenStreetMap, under ODbL.",url:"https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"}),Object(K.jsx)(m.a,{position:this.brisbaneOfficeCords,children:Object(K.jsx)(p.a,{children:"Brisbane Office"})}),Object(K.jsx)(m.a,{position:this.denverOfficeCords,children:Object(K.jsx)(p.a,{children:"Denver Office"})})]})]}),Object(K.jsxs)("div",{className:"stats",children:[Object(K.jsxs)(P.a,{selectedIndex:this.state.selectedContentIndex,className:"table-data-switcher",onChange:function(t){var e,s;switch(t.name){case"us":e=a.state.usData,s=a.state.areaUsData;break;case"australia":e=a.state.australiaData,s=a.state.areaAustraliaData;break;default:e=a.state.overallData,s=a.state.areaOverallData}a.setState({tableData:e,areaChartData:s})},children:[Object(K.jsx)(U.a,{name:"overall",text:"Overall"}),Object(K.jsx)(U.a,{name:"australia",text:"Australia"}),Object(K.jsx)(U.a,{name:"us",text:"US"})]}),Object(K.jsx)("div",{className:"area-chart-container",children:Object(K.jsx)(H.StackedAreaChart,{data:this.state.areaChartData,options:this.state.areaChartOptions})}),Object(K.jsx)("div",{className:"table-container",children:this.state.dataLoading?Object(K.jsx)(S.a,{showHeader:!1,showToolbar:!1,headers:this.state.tableHeaders}):Object(K.jsx)(T.a,{rows:this.state.tableData,headers:this.state.tableHeaders,isSortable:!0,stickyHeader:!0,children:function(a){var t=a.rows,e=a.headers,s=a.getHeaderProps,i=a.getRowProps,n=a.getTableProps;return Object(K.jsxs)(N.a,Object(c.a)(Object(c.a)({},n()),{},{children:[Object(K.jsx)(_.a,{children:Object(K.jsx)(A.a,{children:e.map((function(a){return Object(K.jsx)(M.a,Object(c.a)(Object(c.a)({},s({header:a})),{},{children:a.header}),a.key)}))})}),Object(K.jsx)(E.a,{children:t.map((function(a){return Object(K.jsx)(A.a,Object(c.a)(Object(c.a)({},i({row:a})),{},{children:a.cells.map((function(a){var t;switch(a.info.header){case"distance_km":case"distance_miles":case"time":t=a.value.toFixed(2);break;case"date":t=new Date(a.value).toLocaleDateString();break;default:t=a.value}return Object(K.jsx)(I.a,{children:t},a.id)}))}),a.id)}))})]}))}})})]})]})]})}}],[{key:"getDonutChartOptions",value:function(a){return{height:"400px",width:"100%",legend:{alignment:F.Alignments.CENTER},donut:{center:{label:"Total Distance"},alignment:F.Alignments.CENTER},data:{loading:a}}}},{key:"getAreaChartOptions",value:function(a){return{data:{loading:a},axes:{left:{stacked:!0,scaleType:F.ScaleTypes.LINEAR,mapsTo:"value"},bottom:{scaleType:F.ScaleTypes.TIME,mapsTo:"date"}},curve:"curveMonotoneX",height:"400px"}}}]),e}(n.a.Component),q=function(a){a&&a instanceof Function&&e.e(3).then(e.bind(null,149)).then((function(t){var e=t.getCLS,s=t.getFID,i=t.getFCP,n=t.getLCP,r=t.getTTFB;e(a),s(a),i(a),n(a),r(a)}))};o.a.render(Object(K.jsx)(n.a.StrictMode,{children:Object(K.jsx)(R,{})}),document.getElementById("root")),q()},89:function(a,t,e){},90:function(a,t,e){}},[[124,1,2]]]);
//# sourceMappingURL=main.e6156366.chunk.js.map