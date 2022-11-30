namespace $.$$ {
	export class $memento_sidebar extends $.$memento_sidebar {
		tags(){
			let pages: $mol_view[] = []
			let mementos = this.mementos() as $memento_page[]
			mementos.forEach( ( page, index ) => {
				const obj = new this.$.$mol_button_minor()
				obj.sub = () => [
					new this.$.$mol_icon_tag(),
					page.data().collection,
				] as readonly any[]
				obj.event_click = () => this.selected_tag(page.data().collection)
				pages.push( obj )
			} )

			return $memento_utils.unique(pages, "collection")
		}

		collections(){
			let pages: $mol_view[] = []
			let mementos = this.mementos() as $memento_page[]
			mementos.forEach( ( page, index ) => {
				const collection = this.Collection( index )
				collection.label = () => [ page.data().collection ]
				pages.push( collection )
			} )
			return pages



			return [
				this.memes(),
				this.dashboards1(),
				this.dashboards2(),
				this.dashboards3(),
			]	
		}

		@$mol_mem
		selected_collection( val?: any ) {
			return val
		}
		@$mol_mem
		selected_tag( val?: any ) {
			return val
		}
	}
}
