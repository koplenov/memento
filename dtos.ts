namespace $.$$ {
	export class MementoDTO {
		title?: string = undefined
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
