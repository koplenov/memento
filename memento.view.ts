namespace $.$$ {
	const baseMementosDir: string = 'mementos';
	
	export class $memento_content extends $.$memento_content {
		
		@ $mol_mem
		pages() {
			return [
				this.Menu(),
				... $mol_maybe( this.Spread() ),
			]
		}
		
		Spread() {
			return this.spreads()[ this.spread() ]
		}
		
		@ $mol_mem
		spread( next?: string ) {
			return this.$.$mol_state_arg.value( this.param(), next ) ?? ''
		}

		@ $mol_mem
		links() {
			return Object.keys( this.spreads() ).map( spread => this.Link( spread ) )
		}

		auto(){
			this.$.$mol_lights(true)
		}
		
		@ $mol_mem
		tauri_funcs(){
		  return $mol_wire_sync({ ... window.__TAURI__.fs })
		}
	  
		@ $mol_mem
		tauri(){
		  const tauri = this.tauri_funcs()
		  tauri.createDir(baseMementosDir, { dir: this.tauri_funcs().BaseDirectory.App, recursive: true });
		  return tauri
		}

		@ $mol_mem
		page_title(id: any) {
			return id
		}

		/*
		// left bar
		@ $mol_mem
		hided(val?: any){
			return val || null
		}

		@ $mol_mem
		showBar(val?: any) {
			this.hided(null)
		}
		

		@ $mol_mem
		hideBar(val?: any) {
			this.hided(true)
		}
		*/

		@ $mol_mem
		resets( reset?: null ) {
    		return Math.random()
		}

		// pages
		@ $mol_mem
		loadInfo(){
			this.preparate()
			this.resets() // слушаем ресеты
			let pages = []
			const entries = this.tauri().readDir(baseMementosDir, { dir: this.tauri().BaseDirectory.App, recursive: true });
			for (const entry of entries) {

				let employee: MementoInfo = {
					title: entry.name, 
					content: "Tom"
				}
				pages.push(employee)
			}
			return pages as MementoInfo[];
		}

		addMemento(content: string){
			if(content.trim() === ""){
				alert("Попытка добавить пустую ссылку!")
				return
			}
			this.tauri().createDir(baseMementosDir +'/'+ content, { dir: this.tauri().BaseDirectory.App, recursive: true });
			this.resets( null ) // форсируем ресет
			/// let pages = [...this.$.$mol_state_local.value( "db" ) as MementoInfo[]]
			/// pages.push({ title: content, content: "Добавьте описание"})
			/// this.$.$mol_state_local.value( "db", pages )
		}

		deleteMemento(id: string){
			let pages = [...this.$.$mol_state_local.value( "db" ) as MementoInfo[]]
			pages = this.arrayRemove(pages, id)
			this.$.$mol_state_local.value( "db", pages )
		}

		arrayRemove(arr: MementoInfo[], value: string) { 
			return arr.filter(function(ele: MementoInfo){ 
				return ele.title != value; 
			});
		}

		loadPages(){
			let pages = []
			for (const iterator of this.loadInfo()) {
				let page = iterator as MementoInfo
				pages.push(this.Page(page.title))
			}
			return pages
		}

		@ $mol_mem_key
		updateContent(title: string, val?: any){
			if ( val !== undefined ){
				function isNeedMemento(memento: MementoInfo) {
					return memento.title === title;
				}
				let pages = [...this.$.$mol_state_local.value( "db" ) as MementoInfo[]]
				let index = pages.findIndex(isNeedMemento)
				pages[index].content = val
				this.$.$mol_state_local.value( "db", pages )
				return val as never
			}
			return ""
		}

		spreads() {
			let pages =  this.loadPages()
			return pages
			// sipmle search
			let search = this.search().query()
			return pages.filter(function(ele){
				return ele !== undefined && ele.title().includes(search) 
			});
		}

		@ $mol_mem_key
		content(id: any, next?: any) {
			return this.$.$mol_state_local.value(id, next) ?? ''
		}

		addKeyFromSearch() {
			this.addMemento(this.search().query())
		}

		@ $mol_mem_key
		removeMementoButton(id: any, next?: any) {
			this.tauri().removeDir(baseMementosDir +'/'+ id, { dir: this.tauri().BaseDirectory.App });
			this.deleteMemento(id)
			this.resets( null ) // форсируем ресет
		}
	}

	interface MementoInfo {
		title: string
		content: string
	}
}
