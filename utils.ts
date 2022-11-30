namespace $.$$ {
	export class $memento_utils {
		@$mol_action
		static generateUUID() { // Public Domain/MIT
			var d = new Date().getTime()//Timestamp
			var d2 = ( ( typeof performance !== 'undefined' ) && performance.now && ( performance.now() * 1000 ) ) || 0//Time in microseconds since page-load or 0 if unsupported
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace( /[xy]/g, function( c ) {
				var r = Math.random() * 16//random number between 0 and 16
				if( d > 0 ) {//Use timestamp until depleted
					r = ( d + r ) % 16 | 0
					d = Math.floor( d / 16 )
				} else {//Use microseconds since page-load if supported
					r = ( d2 + r ) % 16 | 0
					d2 = Math.floor( d2 / 16 )
				}
				return ( c === 'x' ? r : ( r & 0x3 | 0x8 ) ).toString( 16 )
			} )
		}

		@$mol_action
		static description( text: string ) {
			return text.split( /\r?\n/ )[ 0 ]
		}

		@$mol_action
		static title_from_post( data: any ) {
			let title

			const group = data.groups[ 0 ]
			if( group ) {
				title = group.name
			}

			const profile = data.profiles[ 0 ]
			if( profile ) {
				title = `${ profile.first_name } ${ profile.last_name }`
			}

			return title
		}

		static unique(array : any, propertyName: string) {
			return array.filter((e, i) => array.findIndex(a => a[propertyName] === e[propertyName]) === i);
		}
	}
}
