

class ViewerController {

	constructor(viewerDiv) {
		this.viewerDiv = $(viewerDiv);
		this.imgElement = $('<img>').css('cursor', 'grab').css('transform-origin', '0 0')
		
		this.viewerDiv.append(this.imgElement);

		this.maxWheel = 50;
		this.maxZoom = 5;
		this.zoomSpeed = 0.005;
		this.hasView = false;
		this.inRot = false;
		this.inPan = false;
		this.bindViewerEvents();

	}

	view(folder, count, startFrame) {
		this.folder = folder;
		this.currFrame = startFrame;
		this.startFrame = startFrame;
		this.count = count;

		this.threshold = 400 / count;
		this.currZoom = 1;
		this.currTrans = {x: 0, y: 0};

		this.setTransform();

		this.touches = 0;
		this.endRot();
		this.endPan();
		this.endPanZoom();

		this.imgElement.on('load', function () {
			var viewerDiv = $(this).parents(0);
			$(this).parents(0).data('controller').newViewLoaded();
			$(this).off('load');
		});
		this.updateSrc(startFrame);
		// will trigger img load event when src loads
		// which then calls newViewLoaded()
	}

	newViewLoaded() {
		if (this.imgElement.attr('src') === undefined) return;

		this.imgW = this.viewerDiv.width();
		this.imgH = this.viewerDiv.height();
		this.hasView = true;
	}

	updateSrc(num) {
		this.imgElement.attr('src', `${this.folder}/0_${num}.jpg`);
	}

	mod(n, m) {
		return ((n % m) + m) % m;
	}

	clamp(num, min, max) {
		return Math.min(Math.max(num, min), max);
	}

	bindViewerEvents() {
		this.viewerDiv.data('controller', this);
		
		// MOUSE SUPPORT

		this.viewerDiv.mousedown(function (e) {
			if (e.which === 1) {
				e.preventDefault();
				$(this).data('controller').startRot(e.pageX, e.pageY);
			} else if (e.which === 3 || e.which === 2) {
				e.preventDefault();
				$(this).data('controller').startPan(e.pageX, e.pageY);
			}

		});

		this.viewerDiv.mouseup(function (e) {
			if (e.which === 1) {
				$(this).data('controller').endRot(e.pageX, e.pageY);
			} else if (e.which === 3 || e.which === 2) {
				$(this).data('controller').endPan(e.pageX, e.pageY);
			}

		});

		this.viewerDiv.mouseleave(function (e) {
			if (e.which === 1) {
				$(this).data('controller').endRot(e.pageX, e.pageY);
			} else if (e.which === 3 || e.which === 2) {
				$(this).data('controller').endPan(e.pageX, e.pageY);
			}
		});

		this.viewerDiv.on('mousewheel', function (e) {
			$(this).data('controller').zoom(e.pageX, e.pageY, e.originalEvent.wheelDelta);
		});

		
		// TOUCH SUPPORT

		this.viewerDiv.on('touchstart', function (e) {
			$(this).data('controller').resolveTouchState(e);
		});

		this.viewerDiv.on('touchend', function (e) {
			$(this).data('controller').resolveTouchState(e);
		});

		this.viewerDiv.on('touchcancel', function (e) {
			$(this).data('controller').resolveTouchState(e);
		});

		this.viewerDiv.on('touchmove', function (e) {
			$(this).data('controller').resolveTouchState(e);
			//$('#product-popup .popup-title').text(`move ${$(this).data('controller').touches}`)
			if (e.touches.length === 1) {
				e.preventDefault();
				$(this).data('controller').registerRotMove(e.touches[0].pageX, e.touches[0].pageY);
			} else if (e.touches.length === 2) {
				e.preventDefault();
				var doubleT = ViewerController.doubleTouch(e.touches[0], e.touches[1]);
				$(this).data('controller').registerPanZoom(doubleT.x, doubleT.y, doubleT.d);
			}
		});

		// GENERAL

		this.viewerDiv.contextmenu(function (e) { e.preventDefault() });

		// to keep pan in bouindaries when window resizes
		$(window).data('controller', this);
		$(window).resize(function () {
			$(this).data('controller').newViewLoaded();
		});
	}


