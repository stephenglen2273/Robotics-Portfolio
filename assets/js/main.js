(function () {
  "use strict";

  var data = window.PORTFOLIO || {};
  var profile = data.profile || {};
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === "text") node.textContent = attrs[k];
        else if (k === "html") node.innerHTML = attrs[k];
        else if (k === "class") node.className = attrs[k];
        else node.setAttribute(k, attrs[k]);
      });
    }
    (children || []).forEach(function (c) { if (c) node.appendChild(c); });
    return node;
  }

  function icon(name) {
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("class", "icon");
    var use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute("href", "#icon-" + name);
    svg.appendChild(use);
    return svg;
  }

  /* ---------- Profile fields ---------- */
  $$("[data-field]").forEach(function (node) {
    var v = profile[node.getAttribute("data-field")];
    if (v) node.textContent = v;
  });
  if (profile.name) document.title = profile.name + " · Robotics Portfolio";
  $("#year").textContent = new Date().getFullYear();

  var resume = $("#resume-link");
  if (profile.resume) resume.href = profile.resume; else resume.remove();

  var emailLink = $("#email-link");
  if (profile.email) emailLink.href = "mailto:" + profile.email; else emailLink.remove();

  function renderSocial(container) {
    (profile.social || []).filter(function (s) { return s.url; }).forEach(function (s) {
      var a = el("a", { href: s.url, target: "_blank", rel: "noopener", "aria-label": s.label, title: s.label });
      a.appendChild(icon(s.icon || "link"));
      container.appendChild(el("li", null, [a]));
    });
  }
  renderSocial($("#hero-social"));
  renderSocial($("#contact-social"));

  /* ---------- About ---------- */
  var aboutBody = $("#about-body");
  (profile.about || []).forEach(function (p) { aboutBody.appendChild(el("p", { text: p })); });

  var avatar = $("#avatar");
  if (profile.photo) {
    avatar.appendChild(el("img", { src: profile.photo, alt: profile.name || "" }));
  } else {
    var initials = (profile.name || "?").split(/\s+/).map(function (w) { return w[0]; }).join("").slice(0, 2).toUpperCase();
    avatar.appendChild(el("span", { text: initials }));
  }

  var facts = $("#facts");
  (profile.facts || []).forEach(function (f) {
    facts.appendChild(el("dt", { text: f[0] }));
    facts.appendChild(el("dd", { text: f[1] }));
  });

  /* ---------- Generated cover art (used when a project has no image) ---------- */
  function hash(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function coverSVG(title) {
    var h = hash(title);
    var hue = 170 + (h % 70); // teal → blue range
    var nodes = "";
    var pts = [];
    for (var i = 0; i < 7; i++) {
      var x = 30 + ((h >>> (i * 3)) % 340);
      var y = 25 + ((h >>> (i * 4 + 1)) % 175);
      pts.push([x, y]);
    }
    for (var j = 1; j < pts.length; j++) {
      nodes += '<line x1="' + pts[j - 1][0] + '" y1="' + pts[j - 1][1] + '" x2="' + pts[j][0] + '" y2="' + pts[j][1] + '" stroke="hsla(' + hue + ',80%,70%,.55)" stroke-width="1.5"/>';
    }
    pts.forEach(function (p, k) {
      nodes += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + (k === 0 || k === pts.length - 1 ? 6 : 3.5) + '" fill="hsl(' + hue + ',85%,72%)"/>';
    });
    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 225">' +
      '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="hsl(' + hue + ',45%,16%)"/><stop offset="1" stop-color="hsl(' + (hue + 30) + ',50%,9%)"/></linearGradient>' +
      '<pattern id="p" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="rgba(255,255,255,.06)"/></pattern></defs>' +
      '<rect width="400" height="225" fill="url(#g)"/><rect width="400" height="225" fill="url(#p)"/>' +
      nodes + "</svg>";
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }

  /* ---------- Projects ---------- */
  var projects = data.projects || [];
  var grid = $("#project-grid");
  var filters = $("#filters");
  var activeTag = "All";

  var tags = ["All"];
  projects.forEach(function (p) {
    (p.tags || []).forEach(function (t) { if (tags.indexOf(t) === -1) tags.push(t); });
  });

  tags.forEach(function (t) {
    var b = el("button", { class: "chip" + (t === "All" ? " active" : ""), type: "button", text: t, "aria-pressed": t === "All" ? "true" : "false" });
    b.addEventListener("click", function () {
      activeTag = t;
      $$(".chip", filters).forEach(function (c) {
        var on = c.textContent === t;
        c.classList.toggle("active", on);
        c.setAttribute("aria-pressed", on ? "true" : "false");
      });
      renderProjects();
    });
    filters.appendChild(b);
  });

  var LINK_META = {
    code: { label: "Code", icon: "github" },
    video: { label: "Video", icon: "play" },
    demo: { label: "Demo", icon: "link" },
    paper: { label: "Paper", icon: "link" },
    writeup: { label: "Write-up", icon: "link" }
  };

  function linkRow(links) {
    var row = el("div", { class: "card-links" });
    Object.keys(links || {}).forEach(function (k) {
      if (!links[k]) return;
      var meta = LINK_META[k] || { label: k, icon: "link" };
      var a = el("a", { href: links[k], target: "_blank", rel: "noopener" });
      a.appendChild(icon(meta.icon));
      a.appendChild(document.createTextNode(meta.label));
      a.addEventListener("click", function (e) { e.stopPropagation(); });
      row.appendChild(a);
    });
    return row;
  }

  function renderProjects() {
    grid.innerHTML = "";
    projects
      .filter(function (p) { return activeTag === "All" || (p.tags || []).indexOf(activeTag) !== -1; })
      .forEach(function (p) {
        var idx = projects.indexOf(p);
        var img = el("img", { src: p.image || coverSVG(p.title), alt: p.image ? p.title : "", loading: "lazy" });
        var media = el("div", { class: "card-media" }, [img]);
        if (p.featured) media.appendChild(el("span", { class: "badge mono", text: "Featured" }));

        var tagList = el("ul", { class: "tags" });
        (p.tags || []).forEach(function (t) { tagList.appendChild(el("li", { class: "mono", text: t })); });

        var body = el("div", { class: "card-body" }, [
          el("div", { class: "card-meta mono", text: p.year || "" }),
          el("h3", { text: p.title }),
          el("p", { text: p.summary || "" }),
          tagList,
          linkRow(p.links)
        ]);

        var card = el("article", { class: "card reveal", tabindex: "0", role: "button", "aria-label": "Open details: " + p.title }, [media, body]);
        card.addEventListener("click", function () { openProject(idx); });
        card.addEventListener("keydown", function (e) {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openProject(idx); }
        });
        grid.appendChild(card);
      });
    observeReveals();
  }

  /* ---------- Modal ---------- */
  var modal = $("#project-modal");
  var modalBody = $("#modal-body");

  function toEmbed(url) {
    var m = url && url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{6,})/);
    return m ? "https://www.youtube-nocookie.com/embed/" + m[1] : null;
  }

  function openProject(i) {
    var p = projects[i];
    modalBody.innerHTML = "";
    var embed = p.links && toEmbed(p.links.video);
    if (embed) {
      modalBody.appendChild(el("div", { class: "modal-video" }, [
        el("iframe", { src: embed, title: p.title + " video", allow: "accelerometer; encrypted-media; gyroscope; picture-in-picture", allowfullscreen: "" })
      ]));
    } else {
      modalBody.appendChild(el("img", { class: "modal-img", src: p.image || coverSVG(p.title), alt: p.image ? p.title : "" }));
    }
    modalBody.appendChild(el("div", { class: "card-meta mono", text: [p.year].concat(p.tags || []).filter(Boolean).join(" · ") }));
    modalBody.appendChild(el("h3", { id: "modal-title", text: p.title }));
    (p.details && p.details.length ? p.details : [p.summary]).forEach(function (d) {
      modalBody.appendChild(el("p", { text: d }));
    });
    if (p.highlights && p.highlights.length) {
      var ul = el("ul", { class: "highlights" });
      p.highlights.forEach(function (h) { ul.appendChild(el("li", { text: h })); });
      modalBody.appendChild(ul);
    }
    modalBody.appendChild(linkRow(p.links));
    if (typeof modal.showModal === "function") modal.showModal(); else modal.setAttribute("open", "");
    document.body.classList.add("no-scroll");
  }

  function closeModal() {
    if (modal.open) modal.close();
  }
  modal.addEventListener("close", function () {
    document.body.classList.remove("no-scroll");
    modalBody.innerHTML = ""; // stops any playing video
  });
  $("#modal-close").addEventListener("click", closeModal);
  modal.addEventListener("click", function (e) { if (e.target === modal) closeModal(); });

  /* ---------- Skills ---------- */
  var skillGrid = $("#skill-grid");
  (data.skills || []).forEach(function (g) {
    var ul = el("ul");
    g.items.forEach(function (s) { ul.appendChild(el("li", { text: s })); });
    skillGrid.appendChild(el("div", { class: "skill-card reveal" }, [el("h3", { class: "mono", text: g.group }), ul]));
  });

  /* ---------- Timeline ---------- */
  var timeline = $("#timeline");
  (data.timeline || []).forEach(function (t) {
    timeline.appendChild(el("li", { class: "reveal" }, [
      el("div", { class: "when mono", text: t.when }),
      el("h3", { text: t.title }),
      el("div", { class: "org", text: t.org || "" }),
      t.text ? el("p", { text: t.text }) : null
    ]));
  });

  /* ---------- Reveal on scroll ---------- */
  var io = "IntersectionObserver" in window
    ? new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
        });
      }, { threshold: 0.12 })
    : null;
  function observeReveals() {
    $$(".reveal:not(.in)").forEach(function (n) { if (io) io.observe(n); else n.classList.add("in"); });
  }

  renderProjects();

  /* ---------- Nav: mobile menu, scroll state, active link ---------- */
  var toggle = $(".nav-toggle");
  var links = $("#nav-links");
  toggle.addEventListener("click", function () {
    var open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  $$("a", links).forEach(function (a) {
    a.addEventListener("click", function () { links.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); });
  });

  var header = $(".site-header");
  var sections = $$("main section[id]");
  function onScroll() {
    header.classList.toggle("scrolled", window.scrollY > 10);
    var pos = window.scrollY + 120;
    var current = "";
    sections.forEach(function (s) { if (s.offsetTop <= pos) current = s.id; });
    $$("a", links).forEach(function (a) { a.classList.toggle("active", a.getAttribute("href") === "#" + current); });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Theme toggle ---------- */
  $("#theme-toggle").addEventListener("click", function () {
    var root = document.documentElement;
    var current = root.getAttribute("data-theme") ||
      (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    var next = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
    drawGrid();
  });

  /* ---------- Hero background: animated node graph ---------- */
  var canvas = $("#hero-grid");
  var ctx = canvas.getContext("2d");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var dots = [];
  var w = 0, hgt = 0, raf = null;

  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth; hgt = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = hgt * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var count = Math.round(Math.min(70, (w * hgt) / 16000));
    dots = [];
    for (var i = 0; i < count; i++) {
      dots.push({ x: Math.random() * w, y: Math.random() * hgt, vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3 });
    }
  }

  function drawGrid() {
    var accent = getComputedStyle(document.documentElement).getPropertyValue("--accent-rgb").trim() || "45,212,191";
    ctx.clearRect(0, 0, w, hgt);
    for (var i = 0; i < dots.length; i++) {
      var a = dots[i];
      for (var j = i + 1; j < dots.length; j++) {
        var b = dots[j];
        var dx = a.x - b.x, dy = a.y - b.y, d = dx * dx + dy * dy;
        if (d < 16000) {
          ctx.strokeStyle = "rgba(" + accent + "," + (0.18 * (1 - d / 16000)) + ")";
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
      ctx.fillStyle = "rgba(" + accent + ",0.55)";
      ctx.beginPath(); ctx.arc(a.x, a.y, 1.8, 0, Math.PI * 2); ctx.fill();
    }
  }

  function tick() {
    dots.forEach(function (d) {
      d.x += d.vx; d.y += d.vy;
      if (d.x < 0 || d.x > w) d.vx *= -1;
      if (d.y < 0 || d.y > hgt) d.vy *= -1;
    });
    drawGrid();
    raf = requestAnimationFrame(tick);
  }

  resize();
  if (reduce) drawGrid(); else tick();
  window.addEventListener("resize", function () { resize(); if (reduce) drawGrid(); });
  document.addEventListener("visibilitychange", function () {
    if (reduce) return;
    if (document.hidden) cancelAnimationFrame(raf); else tick();
  });
})();
