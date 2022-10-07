namespace $.$$ {
	const baseMementosDir: string = 'mementos'
	const contentMementoSpec: string = 'content.md'
	const metaMementoSpec: string = 'meta.memento'

	const MementoDTO = $mol_data_record( {
		title: $mol_data_string,
		md_content_path: $mol_data_string,
		collection: $mol_data_optional( $mol_data_string ),
		tags: $mol_data_optional( $mol_data_array( $mol_data_string ) ),
	} )

	export class Utils {
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
	}

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

		@$mol_mem
		menu_body() {
			return [
				this.Menu_links(),
			]
		}

		auto() {
			this.$.$mol_lights( true )
		}

		@$mol_action
		tauri_funcs() {
			return $mol_wire_sync( { ...window.__TAURI__.fs } )
		}

		@$mol_mem
		tauri() {
			const tauri = this.tauri_funcs()
			tauri.createDir( baseMementosDir, { dir: this.tauri_funcs().BaseDirectory.App, recursive: true } )
			return tauri
		}

		// @$mol_mem_key
		page_title( id: $memento_page, title?: any ) {
			const path = baseMementosDir + '/' + id
			const mementoDto = this.getMementoData( id )
			const data = this.$.$mol_state_local.value( id + 'page_title', title ) ?? mementoDto.title
			if( title !== undefined ) {
				mementoDto.title = title
				this.tauri().writeTextFile( path + '/' + metaMementoSpec, JSON.stringify( mementoDto ), { dir: this.tauri().BaseDirectory.App } )
				return data
			}
			return data
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
			const path = baseMementosDir + '/' + Utils.generateUUID()
			this.tauri().createDir( path, { dir: this.tauri().BaseDirectory.App, recursive: true } )

			let data = MementoDTO( {
				title: 'blank title',
				md_content_path: contentMementoSpec,
				collection: 'GG',
				tags: [ 'pp', 'gg' ]
			} )

			this.tauri().writeTextFile( path + '/' + data.md_content_path, id, { dir: this.tauri().BaseDirectory.App } )

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
			const data = this.$.$mol_state_local.value( id, next ) ?? this.tauri().readTextFile(
				path + '/' + this.getMementoData( id ).md_content_path,
				{ dir: this.tauri().BaseDirectory.App }
			)
			this.tauri().writeTextFile( path + '/' + this.getMementoData( id ).md_content_path, data, { dir: this.tauri().BaseDirectory.App } )
			return data
		}

		@$mol_action
		getMementoData( id?: string ) {
			const path = baseMementosDir + '/' + id
			return MementoDTO(
				JSON.parse(
					this.tauri().readTextFile(
						path + '/' + metaMementoSpec,
						{ dir: this.tauri().BaseDirectory.App }
					)
				) as $mol_type_writable<typeof MementoDTO.Value>
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
}
