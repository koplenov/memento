namespace $.$$ {

	export class $memento extends $.$memento {
		@ $mol_mem
		token(token?: string){
			if(token){
				$memento_config_vktoken2.set_token(token) 
			}
			return $memento_config_vktoken2.get_token()
		}

		@ $mol_mem
		sub() {
			if(this.token()){
				return super.sub()
			} else {
				return this.token_instruction()
			}
		}
		configure_token(){
			const token = this.set_token().value().split("=")[1].split("&")[0]
			this.token(token)
		}
	}
}
