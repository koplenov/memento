namespace $.$$ {
	const baseMementosDir: string = 'mementos'
	const contentMementoSpec: string = 'content.md'
	const metaMementoSpec: string = 'meta.memento'

	export class $memento_content extends $.$memento_content {

		@$mol_mem
		pages() {
			return [
				this.Menu(),
				...$mol_maybe( this.Spread() ),
			]
		}

		Spread() {
			return this.spreads()[ this.spread() ]
		}

		@$mol_mem
		spread( next?: string ) {
			return this.$.$mol_state_arg.value( this.param(), next ) ?? ''
		}

		@$mol_mem
		links() {
			return Object.keys( this.spreads() ).map( spread => this.Link( spread ) )
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

		// pages
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
			this.tauri().writeTextFile( path + '/' + metaMementoSpec, '', { dir: this.tauri().BaseDirectory.App } )
			this.resets( null ) // форсируем ресет
		}

		arrayRemove( arr: MementoInfo[], value: string ) {
			return arr.filter( function( ele: MementoInfo ) {
				return ele.title != value
			} )
		}

		loadPages() {
			let pages = []
			for( const iterator of this.loadInfo() ) {
				let page = iterator as MementoInfo
				pages.push( this.Page( page ) )
			}
			return pages
		}

		spreads() {
			let pages = this.loadPages()
			// simple search
			let search = this.search().query()
			return pages.filter( function( ele ) {
				return ele !== undefined && ele.title().includes( search )
			} )
		}

		@$mol_mem_key
		content( id: any, next?: any ) {
			const path = baseMementosDir + '/' + id
			this.tauri().writeTextFile( path + '/' + contentMementoSpec, next, { dir: this.tauri().BaseDirectory.App } )
			return this.tauri().readTextFile( path + '/' + contentMementoSpec, { dir: this.tauri().BaseDirectory.App } )
			// or fast cache return this.$.$mol_state_local.value( id, next ) ?? ''
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

	interface MementoInfo {
		title: string
		content: string
	}
}
