const jsPDF = window.jspdf.jsPDF;
const doc = new jsPDF();
//doc.text("Hello world2! this is the Title", 10, 10);
const docWidth = doc.internal.pageSize.getWidth();
const docHeight = doc.internal.pageSize.getHeight();
//console.log('doc', docWidth, docHeight)


class Album {
	constructor(containerElement, index, file) {
		const image = new Image();
		const reader = new FileReader;
		let imgWidth, imgHeight, ratio;

		reader.onload = function () {
			image.onload = function () {
				imgWidth = image.width;
				imgHeight = image.height;
				ratio = imgWidth / imgHeight;
				console.log('onload', imgWidth, imgHeight, ratio);

				let renderWidth = (imgWidth > docWidth) ? docWidth : imgWidth;
				renderWidth -= 20;
				let renderHeight = renderWidth / ratio;
				console.log('render', renderWidth, renderHeight);

				if (index > 0) {
					doc.addPage();
				}
				doc.addImage(image.src, "JPEG", 10, 20, renderWidth, renderHeight); // width unit mm

			};

			image.src = reader.result;
		}
		if (file) {
			reader.readAsDataURL(file);
		};

		image.dataset.index = index;
		image.title = file.name;
		containerElement.appendChild(image);
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

		this.geneBtn = document.querySelector("#generate");
		this.geneBtn.addEventListener('click', () => doc.save("myImg2Pdf.pdf"))

		this.indexArr = [];

	};

	_openFileDialog() {
		this.fileDialog.click();
	};

	_handleFileSelect(evt) {
		this.filesInfo = evt.target.files;
		console.log(this.filesInfo);
		this._renderAlbums();
	}

	_renderAlbums() {
		const albumContainer = document.querySelector("#album-container");
		albumContainer.innerHTML = '';
		for (let i = 0; i < this.filesInfo.length; i++) {
			const file = this.filesInfo[i];
			file.index = i; // should only run for the first render
			const preview = new Album(albumContainer, i, file);
		};

		// show the generate btn
		this.geneBtn.classList.remove('hidden');
	};


};



const app = new App();

