
class Album {
	constructor(container, num){
		this.dragStart = false; // like a flag
		this.originX = null;
		this.originY = null;
		this.offsetX = 0; // for calculating new start position 
		this.offsetY = 0;

		//bind this
		this._onDragStart = this._onDragStart.bind(this);
		this._onDragMove = this._onDragMove.bind(this);
		this._onDragEnd = this._onDragEnd.bind(this);

		const img = document.createElement('div');
		img.innerHTML = `<span> ${num} </span>`;
		img.dataset.index = num;
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
		let arr = [1,2,3,4,5];
		const container = document.querySelector("#album");
		for (const num of arr) {
			const album = new Album(container, num);
		}
	}
};


const app = new App(); 




