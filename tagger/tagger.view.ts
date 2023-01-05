namespace $.$$ {

	export class $memento_tagger extends $.$memento_tagger {

		menu_content() {
			return [
				... super.menu_content(),
				... this.filter_pattern().length ? [ this.Add_option() ] : [],
			]
		}

		/*
		@$mol_action
		add_option( event: MouseEvent ) {
			const a = this.filter_pattern()
			const option = { [ this.filter_pattern() ]: this.filter_pattern() }
			this.dictionary( { ...this.dictionary(), ...option } )
			this.event_select( this.filter_pattern(), event )
			this.filter_pattern( '' )
		}
		*/
	}

	export class $memento_tagger_compat extends $.$memento_tagger_compat {

		@$mol_action
		add_tag_from_list(next? : any){
			if(next !== undefined){
				this.add_tag(this.dict()[next])
			}
		}

		add_tag(tag: string){
			const tags = Object.values( this.note_tags( this.id() ) )
			tags.push(tag)
			this.note_tags( this.id(), tags )
		}

		@$mol_action
		create_and_add_tag(){
			const new_tag = this.Tagger().filter_pattern()
			this.add_tag(new_tag)
		}

		@$mol_action
		log( message?: any, ...optionalParams: any[] ) {
			console.log( message, optionalParams )
		}

		@$mol_mem
		dict( next?: any ) {
			const all_tags = Object.values( this.all_tags() )
			const note_tags = next !== undefined ? Object.values( this.note_tags( this.id(), next ) ) : Object.values( this.note_tags( this.id() ) )
			return all_tags.filter( n => !note_tags.includes( n ) )
		}

		@$mol_mem
		skill_rows() {
			console.log( "skill_rowsss ", this.note_tags( this.id() ) )
			return Object.keys( this.note_tags( this.id() ) ).map( key => this.Skill( key ) )
		}

		@$mol_mem_key
		skill_title( key: string ) {
			return Object.values( this.note_tags( this.id()) )[ key ]
		}

		@$mol_action
		removeTagFromThisPost( id: any ) {
			const { [ id ]: _, ...next } = this.note_tags( this.id() )
			this.note_tags( this.id(), next )
		}
	}
}
