namespace $.$$ {
	export class MementoDTO {
		id: string = ''
		date: number = 0
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
