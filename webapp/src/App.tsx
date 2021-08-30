import React from 'react';
import './App.scss';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import L, { LatLng, LatLngLiteral, Map as LeafletMap, Polyline } from "leaflet";
import {
    Content,
    ContentSwitcher,
    DataTable,
    DataTableSkeleton,
    Header,
    HeaderGlobalBar,
    HeaderMenu,
    HeaderMenuItem,
    HeaderName,
    HeaderNavigation,
    SkipToContent,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "carbon-components-react";
import { DonutChart, TreemapChart } from "@carbon/charts-react";
import { Alignments, AreaChartOptions, DonutChartOptions, ScaleTypes } from '@carbon/charts/interfaces';

type AppStateProps = {
    overallData: any,
    usData: any,
    australiaData: any,
    tableData: any,
    donutChartOptions: DonutChartOptions;
    donutChartData: any,
    dataLoading: boolean,
    distanceUnit: DistanceUnit,
    tableHeaders: any[],
    treeMapData: any,
    areaChartData: any,
    areaUsData: any,
    areaAustraliaData: any,
    areaOverallData: any,
    selectedContentIndex: number,
    selectedCatIndex: number,
    areaChartOptions: any
}

enum DistanceUnit {
    KM = "km",
    MILES = "miles"
}

class App extends React.Component<any, AppStateProps> {
    private brisbaneOfficeCords: LatLng = new LatLng(-27.466898152285882, 153.029165642155334);
    private denverOfficeCords: LatLng = new LatLng(39.627924473980165, L.Util.wrapNum(-104.89594227315469, [0,360], true));
    private midPoint: LatLngLiteral = {lat: 5.405980169474166, lng: L.Util.wrapNum(-156.74269746105844, [0,360], true)};
    private australiaProgressLine?: Polyline;
    private usProgressLine?: Polyline;
    private data:any = undefined;
    private map?: LeafletMap;
    private totalDistance_km = this.brisbaneOfficeCords.distanceTo(this.denverOfficeCords) / 1000;
    private totalDistance_miles = this.totalDistance_km * 0.621371;

    constructor(props: Readonly<AppStateProps> | AppStateProps) {
        super(props);
        this.state = {
            dataLoading: true,
            overallData: [],
            usData: [],
            australiaData: [],
            tableData: [],
            areaOverallData: [],
            areaUsData: [],
            areaAustraliaData: [],
            areaChartData: [],
            donutChartOptions: App.getDonutChartOptions(true),
            areaChartOptions: App.getAreaChartOptions(true),
            treeMapData: [],
            donutChartData: [],
            distanceUnit: DistanceUnit.KM,
            tableHeaders: this.getTableHeaders(DistanceUnit.KM),
            selectedContentIndex: 0,
            selectedCatIndex: 0,
        };
    }

    getProgressPoint(map: LeafletMap, pointA: LatLngLiteral, pointB: LatLngLiteral, progress: number) {
        // @ts-ignore
        const angleDeg = L.GeometryUtil.angle(map, pointA, pointB);
        // @ts-ignore
        const latlng = L.GeometryUtil.destination(pointA, angleDeg, progress);
        // @ts-ignore
        return L.GeometryUtil.closestOnSegment(map, [latlng.lat, L.Util.wrapNum(latlng.lng, [0, 360], true)], pointA, pointB);
    }

    changeDistanceUnit(unit: DistanceUnit) {
        this.setState({distanceUnit: unit, dataLoading: true, donutChartOptions: App.getDonutChartOptions(true)});
        this.updateStats(unit);
    }

    mapCreated = (map: LeafletMap) => {
        // @ts-ignore
        new L.polyline([this.brisbaneOfficeCords, this.denverOfficeCords], {
            weight: 8,
            opacity: 0.3,
            color: '#ee5396',
        }).addTo(map);

        this.map = map;

        fetch("/api/dashboard")
            .then(response => {
                response.json()
                    .then(progress => {
                        this.data = progress;
                        this.updateStats(this.state.distanceUnit);
                    });
            })
    }

    private updateStats(distanceUnit: DistanceUnit) {

        if (!this.data || !this.map) {
            return;
        }

        const ausTotalDistance_km = this.data.australia.totalDistance_km;
        const usTotalDistance_km = this.data.us.totalDistance_km;

        const isUnitKM = distanceUnit == DistanceUnit.KM;
        const ausTotalDistance = isUnitKM ? this.data.australia.totalDistance_km : this.data.australia.totalDistance_miles;
        const usTotalDistance = isUnitKM ? this.data.us.totalDistance_km : this.data.us.totalDistance_miles;
        const totalDistance = isUnitKM ? this.totalDistance_km : this.totalDistance_miles;

        const distanceColumn = `distance_${distanceUnit}`;

        const brisProgressPoint: LatLng = this.getProgressPoint(this.map, this.brisbaneOfficeCords, this.denverOfficeCords, ausTotalDistance_km * 1000);
        const denProgressPoint = this.getProgressPoint(this.map, this.denverOfficeCords, this.brisbaneOfficeCords, usTotalDistance_km * 1000);

        if (!this.australiaProgressLine) {
            // @ts-ignore
            this.australiaProgressLine = new L.polyline([this.brisbaneOfficeCords, [brisProgressPoint.lat, L.Util.wrapNum(brisProgressPoint.lng, [0, 360], true)]], {
                weight: 5,
                color: '#6929c4',
            }).addTo(this.map);
        }

        this.australiaProgressLine?.bindPopup(`Australia Progress: ${(ausTotalDistance).toFixed(2)}`);

        if (!this.usProgressLine) {
            // @ts-ignore
            this.usProgressLine = new L.polyline([this.denverOfficeCords, [denProgressPoint.lat, L.Util.wrapNum(denProgressPoint.lng, [0, 360], true)]], {
                weight: 5,
                color: '#1192e8',
            }).addTo(this.map);
        }
        this.usProgressLine?.bindPopup(`US Progress: ${(usTotalDistance).toFixed(2)}`);
        const dateCompareFn = (a:any, b:any) => (a.date > b.date) ? 1 : ((b.date > a.date) ? -1 : 0);

        const areaUsData = this.data.us.raw.map((row: any) => ({
            group: row.name,
            date: new Date(row.date),
            value: row[distanceColumn]
        })).sort(dateCompareFn);

        const areaAustraliaData = this.data.australia.raw.map((row: any) => {
            return {
                group: row.name,
                name: row.name,
                showLabel: true,
                date: new Date(row.date),
                value: row[distanceColumn]
            };
        }).sort(dateCompareFn);

        const areaOverallData = [...areaAustraliaData, ...areaUsData].sort(dateCompareFn);

        const distanceCompareFn = (a:any, b:any) => (a[distanceColumn] < b[distanceColumn]) ? 1 : ((b[distanceColumn] < a[distanceColumn]) ? -1 : 0);

        let overallData = [...this.data.us.individual, ...this.data.australia.individual].sort(distanceCompareFn);

        const treeMapData = this.getTreemapData("distance");

        this.setState({
            dataLoading: false,
            overallData: overallData,
            tableData: overallData,
            usData: this.data.us.individual.sort(distanceCompareFn),
            australiaData: this.data.australia.individual.sort(distanceCompareFn),
            tableHeaders: this.getTableHeaders(distanceUnit),
            donutChartData: [
                {group: 'US', value: usTotalDistance},
                {group: 'Australia', value: ausTotalDistance},
                {group: 'Remaining', value: totalDistance - (ausTotalDistance + usTotalDistance)}
            ],
            donutChartOptions: App.getDonutChartOptions(false),
            areaUsData,
            areaAustraliaData,
            areaOverallData,
            areaChartData: areaOverallData,
            treeMapData,
            areaChartOptions: App.getAreaChartOptions(false),
            selectedContentIndex: 0,
            selectedCatIndex: 0
        });
    }

    private static getDonutChartOptions(loading: boolean): DonutChartOptions {

        return {
            height: "400px",
            width: "100%",
            legend: {
                alignment: Alignments.CENTER
            },
            donut: {
                center: {
                    label: `Total Distance`
                },
                alignment: Alignments.CENTER
            },
            data: {
                loading: loading
            }
        };
    }

    private static getAreaChartOptions(loading: boolean): AreaChartOptions {
        return {
            data: {
                loading: loading
            },
            axes: {
                left: {
                    stacked: true,
                    scaleType: ScaleTypes.LINEAR,
                    mapsTo: "value"
                },
                bottom: {
                    scaleType: ScaleTypes.TIME,
                    mapsTo: "date"
                }
            },
            curve: "curveMonotoneX",
            height: "400px"
        };
    }

    getTableHeaders(unit: DistanceUnit) {
        return [
            {
                key: 'name',
                header: 'Name',
            },
            {
                key: 'date',
                header: 'Latest Date'
            },
            {
                key: 'activities',
                header: '# Activities',
                align: "end",
            },
            {
                key: `distance_${unit}`,
                align: "end",
                header: 'Distance',
            },
            {
                key: 'time',
                align: "end",
                header: 'Time (min)',
            },
        ]
    }

    render() {
        // @ts-ignore
        // @ts-ignore
        return (

            <div className={"main-content"}>
                <Header aria-label="Oniqua fit board">
                    <SkipToContent/>
                    <HeaderName href="#" prefix="Oniqua">
                        Fit-board
                    </HeaderName>
                    <HeaderGlobalBar>
                        <HeaderNavigation aria-label="">
                            <HeaderMenu aria-label="Distance Unit" menuLinkName={`Distance Unit (${this.state.distanceUnit})` }>
                                <HeaderMenuItem href="#" onClick={() => this.changeDistanceUnit(DistanceUnit.KM)}>{DistanceUnit.KM}</HeaderMenuItem>
                                <HeaderMenuItem href="#" onClick={() => this.changeDistanceUnit(DistanceUnit.MILES)}>{DistanceUnit.MILES}</HeaderMenuItem>
                            </HeaderMenu>
                        </HeaderNavigation>
                    </HeaderGlobalBar>
                </Header>
                <Content>
                    <div className={"aggregates"}>
                        <div>
                            <h2>Australia to US Challenge</h2>
                        </div>
                        <div className={"chart"}>
                            <DonutChart data={this.state.donutChartData} options={this.state.donutChartOptions}/>
                        </div>
                        <MapContainer zoomControl={false} dragging={false} worldCopyJump={true} className={"map"} center={this.midPoint} zoom={2.5} whenCreated={this.mapCreated} minZoom={2.5} maxZoom={2.5}>
                            <TileLayer
                                noWrap={false}
                                attribution='Map tiles by Carto, under CC BY 3.0. Data by OpenStreetMap, under ODbL.'
                                url="https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
                            />
                            <Marker position={this.brisbaneOfficeCords}>
                                <Popup>
                                    Brisbane Office
                                </Popup>
                            </Marker>
                            <Marker position={this.denverOfficeCords}>
                                <Popup>
                                    Denver Office
                                </Popup>
                            </Marker>
                        </MapContainer>
                    </div>
                    <div className={"stats"}>
                        <ContentSwitcher selectedIndex={this.state.selectedCatIndex} className={"data-switcher treemap-data-switcher"} onChange={(data) => {

                            this.setState({treeMapData: this.getTreemapData(data.name?.toString())});

                        }}>
                            <Switch name="distance" text="Distance"/>
                            <Switch name="time" text="Time"/>
                            <Switch name="activities" text="Activities"/>
                        </ContentSwitcher>
                        <div className={"area-chart-container"}>
                            <TreemapChart data={this.state.treeMapData} options={this.state.areaChartOptions}/>
                        </div>
                        <ContentSwitcher selectedIndex={this.state.selectedContentIndex} className={"data-switcher table-data-switcher"} onChange={(data) => {
                            let tableData: any;
                            let areaData: any;
                            switch (data.name) {
                                case "us":
                                    tableData = this.state.usData;
                                    areaData = this.state.areaUsData;
                                    break;
                                case "australia":
                                    tableData = this.state.australiaData;
                                    areaData = this.state.areaAustraliaData;
                                    break;
                                default:
                                    tableData = this.state.overallData;
                                    areaData = this.state.areaOverallData
                                    break;
                            }

                            this.setState({tableData, areaChartData: areaData});

                        }}>
                            <Switch name="overall" text="Overall"/>
                            <Switch name="australia" text="Australia"/>
                            <Switch name="us" text="US"/>
                        </ContentSwitcher>
                        <div className={"table-container"}>
                            {
                                this.state.dataLoading ? <DataTableSkeleton showHeader={false} showToolbar={false} headers={this.state.tableHeaders} /> :
                                    <DataTable rows={this.state.tableData} headers={this.state.tableHeaders} isSortable stickyHeader>
                                        {({
                                              //@ts-ignore
                                              rows, headers, getHeaderProps, getRowProps, getTableProps
                                          }) => (
                                            <Table {...getTableProps()}>
                                                <TableHead>
                                                    <TableRow>
                                                        {headers.map((header: any) => (
                                                            <TableHeader className={App.getClassName(header.key)} key={header.key} {...getHeaderProps({header})}>
                                                                {header.header}
                                                            </TableHeader>
                                                        ))}
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {rows.map((row: any) => (
                                                        <TableRow key={row.id} {...getRowProps({row})}>
                                                            {row.cells.map((cell: any) => {
                                                                let cellValue;
                                                                let className= App.getClassName(cell.info.header);
                                                                switch (cell.info.header) {
                                                                    case 'distance_km':
                                                                    case 'distance_miles':
                                                                    case 'time':
                                                                        cellValue =  cell.value.toFixed(2);
                                                                        break;
                                                                    case 'date':
                                                                        const date = new Date(cell.value);
                                                                        cellValue = date.toLocaleDateString();
                                                                        break;
                                                                    default:
                                                                        cellValue = cell.value;
                                                                }

                                                                return <TableCell className={className} key={cell.id}>{cellValue}</TableCell>
                                                            })}
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        )}
                                    </DataTable>
                            }
                        </div>


                    </div>

                </Content>
            </div>
        );
    }

    private static getClassName(header: string) {
        switch (header) {
            case 'distance_km':
            case 'distance_miles':
            case 'time':
            case 'activities':
            case 'date':
            return "number-cell";
            default:
                return "";
        }
    }

    private getTreemapData(type?: string) {
        if (!type) {
            return [];
        }
        let prop: string = type === "distance" ?  `distance_${this.state.distanceUnit}` : type;

        return [
            {
                name: "Australia",
                children: this.data.australia.individual.map((row: any) => {
                    return {name: row.name, value: row[prop], showLabel: true}
                })
            },
            {
                name: "US",
                children: this.data.us.individual.map((row: any) => {
                    return {name: row.name, value: row[prop], showLabel: true}
                })
            },
        ]
    }
}

export default App;
