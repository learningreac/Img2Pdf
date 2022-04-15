const jsPDF = window.jspdf.jsPDF;
const doc = new jsPDF();
//doc.text("Hello world2! this is the Title", 10, 10);
const docWidth = doc.internal.pageSize.getWidth();
const docHeight = doc.internal.pageSize.getHeight();
//console.log('doc', docWidth, docHeight)


class Album {
	constructor(containerElement, index, fileList) {
		// for dragging 
		this.dragStart = false; // like a flag
		this.originX = null;
		this.originY = null;
		this.offsetX = 0; // for calculating new start position 
		this.offsetY = 0;
		this.originalIndex = null;

		//bind this
		this._onDragStart = this._onDragStart.bind(this);
		this._onDragMove = this._onDragMove.bind(this);
		this._onDragEnd = this._onDragEnd.bind(this);

		// creat image and file reader
		const image = new Image();
		const reader = new FileReader;
		let imgWidth, imgHeight, ratio;
		this.fileList = fileList;

		// loading from the file reader
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

				// adding images to pdf
				if (index > 0) {
					doc.addPage();
				}
				doc.addImage(image.src, "JPEG", 10, 20, renderWidth, renderHeight); // width unit mm

			};

			image.src = reader.result;
		}
		if (fileList[index]) {
			reader.readAsDataURL(fileList[index]);
		};

		image.dataset.index = index;
		image.title = fileList[index].name;
		image.addEventListener('pointerdown', this._onDragStart);
		image.addEventListener('pointermove', this._onDragMove);
		image.addEventListener('pointerup', this._onDragEnd);
		containerElement.appendChild(image);
	};

	_onDragStart(event) {
		event.preventDefault();
		console.log('drag start')
		this.originalIndex = event.currentTarget.dataset.index; // image dataset index
		console.log('originalidx', this.originalIndex);
		this.originX = event.clientX;
		this.originY = event.clientY;
		this.dragStart = true;
		event.currentTarget.setPointerCapture(event.pointerId);
	};

	_onDragMove(event) {
		if(!this.dragStart) return;
		const currentX = event.clientX;
		const currentY = event.clientY;
		const deltaX = currentX - this.originX;
		const deltaY = currentY - this.originY;
		//console.log('delta' , deltaX, deltaY);
		const translateX = this.offsetX + deltaX;
		const translateY = this.offsetY + deltaY;
		event.currentTarget.style.transform = 'translate(' + translateX + 'px, ' + translateY + 'px)';	
	};

	_onDragEnd(event) {
		console.log('dragend');
		this.dragStart = false;
		//console.log('dragendpoint', event.clientX, event.clientY)
		const offX = Math.floor(event.clientX/300); // target index if only one row
		const offY= Math.floor(event.clientY/230);
		//console.log('offsetIndex', offX, offY);
		const targetIndex = offX*1 + offY*3	;
		this.offsetX += event.clientX - this.originX;
		this.offsetY += event.clientY - this.originY;

		const originalDiv = document.querySelector(`div[data-index="${this.originalIndex}"]`);
		const targetDiv =  document.querySelector(`div[data-index="${targetIndex}"]`);
		console.log('swapindex', this.originalIndex,targetIndex);
		console.log('getindx',originalDiv.dataset.index)

		originalDiv.innerHTML= '';
		targetDiv.innerHTML = '';

		const swapImage1 = new Album(originalDiv, targetIndex, this.fileList );
		const swapImage2 = new Album(targetDiv, this.originalIndex, this.fileList);
		

		// rerender pdf

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
		console.log('fileDialog', this.fileDialog);
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
			const imgContainer = document.createElement('div');
			imgContainer.className = "img-container";
			imgContainer.dataset.index = `${i}`;
			const preview = new Album(imgContainer, i, this.filesInfo);
			albumContainer.appendChild(imgContainer);

		};

		// show the generate btn
		this.geneBtn.classList.remove('hidden');
	};


};



const app = new App();

