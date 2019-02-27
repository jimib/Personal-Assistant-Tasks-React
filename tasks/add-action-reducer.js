const fs = require('fs-extra-promise');
const _ = require('lodash');
const Promise = require('bluebird');

const ACTION = 'action';
const REDUCER = 'reducer';
const DIR_CLIENT = './client';

task( `Add Action/Reducer` )
.then( (assistant, options = {}) => {

	return assistant.ask([
		{
			name : 'name',
			message : `Name`,
			default : options.name
		},
		{
			type: 'multiselect',
			name: 'includes',
			message : 'Include...',
			options: {
				items: [
					{label : 'Action', value: ACTION, enabled: true},
					{label : 'Reducer', value: REDUCER, enabled: true}
				]
			}
		}
	])
	.then( ( options ) => {
		const {name,includes} = options;
		//do something about this
		return Promise.mapSeries( _.filter([
			() => assistant.template( `${DIR_CLIENT}/redux/index.js`, '../templates/Reducers.js', options ).catch( err => null ),
			_.includes( includes, ACTION ) ? () => assistant.template( `${DIR_CLIENT}/redux/${name}Actions.js`, '../templates/BasicActions.js', options ) : null,
			_.includes( includes, REDUCER ) ? () => assistant.template( `${DIR_CLIENT}/redux/${name}Reducer.js`, '../templates/BasicReducer.js', options ) : null,
			_.includes( includes, REDUCER ) ? () => assistant.editCodeBlock( `${DIR_CLIENT}/redux/${name}Reducer.js`, 'INIT_STATE', {language:'javascript'} ) : null
		]), handler => handler() )
		.then( () => {
			return {tasks:{type:'react',options:{name}}};
		});
	});
} );

