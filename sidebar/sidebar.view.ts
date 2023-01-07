namespace $.$$ {
	export class $memento_sidebar extends $.$memento_sidebar {

		@$mol_mem
		tags() {
			const pages: $mol_view[] = []
			const unique_tags = this.all_tags()
			unique_tags.map( tag => {
				const obj = new this.$.$mol_button_minor()
				obj.sub = () => [
					new this.$.$mol_icon_tag(),
					tag,
				] as readonly any[]
				obj.event_click = () => this.selected_tag( tag );
				pages.push( obj )
			} )
			return pages
		}

		collections() {
			return [
				this.memes(),
			]


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
		
		@$mol_mem
		@$mol_action
		selected_tag( val?: any ) {
			return val
		}
	}
}