	// ROTATION (frame change)

	startRot(x, y) {
		if (!this.hasView || this.inRot || this.inPan) return;

		this.rotStart = {x: x, y: y};
		this.startFrame = this.currFrame;
		this.inRot = true;
		this.imgElement.css('cursor', 'grabbing');
		
		this.viewerDiv.mousemove(function (e) {
			$(this).data('controller').registerRotMove(e.pageX, e.pageY);
		});
	}

	endRot(x, y) {
		if (!this.hasView || !this.inRot) return;

		this.inRot = false;
		this.imgElement.css('cursor', 'grab');
		
		this.viewerDiv.off('mousemove');
	}

	registerRotMove(x, y) {
		if (!this.hasView || !this.inRot) return;

		var dx = x - this.rotStart.x;
		var dframe = -Math.floor(dx / this.threshold);
		var newFrame = this.mod(this.startFrame + dframe, this.count);
		if (newFrame != this.currFrame) {
			this.currFrame = newFrame;
			this.updateSrc(this.currFrame);
		}
	}

	// ZOOM (frame change)

	/*zoom(x, y, delta) { // zoom on center
		if (!this.hasView) return;

		var trueDelta = this.clamp(delta, -this.maxWheel, this.maxWheel);
		this.currZoom = this.clamp(this.currZoom + this.zoomSpeed * trueDelta, 1, this.maxZoom);
		this.imgElement.css('transform', `scale(${this.currZoom})`);
		this.imgElement.css('transform-origin', 'center');
	}*/

	/*zoom(x, y, delta) { // zoom on cursor (alternative way)
		if (!this.hasView) return;

		var pos = {x: x - this.imgElement.offset().left, y: y - this.imgElement.offset().top};
		var trueDelta = this.clamp(delta, -this.maxWheel, this.maxWheel);
		var newZoom = 1 + this.zoomSpeed * trueDelta;

		// zoom clamping done before to work correctly,
		// because new trans depends on new zoom
		var finalZoom = this.clamp(this.currZoom * newZoom, 1, this.maxZoom);
		newZoom = finalZoom / this.currZoom;

		// scale and translation parameters for matrix
		this.currZoom = finalZoom;
		this.currTrans.x = this.currTrans.x + pos.x*(1-newZoom);
		this.currTrans.y = this.currTrans.y + pos.y*(1-newZoom);

		// keep in bounds
		this.currTrans.x = this.clamp(this.currTrans.x, this.imgW*(1-this.currZoom), 0);
		this.currTrans.y = this.clamp(this.currTrans.y, this.imgH*(1-this.currZoom), 0);


		this.imgElement.css('transform', `matrix(${this.currZoom},0,0,${this.currZoom},${this.currTrans.x},${this.currTrans.y})`)
	}*/

	zoom(x, y, delta) { // zoom on cursor
		if (!this.hasView) return;

		var pos = {x: x - this.viewerDiv.offset().left, y: y - this.viewerDiv.offset().top};
		var trueDelta = this.clamp(delta, -this.maxWheel, this.maxWheel);
		var newZoom = 1 + this.zoomSpeed * trueDelta;
		
		// zoom clamping done before to work correctly,
		// because new trans depends on new zoom
		var finalZoom = this.clamp(this.currZoom * newZoom, 1, this.maxZoom);
		newZoom = finalZoom / this.currZoom;

		// scale and translation parameters for matrix
		this.currZoom = this.currZoom * newZoom;
		this.currTrans.x = newZoom*this.currTrans.x + pos.x*(1-newZoom);
		this.currTrans.y = newZoom*this.currTrans.y + pos.y*(1-newZoom);
		
		// keep in bounds
		this.currTrans.x = this.clamp(this.currTrans.x, this.imgW*(1-this.currZoom), 0);
		this.currTrans.y = this.clamp(this.currTrans.y, this.imgH*(1-this.currZoom), 0);

		this.setTransform();
	}

