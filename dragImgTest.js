
class Album {
	constructor(container, src, index,PHOTO_LIST){
		this.dragStart = false; // like a flag
		this.originX = null;
		this.originY = null;
		this.offsetX = 0; // for calculating new start position 
		this.offsetY = 0;

		this.originalIndex = null;
		this.PHOTO_LIST = PHOTO_LIST; // make it public before use in callback;

		//bind this
		this._onDragStart = this._onDragStart.bind(this);
		this._onDragMove = this._onDragMove.bind(this);
		this._onDragEnd = this._onDragEnd.bind(this);

		const img = new Image();
		img.src = src
		img.dataset.index = index;
		img.addEventListener('pointerdown', this._onDragStart);
		img.addEventListener('pointermove', this._onDragMove);
		img.addEventListener('pointerup', this._onDragEnd);
		container.appendChild(img);
	};

	_onDragStart(event) {
		event.preventDefault();
		this.originalIndex = event.currentTarget.dataset.index;
		console.log('originalidx', this.originalIndex);
		this.originX = event.clientX;
		this.originY = event.clientY;
		//console.log('origin' , this.originX ,this.originY);
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

	}
	_onDragEnd(event) {
		console.log('dragend');
		this.dragStart = false;
		//console.log('dragendpoint', event.clientX, event.clientY)
		const offX = Math.floor(event.clientX/300); // target index if only one row
		const offY= Math.floor(event.clientY/230);
		//console.log('offsetIndex', offX, offY);
		const targetIndex = offX*1 + offY*3	;
		//this.offsetX += event.clientX - this.originX;
		//this.offsetY += event.clientY - this.originY;

		const originalDiv = document.querySelector(`div[data-index="${this.originalIndex}"]`);
		const targetDiv =  document.querySelector(`div[data-index="${targetIndex}"]`);
		console.log('swapindex', this.originalIndex,targetIndex);
		//console.log('photolist', this.PHOTO_LIST);

		originalDiv.innerHTML= '';
		targetDiv.innerHTML = '';

		// drag start div change img;
		//constructor(container, src, index,PHOTO_LIST){}
		const swapImage1 = new Album(originalDiv, this.PHOTO_LIST[targetIndex],this.originalIndex,this.PHOTO_LIST );
		/*
		const swapImage = new Image()
		swapImage.src = this.PHOTO_LIST[offX];
		swapImage.dataset.index = this.originalIndex;
		console.log(swapImage);
		swapImage.addEventListener('pointerdown', this._onDragStart);
		swapImage.addEventListener('pointermove', this._onDragMove);
		swapImage.addEventListener('pointerup', this._onDragEnd);
		originalDiv.appendChild(swapImage);
		*/

		// drag end div change img;
		const swapImage2 = new Album(targetDiv, this.PHOTO_LIST[this.originalIndex],  targetIndex, this.PHOTO_LIST);
		/*
		swapImage2.src = this.PHOTO_LIST[this.originalIndex];
		swapImage2.dataset.index = offX;
		targetDiv.appendChild(swapImage2);
		*/;

		// change the order in PHOTOLIST
		[this.PHOTO_LIST[this.originalIndex], this.PHOTO_LIST[targetIndex]] = [this.PHOTO_LIST[targetIndex], this.PHOTO_LIST[this.originalIndex]];
	} 

}

class App {
	constructor(){
		const PHOTO_LIST = [
			"img/train1.jpg",
			"img/train2.jpg",
			"img/train4.jpg",
			"img/train6.jpg",
			"img/train7.jpg",
			"img/train8.jpg"
		];
		const container = document.querySelector("#album");
		for(let i=0; i<PHOTO_LIST.length;i++){
			const imgContainer = document.createElement('div');
			imgContainer.className = "img-container";
			imgContainer.dataset.index = `${i}`;
			const photoSrc = PHOTO_LIST[i];
			const album = new Album(imgContainer, photoSrc, i, PHOTO_LIST);
			container.appendChild(imgContainer);
		}
	}
};


const app = new App(); 




