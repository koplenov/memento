namespace $.$$ {
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

		// @$mol_mem_key
		page_title( id: $memento_page, title?: any ) {
			const path = baseMementosDir + '/' + id
			const mementoDto = this.getMementoData( id )
			const data = this.$.$mol_state_local.value( id + 'page_title', title ) ?? mementoDto.title
			if( title !== undefined ) {
				mementoDto.title = title
				$memento_tauri.fs().writeTextFile( path + '/' + metaMementoSpec, JSON.stringify( mementoDto ), { dir: $memento_tauri.base().BaseDirectory.App } )
				return data
			}
			return data
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
				this.log(images)
				return images
			}
			return null
		}

		cacheFile( id: any, imgUrl: string ) {
			const extension = 'png'
			const fileName = `${ $mol_hash_string( imgUrl ) }.${ extension }`
			let fullpath = $memento_tauri.path().join( baseMementosDir, id, fileName )
			let fullConvertPath = $memento_tauri.path().join( $memento_tauri.path().appDir(), fullpath )

			if( $memento_tauri.fs().exists( fullpath, { dir: $memento_tauri.base().BaseDirectory.App } ) ) {
				this.log( 'Load cached file', fullpath )
			}
			else {
				this.log( 'Download file', imgUrl )
				const arrayBuffer = $mol_fetch.buffer(imgUrl)
				this.saveImage( arrayBuffer, fullpath )
			}
			return $memento_tauri.tauri().convertFileSrc( fullConvertPath )
		}

		saveImage( blob: any, fullpath: string ) {
			$memento_tauri.fs().writeBinaryFile(
				{
					contents: blob,
					path: fullpath,
				},
				{
					dir: $memento_tauri.base().BaseDirectory.App,
				}
			)
		};

		@$mol_mem
		resets( reset?: null ) {
			return Math.random()
		}

		@$mol_mem
		loadInfo() {
			this.resets() // слушаем ресеты
			return $memento_tauri.fs().readDir( baseMementosDir, { dir: $memento_tauri.base().BaseDirectory.App, recursive: true } )
		}

		@$mol_mem
		vk() {
			return new $memento_lib_vk( vktoken )
		}

		@$mol_action
		alert( message: string ) {
			alert( message )
		}

		addMemento( id: string ) {
			if( id.trim() === "" ) {
				this.alert( "Попытка добавить пустую ссылку!" )
				return
			}

			let extractedData = id
			let extracted: boolean = false

			// link detect
			if( id.includes( 'vk.com' ) ) {
				if( id.includes( 'wall' ) ) {
					const wall = id.split( 'wall' ).at( -1 ) ?? null
					if( wall ) {
						extracted = true
						extractedData = this.vk().wall( wall )
					}
				}
			}

			const path = baseMementosDir + '/' + $memento_utils.generateUUID()
			$memento_tauri.fs().createDir( path, { dir: $memento_tauri.base().BaseDirectory.App, recursive: true } )

			let data = new MementoDTO()
			data.title = 'blank title',
				data.md_content_path = contentMementoSpec,
				data.nav = JSON.stringify( id ),
				data.collection = 'GG'
			data.tags = [ 'pp', 'gg' ]

			this.log( extractedData )
			if( extracted ) {
				const post = extractedData[ 0 ] as any
				data.title = post.text
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
			$memento_tauri.fs().writeTextFile( path + '/' + data.md_content_path, extractedData, { dir: $memento_tauri.base().BaseDirectory.App } )

			$memento_tauri.fs().writeTextFile( path + '/' + metaMementoSpec, JSON.stringify( data ), { dir: $memento_tauri.base().BaseDirectory.App } )
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
			const data = this.$.$mol_state_local.value( id, next ) ?? $memento_tauri.base().readTextFile(
				path + '/' + this.getMementoData( id ).md_content_path,
				{ dir: $memento_tauri.base().BaseDirectory.App }
			)
			$memento_tauri.fs().writeTextFile( path + '/' + this.getMementoData( id ).md_content_path, data, { dir: $memento_tauri.base().BaseDirectory.App } )
			return data
		}

		@$mol_action
		getMementoData( id?: string ) {
			const path = baseMementosDir + '/' + id
			const data = JSON.parse(
				$memento_tauri.fs().readTextFile(
					path + '/' + metaMementoSpec,
					{ dir: $memento_tauri.base().BaseDirectory.App }
				) )
			return data as MementoDTO
		}

		addKeyFromSearch() {
			this.addMemento( this.search().query() )
		}

		@$mol_mem_key
		removeMementoButton( id: any, next?: any ) {
			$memento_tauri.fs().removeDir( baseMementosDir + '/' + id, { dir: $memento_tauri.base().BaseDirectory.App, recursive: true } )
			this.resets( null ) // форсируем ресет
		}
	}
}
