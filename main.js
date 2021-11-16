const jsPDF = window.jspdf.jsPDF;
const doc = new jsPDF();



class Album {
	constructor(containerElement, index, file) {
		
		const image = document.createElement('img');
		const reader = new FileReader;
		reader.addEventListener('load', function(){
			 image.src = reader.result;
			 doc.addImage( image.src, "JPEG", 15, 40, 180, 180);
			 },false);
		if (file) {
		    reader.readAsDataURL(file);
		};
		
		image.dataset.index = index;
		image.title= file.name;
		containerElement.appendChild(image);

		//console.log('image', image)
	}
}; 


class App {
	constructor() {
		this.filesInfo = {};
		
		//bind event handlers
		this._openFileDialog = this._openFileDialog.bind(this);
		this._handleFileSelect = this._handleFileSelect.bind(this);

		const uploadBtn = document.querySelector('#upload');
		uploadBtn.addEventListener('click', this._openFileDialog);

		this.fileDialog = document.getElementById("fileDialogId");
		this.fileDialog.addEventListener('change', this._handleFileSelect, false);
	
		this.indexArr = [];

	};

	_openFileDialog() {
		this.fileDialog.click();
	};

	_handleFileSelect(evt){
		this.filesInfo = evt.target.files;
		console.log(this.filesInfo);
		this._renderAlbums();
	}


	_renderAlbums() {
		const albumContainer = document.querySelector("#album-container");
		albumContainer.innerHTML = '';
		//for(const file of this.filesInfo) {
		for(let i=0; i<this.filesInfo.length; i++){
			const file = this.filesInfo[i];
			file.index = i; // should only run for the first render
			const preview = new Album(albumContainer, i, file);
		};

		
	};


};



const app = new App();
const geneBtn = document.querySelector("#generate");
geneBtn.addEventListener('click', ()=>doc.save("a8.pdf"))
