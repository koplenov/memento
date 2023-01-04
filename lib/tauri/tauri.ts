namespace $.$$ {
	export class $memento_lib_tauri extends $mol_object {
		@$mol_action
		static fs() {
			return $mol_wire_sync( { ...window.__TAURI__.fs } )
		}

		@$mol_action
		static path() {
			return $mol_wire_sync( { ...window.__TAURI__.path } )
		}

		@$mol_action
		static tauri() {
			return $mol_wire_sync( { ...window.__TAURI__.tauri } )
		}

		@$mol_mem
		static base() {
			const tauri = this.fs()
			tauri.createDir( this.$.$memento_config_baseMementosDir, { dir: this.fs().BaseDirectory.App, recursive: true } )
			return tauri
		}
	}
}