	setTransform() {
		this.imgElement.css('transform', `matrix(${this.currZoom},0,0,${this.currZoom},${this.currTrans.x},${this.currTrans.y})`)
	}


	// PAN (when zoomed)

	startPan(x, y) {
		if (!this.hasView || this.inPan || this.inRot) return;

		this.lastPan = {x: x, y: y};
		this.inPan = true;
		this.imgElement.css('cursor', 'move');
		
		this.viewerDiv.mousemove(function (e) {
			$(this).data('controller').registerPanMove(e.pageX, e.pageY);
		});
	}

	endPan(x, y) {
		if (!this.hasView || !this.inPan) return;

		this.inPan = false;
		this.imgElement.css('cursor', 'grab');
		
		this.viewerDiv.off('mousemove');
	}

	registerPanMove(x, y) {
		if (!this.hasView || !this.inPan) return;

		var dx = x - this.lastPan.x;
		var dy = y - this.lastPan.y;
		this.lastPan = {x: x, y: y};
		this.currTrans.x += dx;
		this.currTrans.y += dy;
		
		// keep in bounds
		this.currTrans.x = this.clamp(this.currTrans.x, this.imgW*(1-this.currZoom), 0);
		this.currTrans.y = this.clamp(this.currTrans.y, this.imgH*(1-this.currZoom), 0);
		
		this.setTransform();
	}


	// TOUCH specific

	resolveTouchState(e) {
		var touches = e.touches.length;
		if (touches > 2) touches = 0;

		if (this.touches === touches) return;

		if (touches === 0 && this.touches === 1) {
			this.endRot(e.changedTouches[0].pageX, e.changedTouches[0].pageY);
		} else if (touches === 0 && this.touches === 2) {
			this.endPanZoom();
		} else if (touches === 1 && this.touches === 0) {
			this.startRot(e.touches[0].pageX, e.touches[0].pageY);
		} else if (touches === 1 && this.touches === 2) {
			this.endPanZoom();
			this.startRot(e.touches[0].pageX, e.touches[0].pageY);
		} else if (touches === 2 && this.touches === 0) {
			var doubleT = ViewerController.doubleTouch(e.touches[0], e.touches[1]);
			this.startPanZoom(doubleT.x, doubleT.y, doubleT.d);
		} else if (touches === 2 && this.touches === 1) {
			var doubleT = ViewerController.doubleTouch(e.touches[0], e.touches[1]);
			this.endRot(e.touches[0].pageX, e.touches[0].pageY);
			this.startPanZoom(doubleT.x, doubleT.y, doubleT.d);
		}

		this.touches = touches;
	}

	static doubleTouch(t1, t2) {
		var x = (t1.pageX + t2.pageX) / 2;
		var y = (t1.pageY + t2.pageY) / 2;
		var d = Math.sqrt((t1.pageX-t2.pageX)*(t1.pageX-t2.pageX) + (t1.pageY-t2.pageY)*(t1.pageY-t2.pageY));
		return {x: x, y: y, d: d};
	}

	startPanZoom(x, y, d) {
		if (!this.hasView || this.inPan || this.inRot) return;

		this.lastPan = {x: x, y: y};
		this.lastD = d;
		this.inPan = true;
	}

	endPanZoom() {
		if (!this.hasView || !this.inPan) return;

		this.inPan = false;
	}

	registerPanZoom(x, y, d) {
		// two finger drag translate
		var dx = x - this.lastPan.x;
		var dy = y - this.lastPan.y;
		this.lastPan = {x: x, y: y};
		this.currTrans.x += dx;
		this.currTrans.y += dy;
		
		// keep in bounds
		this.currTrans.x = this.clamp(this.currTrans.x, this.imgW*(1-this.currZoom), 0);
		this.currTrans.y = this.clamp(this.currTrans.y, this.imgH*(1-this.currZoom), 0);

		// pinch zoom
		this.zoom(x, y, (d - this.lastD));
		this.lastD = d;
		
		this.setTransform();
	}

}