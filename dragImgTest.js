
class Album {
	constructor(container, src, index){
		this.dragStart = false; // like a flag
		this.originX = null;
		this.originY = null;
		this.offsetX = 0; // for calculating new start position 
		this.offsetY = 0;

		//bind this
		this._onDragStart = this._onDragStart.bind(this);
		this._onDragMove = this._onDragMove.bind(this);
		this._onDragEnd = this._onDragEnd.bind(this);

		const img = new Image();
		img.src = src
		//img.innerHTML = `<span> ${num} </span>`;
		img.dataset.index = index;
		img.addEventListener('pointerdown', this._onDragStart);
		img.addEventListener('pointermove', this._onDragMove);
		img.addEventListener('pointerup', this._onDragEnd);
		container.appendChild(img);
	};

	_onDragStart(event) {
		event.preventDefault();
		this.originX = event.clientX;
		//this.originY = event.clientY;
		//console.log('origin' , this.originX ,this.originY);
		console.log('origin' , this.originX )
		this.dragStart = true;
		event.currentTarget.setPointerCapture(event.pointerId);
	};


	_onDragMove(event) {
		if(!this.dragStart) return;
		const currentX = event.clientX;
		//const currentY = event.clientY;
		const deltaX = currentX - this.originX;
		//const deltaY = currentY - this.originY;
		//console.log('delta' + delta);
		const translateX = this.offsetX + deltaX;
		//const translateY = this.offsetY + deltaY;
		//event.currentTarget.style.transform = 'translate(' + translateX + 'px, ' + translateY + 'px)';	
		event.currentTarget.style.transform = 'translate(' + translateX + 'px)';

	}
	_onDragEnd(event) {
		this.dragStart = false;
		this.offsetX += event.clientX - this.originX;
		//this.offsetY += event.clientY - this.originY;
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
			imgContainer.id = `${i}`;
			const photoSrc = PHOTO_LIST[i];
			const album = new Album(imgContainer, photoSrc, i);
			container.appendChild(imgContainer);
		}
	}
};


const app = new App(); 




