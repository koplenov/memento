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
				obj.event_click = () => this.selected_tag( tag )
				pages.push( obj )
			} )
			return pages
		}

		@$mol_mem
		id( id?: any ) {
			if( id !== undefined ) return id as never
			return ""
		}

		@$mol_mem_key
		collection_title( id: any, next?: any ) {
			const page = this.all_collections().filter( collection => collection.uid === id )[ 0 ]
			if( next === undefined )
				return page.name ?? 'Set name'
			else {
				this.note_update_collection( id + " | " + next )
				return next
			}
		}

		@$mol_mem
		collections() {
			return this.all_collections().map( collection => this.Collection( collection.uid ) )

			console.log( 'all collections', this.all_collections() )

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
		@$mol_action
		selected_tag( val?: any ) {
			return val
		}

		@$mol_mem_key
		remover_container( id: any ) {
			return this.can_edit_collections() ? this.deleteCollectionButton( id ) : null
		}

		@$mol_action
		delete_collection( id: any ) {
			console.log( 'delete_collection', id )
			const uid = id
			const path = this.$.$memento_config_collections_dir + '/' + uid
			$memento_lib_tauri.fs().removeDir( path, { dir: $memento_lib_tauri.base().BaseDirectory.App, recursive: true } )
			this.note_update_collection( null )
		}

		@$mol_action
		select_collection( collection: string ) {
			if( this.can_edit_collections() ) {
				return
			}
			return this.selected_tag( collection )
		}

		select_all_materials() {
			this.selected_tag( '' )
		}

		@$mol_action
		create_collection( val?: any ) {
			console.log( 'create_collection', val )

			const uid = $memento_utils.generateUUID()
			const path = this.$.$memento_config_collections_dir + '/' + uid
			$memento_lib_tauri.fs().createDir( path, { dir: $memento_lib_tauri.base().BaseDirectory.App, recursive: true } )


			let data = new CollectionDTO()
			data.name = 'GG'

			$memento_lib_tauri.fs().writeTextFile( path + '/' + $memento_config_metaMementoSpec, JSON.stringify( data ), { dir: $memento_lib_tauri.base().BaseDirectory.App } )
			this.note_update_collection( null )
		}

		/*
			Edit Collections
		*/
		@$mol_mem
		can_edit_collections( bool?: boolean ) {
			return bool ?? false
		}

		@$mol_action
		change_edit_collections_state() {
			this.can_edit_collections( !this.can_edit_collections() )
		}
	}
}
