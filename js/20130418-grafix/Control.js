
var Control = function() {

	//Each shape checks the mouse for itself
	this.mouseInstance = false;
	this.mouseButtonStates = [];
	this.mouseOnState = false;
	this.mouseOnEvent = new Event( 'shape-mouse-on', this );
	this.mouseOffEvent = new Event( 'shape-mouse-off', this );
	this.mouseMoveEvent = new Event( 'shape-mouse-move', this );
	this.mouseClickEvent = new Event( 'shape-mouse-click', this );
	this.mouseDownEvent = new Event( 'shape-mouse-down', this );
	this.mouseUpEvent = new Event( 'shape-mouse-up', this );
	this.lastMouseDownPosition = false;
	this.lastMouseUpPosition = false;
	this.dragEvent = new Event( 'shape-drag', this );
	this.dragMoveEvent = new Event( 'shape-drag-move', this );
	this.dropEvent = new Event( 'shape-drop', this );
	this.dragCancelEvent = new Event( 'shape-drag-cancel', this );
	this.isDragging = false,
	this.dragLazyness = 5;
}