/* Vanilla stand-ins for the BeTheme + Slider Revolution behaviour on the original homepage. */
(function () {
	'use strict';

	var DESKTOP = 1240; // BeTheme mobileInit: side slide + responsive header below this
	var body = document.body;
	var $ = function (s, ctx) { return (ctx || document).querySelector(s); };
	var $$ = function (s, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(s)); };

	/* Slider | auto layout on a 1600x640 grid */
	var slider = $('#rev_slider_4_1_wrapper');

	function sizeSlider() {
		var w = slider.clientWidth;
		var s = Math.min(1, w / 1600);
		slider.style.setProperty('--rs-s', s);
		slider.style.setProperty('--rs-off', Math.max(0, (w - 1600) / 2) + 'px');
	}

	/* Menu | submenu markup (mfnMenu init) */
	var menuList = $('#menu > ul.menu');
	$$('li', menuList).forEach(function (li) {
		if (li.querySelector('ul')) {
			li.classList.add('submenu');
			var t = document.createElement('span');
			t.className = 'menu-toggle';
			li.appendChild(t);
			$$('ul li:last-child', li).forEach(function (l) { l.classList.add('last-item'); });
		}
	});

	function fade(el, show) {
		if (!el) return;
		el.style.transition = 'opacity .1s';
		if (show) {
			el.style.display = 'block';
			el.style.opacity = 0;
			requestAnimationFrame(function () { el.style.opacity = 1; });
		} else {
			el.style.display = 'none';
		}
	}

	// desktop: hover; mobile: +/- toggle
	$$('li', menuList).forEach(function (li) {
		li.addEventListener('mouseenter', function () {
			if (window.innerWidth < DESKTOP) return;
			li.classList.add('hover');
			fade(li.querySelector(':scope > ul'), true);
		});
		li.addEventListener('mouseleave', function () {
			if (window.innerWidth < DESKTOP) return;
			li.classList.remove('hover');
			fade(li.querySelector(':scope > ul'), false);
		});
	});

	menuList.addEventListener('click', function (e) {
		var t = e.target.closest('.menu-toggle');
		if (!t || window.innerWidth >= DESKTOP) return;
		var li = t.closest('li');
		var open = !li.classList.contains('hover');
		li.classList.toggle('hover', open);
		fade(li.querySelector(':scope > ul'), open);
	});

	/* Menu | side slide */
	var slide = $('#Side_slide');
	var overlay = $('#body_overlay');
	var nav = $('nav#menu');
	var slideW = parseInt(slide.getAttribute('data-width'), 10) || 250;

	function openSlide() {
		slide.style.right = '0px';
		body.style.position = 'relative';
		body.style.left = (-slideW / 2) + 'px';
		overlay.style.display = 'block';
		overlay.style.opacity = 0;
		requestAnimationFrame(function () { overlay.style.opacity = 1; });
	}

	function closeSlide() {
		slide.style.right = (-slideW) + 'px';
		body.style.left = '0px';
		overlay.style.opacity = 0;
		setTimeout(function () { overlay.style.display = 'none'; }, 300);
	}

	function placeMenu() {
		if (window.innerWidth < DESKTOP) {
			if (!slide.classList.contains('enabled')) {
				$('.menu_wrapper', slide).appendChild(nav);
				slide.classList.add('enabled');
			}
		} else if (slide.classList.contains('enabled')) {
			closeSlide();
			$('#Top_bar .menu_wrapper').insertBefore(nav, $('#Top_bar .menu_wrapper').firstChild);
			slide.classList.remove('enabled');
			$$('#menu li ul').forEach(function (ul) { ul.style.display = ''; });
			$$('#menu li.hover').forEach(function (li) { li.classList.remove('hover'); });
		}
	}

	$('.responsive-menu-toggle').addEventListener('click', function (e) {
		e.preventDefault();
		openSlide();
	});
	$('.close', slide).addEventListener('click', function (e) {
		e.preventDefault();
		closeSlide();
	});
	overlay.addEventListener('click', closeSlide);
	document.addEventListener('keydown', function (e) {
		if (e.key === 'Escape' && slide.style.right === '0px') closeSlide();
	});

	/* Back to top */
	$('#back_to_top').addEventListener('click', function (e) {
		e.preventDefault();
		window.scrollTo({ top: 0, behavior: 'smooth' });
	});

	/* Animations | add data-anim-type once visible (>= 960) or immediately (< 960) */
	function animate() {
		var vh = window.innerHeight;
		$$('.animate').forEach(function (el) {
			var type = el.getAttribute('data-anim-type');
			if (!type || el.classList.contains(type)) return;
			var r = el.getBoundingClientRect();
			if (window.innerWidth < 960 || (r.top < vh && r.bottom > 0)) el.classList.add(type);
		});
	}

	function layout() {
		sizeSlider();
		placeMenu();
		animate();
	}

	layout();
	window.addEventListener('resize', layout);
	window.addEventListener('scroll', animate, { passive: true });
	window.addEventListener('load', layout);
})();
