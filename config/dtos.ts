namespace $.$$ {
	/*
		Collections
	*/
	export class CollectionDTO {
		name: string = ''
	}

	/*
		Notes
	*/
	export class MementoDTO {
		id: string = ''
		date_posted: number = 0
		date_added: number = 0
		title?: string = undefined
		description?: string = undefined
		md_content_path?: string = undefined
		nav?: string = undefined
		attachments?: Attachments = undefined
		collection?: string = undefined
		tags?: string[] = undefined
	}

	export class Attachments {
		images: string[] = []
	}
}
