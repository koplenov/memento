namespace $.$$ {
	export class $memento_sidebar extends $.$memento_sidebar {
		rows() {
			let pages: $mol_view[] = []
			let mementos = this.mementos() as $memento_page[]
			mementos.forEach( ( page, index ) => {
				const collection = this.Collection( index )
				collection.label = () => [ page.data().collection ]
				pages.push( collection )
			} )
			return pages
		}

		@$mol_mem
		selected_collection( val?: any ) {
			return val
		}
	}
}
