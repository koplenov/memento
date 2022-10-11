namespace $ {
	export class $memento_lib_vk extends $mol_object {
		constructor(vktoken: string) {
			super();
			this.accessToken(vktoken)
			return this
		}
		
		@$mol_mem
		apiUrl() {
			return 'https://api.vk.com/method/'
		}
		
		@$mol_mem
		version() {
			return 5.131
		}

		@$mol_mem
		accessToken(accessToken?: string) {
			return accessToken
		}
		
		@$mol_action
		wall(wallId: string) {
			const url = `${this.apiUrl()}wall.getById?posts=${wallId}&access_token=${this.accessToken()}&extended=1&v=${this.version()}`
			return this.tauri_net_funcs().fetch(url).data.response
		}

		@$mol_action
		tauri_net_funcs() {
			return $mol_wire_sync( { ...window.__TAURI__.http } )
		}
	}
}

