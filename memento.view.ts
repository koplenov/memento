namespace $.$$ {
	const baseMementosDir: string = 'mementos'
	const contentMementoSpec: string = 'content.md'
	const metaMementoSpec: string = 'meta.memento'

	const vktoken: string = 'vk1.a.ifJQdpy6zOmN5kYkkt7JUgBMeE1YoyDxMvN0yGGbXUazaK8mMK9U3VxOClCPz7eKj4baV5FfcIowFUGdqU3v6ynFnw1Sa004E-EpRq9JKbFHG0uRzvM7wor4JbTz-LIAAD-2arkczWo0NJXijA05gFauLqzKYFe_HrL6zpDM96KR4NDQk3iMImzixZ3a0FQ3'

	class MementoDTO {
		title?: string = undefined
		md_content_path?: string = undefined
		nav?: string = undefined
		attachments?: Attachments = undefined
		collection?: string = undefined
		tags?: string[] = undefined
	}

	class Attachments {
		images: string[] = []
	}

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
		tauri_fs() {
			return $mol_wire_sync( { ...window.__TAURI__.fs } )
		}
		@$mol_action
		tauri_fs_async() {
			return window.__TAURI__.fs
		}

		@$mol_action
		tauri_path() {
			return $mol_wire_sync( { ...window.__TAURI__.path } )
		}

		@$mol_action
		tauri_tauri() {
			return $mol_wire_sync( { ...window.__TAURI__.tauri } )
		}

		@$mol_mem
		tauri() {
			const tauri = this.tauri_fs()
			tauri.createDir( baseMementosDir, { dir: this.tauri_fs().BaseDirectory.App, recursive: true } )
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

		@$mol_mem_key
		image_uri( id:any, imageUrl?: any ) {
			return imageUrl ?? 'default'
		}

		@$mol_mem
		async page_images( id?: any ) {
			const attachments = this.getMementoData( id ).attachments
			if( attachments && attachments.images ) {
				let images = []
				for( const image of attachments.images ) {
					const cachedImage = await this.cacheFile(id, image)
					this.image_uri(id, cachedImage)
					images.push( this.Image( id ) )
				}
				return images
			}
			return null
		}

		@$mol_action
		async cacheFile( id: any, imgUrl: string ) {
			const extension = 'png'
			const fileName = `${$mol_hash_string(imgUrl)}.${extension}`
			let fullpath = this.tauri_path().join(baseMementosDir, id, fileName)
			let fullConvertPath = this.tauri_path().join(this.tauri_path().appDir(), fullpath)

			if( this.tauri_fs().exists( fullpath, { dir: this.tauri().BaseDirectory.App } ) ) {
				this.log('Load cached file') // сюда доходит
			}
			else {
				this.log('Download file')
				let blob = await (await(fetch(imgUrl))).blob()
				const buffer = await blob.arrayBuffer()
				const array = new Uint8Array( buffer )
				await this.saveImage(array, fullpath )
			}
			return await this.tauri_tauri().convertFileSrc(fullConvertPath)
		}

		async saveImage(blob: any, fullpath: string) {
			await this.tauri_fs_async().writeBinaryFile(
			  {
				contents: blob,
				path: fullpath,
			  },
			  {
				dir:  this.tauri().BaseDirectory.App,
			  }
			);
		  };

		@$mol_mem
		resets( reset?: null ) {
			return Math.random()
		}

		@$mol_mem
		loadInfo() {
			this.resets() // слушаем ресеты
			return this.tauri().readDir( baseMementosDir, { dir: this.tauri().BaseDirectory.App, recursive: true } )
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

			const path = baseMementosDir + '/' + Utils.generateUUID()
			this.tauri().createDir( path, { dir: this.tauri().BaseDirectory.App, recursive: true } )

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
			this.tauri().writeTextFile( path + '/' + data.md_content_path, extractedData, { dir: this.tauri().BaseDirectory.App } )

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
			const data = JSON.parse(
				this.tauri().readTextFile(
					path + '/' + metaMementoSpec,
					{ dir: this.tauri().BaseDirectory.App }
				) )
			return data as MementoDTO//Object.setPrototypeOf( data, MementoDTO.prototype ) as MementoDTO
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
