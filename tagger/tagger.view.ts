/*
namespace $.$$ {
	export class $memento_tagger extends $.$memento_tagger {
		dict() {
			// поле ввода
			const queryTag = this.Friends().Pick().Filter().value()

			// существующие теги + наш
			const existTags = [
				"mem", "koplenov", ...this.Friends().value(), queryTag
			]

			return existTags
		}
	}
}
*/

namespace $.$$ {

	export class $memento_tagger extends $.$memento_tagger {

		menu_content() {
			return [
				... super.menu_content(),
				... this.filter_pattern().length ? [ this.Add_option() ] : [],
			]
		}

		add_option( event: MouseEvent ) {
			const option = { [ this.filter_pattern() ]: this.filter_pattern() }
			this.dictionary( { ...this.dictionary(), ...option } )
			this.event_select( this.filter_pattern(), event )
			this.filter_pattern( '' )
		}

		dict() {

		}

	}

	export class $memento_tagger_compat extends $.$memento_tagger_compat {
		@$mol_mem
		auto() {
			// fuck.. but it.. works!
			this.Tagger().value = ( val?: any ) => undefined
			// console.log( this.tags() )
		}

		@$mol_mem
		dict( next?: any ) {
			console.log("next", next)


			if( next !== undefined ) {
				const updateDto = this.dto() as MementoDTO
				updateDto.tags = Object.values(next)
				this.dto(updateDto)
			}

			// Array.from(items);
			
			if(next === undefined)
				return this.tags();

			const _ = this.skill_rows()

			const out = this.tags().filter((x: string) => !this.dto().tags.includes(x))
			return Object.fromEntries(out.map(x => [x, x])) || {gg: "gg"}
		}

		@$mol_mem
		skill_rows() {
			// load from page
			//return [...Object.keys( this.dict() ).map( key => this.Skill( key ) ), ...Object.keys( this.allTags() ).map( key => this.Skill( key ) )]
			// return Object.keys( this.dict() ).map( key => this.Skill( key ) )
			if(this.dto().tags)
				return Object.keys( this.dto().tags ).map( key => this.Skill( key ) )
			return []
		}

		@$mol_mem_key
		skill_title( key: string ) {
			return this.dict()[ key ]
		}

		@$mol_action
		removeTagFromThisPost( id: any ) {
			// непонятное
			const { [ id ]: _, ...next } = this.Tagger().dictionary()
			this.Tagger().dictionary( next )

			return // выше и ниже одно и тоже

			// понятное)0
			const newTags = { ...this.Tagger().dictionary() }
			delete newTags[ id ]
			this.Tagger().dictionary( newTags )
		}

	}


}
