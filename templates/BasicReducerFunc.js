	[{{NAME}}] : (state, action) => {
		//modify your state
		
		/*
		//HELPER FUNCTIONS TO ACCELLERATE THE MODIFICATION OF STATE
		//pass the property used to uniquely identify the item in the array
		
		state.items = AddItem( state.items, action.item, 'uuid' );
		state.items = RemoveItem( state.items, action.item, 'uuid' );
		state.items = UpdateItem( state.items, action.item, 'uuid' );
		*/

		//return state for changes to be applied to the immutable state
		return state; 
	},