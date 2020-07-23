#!/usr/bin/env node
const inquirer = require('inquirer');
const boxen = require('boxen');

const axios = require('axios');

// const IP_URI = 'https://ifconfig.me';
const GL_API = 'http://ip-api.com/json/';
const W_API = 'http://api.weatherapi.com/v1/current.json?key=&q='

// const ifConfigCommand = 'curl ifconfig.me'

// const getIP = async() => {
// const execSync = require('child_process').execSync;
// // import { execSync } from 'child_process';  // replace ^ if using ES modules
// const output = await execSync(ifConfigCommand, { encoding: 'utf-8' });  // the default is 'buffer'
// console.log('Output was:\n', output);
// }

// const getIP = async () => {
// 	const response = await axios.get(IP_URI);
// 	return response.data;
// }

const getGeoLocation = async () => {
	const response = await axios.get(GL_API);
	return response.data;
}

//getGeoLocation();
const getWeather = async() => {
	const {lat , lon} = await getGeoLocation();
	const WeatherURI = W_API + lat + ',' + lon;
	const response = await axios.get(WeatherURI);
	// const {temp_c,condition:{text}} = response.data.current;
	return response.data.current;
}

inquirer
	.prompt([
		{
			type: 'list',
			message: 'Select an option ☀️',
			name: 'source',
			choices: [
				'Temperature in Celsius',
				'Temperature in Farenheit',
				'Wind data',
				'Precipitation',
				'UV Index'
			],
		},
	])
	.then(async (answers) => {
		console.log('\n');
		const weather =await getWeather();
		switch(answers.source) {
			case 'Temperature in Celsius':
				console.log(boxen(`Weather : ${weather.temp_c} \u02DAC ${weather.condition.text}\n Feels like: ${weather.feelslike_c} \u02DAC`,{padding:1} ))
			break;
			case 'Temperature in Farenheit':
				console.log(boxen(`Weather : ${weather.temp_f} \u02DAF ${weather.condition.text}\n Feels like: ${weather.feelslike_f} \u02DAF`,{padding:1} ))
			break;
			case 'Wind data':
			console.log(boxen(`Wind Speed: ${weather.wind_mph}mph\nWind Degree: ${weather.wind_degree}\nWind Direction: ${weather.wind_dir}`,{padding:1}))
			break;
			case 'Precipitation':
			console.log(boxen(`Precipitation (mm): ${weather.precip_mm}\nHumidity: ${weather.humidity}`,{padding:1}))
			break;
			case 'UV Index':
			console.log(boxen(`UV: ${weather.uv}\nCloud: ${weather.cloud}`,{padding:1}))
			break;
			default:
			console.error('Invalid Option!')
			break;
		}
	})
	.catch(err => {
		console.error(err);
	});
