import React, { Component } from 'react'
import '../Stylesheets/Landing.css'
import * as d3 from 'd3';
import { scaleQuantile } from 'd3-scale';
import statesData from '../data/us-states.csv';
import countiesData from '../data/us-counties.csv';
import { ComposableMap, Geographies, Geography } from "react-simple-maps";


export default class Landing extends Component {

    constructor() {
        super();
        this.state = {}
    }

    async componentDidMount() {
        await d3.csv(statesData).then((data) => {
            this.organizeStateData(data);
        })
        await d3.csv(countiesData).then((data) => {
            this.organizeCountiesData(data);
        })
    }

    organizeStateData = (data) => {
        let states = {};
        let cases = [];
        let deaths = [];
        for (let stateObj of data) {
            let stateName = stateObj['state'];
            if (!states[stateName]) {
                states[stateName] = [stateObj];
            } else {
                states[stateName].push(stateObj)
            }

            cases.push(stateObj.cases)
            deaths.push(stateObj.deaths);
        }

        const stateCasesColor = scaleQuantile()
            .domain(cases.map(d => d))
            .range([
                "#FFFFFF",
                "#f9e5e8",
                "#f5ccd9",
                "#f0b4d1",
                "#eb9dcf",
                "#e586d4",
                "#e171de",
                "#ca5cdc",
                "#ac48d7",
                "#8935d1",
                "#6222cd"
            ])

        const stateDeathColors = scaleQuantile()
            .domain(cases.map(d => d))
            .range([
                "#FFFFFF",
                "#f5e3e3",
                "#eccac9",
                "#e3b2b0",
                "#d99b99",
                "#d08783",
                "#c7736e",
                "#bd625b",
                "#b45249",
                "#ab4339",
                "#a13529"
            ])

        this.setState({ states, statecasesColor: stateCasesColor, statedeaths: stateDeathColors })
    }

    organizeCountiesData = (data) => {
        let county = {}
        let cases = [];
        let deaths = [];
        for (let countyObj of data) {
            let countyName = countyObj['county'];
            if (!county[countyName]) {
                county[countyName] = [countyObj];
            } else {
                county[countyName].push(countyObj);
            }
            cases.push(countyObj.cases);
            deaths.push(countyObj.deaths);
        }

        const stateCasesColor = scaleQuantile()
            .domain(cases.map(d => d))
            .range([
                "#FFFFFF",
                "#f9e5e8",
                "#f5ccd9",
                "#f0b4d1",
                "#eb9dcf",
                "#e586d4",
                "#e171de",
                "#ca5cdc",
                "#ac48d7",
                "#8935d1",
                "#6222cd"
            ])

        const stateDeathColors = scaleQuantile()
            .domain(cases.map(d => d))
            .range([
                "#FFFFFF",
                "#f5e3e3",
                "#eccac9",
                "#e3b2b0",
                "#d99b99",
                "#d08783",
                "#c7736e",
                "#bd625b",
                "#b45249",
                "#ab4339",
                "#a13529"
            ])

        this.setState({ county, countycases: stateCasesColor, countydeaths: stateDeathColors })
    }

    render() {
        const countyUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json";
        const stateUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

        const { states, county } = this.state;
        console.log('states:', states);
        console.log('county:', county);

        return (
            <div>
                {this.state.county ?
                <ComposableMap projection="geoAlbersUsa">
                    <Geographies geography={countyUrl}>
                        {({ geographies }) =>
                            geographies.map(geo => {

                                const county = this.state.county; 
                                const geoName = geo.properties.name;
                                let countyColor = null; 
                                if (county[geoName]) {
                                    countyColor = county[geoName][county[geoName].length - 1].cases;
                                }

                                return (
                                <Geography
                                    key={geo.rsmKey}
                                    geography={geo}
                                    stroke="white"
                                    strokeWidth="0.1"
                                    fill={countyColor ? this.state.countycases(countyColor) : "white"}
                                />
                                )})}
                    </Geographies>
                </ComposableMap> : null }
                <ComposableMap projection="geoAlbersUsa">
                    <Geographies geography={stateUrl}>
                        {({ geographies }) =>
                            geographies.map(geo => 
                                <Geography
                                    key={geo.rsmKey}
                                    geography={geo}
                                    fill="#808080"
                                    stroke="white"
                                    strokeWidth="0.1"
                                />
                            )}
                    </Geographies>
                </ComposableMap>
            </div>
        )
    }
}
