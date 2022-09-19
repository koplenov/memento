namespace $.$$ {
	const baseMementosDir: string = 'mementos'
	const contentMementoSpec: string = 'content.md'
	const metaMementoSpec: string = 'meta.memento'

	const MementoData = $mol_data_record( {
		collection: $mol_data_optional( $mol_data_string ),
		tags: $mol_data_optional( $mol_data_array( $mol_data_string ) ),
	} )

	export class $memento_content extends $.$memento_content {

		@$mol_mem
		mementos( val?: any ) {
			return val as $memento_page[] || []
		}

		@$mol_mem
		tags() {
			let tags = []
			let pages = this.mementos()
			for( const iterator of pages ) {
				const data = iterator.data()
				tags.push( ...data.tags )
			}
			return Array.from( [ ...new Set( tags ) ] )
		}

		@ $mol_mem
		menu_body() {
			return [
				this.Menu_links(),
			]
		}

		auto() {
			this.$.$mol_lights( true )
		}

		@$mol_mem
		tauri_funcs() {
			return $mol_wire_sync( { ...window.__TAURI__.fs } )
		}

		@$mol_mem
		tauri() {
			const tauri = this.tauri_funcs()
			tauri.createDir( baseMementosDir, { dir: this.tauri_funcs().BaseDirectory.App, recursive: true } )
			return tauri
		}

		@$mol_mem
		page_title( id: any ) {
			return id
		}

		@$mol_mem
		resets( reset?: null ) {
			return Math.random()
		}

		@$mol_mem
		loadInfo() {
			this.resets() // слушаем ресеты
			return this.tauri().readDir( baseMementosDir, { dir: this.tauri().BaseDirectory.App, recursive: true } )
		}

		addMemento( id: string ) {
			if( id.trim() === "" ) {
				alert( "Попытка добавить пустую ссылку!" )
				return
			}
			const path = baseMementosDir + '/' + id
			this.tauri().createDir( path, { dir: this.tauri().BaseDirectory.App, recursive: true } )
			this.tauri().writeTextFile( path + '/' + contentMementoSpec, 'write simple text here', { dir: this.tauri().BaseDirectory.App } )

			let data = MementoData( {
				collection: 'GG',
				tags: [ 'pp', 'gg' ]
			} )

			this.tauri().writeTextFile( path + '/' + metaMementoSpec, JSON.stringify( data ), { dir: this.tauri().BaseDirectory.App } )
			this.resets( null ) // форсируем ресет
		}

		@$mol_mem
		loadPages() {
			let pages = []
			for( const iterator of this.loadInfo() ) {
				const page = this.Page( iterator.name )
				page.data = () => this.getMementoData( iterator.name )
				pages.push( page )
			}
			return pages
		}

		@$mol_action
		log( message?: any, ...optionalParams: any[] ) {
			console.log( message, optionalParams )
		}

		@$mol_mem_key
		content( id: any, next?: any ) {
			const path = baseMementosDir + '/' + id
			this.tauri().writeTextFile( path + '/' + contentMementoSpec, next, { dir: this.tauri().BaseDirectory.App } )
			//return this.tauri().readTextFile( path + '/' + contentMementoSpec, { dir: this.tauri().BaseDirectory.App } )
			return this.$.$mol_state_local.value( id, next ) ?? ''
		}

		@$mol_mem
		getMementoData( id?: string ) {
			const path = baseMementosDir + '/' + id
			return MementoData(
				JSON.parse(
					this.tauri().readTextFile(
						path + '/' + metaMementoSpec,
						{ dir: this.tauri().BaseDirectory.App }
					)
				)
			)
		}

		addKeyFromSearch() {
			this.addMemento( this.search().query() )
		}

		@$mol_mem_key
		removeMementoButton( id: any, next?: any ) {
			this.tauri().removeDir( baseMementosDir + '/' + id, { dir: this.tauri().BaseDirectory.App, recursive: true } )
			this.resets( null ) // форсируем ресет
		}
	}
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

	interface MementoInfo {
		title: string
		content: string
	}
}
