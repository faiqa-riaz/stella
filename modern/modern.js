/* StellaMaria – modern homepage: drawer menu, scroll-spy, reveal, call button. */
(function () {
	'use strict';

	var doc = document.documentElement;
	doc.classList.add('js');

	var sidebar = document.getElementById('sidebar');
	var menuBtn = sidebar.querySelector('.menu-btn');
	var panel = document.getElementById('sidebar-panel');
	var scrim = document.querySelector('.scrim');
	var navLinks = Array.prototype.slice.call(sidebar.querySelectorAll('.nav a'));
	var drawerQuery = window.matchMedia('(max-width: 1099px)');

	/* Drawer (below desktop) */
	function setOpen(open) {
		sidebar.classList.toggle('is-open', open);
		menuBtn.setAttribute('aria-expanded', String(open));
		menuBtn.querySelector('use').setAttribute('href', open ? '#i-x' : '#i-menu');
		menuBtn.querySelector('.menu-btn-label').textContent = open ? 'Schließen' : 'Menü';
		if (open) {
			scrim.hidden = false;
			requestAnimationFrame(function () { scrim.classList.add('is-visible'); });
			document.body.style.overflow = 'hidden';
			var first = panel.querySelector('a');
			if (first) first.focus();
		} else {
			scrim.classList.remove('is-visible');
			document.body.style.overflow = '';
			setTimeout(function () { if (!sidebar.classList.contains('is-open')) scrim.hidden = true; }, 250);
		}
	}

	menuBtn.addEventListener('click', function () {
		setOpen(!sidebar.classList.contains('is-open'));
	});
	scrim.addEventListener('click', function () { setOpen(false); });
	document.addEventListener('keydown', function (e) {
		if (e.key === 'Escape' && sidebar.classList.contains('is-open')) {
			setOpen(false);
			menuBtn.focus();
		}
	});
	panel.addEventListener('click', function (e) {
		if (e.target.closest('a') && drawerQuery.matches) setOpen(false);
	});
	drawerQuery.addEventListener('change', function (e) {
		if (!e.matches) setOpen(false);
	});

	/* Scroll-spy: highlight the section in view */
	var sections = navLinks
		.map(function (a) { return document.querySelector(a.getAttribute('href')); })
		.filter(Boolean);

	function setActive(id) {
		navLinks.forEach(function (a) {
			var on = a.getAttribute('href') === '#' + id;
			a.classList.toggle('is-active', on);
			if (on) a.setAttribute('aria-current', 'true');
			else a.removeAttribute('aria-current');
		});
	}

	if ('IntersectionObserver' in window) {
		var spy = new IntersectionObserver(function (entries) {
			entries.forEach(function (entry) {
				if (entry.isIntersecting) setActive(entry.target.id);
			});
		}, { rootMargin: '-45% 0px -50% 0px' });
		sections.forEach(function (s) { spy.observe(s); });

		/* Reveal on scroll */
		var reveal = new IntersectionObserver(function (entries) {
			entries.forEach(function (entry) {
				if (!entry.isIntersecting) return;
				entry.target.classList.add('is-in');
				reveal.unobserve(entry.target);
			});
		}, { rootMargin: '0px 0px -8% 0px' });

		document.querySelectorAll('.reveal').forEach(function (el) {
			// Stagger siblings that share a parent grid (40ms each)
			var siblings = Array.prototype.filter.call(el.parentNode.children, function (c) { return c.classList.contains('reveal'); });
			el.style.transitionDelay = (siblings.indexOf(el) * 40) + 'ms';
			reveal.observe(el);
		});

		/* Floating call button: hidden over the hero (it has its own CTAs) and the booking section */
		var fab = document.querySelector('.fab');
		var hero = document.getElementById('start');
		var termin = document.getElementById('termin');
		if (fab && hero && termin) {
			var heroVisible = true;
			var terminVisible = false;
			var updateFab = function () { fab.classList.toggle('is-hidden', heroVisible || terminVisible); };
			new IntersectionObserver(function (entries) {
				heroVisible = entries[0].isIntersecting;
				updateFab();
			}, { rootMargin: '0px 0px -40% 0px' }).observe(hero);
			new IntersectionObserver(function (entries) {
				terminVisible = entries[0].isIntersecting;
				updateFab();
			}).observe(termin);
		}
	} else {
		document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-in'); });
	}

	/* FAQ: keep one answer open at a time */
	var faqs = Array.prototype.slice.call(document.querySelectorAll('.faq details'));
	faqs.forEach(function (d) {
		d.addEventListener('toggle', function () {
			if (!d.open) return;
			faqs.forEach(function (o) { if (o !== d) o.open = false; });
		});
	});

	/* Current year */
	document.querySelectorAll('[data-year]').forEach(function (el) {
		el.textContent = new Date().getFullYear();
	});
})();
