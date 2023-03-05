namespace $.$$ {
	export const $memento_config_collections_dir = 'collections'

	export const $memento_config_baseMementosDir = 'mementos'
	export const $memento_config_contentMementoSpec = 'content.md'
	export const $memento_config_metaMementoSpec = 'meta.memento'
	export const $memento_config_vktoken = 'vk1.a.ifJQdpy6zOmN5kYkkt7JUgBMeE1YoyDxMvN0yGGbXUazaK8mMK9U3VxOClCPz7eKj4baV5FfcIowFUGdqU3v6ynFnw1Sa004E-EpRq9JKbFHG0uRzvM7wor4JbTz-LIAAD-2arkczWo0NJXijA05gFauLqzKYFe_HrL6zpDM96KR4NDQk3iMImzixZ3a0FQ3'

	export class $memento_config_vktoken2 {
		private static token: string | undefined = undefined;
		static set_token( token: string ) {
			$memento_lib_tauri.fs()
				.writeTextFile(
					$memento_config_metaMementoSpec,
					JSON.stringify( { token } ),
					{ dir: $memento_lib_tauri.base().BaseDirectory.App }
				)
		}
		static get_token() {
			if( this.token ) {
				return this.token
			} else {
				if(
					$memento_lib_tauri.base().exists(
						$memento_config_metaMementoSpec,
						{ dir: $memento_lib_tauri.base().BaseDirectory.App }
					)
				) {
					return this.token = JSON.parse( $memento_lib_tauri.base().readTextFile(
						$memento_config_metaMementoSpec,
						{ dir: $memento_lib_tauri.base().BaseDirectory.App }
					) ).token
				} else {
					return undefined
				}
			}
		}
	}
}
