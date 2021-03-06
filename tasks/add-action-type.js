const fs = require('fs-extra-promise');
const _ = require('lodash');
const Promise = require('bluebird');

const DIR_CLIENT = './client';

task( `Add Action-Type` )
.then( (assistant, options = {}) => {
	return assistant.list(`${DIR_CLIENT}/redux/actions`,{extensions:['.js']})
	.then( results => {
		const regexpActionId = /([a-zA-Z0-9]+)Action[s]?.js+/;
		const items = _.filter( _.map( results, name => {
			if( regexpActionId.test( name ) ){
				const id = regexpActionId.exec( name )[1];
				return {label:name,value:{
					id,name
				}};
			}else{
				return null;
			}
		} ) );


		if( _.size( items ) == 0 ){
			return assistant.alert('No Actions/Reducers found...');
		}else{
			return assistant.ask([
				{
					name : 'action',
					type : 'choose',
					message : 'Add Action_Type for...',
					options : {
						items
					}
				}
			])
			.then( options => {
				return assistant.ask([
					{
						name : 'actionTypeName',
						message : `Action Type name...`,
						options : {
							value : `${options.action.id.toUpperCase()}_`,
						} 
					}
				])
				.then( ( result ) => _.merge( options, result ) );
			})
			.then( ( result ) => {
				const {action,actionTypeName} = result;
				const {id,name} = action;
				const NAME = `${actionTypeName}`.toUpperCase();
				const nameCamelCased = _.camelCase( NAME );
	
				const options = {id,name,NAME,nameCamelCased};

				return Promise.mapSeries([
					() => {
						return assistant.render( '../templates/BasicActionConst.js', options )
						.then( code => assistant.insertCodeBlock( `${DIR_CLIENT}/redux/actions/${id}Actions.js`, 'CONST_ACTION_TYPE', code ) )
					},
					() => {
						return assistant.render( '../templates/BasicActionFunc.js', options )
						.then( code => assistant.insertCodeBlock( `${DIR_CLIENT}/redux/actions/${id}Actions.js`, 'ACTION', code ) )
					},
					() => assistant.insertCodeBlock( `${DIR_CLIENT}/redux/reducers/${id}Reducer.js`, 'IMPORT_ACTION_TYPE', `\t${NAME},` ),
					() => {
						return assistant.render( '../templates/BasicReducerFunc.js', options )
						.then( code => assistant.insertCodeBlock( `${DIR_CLIENT}/redux/reducers/${id}Reducer.js`, 'REDUCER', code ) )
					}
				], handler => handler() );
				// inject the variable
				//_.includes( includes, ACTION ) ? () => assistant.template( `${DIR_CLIENT}/actions/${name}Actions.js`, '../templates/BasicActions.js', options ) : null,
				
			});
		}
		
	} )
} );

