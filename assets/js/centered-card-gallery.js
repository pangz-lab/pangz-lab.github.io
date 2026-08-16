/**
 * CenteredCardGallery — lightweight centered card carousel (no Swiper).
 *
 * - Active card is always scrolled so its center matches the viewport center
 * - Drag / touch / wheel-horizontal / arrows / dots / click-to-focus
 * - Responsive: card size from CSS; JS only does centering math
 *
 * Usage:
 *   const g = CenteredCardGallery.mount('#host', {
 *     items: [{ src, href, alt }],
 *     autoplayMs: 5000
 *   });
 *   // or
 *   await CenteredCardGallery.fromJson('#host', '../path/images.json', '../path', opts);
 */
(function (global) {
  'use strict';

  function qs(el, sel) {
    return el.querySelector(sel);
  }

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function CenteredCardGallery(root, options) {
    this.root = typeof root === 'string' ? document.querySelector(root) : root;
    if (!this.root) throw new Error('CenteredCardGallery: root not found');

    this.opts = Object.assign(
      {
        autoplayMs: 5000,
        loop: true,
        startIndex: 0,
        onChange: null
      },
      options || {}
    );

    this.index = 0;
    this._items = [];
    this._cards = [];
    this._timer = null;
    this._drag = null;
    this._raf = null;
    this._lightboxOpen = false;
    this._onScroll = this._onScroll.bind(this);
    this._onResize = this._onResize.bind(this);
  }

  CenteredCardGallery.prototype._buildShell = function () {
    this.root.classList.add('cg-root');
    this.root.innerHTML =
      '<button type="button" class="cg-btn cg-prev" aria-label="Previous">' +
        '<svg class="cg-chevron" viewBox="0 0 24 48" width="28" height="56" aria-hidden="true">' +
          '<path d="M16 6 L6 24 L16 42" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>' +
        '</svg>' +
      '</button>' +
      '<div class="cg-viewport" tabindex="0" role="region" aria-label="Image gallery">' +
        '<div class="cg-track"></div>' +
      '</div>' +
      '<button type="button" class="cg-btn cg-next" aria-label="Next">' +
        '<svg class="cg-chevron" viewBox="0 0 24 48" width="28" height="56" aria-hidden="true">' +
          '<path d="M8 6 L18 24 L8 42" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>' +
        '</svg>' +
      '</button>' +
      '<div class="cg-dots" role="tablist" aria-label="Gallery pages"></div>';

    this.viewport = qs(this.root, '.cg-viewport');
    this.track = qs(this.root, '.cg-track');
    this.dotsEl = qs(this.root, '.cg-dots');
    this.btnPrev = qs(this.root, '.cg-prev');
    this.btnNext = qs(this.root, '.cg-next');

    // Lightbox on <body> so overflow/transform ancestors never clip it
    if (this.lightbox && this.lightbox.parentNode) {
      this.lightbox.parentNode.removeChild(this.lightbox);
    }
    this.lightbox = document.createElement('div');
    this.lightbox.className = 'cg-lightbox';
    this.lightbox.hidden = true;
    this.lightbox.setAttribute('aria-hidden', 'true');
    this.lightbox.innerHTML =
      '<div class="cg-lightbox-backdrop" data-cg-close></div>' +
      '<button type="button" class="cg-lightbox-close" aria-label="Close" data-cg-close>&times;</button>' +
      '<button type="button" class="cg-lightbox-nav cg-lightbox-prev" aria-label="Previous image">' +
        '<svg viewBox="0 0 24 48" width="32" height="64" aria-hidden="true">' +
          '<path d="M16 6 L6 24 L16 42" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>' +
        '</svg>' +
      '</button>' +
      '<figure class="cg-lightbox-figure">' +
        '<img class="cg-lightbox-img" alt="">' +
      '</figure>' +
      '<button type="button" class="cg-lightbox-nav cg-lightbox-next" aria-label="Next image">' +
        '<svg viewBox="0 0 24 48" width="32" height="64" aria-hidden="true">' +
          '<path d="M8 6 L18 24 L8 42" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>' +
        '</svg>' +
      '</button>';
    document.body.appendChild(this.lightbox);
    this.lightboxImg = qs(this.lightbox, '.cg-lightbox-img');
  };

  CenteredCardGallery.prototype.setItems = function (items) {
    var self = this;
    this._items = items || [];
    this._buildShell();
    this.track.innerHTML = '';
    this.dotsEl.innerHTML = '';
    this._cards = [];

    this._items.forEach(function (item, i) {
      var card = document.createElement('div');
      card.className = 'cg-card';
      card.dataset.index = String(i);
      card.setAttribute('role', 'group');
      card.setAttribute('aria-label', 'Image ' + (i + 1) + ' of ' + self._items.length);

      var link = document.createElement('button');
      link.type = 'button';
      link.className = 'cg-link';
      link.setAttribute('aria-label', 'Open image ' + (i + 1) + ' full size');
      link.dataset.index = String(i);

      var img = document.createElement('img');
      img.src = item.src;
      img.alt = item.alt || '';
      img.draggable = false;
      img.decoding = 'async';

      link.appendChild(img);
      card.appendChild(link);
      self.track.appendChild(card);
      self._cards.push(card);

      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'cg-dot';
      dot.setAttribute('aria-label', 'Go to image ' + (i + 1));
      dot.dataset.index = String(i);
      self.dotsEl.appendChild(dot);
    });

    this._bind();
    this._waitImages().then(function () {
      var start = clamp(
        self.opts.startIndex != null
          ? self.opts.startIndex
          : Math.floor(self._cards.length / 2),
        0,
        Math.max(0, self._cards.length - 1)
      );
      self.goTo(start, false);
      self._startAutoplay();
    });

    return this;
  };

  CenteredCardGallery.prototype._waitImages = function () {
    var imgs = this.track.querySelectorAll('img');
    return Promise.all(
      Array.prototype.map.call(imgs, function (img) {
        if (img.complete && img.naturalWidth) return Promise.resolve();
        return new Promise(function (resolve) {
          img.addEventListener('load', resolve, { once: true });
          img.addEventListener('error', resolve, { once: true });
        });
      })
    );
  };

  CenteredCardGallery.prototype._bind = function () {
    var self = this;

    this.btnPrev.addEventListener('click', function (e) {
      e.stopPropagation();
      self.prev();
    });
    this.btnNext.addEventListener('click', function (e) {
      e.stopPropagation();
      self.next();
    });

    this.dotsEl.addEventListener('click', function (e) {
      var t = e.target.closest('.cg-dot');
      if (!t) return;
      self.goTo(parseInt(t.dataset.index, 10), true);
    });

    // Direct click on card button — most reliable for opening lightbox
    this.track.addEventListener('click', function (e) {
      var link = e.target.closest('.cg-link');
      var card = e.target.closest('.cg-card');
      if (!card) return;
      var i = parseInt(card.dataset.index, 10);
      if (isNaN(i)) return;

      // If user just dragged, ignore the synthetic click
      if (self._didDrag) {
        self._didDrag = false;
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      if (i !== self.index) {
        self.goTo(i, true);
        return;
      }
      self.openLightbox(i);
    });

    this.viewport.addEventListener('scroll', this._onScroll, { passive: true });
    window.addEventListener('resize', this._onResize);

    // Drag to scroll — do NOT setPointerCapture (it steals click from cards)
    this.viewport.addEventListener('pointerdown', function (e) {
      if (e.button != null && e.button !== 0) return;
      if (e.target.closest('.cg-btn')) return;
      self._stopAutoplay();
      self._didDrag = false;
      self._drag = {
        id: e.pointerId,
        startX: e.clientX,
        startScroll: self.viewport.scrollLeft,
        moved: false
      };
      self.viewport.classList.add('is-dragging');
    });

    this.viewport.addEventListener('pointermove', function (e) {
      if (!self._drag || self._drag.id !== e.pointerId) return;
      var dx = e.clientX - self._drag.startX;
      if (Math.abs(dx) > 8) {
        self._drag.moved = true;
        self._didDrag = true;
      }
      if (self._drag.moved) {
        self.viewport.scrollLeft = self._drag.startScroll - dx;
      }
    });

    function endDrag(e) {
      if (!self._drag || (e.pointerId != null && self._drag.id !== e.pointerId)) return;
      var moved = self._drag.moved;
      self._drag = null;
      self.viewport.classList.remove('is-dragging');
      if (moved) {
        self._snapToNearest(true);
        // Keep _didDrag true until click handler clears it
        setTimeout(function () {
          self._didDrag = false;
        }, 50);
      }
      if (!self._lightboxOpen) self._startAutoplay();
    }

    this.viewport.addEventListener('pointerup', endDrag);
    this.viewport.addEventListener('pointercancel', endDrag);
    this.viewport.addEventListener('pointerleave', function (e) {
      if (self._drag) endDrag(e);
    });

    this.viewport.addEventListener('keydown', function (e) {
      if (self._lightboxOpen) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        self.prev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        self.next();
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        self.openLightbox(self.index);
      }
    });

    // Lightbox controls
    this.lightbox.addEventListener('click', function (e) {
      if (e.target.hasAttribute('data-cg-close') || e.target.closest('[data-cg-close]')) {
        self.closeLightbox();
      }
    });
    qs(this.lightbox, '.cg-lightbox-prev').addEventListener('click', function (e) {
      e.stopPropagation();
      self._lightboxStep(-1);
    });
    qs(this.lightbox, '.cg-lightbox-next').addEventListener('click', function (e) {
      e.stopPropagation();
      self._lightboxStep(1);
    });
    this._onKeyLightbox = function (e) {
      if (!self._lightboxOpen) return;
      if (e.key === 'Escape') self.closeLightbox();
      else if (e.key === 'ArrowLeft') self._lightboxStep(-1);
      else if (e.key === 'ArrowRight') self._lightboxStep(1);
    };
    document.addEventListener('keydown', this._onKeyLightbox);

    // Pause autoplay on hover
    this.root.addEventListener('mouseenter', function () {
      self._stopAutoplay();
    });
    this.root.addEventListener('mouseleave', function () {
      if (!self._lightboxOpen) self._startAutoplay();
    });
  };

  CenteredCardGallery.prototype.openLightbox = function (index) {
    if (index == null) index = this.index;
    index = clamp(index, 0, Math.max(0, this._items.length - 1));
    var item = this._items[index];
    if (!item || !this.lightbox || !this.lightboxImg) return;

    this._lightboxOpen = true;
    this._stopAutoplay();

    this.lightboxImg.src = item.src;
    this.lightboxImg.alt = item.alt || '';

    this.lightbox.hidden = false;
    this.lightbox.removeAttribute('hidden');
    this.lightbox.setAttribute('aria-hidden', 'false');
    this.lightbox.classList.add('is-open');
    document.documentElement.classList.add('cg-lightbox-open');
    document.body.classList.add('cg-lightbox-open');

    if (index !== this.index) this.goTo(index, true);
  };

  CenteredCardGallery.prototype.closeLightbox = function () {
    if (!this._lightboxOpen) return;
    this._lightboxOpen = false;
    if (this.lightbox) {
      this.lightbox.hidden = true;
      this.lightbox.setAttribute('hidden', '');
      this.lightbox.setAttribute('aria-hidden', 'true');
      this.lightbox.classList.remove('is-open');
    }
    if (this.lightboxImg) {
      this.lightboxImg.removeAttribute('src');
    }
    document.documentElement.classList.remove('cg-lightbox-open');
    document.body.classList.remove('cg-lightbox-open');
    this._startAutoplay();
  };

  CenteredCardGallery.prototype._lightboxStep = function (delta) {
    var n = this._items.length;
    if (!n) return;
    var next = this.index + delta;
    if (this.opts.loop) {
      if (next < 0) next = n - 1;
      if (next >= n) next = 0;
    } else {
      next = clamp(next, 0, n - 1);
    }
    this.goTo(next, true);
    var item = this._items[next];
    if (item && this.lightboxImg) {
      this.lightboxImg.src = item.src;
      this.lightboxImg.alt = item.alt || '';
    }
  };

  CenteredCardGallery.prototype._onScroll = function () {
    var self = this;
    if (this._raf) return;
    this._raf = requestAnimationFrame(function () {
      self._raf = null;
      if (self._drag) return; // update active while dragging via snap on end
      self._syncActiveFromScroll();
    });
  };

  CenteredCardGallery.prototype._onResize = function () {
    var self = this;
    clearTimeout(this._resizeT);
    this._resizeT = setTimeout(function () {
      self.goTo(self.index, false);
    }, 100);
  };

  /** Scroll so card index is centered in the viewport */
  CenteredCardGallery.prototype._scrollToIndex = function (index, smooth) {
    var card = this._cards[index];
    if (!card || !this.viewport) return;

    var view = this.viewport;
    // offsetLeft relative to track; track is inside viewport
    var cardLeft = card.offsetLeft;
    var cardW = card.offsetWidth;
    var viewW = view.clientWidth;
    var target = cardLeft - (viewW - cardW) / 2;

    var max = view.scrollWidth - viewW;
    target = clamp(target, 0, Math.max(0, max));

    view.scrollTo({
      left: target,
      behavior: smooth ? 'smooth' : 'auto'
    });
  };

  CenteredCardGallery.prototype._nearestIndex = function () {
    var view = this.viewport;
    var viewRect = view.getBoundingClientRect();
    var centerX = viewRect.left + viewRect.width / 2;
    var best = 0;
    var bestDist = Infinity;

    for (var i = 0; i < this._cards.length; i++) {
      var r = this._cards[i].getBoundingClientRect();
      var c = r.left + r.width / 2;
      var d = Math.abs(c - centerX);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    }
    return best;
  };

  CenteredCardGallery.prototype._syncActiveFromScroll = function () {
    var i = this._nearestIndex();
    if (i !== this.index) this._setActive(i, false);
  };

  CenteredCardGallery.prototype._snapToNearest = function (smooth) {
    var i = this._nearestIndex();
    this.goTo(i, smooth);
  };

  CenteredCardGallery.prototype._setActive = function (index, scroll) {
    var prev = this.index;
    this.index = clamp(index, 0, Math.max(0, this._cards.length - 1));

    for (var i = 0; i < this._cards.length; i++) {
      var on = i === this.index;
      this._cards[i].classList.toggle('is-active', on);
      this._cards[i].classList.toggle('is-prev', i === this.index - 1);
      this._cards[i].classList.toggle('is-next', i === this.index + 1);
      this._cards[i].setAttribute('aria-current', on ? 'true' : 'false');
    }

    var dots = this.dotsEl.querySelectorAll('.cg-dot');
    for (var d = 0; d < dots.length; d++) {
      dots[d].classList.toggle('is-active', d === this.index);
    }

    if (scroll) this._scrollToIndex(this.index, true);

    if (prev !== this.index && typeof this.opts.onChange === 'function') {
      this.opts.onChange(this.index, this._cards[this.index]);
    }
  };

  CenteredCardGallery.prototype.goTo = function (index, smooth) {
    var n = this._cards.length;
    if (!n) return this;

    if (this.opts.loop) {
      if (index < 0) index = n - 1;
      if (index >= n) index = 0;
    } else {
      index = clamp(index, 0, n - 1);
    }

    this._setActive(index, false);
    this._scrollToIndex(index, !!smooth);
    return this;
  };

  CenteredCardGallery.prototype.next = function () {
    this._stopAutoplay();
    this.goTo(this.index + 1, true);
    this._startAutoplay();
    return this;
  };

  CenteredCardGallery.prototype.prev = function () {
    this._stopAutoplay();
    this.goTo(this.index - 1, true);
    this._startAutoplay();
    return this;
  };

  CenteredCardGallery.prototype._startAutoplay = function () {
    var self = this;
    this._stopAutoplay();
    if (!this.opts.autoplayMs || this._cards.length < 2) return;
    this._timer = setInterval(function () {
      self.goTo(self.index + 1, true);
    }, this.opts.autoplayMs);
  };

  CenteredCardGallery.prototype._stopAutoplay = function () {
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = null;
    }
  };

  CenteredCardGallery.prototype.destroy = function () {
    this.closeLightbox();
    this._stopAutoplay();
    window.removeEventListener('resize', this._onResize);
    if (this._onKeyLightbox) {
      document.removeEventListener('keydown', this._onKeyLightbox);
    }
    if (this.viewport) {
      this.viewport.removeEventListener('scroll', this._onScroll);
    }
    this.root.innerHTML = '';
  };

  /** Convenience: mount into selector with items array */
  CenteredCardGallery.mount = function (root, options) {
    var opts = options || {};
    var g = new CenteredCardGallery(root, opts);
    g.setItems(opts.items || []);
    return g;
  };

  /**
   * Load images.json then mount.
   * jsonUrl e.g. '../assets/img/verusminer/gallery/images.json'
   * basePath e.g. '../assets/img/verusminer/gallery'
   */
  CenteredCardGallery.fromJson = async function (root, jsonUrl, basePath, options) {
    var res = await fetch(jsonUrl);
    if (!res.ok) throw new Error('CenteredCardGallery: failed to load ' + jsonUrl);
    var names = await res.json();
    var base = (basePath || '').replace(/\/?$/, '/');
    var items = (names || []).map(function (name) {
      var src = base + name;
      return { src: src, href: src, alt: name };
    });
    var g = new CenteredCardGallery(root, options || {});
    g.setItems(items);
    return g;
  };

  global.CenteredCardGallery = CenteredCardGallery;
})(typeof window !== 'undefined' ? window : this);
