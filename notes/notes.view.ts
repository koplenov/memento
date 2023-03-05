namespace $.$$ {
	export class $memento_notes extends $.$memento_notes {

		menu_link_content( id: any ) {
			let extistImages = false
			let extistDescription = false

			const pageData = this.loadPages()[ id ].data()
			const attachments = pageData.attachments
			const text = pageData.description

			if( attachments && attachments.images && Object.keys( attachments.images ).length > 0 ) extistImages = true
			if( text && text.trim() !== "" ) extistDescription = true

			if( !extistDescription && extistImages ) return [ this.memento_note_images( id ) ]
			if( extistDescription && !extistImages ) return [ this.memento_note_text( id ) ]
			if( extistDescription && extistImages ) return [ this.memento_note_card( id ) ]

			return [ "not implement" ]
		}

		@$mol_mem
		menu_body() {
			return [
				this.Menu_links(),
			]
		}

		clear_term() {
			this.selected_tag( '' )
			this.Menu_filter().query( '' )
		}

		@$mol_mem
		menu_links() {
			if( this.selected_tag() !== '' )
				this.Menu_filter().query( this.selected_tag() )

			const term = this.menu_filter()
			const keys = Object.keys( this.loadAllPages() )
			if( term.length > 0 ) {
				const values = Object.values( this.loadAllPages() )

				this.resets_tags()
				const tags = keys
					.filter( note => values[ note ].data().tags && values[ note ].data().tags.length > 0 ? values[ note ].data().tags.some( tag => tag.includes( term ) ) : false )
				const collections = keys
					.filter( note => values[ note ].data().collection && values[ note ].data().collection.length > 0 ? values[ note ].data().collection.includes( term ) : false )
				const names = keys
					.filter( $mol_match_text( term, spread => [ this.spread_title( spread ) ] ) )
				return [ ...tags, ...collections, ...names ].map( spread => this.Menu_link( spread ) )
			}
			else {
				return keys.map( spread => this.Menu_link( spread ) )
			}
		}

		auto() {
			this.$.$mol_lights( true )
		}

		// @$mol_mem_key
		page_title( id: string, title?: any ) {
			const path = this.$.$memento_config_baseMementosDir + '/' + id
			const mementoDto = this.getMementoData( id )
			const data = this.$.$mol_state_local.value( id + 'page_title', title ) ?? mementoDto.title
			if( title !== undefined ) {
				mementoDto.title = title
				$memento_lib_tauri.fs().writeTextFile( path + '/' + $memento_config_metaMementoSpec, JSON.stringify( mementoDto ), { dir: $memento_lib_tauri.base().BaseDirectory.App } )
				return data
			}
			return data
		}

		@$mol_mem
		sharedDto( mementoDto?: MementoDTO ) {
			if( mementoDto !== undefined ) {
				const path = this.$.$memento_config_baseMementosDir + '/' + mementoDto.id
				$memento_lib_tauri.fs().writeTextFile( path + '/' + $memento_config_metaMementoSpec, JSON.stringify( mementoDto ), { dir: $memento_lib_tauri.base().BaseDirectory.App } )
				return mementoDto
			}
			return []
		}

		@$mol_mem_key
		page_url( id: string ) {
			const mementoDto = this.getMementoData( id )
			return mementoDto.nav?.replaceAll( '"', '' )
		}

		@$mol_mem_key
		item_title( id: number ) {
			return this.page_title( this.loadPages()[ id ].data().id )
			//return this.loadPages()[id].data().title
		}
		@$mol_mem_key
		item_description( id: number ) {
			return this.loadPages()[ id ].data().description
		}
		@$mol_mem_key
		item_images( id: number ) {
			return this.page_images( this.loadPages()[ id ].data().id )

			const attachments = this.loadPages()[ id ].data().attachments
			if( attachments && attachments.images ) return attachments.images
			else return []
		}
		@$mol_mem_key
		timestamp( id: number ) {
			return new $mol_time_moment( this.loadPages()[ id ].data().date_posted * 1000 ).toString( 'DD Mon YYYY в hh:mm' )//new $mol_date()?.toString( 'DD Month YYYY' )
		}

		Spread() {
			return this.spreads()[ this.spread() ] || this.WelcomeSpread()
		}

		@$mol_mem_key
		image_uri( id: any, imageUrl?: any ) {
			return imageUrl ?? 'default'
		}

		page_images( id?: any ) {
			const attachments = this.getMementoData( id ).attachments
			if( attachments && attachments.images ) {
				let images = []
				for( const image of attachments.images ) {
					const cachedImage = this.cacheFile( id, image )
					this.image_uri( image, cachedImage )
					images.push( this.Image( image ) )
				}
				this.log( images )
				return images
			}
			return []
		}

		cacheFile( id: any, imgUrl: string ) {
			const extension = 'png'
			const fileName = `${ $mol_hash_string( imgUrl ) }.${ extension }`
			let fullpath = $memento_lib_tauri.path().join( this.$.$memento_config_baseMementosDir, id, fileName )
			let fullConvertPath = $memento_lib_tauri.path().join( $memento_lib_tauri.path().appDir(), fullpath )

			if( $memento_lib_tauri.fs().exists( fullpath, { dir: $memento_lib_tauri.base().BaseDirectory.App } ) ) {
				this.log( 'Load cached file', fullpath )
			}
			else {
				this.log( 'Download file', imgUrl )
				const arrayBuffer = $mol_fetch.buffer( imgUrl )
				this.saveImage( arrayBuffer, fullpath )
			}
			return $memento_lib_tauri.tauri().convertFileSrc( fullConvertPath )
		}

		saveImage( blob: any, fullpath: string ) {
			$memento_lib_tauri.fs().writeBinaryFile(
				{
					contents: blob,
					path: fullpath,
				},
				{
					dir: $memento_lib_tauri.base().BaseDirectory.App,
				}
			)
		};

		@$mol_mem
		resets( reset?: null ) {
			return Math.random()
		}

		@$mol_mem
		resets_tags( reset?: null ) {
			return Math.random()
		}

		@$mol_mem
		loadInfo() {
			this.resets() // слушаем ресеты
			return $memento_lib_tauri.fs().readDir( this.$.$memento_config_baseMementosDir, { dir: $memento_lib_tauri.base().BaseDirectory.App, recursive: true } )
		}

		@$mol_mem
		vk() {
			return new $memento_lib_vk( $memento_config_vktoken2.get_token() )
		}

		@$mol_action
		alert( message: string ) {
			alert( message )
		}

		@$mol_action
		addMemento( id: string ) {
			if( id.trim() === "" ) {
				this.alert( "Попытка добавить пустую ссылку!" )
				return
			}

			if( !id.includes( 'vk.com' ) ) {
				this.alert( "Это не материал вк!" )
				return
			}

			let extractedData: any = id
			let extracted: boolean = false

			// link detect
			if( id.includes( 'vk.com' ) ) {
				const url = id.split( '?hash' )[ 0 ]
				if( url.includes( 'wall' ) ) {
					const wall = url.split( 'wall' ).at( -1 ) ?? null
					if( wall ) {
						extracted = true
						extractedData = this.vk().wall( wall )
					}
				}
			}

			const uid = $memento_utils.generateUUID()
			const path = this.$.$memento_config_baseMementosDir + '/' + uid
			$memento_lib_tauri.fs().createDir( path, { dir: $memento_lib_tauri.base().BaseDirectory.App, recursive: true } )

			let data = new MementoDTO()
			data.id = uid
			data.date_added = new $mol_time_moment().valueOf()
			data.title = 'blank title'
			data.md_content_path = $memento_config_contentMementoSpec
			data.nav = JSON.stringify( id )
			//// 	data.collection = 'GG'
			//// data.tags = [ 'pp', 'gg' ]

			let content

			// this.log( extractedData )
			if( extracted ) {
				const post = extractedData.items[ 0 ] as any
				this.log( "page", post.date )
				data.date_posted = post.date
				data.title = $memento_utils.title_from_post( extractedData )
				data.description = $memento_utils.description( post.text )
				content = post.text
				if( post.attachments ) {
					const attachments = new Attachments()
					for( const attachment of post.attachments ) {
						if( attachment.type === "photo" ) {
							attachments.images.push( attachment.photo.sizes.at( -1 ).url )
						}
					}
					data.attachments = attachments
				}
				extractedData = JSON.stringify( extractedData )
			}
			$memento_lib_tauri.fs().writeTextFile( path + '/' + data.md_content_path, content, { dir: $memento_lib_tauri.base().BaseDirectory.App } )

			$memento_lib_tauri.fs().writeTextFile( path + '/' + $memento_config_metaMementoSpec, JSON.stringify( data ), { dir: $memento_lib_tauri.base().BaseDirectory.App } )
			this.resets( null ) // форсируем ресет
		}

		@$mol_mem
		loadPages() {
			let pages = []
			for( const page of this.loadAllPages() ) {
				pages.push( page )
			}
			return pages
		}

		@$mol_mem
		loadAllPages() {
			let pages = []
			for( const iterator of this.loadInfo() ) {
				const page = this.Page( iterator.name )
				page.data = () => this.getMementoData( iterator.name )
				pages.push( page )
			}

			// sort by added date
			pages.sort(function (a,b){return (b.data() as MementoDTO).date_added - (a.data() as MementoDTO).date_added})

			return pages
		}

		@$mol_action
		log( message?: any, ...optionalParams: any[] ) {
			console.log( message, optionalParams )
		}

		@$mol_mem_key
		content( id: any, next?: any ) {
			const path = this.$.$memento_config_baseMementosDir + '/' + id
			if( next !== undefined ) {
				return this.$.$mol_state_local.value( id, next )
			}

			const memento_data = this.getMementoData( id )
			return $memento_lib_tauri.base().readTextFile(
				path + '/' + memento_data.md_content_path,
				{ dir: $memento_lib_tauri.base().BaseDirectory.App }
			)
		}

		@$mol_mem_key
		content_flush( id: string ) {
			this.$.$mol_wait_timeout( 400 )
			const memento_data = this.getMementoData( id )
			const path = this.$.$memento_config_baseMementosDir + '/' + id + '/' + memento_data.md_content_path
			$memento_lib_tauri.fs().writeTextFile( path, this.content( id ), { dir: $memento_lib_tauri.base().BaseDirectory.App } )
		}

		@$mol_mem
		id( id?: any ) {
			if( id !== undefined ) return id as never
			return ""
		}

		@$mol_action
		@$mol_mem_key
		getMementoData( id: string ) {
			const path = this.$.$memento_config_baseMementosDir + '/' + id

			const json = $memento_lib_tauri.fs().readTextFile(
				path + '/' + $memento_config_metaMementoSpec,
				{ dir: $memento_lib_tauri.base().BaseDirectory.App }
			)
			this.log( json )

			const data = $mol_json_from_string( json )
			this.sharedDto( data )
			return data as MementoDTO
		}

		setMementoData( id: string, dto: MementoDTO ) {
			const path = this.$.$memento_config_baseMementosDir + '/' + id
			const data = JSON.stringify( dto )
			$memento_lib_tauri.fs().writeTextFile(
				path + '/' + $memento_config_metaMementoSpec, data,
				{ dir: $memento_lib_tauri.base().BaseDirectory.App }
			)
		}

		@$mol_action
		addKeyFromSearch() {
			this.addMemento( this.search().query() )
			this.search().query( '' )
		}

		@$mol_mem_key
		removeMementoButton( id: any, next?: any ) {
			$memento_lib_tauri.fs().removeDir( this.$.$memento_config_baseMementosDir + '/' + id, { dir: $memento_lib_tauri.base().BaseDirectory.App, recursive: true } )
			this.resets( null ) // форсируем ресет
		}

		@$mol_mem
		all_tags() {
			this.resets_tags()
			let tags = []
			let pages = this.loadAllPages()
			for( const iterator of pages ) {
				const data = iterator.data()
				if( data.tags && data.tags.length > 0 )
					tags.push( ...Object.values( data.tags ) )
			}
			return Array.from( [ ...new Set( tags ) ] ) ?? []
		}

		@$mol_mem_key
		current_id( id: string ) {
			return id
		}

		@$mol_mem_key
		note_tags( id: string, tags?: any ) {
			if( tags !== undefined ) {
				this.note_update_tags( id, tags )
			}
			return this.getMementoData( id ).tags
		}

		@$mol_action
		note_update_tags( id: string, tags: any ) {
			const dto = this.getMementoData( id )
			dto.tags = tags
			this.setMementoData( id, dto )
			this.resets_tags( null ) // форсируем ресет
		}


		/*
			Collections
		*/

		@$mol_mem
		resets_collections( reset?: null ) {
			return Math.random()
		}

		@$mol_mem
		load_collections_from_disk() {
			this.resets_collections() // слушаем ресеты
			return $memento_lib_tauri.fs().readDir( this.$.$memento_config_collections_dir, { dir: $memento_lib_tauri.base().BaseDirectory.App, recursive: true } )
		}

		@$mol_mem
		all_collections() {
			this.resets_collections()
			return this.load_collections_from_disk().map( collection => {
				const path = collection.path
				const json = $memento_lib_tauri.fs().readTextFile(
					path + '/' + $memento_config_metaMementoSpec,
					{ dir: $memento_lib_tauri.base().BaseDirectory.App }
				)
				const data = $mol_json_from_string( json )
				return { id: collection.name, uid: collection.name, name: data.name }
			} )
		}

		@$mol_action
		note_update_collection( id: string, collection: string ) {
			if( id === null ) {
				this.resets_collections( null ) // форсируем ресет
				return
			}

			if( id.includes( " | " ) ) {
				const args = id.split( " | " )
				id = args[ 0 ]
				collection = args[ 1 ]
			}

			const path = this.$.$memento_config_collections_dir + '/' + id
			const data = JSON.stringify( { name: collection } )
			$memento_lib_tauri.fs().writeTextFile(
				path + '/' + $memento_config_metaMementoSpec, data,
				{ dir: $memento_lib_tauri.base().BaseDirectory.App }
			)
			this.resets_collections( null ) // форсируем ресет
		}

		@$mol_action
		page_note_update_collection( id: string, collection: string ) {
			if( id.includes( " | " ) ) {
				const args = id.split( " | " )
				id = args[ 0 ]
				collection = args[ 1 ]
			}

			const dto = this.getMementoData( id )
			dto.collection = collection
			this.setMementoData( id, dto )
			this.resets_collections( null ) // форсируем ресет
		}

		@$mol_action
		getCollectionData( id: string ) {
			const path = this.$.$memento_config_collections_dir + '/' + id
			const json = $memento_lib_tauri.fs().readTextFile(
				path + '/' + $memento_config_metaMementoSpec,
				{ dir: $memento_lib_tauri.base().BaseDirectory.App }
			)
			this.log( json )
			const data = $mol_json_from_string( json )
			this.sharedDto( data )
			return data as MementoDTO
		}

		@$mol_mem_key
		collection( id: string, next?: any ) {
			if( next === undefined ) {
				const data = this.all_collections().filter( collection => collection.uid === this.getMementoData( id ).collection )
				return data[ 0 ] ? data[ 0 ].name : null
			} else {
				this.page_note_update_collection( id, this.all_collections()[ next ].uid )
				return next
			}
		}

		collections() {
			// return this.all_collections().map(collection => collection.name)
			return this.all_collections().map( collection => [ collection.id ] = collection.name )
		}
	}
}
