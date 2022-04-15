class Album {
    constructor(containerElement, imgIndex, fileIdx, fileList, mappingArr) {
        // for dragging 
        this.dragStart = false; // like a flag
        this.originX = null;
        this.originY = null;
        this.offsetX = 0; // for calculating new start position 
        this.offsetY = 0;
        this.originalIndex = null;
        this.currFileIndex = null;

        //bind this
        this._onDragStart = this._onDragStart.bind(this);
        this._onDragMove = this._onDragMove.bind(this);
        this._onDragEnd = this._onDragEnd.bind(this);

        // public fields
        this.containerElement = containerElement;
        this.fileList = fileList;
        this.fileIdx = fileIdx;
        this.file = fileList[fileIdx];
        this.index = imgIndex;
        this.mappingArr = mappingArr;

        // loading from the file reader
        this.firstRender = true;
        this._loadAndRenderImg();

    };

    _loadAndRenderImg() {
        const image = new Image();
        const reader = new FileReader;

        const load = (e) => {// this.index will be undefined if not use arrow function
            image.src = reader.result;
        }

        if (this.file) {
            reader.readAsDataURL(this.file);
        };

        reader.addEventListener('load', load);

        image.dataset.index = this.index;
        image.title = this.file.name;
        image.id = this.fileIdx;
        image.addEventListener('pointerdown', this._onDragStart);
        image.addEventListener('pointermove', this._onDragMove);
        image.addEventListener('pointerup', this._onDragEnd);
        this.containerElement.appendChild(image);
    };

    _onDragStart(event) {
        event.preventDefault();
        // console.log('drag start', event.target.title);
        this.originalIndex = event.currentTarget.dataset.index; // div image dataset index
        this.currFileIndex = event.currentTarget.id; // image filelist id
        //console.log('current file id',event.currentTarget.id);
        console.log('originalidx', this.originalIndex);
        this.originX = event.clientX;
        this.originY = event.clientY;
        this.dragStart = true;
        event.currentTarget.setPointerCapture(event.pointerId);
    };

    _onDragMove(event) {
        if (!this.dragStart) return;
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
        const offX = Math.floor(event.clientX / 300); // target index if only one row
        const offY = Math.floor(event.clientY / 230);
        //console.log('offsetIndex', offX, offY);
        const targetIndex = offX * 1 + offY * 3;
        this.offsetX += event.clientX - this.originX;
        this.offsetY += event.clientY - this.originY;

        const originalDiv = document.querySelector(`div[data-index="${this.originalIndex}"]`);
        const targetDiv = document.querySelector(`div[data-index="${targetIndex}"]`);
        const targetImage = document.querySelector(`img[data-index="${targetIndex}"]`)
        //console.log('target div', targetImage)
        console.log('swapindex', this.originalIndex, targetIndex);
        //console.log('getindx', originalDiv.dataset.index)


        console.log(typeof (this.originalIndex), typeof (targetIndex)); // string , number
        if (parseInt(this.originalIndex) !== targetIndex) {
            originalDiv.innerHTML = '';
            targetDiv.innerHTML = '';
            const swapImage1 = new Album(originalDiv, this.originalIndex, targetImage.id, this.fileList, this.mappingArr);
            const swapImage2 = new Album(targetDiv, targetIndex, this.currFileIndex, this.fileList, this.mappingArr);
            [this.mappingArr[this.currFileIndex], this.mappingArr[targetImage.id]] = [this.mappingArr[targetImage.id], this.mappingArr[this.currFileIndex]];
            console.log(this.mappingArr);
        }
    }
};


class App {
    constructor() {
        this.filesInfo;
        const jsPDF = window.jspdf.jsPDF;
        this.doc = new jsPDF();

        // const docHeight = doc.internal.pageSize.getHeight();

        //bind event handlers
        this._openFileDialog = this._openFileDialog.bind(this);
        this._handleFileSelect = this._handleFileSelect.bind(this);
        this._generatePDF = this._generatePDF.bind(this);
        this._addImagetoPDF = this._addImagetoPDF.bind(this);
        this._savePDF = this._savePDF.bind(this);

        const uploadBtn = document.querySelector('#upload');
        uploadBtn.addEventListener('click', this._openFileDialog);

        this.fileDialog = document.getElementById("fileDialogId");
        this.fileDialog.addEventListener('change', this._handleFileSelect, false);

        this.geneBtn = document.querySelector("#generate");
        this.geneBtn.addEventListener('click', this._generatePDF)

    };

    _openFileDialog() {
        this.fileDialog.click();
    };

    _handleFileSelect(evt) {
        this.filesInfo = evt.target.files;
        console.log(this.filesInfo);
        this.mappingArr = Array.from(Array(this.filesInfo.length).keys());
        console.log(this.mappingArr);
        this._renderAlbums();
    }

    _renderAlbums() {
        const albumContainer = document.querySelector("#album-container");
        albumContainer.innerHTML = '';
        for (let i = 0; i < this.filesInfo.length; i++) {
            const imgContainer = document.createElement('div');
            imgContainer.className = "img-container";
            imgContainer.dataset.index = `${i}`;
            const preview = new Album(imgContainer, i, i, this.filesInfo, this.mappingArr);
            albumContainer.appendChild(imgContainer);

        };

        // show the generate btn
        this.geneBtn.classList.remove('hidden');
    }

    _addImagetoPDF(file, index, docWidth) {
        
        const reader = new FileReader;

       const loadReader = () => {

            const image = new Image();
            let imgWidth, imgHeight, ratio;

             image.onload = () => {
                imgWidth = image.width;
                imgHeight = image.height;
                ratio = imgWidth / imgHeight;;

                let renderWidth = (imgWidth > docWidth) ? docWidth : imgWidth;
                renderWidth -= 20;
                let renderHeight = renderWidth / ratio;

                if (index > 0) {
                    this.doc.addPage();
                };

                this.doc.addImage(reader.result, "JPEG", 10, 20, renderWidth, renderHeight); // width unit mm
              
            };
            image.src = reader.result;

        }

        reader.readAsDataURL(file);
        reader.addEventListener('load', loadReader);
    }

    _generatePDF() {
        const docWidth = this.doc.internal.pageSize.getWidth();
        console.log('mapping',this.mappingArr)
        for (let i = 0; i < this.filesInfo.length; i++) {
            this._addImagetoPDF(this.filesInfo[this.mappingArr[i]], i, docWidth)
        };
        setTimeout(this._savePDF, 2000)
    };

    _savePDF(){
        console.log('save pdf')
        this.doc.save("myImg3Pdf.pdf");
    }
};



const app = new App();

