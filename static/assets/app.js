/* =========================================================================
   a1ohadance // GLITCH · DATAMOSH  —  shared behaviour
   - reassemble-from-noise boot on the main glitch heading
   - periodic glitch bursts + scan-tear on the hero title
   - demo (non-functional) contact form handler
   Respects prefers-reduced-motion: NO glitch animation, static RGB-split.
   No remote requests.
   ========================================================================= */
(function(){
  "use strict";

  var reduce = window.matchMedia &&
               window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // shared: true while the mobile menu is open. The home wallpaper pauses its canvas loop then, so the
  // continuously-animating fixed canvas doesn't make iOS Safari composite the menu blurry (home-only bug).
  var menuOpen = false;

  /* -------------------------------------------------------------------
     1. BOOT REASSEMBLE — runs on the primary glitch heading of a page.
        Targets (in priority order): .glitch-title, .post-h1, .page-title
     ------------------------------------------------------------------- */
  function bootTitle(title){
    if(!title) return;

    var charset = "01<>#%&$@/\\|=+*ABCDEF0x";
    var rnd = function(){ return charset[Math.floor(Math.random()*charset.length)]; };

    // The "real" words come from the existing span text (or the element text).
    var spans = title.querySelectorAll("span");
    var hasSpans = spans.length > 0;
    var realText;
    if(hasSpans){
      realText = Array.prototype.map.call(spans, function(s){ return s.textContent; });
    } else {
      realText = [title.textContent];
    }

    title.classList.add("boot");
    var bootStart = performance.now();
    var bootDur = 620;

    function setWords(words){
      if(hasSpans){
        spans.forEach(function(sp, idx){ sp.textContent = words[idx]; });
      } else {
        title.textContent = words[0];
      }
    }

    function bootTick(now){
      var t = (now - bootStart) / bootDur;
      if(t >= 1){ setWords(realText); return; }
      var out = realText.map(function(word){
        var locked = Math.floor(word.length * t);
        var s = "";
        for(var i=0;i<word.length;i++){
          s += (i < locked) ? word[i] : (word[i] === " " ? " " : rnd());
        }
        return s;
      });
      setWords(out);
      requestAnimationFrame(bootTick);
    }
    requestAnimationFrame(bootTick);

    setTimeout(function(){ title.classList.remove("boot"); }, bootDur + 60);
  }

  /* -------------------------------------------------------------------
     2. PERIODIC BURSTS + SCAN-TEAR — only on the hero .glitch-title.
     ------------------------------------------------------------------- */
  function getCSS(v){
    return getComputedStyle(document.documentElement).getPropertyValue(v).trim();
  }

  function wireBursts(title){
    if(!title) return;
    var tear  = document.querySelector(".scan-tear");
    var slice = tear ? tear.querySelector(".slice") : null;

    function burst(){
      if(document.hidden){ scheduleBurst(); return; }
      title.classList.add("burst");
      if(Math.random() < 0.85 && slice){
        var top   = (8 + Math.random()*74);
        var h     = (8 + Math.random()*26);
        var shift = (Math.random()*44 - 22);
        slice.style.top = top + "%";
        slice.style.height = h + "%";
        slice.style.transform = "scaleX(.92) translateX(" + shift + "px)";
        slice.style.color = [getCSS("--r"),getCSS("--c"),getCSS("--m")][Math.floor(Math.random()*3)];
        tear.classList.add("active");
        setTimeout(function(){ tear.classList.remove("active"); }, 360);
      }
      setTimeout(function(){ title.classList.remove("burst"); }, 440);
      scheduleBurst();
    }
    function scheduleBurst(){
      var next = 1200 + Math.random()*2200;   // datamosh: bursts every ~1.2-3.4s
      setTimeout(burst, next);
    }
    setTimeout(scheduleBurst, 620 + 1400);
  }

  /* -------------------------------------------------------------------
     3. DEMO CONTACT FORM — non-functional; shows a faux "transmission".
     ------------------------------------------------------------------- */
  function wireForm(){
    var form = document.getElementById("contact-form");
    if(!form) return;
    var status = document.getElementById("form-status");
    form.addEventListener("submit", function(e){
      e.preventDefault();
      if(status){
        status.textContent = "// transmission not sent — this is a demo form. Use a channel below.";
      }
    });
  }

  /* -------------------------------------------------------------------
     4. CLIENT-SIDE SEARCH — simple filter over .posts cards on the home
        page. Works without JS (shows all); with JS it hides non-matches.
     ------------------------------------------------------------------- */
  function wireSearch(){
    var input = document.getElementById("post-search");
    if(!input) return;
    var scope = document.getElementById(input.getAttribute("data-target") || "");
    if(!scope) return;
    var cards = Array.prototype.slice.call(scope.querySelectorAll(".card"));
    var empty = document.getElementById("search-empty");

    function haystack(card){
      return (card.textContent || "").toLowerCase();
    }
    input.addEventListener("input", function(){
      var q = input.value.trim().toLowerCase();
      var shown = 0;
      cards.forEach(function(card){
        // never surface the corrupted placeholder cards in a search
        if(card.classList.contains("corrupted")){
          card.hidden = q.length > 0;
          return;
        }
        var match = q === "" || haystack(card).indexOf(q) !== -1;
        card.hidden = !match;
        if(match) shown++;
      });
      if(empty){ empty.style.display = (shown === 0) ? "block" : "none"; }
    });
  }

  /* -------------------------------------------------------------------
     5. VISITOR COUNTER — playful, offline. Persists a per-browser count
        in localStorage; falls back to a stable pseudo number if blocked.
     ------------------------------------------------------------------- */
  function wireCounter(){
    var el = document.getElementById("visitor-count");
    if(!el) return;
    var base = 13370; // fun baseline
    var n;
    try{
      var key = "a1ohadance_visits";
      n = parseInt(localStorage.getItem(key) || "", 10);
      if(isNaN(n)) n = base + Math.floor(Math.random()*420);
      n += 1;
      localStorage.setItem(key, String(n));
    }catch(e){
      n = base + 256; // storage blocked — stable fallback
    }
    el.textContent = String(n).padStart(6, "0");
  }

  /* -------------------------------------------------------------------
     6. TIP OF THE DAY — rotates through defensive-security tips.
        prefers-reduced-motion: show ONE static tip, no rotation.
     ------------------------------------------------------------------- */
  var TIPS = [
    "Use a password manager — don't let your browser store passwords.",
    "Turn on MFA everywhere. A stolen password is useless without the second factor.",
    "Treat cracked software like a gift-wrapped trojan.",
    "Session cookies can bypass MFA — log out and clear them on shared machines.",
    "Check your emails on Have I Been Pwned regularly."
  ];
  function wireTip(){
    var body = document.getElementById("tip-body");
    if(!body) return;
    // start on a date-stable index so "tip of the day" is consistent per day
    var start = (new Date()).getDate() % TIPS.length;
    var i = start;
    body.textContent = TIPS[i];

    if(reduce) return; // static tip only — no rotation.

    setInterval(function(){
      if(document.hidden) return;
      i = (i + 1) % TIPS.length;
      body.classList.remove("swap");
      // force reflow so the animation can re-trigger
      void body.offsetWidth;
      body.textContent = TIPS[i];
      body.classList.add("swap");
    }, 6000);
  }

  /* -------------------------------------------------------------------
     7. READING TIME — count words in the article body and write
        "· X min read" into the meta line (~200 wpm). Static fallback in
        the HTML covers JS-off; this just refines it from the real count.
     ------------------------------------------------------------------- */
  function wireReadingTime(){
    var slot = document.getElementById("read-time");
    if(!slot) return;
    var body = document.querySelector(".reading .prose") ||
               document.querySelector(".prose");
    if(!body) return;
    var words = (body.textContent || "").trim().split(/\s+/).filter(Boolean).length;
    var mins = Math.max(1, Math.round(words / 200));
    slot.textContent = mins + " min read";
  }

  /* -------------------------------------------------------------------
     8. TABLE OF CONTENTS — find h2/h3 in the article, slug + id them,
        and populate the (sidebar + collapsible) TOC lists. Smooth-scroll
        is handled by CSS (html{scroll-behavior:smooth}); reduced-motion
        disables it. Highlights the current section via IntersectionObserver.
     ------------------------------------------------------------------- */
  function slugify(text){
    return (text || "")
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")   // drop punctuation / glyphs
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || "section";
  }

  function wireTOC(){
    var prose = document.querySelector(".reading .prose") ||
                document.querySelector(".prose");
    if(!prose) return;
    var lists = document.querySelectorAll("[data-toc-list]");
    if(!lists.length) return;

    var headings = Array.prototype.slice.call(
      prose.querySelectorAll("h2, h3")
    );
    if(headings.length < 2){
      // not enough structure to bother — leave the TOC containers hidden
      var layoutEmpty = document.querySelector(".reading-layout");
      if(layoutEmpty) layoutEmpty.classList.remove("has-toc");
      document.querySelectorAll(".post-toc").forEach(function(t){
        t.style.display = "none";
      });
      return;
    }

    var used = {};
    var entries = headings.map(function(h){
      var label = h.textContent.trim();
      var id = h.id;
      if(!id){
        id = slugify(label);
        while(used[id]){ id = id + "-x"; }
        h.id = id;
      }
      used[id] = true;
      return { id:id, label:label, level: h.tagName === "H3" ? 3 : 2 };
    });

    function buildInto(ul){
      ul.textContent = "";
      entries.forEach(function(e){
        var li = document.createElement("li");
        if(e.level === 3) li.className = "toc-sub";
        var a = document.createElement("a");
        a.href = "#" + e.id;
        a.textContent = e.label;
        li.appendChild(a);
        ul.appendChild(li);
      });
    }
    lists.forEach(buildInto);

    var layout = document.querySelector(".reading-layout");
    if(layout) layout.classList.add("has-toc");

    // collapse the mobile TOC after a click (so the page jumps cleanly)
    document.querySelectorAll(".toc-collapse .toc-list a").forEach(function(a){
      a.addEventListener("click", function(){
        var det = a.closest("details.toc-collapse");
        if(det) det.open = false;
      });
    });

    // active-section highlight (sidebar). Skips quietly if unsupported.
    if("IntersectionObserver" in window){
      var linkMap = {};
      document.querySelectorAll("[data-toc-list] a").forEach(function(a){
        var key = a.getAttribute("href").slice(1);
        (linkMap[key] = linkMap[key] || []).push(a);
      });
      var current = null;
      var io = new IntersectionObserver(function(obs){
        obs.forEach(function(en){
          if(en.isIntersecting){
            var id = en.target.id;
            if(id === current) return;
            if(current && linkMap[current]){
              linkMap[current].forEach(function(a){ a.removeAttribute("aria-current"); });
            }
            current = id;
            if(linkMap[id]){
              linkMap[id].forEach(function(a){ a.setAttribute("aria-current", "true"); });
            }
          }
        });
      }, { rootMargin: "-80px 0px -70% 0px", threshold: 0 });
      entries.forEach(function(e){
        var el = document.getElementById(e.id);
        if(el) io.observe(el);
      });
    }
  }

  /* -------------------------------------------------------------------
     init
     ------------------------------------------------------------------- */
  /* -------------------------------------------------------------------
     HUD terminal — cycles through commands in random order with a
     type-in effect and a brief glitch-scramble on the way out.
     Respects prefers-reduced-motion (shows one static command).
     ------------------------------------------------------------------- */
  function wireHudTerminal(){
    var el = document.querySelector(".hud-status .cmds");
    if(!el) return;
    var cmds = [
      "./recon --hunt",
      "nmap -sV 10.0.0.0/24",
      "john hash.txt",
      "tcpdump -i eth0 -nn",
      "cat stealer.log",
      "msfconsole -x run",
      "curl c2.local/beacon",
      "hunt --signal=live",
      "strings dump.bin",
      "tshark -r cap.pcap"
    ];
    if(reduce){ el.textContent = cmds[0]; return; }

    var colors = ["#dfeee7", getCSS("--c"), getCSS("--m"), getCSS("--g")];
    var glitch = "█▓▒#%@!?/\\";
    function rnd(n){ return Math.floor(Math.random()*n); }
    function pick(a){ return a[rnd(a.length)]; }
    var last = -1;
    function nextCmd(){ var i; do{ i = rnd(cmds.length); }while(i===last && cmds.length>1); last=i; return cmds[i]; }
    function scramble(s){ var o=""; for(var i=0;i<s.length;i++){ o += (s[i]===" ") ? " " : (Math.random()<0.5 ? glitch[rnd(glitch.length)] : s[i]); } return o; }

    function type(cmd, done){
      el.style.color = pick(colors);
      var i = 0;
      (function step(){
        el.textContent = cmd.slice(0, i++);
        if(i <= cmd.length) setTimeout(step, 26 + rnd(36));
        else setTimeout(done, 1500 + rnd(1100));
      })();
    }
    function out(cmd, done){
      el.style.color = getCSS("--r");
      var n = 0;
      (function step(){
        el.textContent = scramble(cmd);
        if(++n < 4) setTimeout(step, 60);
        else { el.textContent = ""; setTimeout(done, 200); }
      })();
    }
    (function cycle(){ var c = nextCmd(); type(c, function(){ out(c, cycle); }); })();
  }

  /* -------------------------------------------------------------------
     Page background FX — spawns datamosh blocks + flickering pixels at
     random positions / colours / sizes / timing. Slow, subtle, capped.
     ------------------------------------------------------------------- */
  function wirePageFx(){
    var host = document.querySelector(".page-fx");
    if(!host || reduce) return;
    var colors = [getCSS("--c"), getCSS("--m"), getCSS("--r"), getCSS("--g")];
    function rnd(a,b){ return a + Math.random()*(b-a); }
    function ri(a,b){ return Math.floor(rnd(a,b+1)); }
    function spawnOne(life){
      var blk = Math.random() < 0.5;
      var el = document.createElement("span");
      el.className = blk ? "fx-blk" : "fx-px";
      el.style.background = colors[ri(0,colors.length-1)];
      el.style.setProperty("--peak", (blk ? rnd(.14,.3) : rnd(.4,.65)).toFixed(3));
      el.style.width  = (blk ? ri(110,300) : ri(12,64)) + "px";
      el.style.height = (blk ? ri(16,40) : ri(8,20)) + "px";
      el.style.top  = rnd(3,93).toFixed(1) + "%";
      el.style.left = rnd(0,92).toFixed(1) + "%";
      el.style.setProperty("--dx", ((Math.random()<0.5?-1:1) * ri(22,56)) + "px");
      var dur = rnd(280, 720) / 1000;   // short, snappy — a rapid glitch flash
      el.style.animation = (blk ? "fx-blk-life " : "fx-px-life ") + dur.toFixed(2) + "s steps(" + ri(5,9) + ") forwards";
      el.addEventListener("animationend", function(){ el.remove(); });
      host.appendChild(el);
    }
    /* one glitch burst (1-3s of activity), then a quiet gap, then repeat — forever */
    function burst(){
      if(document.hidden){ setTimeout(burst, 1600); return; }   // don't spawn while tab hidden
      var glitchDur = rnd(1000, 3000);          // burst window ~1-3s
      var count = ri(4, 9);                       // rapid glitches that snap in/out during the window
      for(var i=0;i<count;i++){
        setTimeout(function(){ spawnOne(glitchDur); }, rnd(0, glitchDur*0.7));
      }
      var quiet = rnd(1000, 2200);               // then quiet for ~1-2s
      setTimeout(burst, glitchDur + quiet);
    }
    burst();
  }

  /* -------------------------------------------------------------------
     Idle-process PONG — a self-playing game on the hero canvas.
     ------------------------------------------------------------------- */
  function wirePong(){
    var cv = document.querySelector(".arcade-screen");
    if(!cv || !cv.getContext) return;
    var ctx = cv.getContext("2d");
    var W = cv.width, H = cv.height;
    var cyan = getCSS("--c") || "#00e5ff", mag = getCSS("--m") || "#ff35e0", muted = getCSS("--muted") || "#7a7a82";
    var pw = 6, ph = 32, pad = 14;
    var ly = H/2 - ph/2, ry = H/2 - ph/2, sl = 0, sr = 0, ball;
    function reset(dir){ ball = {x:W/2, y:H/2, vx:dir*3.4, vy:(Math.random()*2-1)*2.4}; }
    function draw(){
      ctx.clearRect(0,0,W,H);
      ctx.fillStyle = "rgba(122,122,130,.35)";
      for(var y=8;y<H;y+=16){ ctx.fillRect(W/2-1, y, 2, 8); }
      ctx.fillStyle = muted; ctx.font = "bold 22px ui-monospace,monospace"; ctx.textAlign = "center";
      ctx.fillText(sl, W/2-46, 30); ctx.fillText(sr, W/2+46, 30);
      ctx.fillStyle = cyan; ctx.fillRect(pad, ly, pw, ph);
      ctx.fillStyle = mag; ctx.fillRect(W-pad-pw, ry, pw, ph);
      ctx.fillStyle = "#fff"; ctx.fillRect(ball.x-3, ball.y-3, 6, 6);
    }
    reset(1);
    if(reduce){ draw(); return; }
    var raf=0, running=false, inView=true;
    function step(){
      ball.x += ball.vx; ball.y += ball.vy;
      if(ball.y < 4){ ball.y = 4; ball.vy = Math.abs(ball.vy); }
      if(ball.y > H-4){ ball.y = H-4; ball.vy = -Math.abs(ball.vy); }
      ly += ((ball.y - ph/2 + Math.sin(ball.x*0.05)*7) - ly) * 0.085;
      ry += ((ball.y - ph/2 + Math.cos(ball.x*0.04)*7) - ry) * 0.085;
      ly = Math.max(0, Math.min(H-ph, ly)); ry = Math.max(0, Math.min(H-ph, ry));
      if(ball.vx < 0 && ball.x-3 <= pad+pw && ball.y > ly && ball.y < ly+ph){ ball.vx = Math.abs(ball.vx); ball.vy += (ball.y-(ly+ph/2))*0.05; }
      if(ball.vx > 0 && ball.x+3 >= W-pad-pw && ball.y > ry && ball.y < ry+ph){ ball.vx = -Math.abs(ball.vx); ball.vy += (ball.y-(ry+ph/2))*0.05; }
      if(ball.x < -4){ sr++; reset(1); }
      else if(ball.x > W+4){ sl++; reset(-1); }
      draw();
      raf=requestAnimationFrame(step);
    }
    function gate(){               // run only when on-screen AND tab visible
      var on = inView && !document.hidden;
      if(on && !running){ running=true; raf=requestAnimationFrame(step); }
      else if(!on && running){ running=false; if(raf) cancelAnimationFrame(raf); raf=0; }
    }
    if("IntersectionObserver" in window){
      new IntersectionObserver(function(es){ inView=es[0].isIntersecting; gate(); },{threshold:0}).observe(cv);
    }
    document.addEventListener("visibilitychange", gate);
    gate();
  }

  /* -----------------------------------------------------------------
     Mobile nav: glitch toggle opens/closes the dropdown menu.
     Works regardless of reduced-motion (purely functional).
     ----------------------------------------------------------------- */
  /* reusable scramble→resolve on one element's text (preserves inline markup) */
  function scrambleText(el, dur){
    if(!el) return;
    var w=document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null), n, tns=[];
    while((n=w.nextNode())){ if(/\S/.test(n.nodeValue)) tns.push(n); }
    if(!tns.length) return;
    var reals=tns.map(function(x){ return x.nodeValue; });
    var total=reals.reduce(function(a,s){ return a+s.length; },0);
    dur=dur||Math.min(900,300+total*12);
    var GC="01<>#%&$@/\\|=+*ABCDEF0x", start=performance.now();
    el.classList.add("dec-on");
    (function tick(now){
      var t=(now-start)/dur;
      if(t>=1){ for(var j=0;j<tns.length;j++) tns[j].nodeValue=reals[j]; el.classList.remove("dec-on"); return; }
      var locked=Math.floor(total*t), c=0;
      for(var i=0;i<tns.length;i++){
        var real=reals[i], s="";
        for(var k=0;k<real.length;k++){
          var ch=real[k];
          s += (c<locked||ch===" "||ch==="\n"||ch==="\t") ? ch : (Math.random()<0.85 ? GC[Math.floor(Math.random()*GC.length)] : ch);
          c++;
        }
        tns[i].nodeValue=s;
      }
      requestAnimationFrame(tick);
    })(performance.now());
  }

  /* live connection-trace recon (home hero). client-side only, nothing stored. */
  function wireRecon(){
    var box=document.getElementById("recon");
    if(!box) return;
    var elIp=document.getElementById("rc-ip"),elGeo=document.getElementById("rc-geo"),
        elIsp=document.getElementById("rc-isp"),elDev=document.getElementById("rc-dev"),
        elScr=document.getElementById("rc-scr"),elTz=document.getElementById("rc-tz"),
        elState=document.getElementById("recon-state");
    function set(el,txt){ if(!el) return; var v=txt||"unknown"; el.setAttribute("data-real",v); el.textContent=v; if(!reduce) scrambleText(el,560); }
    function geoStr(city,country,cc){ var g=[city,country].filter(Boolean).join(", "); return g+(cc?" ["+cc+"]":""); }
    function device(){
      var ua=navigator.userAgent||"",os="unknown",br="unknown",m;
      if(/Windows NT/.test(ua))os="Windows";
      else if(/Android/.test(ua)){ os="Android"; if((m=ua.match(/Android (\d+)/)))os+=" "+m[1]; }
      else if(/iPhone|iPad|iPod/.test(ua))os="iOS";
      else if(/Mac OS X/.test(ua))os="macOS";
      else if(/Linux/.test(ua))os="Linux";
      if(/Edg\//.test(ua))br="Edge";
      else if(/OPR\/|Opera/.test(ua))br="Opera";
      else if((m=ua.match(/Chrome\/(\d+)/)))br="Chrome "+m[1];
      else if((m=ua.match(/Firefox\/(\d+)/)))br="Firefox "+m[1];
      else if(/Safari\//.test(ua))br="Safari";
      return br+" · "+os;
    }
    /* device fingerprint — no API, just the browser snitching on itself */
    setTimeout(function(){
      set(elDev, device());
      set(elScr, (screen.width||0)+"×"+(screen.height||0)+" @"+(window.devicePixelRatio||1)+"x");
      var tz="unknown"; try{ tz=Intl.DateTimeFormat().resolvedOptions().timeZone; }catch(e){}
      set(elTz, tz);
    }, 650);

    function lock(){
      elState.textContent="TARGET LOCKED"; elState.className="recon-state lock";
      box.classList.add("locked","hit");
      setTimeout(function(){ box.classList.remove("hit"); }, 650);
      if(!reduce){ setInterval(function(){          // "live monitoring" flicker (drift-proof)
        if(document.hidden) return;
        var vs=box.querySelectorAll(".recon-body .v[data-real]");
        if(!vs.length) return;
        var el=vs[Math.floor(Math.random()*vs.length)];
        el.textContent=el.getAttribute("data-real"); // reset to real before scrambling
        scrambleText(el,240);
      }, 6500); }
    }
    function fail(){
      elState.textContent="EVADED"; elState.className="recon-state fail";
      box.classList.add("locked","hit");
      setTimeout(function(){ box.classList.remove("hit"); }, 650);
      set(elIp,"—"); set(elGeo,"connection masked"); set(elIsp,"VPN / proxy / Tor?");
    }
    fetch("https://get.geojs.io/v1/ip/geo.json").then(function(r){ if(!r.ok) throw 0; return r.json(); })
      .then(function(d){ set(elIp,d.ip); set(elGeo,geoStr(d.city,d.country,d.country_code)); set(elIsp,d.organization_name||d.organization); lock(); })
      .catch(function(){
        fetch("https://ipapi.co/json/").then(function(r){ if(!r.ok) throw 0; return r.json(); })
          .then(function(d){ if(d.error) throw 0; set(elIp,d.ip); set(elGeo,geoStr(d.city,d.country_name,d.country_code)); set(elIsp,d.org); lock(); })
          .catch(fail);
      });
  }

  /* live threat-intel ticker — recent security stories (HN), scrolling marquee */
  function wireFeed(){
    var track=document.getElementById("feed-track");
    if(!track) return;
    var cut=Math.floor(Date.now()/1000)-90*86400;
    var kws=["malware","ransomware","vulnerability","data breach","exploit","phishing","zero-day"];
    function esc(s){ return String(s).replace(/[&<>"']/g,function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); }
    Promise.all(kws.map(function(q){
      return fetch("https://hn.algolia.com/api/v1/search?tags=story&hitsPerPage=5&query="+encodeURIComponent(q)+"&numericFilters=created_at_i%3E"+cut)
        .then(function(r){ return r.ok?r.json():{hits:[]}; }).catch(function(){ return {hits:[]}; });
    })).then(function(res){
      var seen={},items=[];
      res.forEach(function(x){ (x.hits||[]).forEach(function(h){ if(h.title&&!seen[h.objectID]){ seen[h.objectID]=1; items.push(h); } }); });
      items.sort(function(a,b){ return (b.created_at_i||0)-(a.created_at_i||0); });
      items=items.slice(0,16);
      if(!items.length){ track.innerHTML='<span class="feed-msg">▸ threat feed offline · retry later</span>'; return; }
      var frag="";
      items.forEach(function(h){
        var url=h.url||("https://news.ycombinator.com/item?id="+h.objectID), src="news.yc";
        try{ if(h.url) src=new URL(h.url).hostname.replace(/^www\./,""); }catch(e){}
        frag+='<span class="sep" aria-hidden="true">▸</span><a href="'+url+'" target="_blank" rel="noopener noreferrer">'+esc(h.title)+' <span class="src">· '+esc(src)+'</span></a>';
      });
      track.innerHTML=frag+frag; // duplicate for a seamless loop
      var w=track.scrollWidth/2;
      track.style.animationDuration=Math.max(30,Math.round(w/55))+"s";
      // pause the marquee when off-screen or tab hidden (perf/battery)
      var feed=document.getElementById("threatfeed")||track.parentNode, feedIn=true;
      function fgate(){ track.style.animationPlayState=(document.hidden||!feedIn)?"paused":"running"; }
      if("IntersectionObserver" in window){
        new IntersectionObserver(function(es){ feedIn=es[0].isIntersecting; fgate(); },{threshold:0}).observe(feed);
      }
      document.addEventListener("visibilitychange", fgate);
      fgate();
    });
  }

  /* animate the hero stat numbers counting up, with a glitch lock */
  function wireCounters(){
    var els=document.querySelectorAll(".stat-row .stat b");
    if(!els.length) return;
    function run(b){
      var m=(b.textContent||"").trim().match(/^(\d+)(.*)$/);
      if(!m) return;
      var target=parseInt(m[1],10), suf=m[2]||"";
      if(reduce){ b.textContent=target+suf; return; }
      var dur=2000, start=performance.now();
      b.classList.add("counting");
      (function tick(now){
        var t=Math.min(1,(now-start)/dur);
        b.textContent=Math.round(target*(1-Math.pow(1-t,3)))+suf;
        if(t<1) requestAnimationFrame(tick);
        else { b.textContent=target+suf; b.classList.remove("counting"); }
      })(start);
    }
    if("IntersectionObserver" in window){
      var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ io.unobserve(e.target); run(e.target); } }); },{threshold:.4});
      Array.prototype.forEach.call(els,function(b){ io.observe(b); });
    } else { Array.prototype.forEach.call(els,run); }
  }

  /* typewriter rotating role in the hero tagline */
  function wireTypeRole(){
    var el=document.getElementById("role-rotate");
    if(!el) return;
    var roles=["Threat Hunter","Ethical Hacker","Artifacts Developer","Purple Teamer","Gepuk Enjoyer"];
    if(reduce){ el.textContent=roles[0]; return; }
    var ri=0, ci=0, del=false;
    (function tick(){
      var w=roles[ri];
      if(!del){
        el.textContent=w.slice(0,++ci);
        if(ci===w.length){ del=true; setTimeout(tick,1700); return; }
        setTimeout(tick,70+Math.random()*60);
      } else {
        el.textContent=w.slice(0,--ci);
        if(ci===0){ del=false; ri=(ri+1)%roles.length; setTimeout(tick,360); return; }
        setTimeout(tick,38);
      }
    })();
  }

  /* pause the global-recognition ops map animations when off-screen / tab hidden */
  function wireOpsMap(){
    if(reduce || !("IntersectionObserver" in window)) return;
    var sec=document.querySelector(".opsmap-sec");
    if(!sec) return;
    var inView=true;
    function g(){ sec.classList.toggle("idle", !inView || document.hidden); }
    new IntersectionObserver(function(es){ inView=es[0].isIntersecting; g(); },{threshold:0}).observe(sec);
    document.addEventListener("visibilitychange", g);
    g();
  }

  /* skills line: rolling decrypt — one chip re-scrambles & resolves at a time */
  function wireSkillsDecrypt(){
    if(reduce) return;
    var caps=Array.prototype.slice.call(document.querySelectorAll(".cap-line .cap"));
    if(!caps.length) return;
    var origs=caps.map(function(c){ return c.textContent; }); // canonical text, captured once
    var i=0;
    (function loop(){
      if(document.hidden){ setTimeout(loop, 1500); return; }
      var idx=i % caps.length;
      caps[idx].textContent=origs[idx]; // reset to original before scrambling (drift-proof)
      scrambleText(caps[idx], 600);
      i++;
      setTimeout(loop, 1400+Math.random()*900);
    })();
  }

  /* mobile: fire the card glitch on scroll-in (touch has no :hover) */
  function wireCardFx(){
    if(reduce || !("IntersectionObserver" in window)) return;
    var noHover = window.matchMedia && window.matchMedia("(hover: none)").matches;
    if(!noHover) return; // desktop already glitches on hover
    var cards=document.querySelectorAll(".card, .feat");
    if(!cards.length) return;
    var io=new IntersectionObserver(function(es){
      es.forEach(function(e){
        if(!e.isIntersecting) return;
        io.unobserve(e.target);
        var c=e.target; c.classList.add("fx");
        setTimeout(function(){ c.classList.remove("fx"); }, 900);
      });
    },{threshold:.35});
    Array.prototype.forEach.call(cards,function(c){ io.observe(c); });
  }

  /* 3D recognition globe (desktop + mobile) — lazy-loaded, auto-rotate + drag, logos pop on the front */
  function wireGlobe(){
    /* reduced-motion: still render the globe, just static (no auto-spin, no animated attack sweep) */
    var stage=document.getElementById("globe-stage"), holder=document.getElementById("globe");
    if(!stage||!holder) return;
    var sec=stage.closest(".opsmap-sec")||stage, term=document.getElementById("ops-term"), tgt=document.getElementById("ops-tgt");
    try{ var t=document.createElement("canvas"); if(!(t.getContext("webgl")||t.getContext("experimental-webgl"))) return; }catch(e){ return; }
    var booted=false;
    var io=new IntersectionObserver(function(es){ if(es[0].isIntersecting && !booted){ booted=true; io.disconnect(); load(); } },{rootMargin:"300px"});
    io.observe(stage);
    function load(){ var s=document.createElement("script"); s.src="/assets/vendor/globe.gl.min.js"; s.async=true; s.onload=init; s.onerror=function(){}; document.head.appendChild(s); }
    function init(){
      if(typeof Globe==="undefined") return;
      try{
        var orgs=[
          {name:"NASA",loc:"Washington, D.C. · United States",lat:38.88,lng:-77.04,host:"nasa.gov",logo:"hof_nasa_c.png",cal:{a:-138,l:54}},
          {name:"WHO",loc:"Geneva · Switzerland",lat:46.21,lng:6.14,host:"who.int",logo:"hof_who_c.png",cal:{a:118,l:54}},
          {name:"UNICEF",loc:"New York · United States",lat:40.71,lng:-74.01,host:"unicef.org",logo:"hof_unicef_c.png",cal:{a:-42,l:62}},
          {name:"UNESCO",loc:"Paris · France",lat:48.85,lng:2.35,host:"unesco.org",logo:"hof_unesco_c.png",cal:{a:-80,l:58}},
          {name:"Ferrari",loc:"Maranello · Italy",lat:44.53,lng:10.86,host:"ferrari.com",logo:"hof_ferrari_c.png",cal:{a:50,l:52}},
          {name:"Bayer",loc:"Leverkusen · Germany",lat:51.03,lng:6.98,host:"bayer.com",logo:"hof_bayer_c.png",cal:{a:-26,l:56}},
          {name:"US DoEd",loc:"Washington, D.C. · United States",lat:38.89,lng:-77.02,host:"ed.gov",logo:"hof_doed_c.png",cal:{a:138,l:78}},
          {name:"Nokia",loc:"Espoo · Finland",lat:60.21,lng:24.66,host:"nokia.com",logo:"hof_nokia_c.png",cal:{a:-90,l:44}}
        ];
        var GPAL=[["#00e5ff","0,229,255"],["#ff3344","255,51,68"],["#ff2ec4","255,46,196"],["#ffae00","255,174,0"],["#c6ff3a","198,255,58"],["#9b5cff","155,92,255"],["#2be06a","43,224,106"],["#3b82f6","59,130,246"]];
        /* NASA=cyan WHO=red UNICEF=magenta UNESCO=amber Ferrari=lime Bayer=violet US-DoEd=green Nokia=blue (all distinct) */
        orgs.forEach(function(o,i){ o._i=i; o._gc=GPAL[i%GPAL.length][0]; o._gr=GPAL[i%GPAL.length][1]; });
        var HOME={lat:3.14,lng:101.69};
        var ringHome={lat:HOME.lat,lng:HOME.lng,h:1};
        var pts=orgs.map(function(o){ return {lat:o.lat,lng:o.lng,c:"#7a2230",a:0.01,_org:o}; });
        pts.push({lat:HOME.lat,lng:HOME.lng,c:"#ffb02e",a:0.03,_home:1});
        var labels=orgs.map(function(o){ return {lat:o.lat,lng:o.lng,o:o}; });
        labels.push({lat:HOME.lat,lng:HOME.lng,_home:1});
        sec.classList.add("globe-on");
        /* recognition hand — CD24 marble cards, one per org, dealt on recognition */
        var recFan=document.getElementById("rec-fan"), recCap=document.getElementById("rec-cap"), recCards=[];
        if(recFan){ recFan.innerHTML=""; orgs.forEach(function(o,ci){ var cx=Math.round((ci-3.5)*30),cy=Math.round(Math.abs(ci-3.5)*5),cr=((ci-3.5)*6).toFixed(1);
          recFan.insertAdjacentHTML("beforeend",'<div class="rec-card" style="--cx:'+cx+'px;--cy:'+cy+'px;--cr:'+cr+'deg;--oc:'+o._gc+';--ocr:'+o._gr+'"><span class="cn tl"><b class="rk">'+(ci+1)+'</b><img src="/assets/creds/'+o.logo+'" alt=""></span><span class="pip"><img src="/assets/creds/'+o.logo+'" alt=""></span><span class="cn br"><b class="rk">'+(ci+1)+'</b><img src="/assets/creds/'+o.logo+'" alt=""></span></div>');
        }); recCards=recFan.querySelectorAll(".rec-card"); }
        function recReset(){ if(recFan) recFan.classList.remove("done"); for(var z=0;z<recCards.length;z++) recCards[z].classList.remove("on"); if(recCap) recCap.innerHTML="// awaiting recognitions&#8230;"; }
        function recReveal(ix){ if(recCards[ix]) recCards[ix].classList.add("on"); if(recCap) recCap.innerHTML='<b>'+orgs[ix].name+'</b> recognized <span class="cnt">&#183; '+(ix+1)+'/'+orgs.length+'</span>'; if(ix===orgs.length-1){ if(recFan) recFan.classList.add("done"); if(recCap) recCap.innerHTML='<span class="cnt">&#9733; FULL HAND &#183; HALL OF FAME &#183; '+orgs.length+'/'+orgs.length+'</span>'; } }
        recReset();
        var g=Globe()(holder).width(holder.clientWidth).height(holder.clientHeight).backgroundColor("rgba(0,0,0,0)")
          .globeImageUrl("/assets/earth-blue-marble.jpg").showAtmosphere(true).atmosphereColor("#3aa0ff").atmosphereAltitude(0.18)
          .htmlElementsData(labels).htmlAltitude(0.02).htmlElement(function(d){
            var el=document.createElement("div"); el.className="glabel"; d.__el=el;
            if(d._home){ /* base = a1ohadance the attacker — coder emoji + label */
              el.classList.add("home","on"); el.style.setProperty("--gc","#36e27a");
              el.innerHTML='<span class="gl-home"><span class="gl-emo">👨🏻‍💻</span><span class="gl-tag">a1ohadance</span></span>';
              return el; }
            var nm,lc,cal,gc,dly;
            if(d._home){ nm="a1ohadance"; lc=""; cal={a:118,l:50}; gc="#ff2020"; dly=0; }
            else { nm=d.o.name; lc=d.o.loc; cal=d.o.cal; gc=d.o._gc; dly=(d.o._i*0.13).toFixed(2); }
            var rad=cal.a*Math.PI/180, ex=Math.round(Math.cos(rad)*cal.l), ey=Math.round(Math.sin(rad)*cal.l);
            var sub=lc?('<em>'+lc+'</em>'):'';
            var lg=(!d._home && d.o && d.o.logo)?('<img class="gl-logo" src="/assets/creds/'+d.o.logo+'" alt="">'):'';
            el.style.setProperty("--gc",gc); el.style.setProperty("--dly",dly+"s");
            el.innerHTML='<i class="gl-dot"></i><i class="gl-line" style="width:'+cal.l+'px;transform:rotate('+cal.a+'deg)"></i>'+
              '<span class="gl-box" style="left:'+ex+'px;top:'+ey+'px">'+lg+'<b>'+nm+'</b>'+sub+'</span>';
            if(d._home){ el.classList.add("on","home"); }
            return el;
          })
          .pointsData(pts).pointColor("c").pointAltitude("a").pointRadius(0.3).pointResolution(6).pointsTransitionDuration(300)
          .ringsData([ringHome]).ringColor(function(d){var c=d.h?"255,176,46":(d.r?(d.rc||"255,58,80"):"0,229,255");return function(t){return "rgba("+c+","+(1-t)+")";};}).ringMaxRadius(function(d){return d.h?2.6:(d.r?3.6:5);}).ringPropagationSpeed(function(d){return d.h?1.4:(d.r?2.2:4);}).ringRepeatPeriod(function(d){return d.h?1400:(d.r?650:550);})
          .arcStartLat("sl").arcStartLng("sg").arcEndLat("el").arcEndLng("eg")
          .arcAltitudeAutoScale(0.5)
          .arcColor(function(d){var g=d._gc||"255,46,99";return d._live?["rgba("+g+",.35)","rgba("+g+",1)","#ffffff","rgba("+g+",.9)"]:["rgba("+g+",.12)","rgba("+g+",.6)","rgba("+g+",.95)","rgba(255,255,255,.7)"];})
          .arcStroke(function(d){return d._live?1.9:1.5;})
          .arcDashLength(function(d){return reduce?1:(d._live?0.32:0.4);}).arcDashGap(function(d){return reduce?0:(d._live?2:0.5);}).arcDashInitialGap(function(d){return reduce?0:(d._live?1:0);}).arcDashAnimateTime(function(d){return reduce?0:(d._live?2600:2000);}).arcsTransitionDuration(0)
          .pointOfView({lat:HOME.lat,lng:HOME.lng,altitude:2.7},0);
        var ctrl=g.controls(); ctrl.enablePan=false; ctrl.autoRotate=!reduce; ctrl.autoRotateSpeed=0.55;
        var gmob=window.matchMedia("(max-width:860px)").matches, gcv=holder.querySelector("canvas");
        // drag to spin, wheel/pinch to zoom (bounded so you can't fly through or way out) — desktop + mobile
        ctrl.enableRotate=true; ctrl.enableZoom=true; ctrl.minDistance=170; ctrl.maxDistance=470; ctrl.zoomSpeed=0.7;
        if(gmob){
          // MOBILE: capture touch gestures on the globe — one finger spins, two-finger pinch zooms.
          ctrl.rotateSpeed=0.5;
          holder.style.touchAction="none"; if(gcv) gcv.style.touchAction="none"; if(ctrl.domElement) ctrl.domElement.style.touchAction="none";
        }
        window.addEventListener("resize", function(){ g.width(holder.clientWidth).height(holder.clientHeight); });
        function scroll(){ term.scrollTop=term.scrollHeight; }
        function log(tx,cls){ var d=document.createElement("div"); d.className="tl "+(cls||""); d.innerHTML=tx; term.appendChild(d); var ls=term.getElementsByClassName("tl"); while(ls.length>60) ls[0].remove(); scroll(); return d; }
        function typeLine(cmd,cb){
          log('<span class="kf">&#9484;&#9472;&#9472;(</span><span class="ku">root</span><span class="at">&#10050;</span><span class="kh">a1ohadance</span><span class="kf">)-[</span><span class="kp">~/ops/attack</span><span class="kf">]</span>',"prompt");
          var d=log('<span class="kf">&#9492;&#9472;</span><span class="ku">#</span> <span class="t"></span><span class="cursor"></span>',"cmd");
          var sp=d.querySelector(".t"),cu=d.querySelector(".cursor"),i=0;
          (function tk(){ if(i<=cmd.length){ sp.textContent=cmd.slice(0,i); i++; scroll(); setTimeout(tk,24);} else { cu.remove(); cb&&cb(); } })();
        }
        function ri(n){ return Math.floor(Math.random()*n); }
        function cs(t,c){ return '<span class="'+c+'">'+t+'</span>'; }
        function pad(s,n){ s=""+s; while(s.length<n) s+=" "; return s; }
        function pad2(n){ return (n<10?"0":"")+n; }
        function clk(){ var p=performance.now(); return "20:"+pad2(Math.floor(p/60000)%60)+":"+pad2(Math.floor(p/1000)%60); }
        function sevTag(s){ return cs("["+s+"]","sv-"+s); }
        var INF=cs("[INF]","i-inf");
        var RECON=[
         {c:"nmap -sV -Pn --top-ports 100 {h}", o:[
           ["Starting Nmap 7.95 ( https://nmap.org )","dim"],
           ["Nmap scan report for {h}","dim"],
           [cs(pad("PORT",9),"head")+cs(pad("STATE",8),"head")+cs(pad("SERVICE",11),"head")+cs("VERSION","head"),"sub2"],
           [pad("443/tcp",9)+cs(pad("open",8),"ok2")+pad("https",11)+"nginx 1.25.3","sub2"],
           [pad("22/tcp",9)+cs(pad("open",8),"ok2")+pad("ssh",11)+"OpenSSH 9.6p1","sub2"],
           [pad("8080/tcp",9)+cs(pad("open",8),"ok2")+pad("http",11)+"Werkzeug 2.3 (Python 3.11)","sub2"],
           ["[*] 3 ports open · service scan done","dim"]
         ]},
         {c:"subfinder -d {h} -silent | httpx -sc -title -td", o:[
           [INF+" enumerating sources for {h}","sub2"],
           [pad("api.{h}",18)+cs("[200]","st-2")+" "+cs("[nginx]","t-proto")+" API Gateway","sub2"],
           [pad("dev.{h}",18)+cs("[200]","st-2")+" "+cs("[apache]","t-proto")+" Staging Portal","sub2"],
           [pad("vpn.{h}",18)+cs("[403]","st-4")+" "+cs("[F5]","t-proto")+" SSL-VPN","sub2"],
           [INF+" 287 subdomains · 3 live hosts","sub2"]
         ]},
         {c:"ffuf -u https://{h}/FUZZ -w raft-medium.txt -mc all -fc 404", o:[
           [pad("/api/v1",18)+cs("[Status: 200]","st-2")+cs(", Size: 1432","dim"),"sub2"],
           [pad("/admin",18)+cs("[Status: 301]","st-3")+cs(", Size: 0","dim"),"sub2"],
           [pad("/.git/config",18)+cs("[Status: 200]","st-2")+cs(", Size: 402","dim")+"  "+cs("◂ exposed","warn2"),"sub2"],
           [INF+" 12842 req · 3 matches","sub2"]
         ]},
         {c:"sqlmap -u \"https://{h}/item?id=1\" --batch --risk 3 --level 5", o:[
           ["[*] testing connection to the target URL","dim"],
           ["[PAYLOAD] id=1 AND 5713=5713","sub2"],
           [cs("[+]","hit")+" parameter '"+cs("id","t-id")+"' is "+cs("injectable","ok2")+" (boolean-based blind)","sub2"],
           [cs("[+]","hit")+" back-end DBMS: "+cs("PostgreSQL","ok2"),"sub2"]
         ]},
         {c:"gobuster dir -u https://{h} -w common.txt -t 50 -q", o:[
           [pad("/backup",20)+cs("(Status: 200)","st-2")+cs(" [Size: 91233]","dim"),"sub2"],
           [pad("/.env",20)+cs("(Status: 200)","st-2")+"  "+cs("◂ secrets","warn2"),"sub2"],
           [pad("/admin",20)+cs("(Status: 301)","st-3"),"sub2"]
         ]}
        ];
        function printOuts(arr,host,cb){ var i=0; (function nx(){ if(i>=arr.length){ cb&&cb(); return; } log(arr[i][0].replace(/{h}/g,host),arr[i][1]); i++; setTimeout(nx,260+ri(220)); })(); }
        var SPIN="⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏";
        function spin(label,dur,total,cb){
          var d=log("","sub2"), t0=performance.now();
          (function fr(){
            var e=performance.now()-t0, p=e<dur?e/dur:1, fi=Math.floor(e/80)%SPIN.length;
            var fill=Math.round(p*18), bar="█".repeat(fill)+"░".repeat(18-fill), cnt=Math.round(p*total);
            if(p<1){
              d.innerHTML="  "+cs(SPIN.charAt(fi),"sp")+" "+label+" "+cs("["+bar+"]","bar")+" "+cs(Math.round(p*100)+"%","pct")+" "+cs("("+cnt+"/"+total+")","dim");
              scroll(); requestAnimationFrame(fr);
            } else {
              d.innerHTML="  "+cs("✔","sp done")+" "+label+" "+cs("["+"█".repeat(18)+"]","bar")+" "+cs("100%","pct")+" "+cs("("+total+"/"+total+")","dim");
              scroll(); cb&&cb();
            }
          })();
        }
        var GCH="!<>-_\\/[]{}=+*^?#$%&01ABCDEF▓▒░";
        function glitchLine(target,cls,dur,cb){
          var d=log("",cls), t0=performance.now();
          (function fr(){
            var p=Math.min(1,(performance.now()-t0)/dur), locked=Math.floor(target.length*p), s="";
            for(var i=0;i<target.length;i++){ var ch=target.charAt(i); s += (i<locked||ch===" ") ? ch : GCH.charAt(ri(GCH.length)); }
            d.textContent=s; scroll();
            if(p<1) requestAnimationFrame(fr); else { d.textContent=target; cb&&cb(); }
          })();
        }
        function hofBar(n,t){ var f=Math.round(n/t*18); return "["+"█".repeat(f)+"░".repeat(18-f)+"]"; }
        /* rainbow data-block rain — front overlay on the whole terminal window during the hall-of-fame moment.
           Lives OUTSIDE the scrolling body (sibling), so it can never affect log content / clear / scroll. */
        var RB=["#ff2233","#ff8a00","#ffd24b","#36e27a","#00e5ff","#5b9cff","#b794ff","#ff35e0"];
        var opsWin=term.closest(".ops-term"), rainCv=document.getElementById("term-rain"), rainCtx=rainCv?rainCv.getContext("2d"):null, rainArr=[], rainRAF=null;
        function rmk(W,H){ return {x:Math.random()*W,y:Math.random()*H,w:7+Math.random()*16,h:6+Math.random()*10,s:1.2+Math.random()*3,c:RB[ri(RB.length)]}; }
        function rainStart(){
          if(!opsWin) return; opsWin.classList.add("hof-on");
          if(!rainCv||!rainCv.isConnected){ rainCv=document.getElementById("term-rain"); rainCtx=rainCv?rainCv.getContext("2d"):null; }
          if(!rainCtx) return;
          rainCv.width=opsWin.clientWidth; rainCv.height=opsWin.clientHeight;
          rainArr=[]; var N=Math.max(28,Math.floor(rainCv.width/20)); for(var i=0;i<N;i++) rainArr.push(rmk(rainCv.width,rainCv.height));
          if(rainRAF) return;
          (function fr(){
            var W=rainCv.width,H=rainCv.height,c=rainCtx;
            // fade old blocks (trailing fall-fade) by erasing alpha each frame, then draw
            c.globalCompositeOperation="destination-out"; c.fillStyle="rgba(0,0,0,.13)"; c.fillRect(0,0,W,H);
            c.globalCompositeOperation="source-over"; c.globalAlpha=.92;
            for(var i=0;i<rainArr.length;i++){ var b=rainArr[i]; c.fillStyle=b.c; c.fillRect(b.x,b.y,b.w,b.h); b.y+=b.s; if(b.y>H){ var m=rmk(W,H); b.x=m.x; b.y=-b.h; b.w=m.w; b.h=m.h; b.s=m.s; b.c=m.c; } }
            c.globalAlpha=1; rainRAF=requestAnimationFrame(fr);
          })();
        }
        function rainStop(){ if(opsWin) opsWin.classList.remove("hof-on"); if(rainRAF){ cancelAnimationFrame(rainRAF); rainRAF=null; } if(rainCtx&&rainCv) rainCtx.clearRect(0,0,rainCv.width,rainCv.height); }
        /* invert-strobe + scramble banner ({ORG} OWNED) */
        function ownedBanner(text,cb){
          var d=log("","ownedline"), sp=document.createElement("span"); sp.className="ownedbar"; d.appendChild(sp);
          var t0=performance.now();
          (function fr(){
            var p=Math.min(1,(performance.now()-t0)/1000), lk=Math.floor(text.length*p), s="";
            for(var i=0;i<text.length;i++){ var ch=text.charAt(i); s += (i<lk||ch===" ") ? ch : GCH.charAt(ri(GCH.length)); }
            sp.textContent=s; scroll();
            if(p<1) requestAnimationFrame(fr); else { sp.textContent=text; cb&&cb(); }
          })();
        }
        function hofAnim(o,cve,cb){
          var n=Object.keys(rec).length;
          log("","");
          log('<span class="ach-ico">&#127942;</span><span class="ach-tag">ACHIEVEMENT UNLOCKED</span><span class="ach-txt"> '+o.name+' badge unlocked</span>',"achline");
          setTimeout(function(){
            log(cs("&#9475;","cardbar")+cs("  ORG       ","sub2")+cs("&#187; "+o.name.toUpperCase(),"hofname"),"");
            log(cs("&#9475;","cardbar")+cs("  EXPLOIT   ","sub2")+cs("&#187; "+cve.id+"  "+cve.n,"hit"),"");
            log(cs("&#9475;","cardbar")+cs("  FOOTHOLD  ","sub2")+cs("&#187; root@"+slug(o)+"#  &#183;  VERIFIED &#10003;","win"),"");
            log(cs("&#9475;","cardbar")+cs("  HQ        ","sub2")+cs("&#187; "+o.loc,"cardbar"),"");
            log(cs("&#9475;","cardbar")+cs("  REWARD    ","sub2")+cs("&#187; HALL OF FAME &#183; "+o.name+" recognized a1ohadance &#9733;","hofname"),"");
            log("  "+cs(hofBar(n,orgs.length),"hofbar")+cs("  "+n+"/"+orgs.length+" organizations &#183; hall of fame","sub2"),"");
            log("","");
            cb&&cb();
          }, 650);
        }
        var CVES=[
         {id:"CVE-2021-44228",n:"Log4Shell RCE",s:"critical",p:"/api/v2/login"},
         {id:"CVE-2022-22965",n:"Spring4Shell RCE",s:"critical",p:"/app/upload"},
         {id:"CVE-2023-34362",n:"MOVEit SQLi",s:"critical",p:"/moveitisapi/moveitisapi.dll"},
         {id:"CVE-2023-44487",n:"HTTP/2 Rapid-Reset",s:"high",p:"/"},
         {id:"CVE-2024-21413",n:"Outlook RCE",s:"critical",p:"/owa/auth"},
         {id:"CVE-2022-1388",n:"F5 BIG-IP auth-bypass",s:"critical",p:"/mgmt/tm/util/bash"},
         {id:"CVE-2018-13379",n:"FortiOS path-traversal",s:"high",p:"/remote/fgt_lang"}
        ];
        function neofetch(){
          var A=["  +=========+  ","  | o     o |  ","  |   ___   |  ","  |  (___)  |  ","  | [a1oha] |  ","  +=========+  ","             ","             "];
          var I=['<span class="ku">root</span><span class="at">@</span><span class="kh">a1ohadance</span>','<span class="dim">───────────────────</span>','<span class="nf-k">OS</span>: <span class="nf-v">Kali GNU/Linux Rolling</span>','<span class="nf-k">Host</span>: <span class="nf-v">a1ohadance.my</span>','<span class="nf-k">Kernel</span>: <span class="nf-v">6.10.0-kali-amd64</span>','<span class="nf-k">Shell</span>: <span class="nf-v">zsh 5.9</span>','<span class="nf-k">Uptime</span>: <span class="nf-v">&#8734; · always hunting</span>','<span class="nf-k">Recognition</span>: <span class="nf-v">8 &#215; HALL OF FAME</span>'];
          for(var r=0;r<A.length;r++){ log('<span class="nf-a">'+A[r]+'</span>  '+(I[r]||""),"nf"); }
          log("",""); log('<span class="dim">// secure channel established · base node: Kuala Lumpur, Malaysia (KUL)</span>',"");
        }
        neofetch();
        var cur=-1, rec={}, allArcs=[], recRings=[], on=true, pendingResume=false;
        function city(o){ return o.loc.split(" · ")[0]; }
        function slug(o){ return o.name.toLowerCase().replace(/[^a-z]/g,""); }
        var rafId=null;
        function occl(){
          if(!on){ rafId=null; return; }
          try{ var cam=g.camera().position;
            for(var i=0;i<labels.length;i++){ var L=labels[i]; if(!L.__el) continue;
              var c=g.getCoords(L.lat,L.lng,0);
              L.__el.classList.toggle("back", (c.x*cam.x+c.y*cam.y+c.z*cam.z) <= 0);
            }
          }catch(e){}
          rafId=requestAnimationFrame(occl);
        }
        function gate(v){ on=v; if(v){ g.resumeAnimation&&g.resumeAnimation(); if(!rafId) rafId=requestAnimationFrame(occl); if(pendingResume){ pendingResume=false; step(); } } else { g.pauseAnimation&&g.pauseAnimation(); rainStop&&rainStop(); } }
        new IntersectionObserver(function(es){ gate(es[0].isIntersecting && !document.hidden); },{threshold:0}).observe(stage);
        document.addEventListener("visibilitychange", function(){ gate(!document.hidden); });
        function lbl(i){ return labels[i] && labels[i].__el; }
        var PXPIN='<svg class="pxi" viewBox="0 0 7 8" width="13" height="14" shape-rendering="crispEdges"><g fill="currentColor"><rect x="2" y="0" width="3" height="1"/><rect x="1" y="1" width="5" height="3"/><rect x="2" y="4" width="3" height="1"/><rect x="3" y="5" width="1" height="3"/></g></svg>';
        var PXXH='<svg class="pxi" viewBox="0 0 7 7" width="13" height="13" shape-rendering="crispEdges"><g fill="currentColor"><rect x="3" y="0" width="1" height="2"/><rect x="3" y="5" width="1" height="2"/><rect x="0" y="3" width="2" height="1"/><rect x="5" y="3" width="2" height="1"/><rect x="2" y="2" width="3" height="3" fill="none" stroke="currentColor" stroke-width="0"/><rect x="3" y="3" width="1" height="1"/></g></svg>';
        var PXPLAY='<svg class="pxg" viewBox="0 0 5 7" width="11" height="15" shape-rendering="crispEdges"><g fill="currentColor"><rect x="0" y="0" width="1" height="7"/><rect x="1" y="1" width="1" height="5"/><rect x="2" y="2" width="1" height="3"/><rect x="3" y="3" width="1" height="1"/></g></svg>';
        var PXCHK='<svg class="pxg" viewBox="0 0 7 6" width="15" height="13" shape-rendering="crispEdges"><g fill="currentColor"><rect x="0" y="2" width="1" height="2"/><rect x="1" y="3" width="1" height="2"/><rect x="2" y="4" width="1" height="1"/><rect x="3" y="3" width="1" height="1"/><rect x="4" y="2" width="1" height="1"/><rect x="5" y="1" width="1" height="1"/><rect x="6" y="0" width="1" height="2"/></g></svg>';
        function chip(o,count){
          var coord=o.lat.toFixed(2)+', '+o.lng.toFixed(2);
          return '<span class="tg-lock">LOCKED ON · '+count+'</span>'
            +'<span class="tg-pill">'
              +'<img class="tg-logo" src="/assets/creds/'+o.logo+'" alt="">'
              +'<span class="tg-txt">'
                +'<b class="tgname scr" data-t="'+o.name+'">'+o.name+'</b>'
                +'<span class="tg-sep">&#183;</span>'
                +'<span class="tg-loc scr" data-t="'+o.loc+'">'+o.loc+'</span>'
                +'<span class="tg-sep">&#183;</span>'
                +'<span class="tg-geo scr" data-t="'+coord+'">'+coord+'</span>'
              +'</span>'
            +'</span>';
        }
        function setChip(o,count){ tgt.style.setProperty("--nc",o._gc); tgt.innerHTML=chip(o,count); scrambleChip(); }
        function scrambleChip(){
          var sp=tgt.querySelectorAll(".scr"); if(!sp.length) return;
          for(var i=0;i<sp.length;i++) sp[i].__t=sp[i].getAttribute("data-t");
          var t0=performance.now();
          (function fr(){
            var p=Math.min(1,(performance.now()-t0)/700);
            for(var i=0;i<sp.length;i++){ var t=sp[i].__t,lk=Math.floor(t.length*p),s="";
              for(var k=0;k<t.length;k++) s+=(k<lk||t.charAt(k)===" ")?t.charAt(k):GCH.charAt(ri(GCH.length));
              sp[i].textContent=s; }
            if(p<1) requestAnimationFrame(fr); else for(var j=0;j<sp.length;j++) sp[j].textContent=sp[j].__t;
          })();
        }
        function clrLines(){ var ls=term.querySelectorAll(".tl"); for(var i=ls.length-1;i>=0;i--) ls[i].remove(); }
        function clearNext(){
          rainStop();
          if(!on){ pendingResume=true; return; }
          typeLine("clear", function(){ setTimeout(function(){ clrLines(); step(); }, 220); });
        }
        function step(){
          if(!on){ pendingResume=true; return; }
          cur=(cur+1)%orgs.length;
          if(cur===0){ rec={}; allArcs=[]; g.arcsData(allArcs); recRings=[]; g.ringsData([ringHome]); for(var k=0;k<pts.length;k++){ if(pts[k]._org){ pts[k].c="#7a2230"; pts[k].a=0.01; } } g.pointsData(pts); for(var m=0;m<orgs.length;m++){ if(lbl(m)) lbl(m).classList.remove("on","ok"); } recReset(); }
          var o=orgs[cur], cve=CVES[ri(CVES.length)];
          setChip(o,(cur+1)+"/"+orgs.length);
          // bold, highlighted per-org target banner
          if(cur===0) log(cs("▰▰▰ NEW SWEEP · 8 TARGETS QUEUED ▰▰▰","thdrnew"),"");
          log(cs("&#9656;&#9656;&#9656; TARGET "+(cur+1)+"/"+orgs.length+" · LOCKED ON","tlock"),"");
          /* org banner removed from terminal — the on-screen target pill (.tgt) now carries logo + name + HQ + coords */
          var rc=RECON[ri(RECON.length)];
          typeLine(rc.c.replace(/{h}/g,o.host), function(){
            printOuts(rc.o,o.host,function(){
              typeLine("sudo ./ops/strike.sh --target "+o.host+" --route KUL --payload nuclei", function(){
                log("  "+INF+" strike.sh v2.1 · building exploit chain","sub2");
                log("  "+INF+" resolving "+o.host+" &#8594; "+o.loc,"sub2");
                log("  "+INF+" nuclei -u https://"+o.host+" -t cves/ -severity critical,high","sub2");
                g.pointOfView({lat:HOME.lat,lng:HOME.lng,altitude:2.5},600);
                spin("nuclei · scanning "+o.host, 2200, 4217, function(){
                  log("  ["+clk()+"] "+cs("["+cve.id+"]","t-id")+" "+cs("[http]","t-proto")+" "+sevTag(cve.s)+" "+cs("https://"+o.host+cve.p,"t-url"),"sub2");
                  log(cs("[+]","hit")+" "+cve.id+" · "+cve.n+"  &#8594; MATCHED · weaponizing payload","warn");
                  if(lbl(cur)) lbl(cur).classList.add("on");
                  log(cs("[&#9658;]","hit")+" launching payload  KUL &#8594; "+city(o)+"  …","warn");
                  allArcs.push({sl:HOME.lat,sg:HOME.lng,el:o.lat,eg:o.lng,_live:true,_gc:o._gr}); g.arcsData(allArcs);
                  g.pointOfView({lat:o.lat,lng:o.lng,altitude:2.35},3000);
                  setTimeout(function(){ log('  '+cs("[*]","dim")+' traversing '+(ri(9)+7)+' hops  ·  AES-256 tunnel…',"dim"); },1100);
                  setTimeout(function(){ log('  '+cs("[*]","dim")+' approaching '+o.host+'  ·  payload inbound…',"dim"); },2100);
                  setTimeout(function(){
                    g.ringsData([ringHome,{lat:o.lat,lng:o.lng}].concat(recRings));
                    stage.classList.remove("flash");void stage.offsetWidth;stage.classList.add("flash");
                    for(var i=0;i<pts.length;i++){ if(pts[i]._org===o){ pts[i].a=0.16; } }
                    g.pointsData(pts);
                    log('[+] payload delivered  ·  drop @ '+city(o),"crit");
                    log('[+] ACCESS GRANTED  ·  root@'+slug(o)+'#',"crit");
                    setTimeout(function(){
                      rec[o.name]=1;
                      for(var a=0;a<allArcs.length;a++){ allArcs[a]._live=false; } g.arcsData(allArcs);
                      recRings.push({lat:o.lat,lng:o.lng,r:1,rc:o._gr}); g.ringsData([ringHome].concat(recRings));
                      for(var j=0;j<pts.length;j++){ if(pts[j]._org===o){ pts[j].c=o._gc; pts[j].a=0.22; } }
                      g.pointsData(pts);
                      if(lbl(cur)) lbl(cur).classList.add("ok");
                      setChip(o,(cur+1)+"/"+orgs.length); recReveal(cur);
                      log('[*] vuln disclosed &#8594; responsible disclosure accepted',"dim");
                      hofAnim(o, cve, function(){ setTimeout(clearNext, 1500); });
                    }, 1050);
                  }, 3050);
                });
              });
            });
          });
        }
        if(reduce){
          // reduced-motion: skip the animated sweep — static "all recognised" globe w/ solid arcs
          var staticArcs=[];
          for(var pz=0;pz<pts.length;pz++){ if(pts[pz]._org){ pts[pz].c=pts[pz]._org._gc; pts[pz].a=0.22; } }
          g.pointsData(pts); g.ringsData([]);
          orgs.forEach(function(o,ix){ staticArcs.push({sl:HOME.lat,sg:HOME.lng,el:o.lat,eg:o.lng,_live:false,_gc:o._gr}); if(lbl(ix)){ lbl(ix).classList.add("on","ok"); } recReveal(ix); });
          g.arcsData(staticArcs);
        } else {
          setTimeout(step, 900);
        }
      }catch(e){ sec.classList.remove("globe-on"); }
    }
  }

  function wireNav(){
    var hud = document.querySelector(".hud");
    var btn = document.getElementById("navToggle");
    var nav = document.getElementById("primary-nav");
    if(!hud || !btn || !nav) return;
    // iOS Safari rasterises any element overlapping the wallpaper <canvas> at the canvas layer's
    // low resolution → the open menu looked blurry / dark-fringed (HOME ONLY — other pages have no
    // canvas). Fix: while the menu is open, swap the (already-paused) canvas for a pixel-identical
    // static snapshot painted as a plain <div> background, so the menu composites over normal DOM.
    var wall = document.getElementById("homewall");
    var veil = document.getElementById("homeveil");
    function setOpen(o){
      menuOpen = o;   // pause the home wallpaper canvas loop while the menu is open (battery; harmless)
      // Swap the wallpaper canvas for a non-composited backdrop BEFORE revealing the menu, so the
      // menu rasterises over clean DOM from its very first painted frame (never over the canvas).
      if(wall && veil){
        if(o){
          // snapshot the (paused) wallpaper into the absolute veil so the swap is seamless...
          try{ veil.style.backgroundImage = "url(" + wall.toDataURL() + ")"; }catch(e){}
          veil.style.top = (window.pageYOffset || document.documentElement.scrollTop || 0) + "px";
          veil.style.display = "block";
          // ...then ALWAYS remove the canvas layer — even if the snapshot failed. Absolute (not
          // fixed) veil isn't auto-composited by iOS, so with the canvas gone the menu paints over
          // plain DOM and renders crisp, exactly like the non-home pages.
          wall.style.display = "none";
        } else {
          veil.style.display = "none"; veil.style.backgroundImage = ""; wall.style.display = "";
        }
      }
      hud.classList.toggle("open", o);
      btn.setAttribute("aria-expanded", o ? "true" : "false");
      if(o){
        // glitch-scramble each menu item on open, cascading
        Array.prototype.forEach.call(nav.querySelectorAll("a"), function(a, i){
          setTimeout(function(){ scrambleText(a, 520); }, i*55);
        });
      }
    }
    btn.addEventListener("click", function(e){
      e.stopPropagation();
      setOpen(!hud.classList.contains("open"));
    });
    nav.addEventListener("click", function(e){
      if(e.target.closest("a")) setOpen(false);   // close after picking a link
    });
    document.addEventListener("click", function(e){
      if(hud.classList.contains("open") && !hud.contains(e.target)) setOpen(false);
    });
    document.addEventListener("keydown", function(e){
      if(e.key === "Escape") setOpen(false);
    });
    window.addEventListener("resize", function(){
      if(window.innerWidth > 680) setOpen(false);
    });
  }

  /* JS-driven sticky: relative at the very top (no iOS sticky gap), switches to
     position:fixed once scrolled. A body padding spacer prevents content jump. */
  function wireStickyHeader(){
    var hud = document.querySelector(".hud");
    if(!hud) return;
    var pinned = false;
    function onScroll(){
      var y = window.pageYOffset || document.documentElement.scrollTop || 0;
      if(y > 4 && !pinned){
        document.body.style.setProperty("--hud-h", hud.offsetHeight + "px");
        document.body.classList.add("hud-pinned");
        pinned = true;
      } else if(y <= 4 && pinned){
        document.body.classList.remove("hud-pinned");
        pinned = false;
      }
    }
    window.addEventListener("scroll", onScroll, {passive:true});
    window.addEventListener("resize", function(){
      if(pinned) document.body.style.setProperty("--hud-h", hud.offsetHeight + "px");
    });
    onScroll();
  }

  /* -------------------------------------------------------------------
     CONTENT DECODE — scramble→resolve on scroll-in, matching the header
     boot/terminal glitch. Preserves inline markup (links, bold, etc.).
     ------------------------------------------------------------------- */
  function wireDecode(){
    if(!("IntersectionObserver" in window)) return;
    var scope = document.getElementById("main") || document.body;
    var charset = "01<>#%&$@/\\|=+*ABCDEF0x";
    function rc(){ return charset[Math.floor(Math.random()*charset.length)]; }

    var sel  = "h2,h3,h4,h5,p,li,blockquote,figcaption,dt,dd,th,td,"+
               ".sec-kicker,.sec-title,.lead,.kicker,.chip,.term-line";
    var skip = ".glitch-title,.post-h1,.page-title,.foot-glitch,.cmds,pre,code,.gp-cap,.tagline,.cap-line";
    var picked = Array.prototype.slice.call(scope.querySelectorAll(sel))
      .filter(function(el){ return !el.closest(skip); });
    // keep only top-most matches (drop nested, so shared text nodes aren't double-written)
    picked = picked.filter(function(el){
      return !picked.some(function(o){ return o!==el && o.contains(el); });
    });

    function tnodes(el){
      var out=[], w=document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null), n;
      while((n=w.nextNode())){ if(/\S/.test(n.nodeValue)) out.push(n); }
      return out;
    }
    function decode(el){
      var tns=tnodes(el); if(!tns.length) return;
      var reals=tns.map(function(n){ return n.nodeValue; });
      var total=reals.reduce(function(a,s){ return a+s.length; },0);
      var dur=Math.min(1600, 550+total*9), start=performance.now();
      el.classList.add("dec-on");
      (function tick(now){
        var t=(now-start)/dur;
        if(t>=1){ for(var j=0;j<tns.length;j++) tns[j].nodeValue=reals[j]; el.classList.remove("dec-on"); return; }
        var locked=Math.floor(total*t), c=0;
        for(var i=0;i<tns.length;i++){
          var real=reals[i], s="";
          for(var k=0;k<real.length;k++){
            var ch=real[k];
            s += (c<locked || ch===" " || ch==="\n" || ch==="\t") ? ch : (Math.random()<0.85 ? rc() : ch);
            c++;
          }
          tns[i].nodeValue=s;
        }
        requestAnimationFrame(tick);
      })(performance.now());
    }

    var io=new IntersectionObserver(function(es){
      es.forEach(function(e){
        if(!e.isIntersecting) return;
        io.unobserve(e.target);
        setTimeout(function(){ decode(e.target); }, e.target.__decD||0);
      });
    }, {threshold:0.18, rootMargin:"0px 0px -6% 0px"});

    picked.forEach(function(el,i){ el.__decD=(i%9)*40; io.observe(el); });
  }

  /* live wallpaper: original PixelLab hero, real 3-layer parallax (sky / clouds / landscape) */
  function wireHomeWall(){
    var cv=document.getElementById("homewall"); if(!cv) return;
    var ctx=cv.getContext("2d",{alpha:false}); ctx.imageSmoothingEnabled=false;
    var reduce=window.matchMedia&&window.matchMedia("(prefers-reduced-motion:reduce)").matches;
    var W=600,H=320,t=0, mx=0,my=0,tmx=0,tmy=0, lw=0,lh=0,rzT, FW=600,FH=320, SC=1, ax=0.5, ay=0.42, mob=false, cAx=0;
    var V="?v=5", SRC={sky:"/assets/wall/pl/sky.png"+V,clouds:"/assets/wall/pl/clouds.png"+V,land:"/assets/wall/pl/land.png"+V};
    var IMG={},loaded=0,total=3, flies=[];
    // castle/church window positions in land-art coords (600x320) + flicker phase
    var WIN=[[167,138,0],[180,140,1.5],[108,190,2.4],[122,192,3.6],[135,192,.8],[110,210,4.5],[124,210,5.3],[196,200,2],[531,216,1.1],[556,238,3],[575,250,4.2]];
    function buildFx(){ flies=[]; var n=Math.max(12,Math.round(W/16));
      for(var i=0;i<n;i++) flies.push({x:Math.random()*W,y:H*0.55+Math.random()*H*0.42,v:0.05+Math.random()*0.13,ph:Math.random()*6.28,big:Math.random()<0.3}); }
    // chimney smoke + lake steam (soft rising plumes) — sources/band in land-art coords (600x320)
    var CHIM=[[163,101],[129,146]], SMOKE_MAX=48, smoke=[];
    function softPuff(col){ var s=32,c=document.createElement("canvas"); c.width=c.height=s; var g=c.getContext("2d");
      var rg=g.createRadialGradient(s/2,s/2,0,s/2,s/2,s/2); rg.addColorStop(0,col+"0.55)"); rg.addColorStop(.55,col+"0.2)"); rg.addColorStop(1,col+"0)");
      g.fillStyle=rg; g.fillRect(0,0,s,s); return c; }
    var SMOKE_SP=softPuff("rgba(202,192,220,");
    function newSmoke(ci){ var c=CHIM[ci]; return {x:c[0]+(Math.random()-0.5)*3,y:c[1],age:0,life:130+Math.random()*90,rise:0.18+Math.random()*0.12,drift:0.06+Math.random()*0.07,wob:Math.random()*6.28,wa:0.10+Math.random()*0.12,r0:2.4+Math.random()*1.6,grow:0.05}; }
    // size the buffer from the canvas element's OWN box (100vw×100vh, stable) — not window.innerHeight,
    // which shrinks as the mobile address bar appears and would stretch the fixed buffer
    function resize(){ var cw=cv.clientWidth||window.innerWidth, ch=cv.clientHeight||window.innerHeight; lw=cw; lh=ch;
      H=FH; W=Math.max(150,Math.round(H*cw/ch));
      // desktop: centred (full scene). mobile portrait is a narrow tall crop, so anchor toward the
      // castle (the landmark) and frame its towers roughly centred — like PixelLab's mobile hero.
      mob=cw<768;
      ax=(cw<768)?0.2:0.5;
      ay=0.5;
      cv.width=W; cv.height=H; ctx.imageSmoothingEnabled=false; buildFx(); }
    function onResize(){ if(cv.clientWidth===lw && cv.clientHeight===lh) return; clearTimeout(rzT); rzT=setTimeout(resize,140); }
    // PixelLab banner = each layer cover-fit + centred. opt.over = extra scale (parallax slack so an
    // opaque layer's edge never slides into view); opt.clamp = keep both edges off-screen; opt.ay = vertical anchor.
    function cover(im,dx,opt){ if(!im||!im.width) return; opt=opt||{};
      var over=opt.over||1, ayy=(opt.ay==null?ay:opt.ay), axx=(opt.ax==null?ax:opt.ax);
      var s=Math.max(W/im.width, H/im.height)*over, dw=im.width*s, dh=im.height*s;
      var ox=(W-dw)*axx+dx, oy=(H-dh)*ayy;
      if(opt.clamp){ ox=(dw>=W)?Math.max(W-dw,Math.min(0,ox)):(W-dw)/2;
                     oy=(dh>=H)?Math.max(H-dh,Math.min(0,oy)):(H-dh)/2; }
      ctx.drawImage(im, Math.round(ox), Math.round(oy), Math.round(dw), Math.round(dh)); }
    function draw(){
      mx+=(tmx-mx)*0.06;
      // fill = the sky's own top colour fading down, so any reveal reads as sky, never a dark seam
      var bg=ctx.createLinearGradient(0,0,0,H);
      bg.addColorStop(0,"#a866d6"); bg.addColorStop(.5,"#c071b0"); bg.addColorStop(1,"#5a3a86");
      ctx.fillStyle=bg; ctx.fillRect(0,0,W,H);
      // sky (opaque backdrop) clamped so its tiny parallax can't expose the fill
      cover(IMG.sky,    mx*4, {clamp:true});
      // clouds: transparent layer. WEB — start at the far LEFT of the cloud field (we see x=0), then glide
      // LEFT on scroll (eased + slow) so the right-hand golden banks appear gradually. No zoom. Mobile
      // keeps its castle-centered anchor + gentle drift.
      if(!mob){ var sp=Math.max(0,Math.min(1,(window.pageYOffset||0)/(window.innerHeight*2.1)));
        cAx+=(sp-cAx)*0.05; cover(IMG.clouds, 0, {ax:cAx, over:1.15}); }
      else { cover(IMG.clouds, mx*7 + Math.sin(t*0.0009)*22, {over:1.1, ay:0.12}); }
      // sunset horizon glow that gently breathes (sky, behind the foreground)
      if(!reduce){ var hy=Math.round(H*0.52), hh=Math.round(H*0.24), hb=(0.09+0.07*Math.sin(t*0.013)).toFixed(3);
        var hg=ctx.createLinearGradient(0,hy-hh,0,hy+hh);
        hg.addColorStop(0,"rgba(255,140,120,0)"); hg.addColorStop(.5,"rgba(255,165,150,"+hb+")"); hg.addColorStop(1,"rgba(255,140,120,0)");
        ctx.globalCompositeOperation="lighter"; ctx.fillStyle=hg; ctx.fillRect(0,hy-hh,W,hh*2); ctx.globalCompositeOperation="source-over"; }
      // landscape: pure cover + centred — exactly like PixelLab (no extra zoom). Clamp keeps the
      // forest edges off-screen so the parallax never reveals a gap. Transform reused by window lights.
      var LAY=0.5, lS=Math.max(W/600,H/320), lDW=600*lS, lDH=320*lS;
      var lOX=Math.max(W-lDW,Math.min(0,(W-lDW)*ax+mx*4)), lOY=Math.max(H-lDH,Math.min(0,(H-lDH)*LAY));
      ctx.drawImage(IMG.land, Math.round(lOX), Math.round(lOY), Math.round(lDW), Math.round(lDH));
      // keep the ambient fx (castle window lights + fireflies) alive while scrolling — they sit behind the
      // transparent content so they read as a living wallpaper instead of vanishing past the hero
      var sf=1;
      if(!reduce && sf>0.02){
        ctx.globalCompositeOperation="lighter";
        // (water-shimmer "flow lines" removed by request)
        // castle / church window lights flickering warm at dusk (reuse the exact land transform)
        var sL=lS, oX=lOX, oY=lOY, wsz=Math.max(1,Math.round(sL));
        for(var wi=0;wi<WIN.length;wi++){ var wn=WIN[wi];
          var wx=Math.round(oX+wn[0]*sL), wy=Math.round(oY+wn[1]*sL);
          var fk=(0.5+0.5*Math.sin(t*0.06+wn[2]))*(Math.random()<0.05?0.35:1);
          ctx.globalAlpha=sf*(0.4+0.6*fk); ctx.fillStyle="#ffcf6a"; ctx.fillRect(wx,wy,wsz,wsz+1);
          ctx.globalAlpha=sf*0.3*fk; ctx.fillStyle="#ffe7a0"; ctx.fillRect(wx-1,wy-1,wsz+2,wsz+3); }
        // fireflies near the water/forest (brighter, some larger)
        for(var f=0;f<flies.length;f++){ var fl=flies[f]; fl.y-=fl.v; fl.x+=Math.sin(t*0.02+fl.ph)*0.16;
          if(fl.y<H*0.5){ fl.y=H*0.99; fl.x=Math.random()*W; }
          ctx.globalAlpha=sf*(0.45+0.55*Math.abs(Math.sin(t*0.05+fl.ph))); ctx.fillStyle="#fff0a0";
          var sz=fl.big?2:1; ctx.fillRect(Math.round(fl.x),Math.round(fl.y),sz,sz); }
        // chimney smoke — soft rising plumes (normal alpha, not additive), slow drift
        ctx.globalCompositeOperation="source-over";
        if(smoke.length<SMOKE_MAX && t%6===0){ for(var mc=0;mc<CHIM.length;mc++){ if(Math.random()<0.7) smoke.push(newSmoke(mc)); } }
        for(var mi=smoke.length-1;mi>=0;mi--){ var mp=smoke[mi]; mp.age++;
          mp.y-=mp.rise; mp.x+=mp.drift+Math.sin(mp.age*0.018+mp.wob)*mp.wa;
          if(mp.age>=mp.life){ smoke.splice(mi,1); continue; }
          var mr=(mp.r0+mp.grow*mp.age)*sL, ma=Math.sin((mp.age/mp.life)*Math.PI)*0.5;
          ctx.globalAlpha=ma; ctx.drawImage(SMOKE_SP, Math.round(oX+mp.x*sL-mr), Math.round(oY+mp.y*sL-mr), Math.round(mr*2), Math.round(mr*2)); }
        ctx.globalAlpha=1; ctx.globalCompositeOperation="source-over";
      }
      t++;
    }
    function frame(){ if(!document.hidden && !menuOpen) draw(); requestAnimationFrame(frame); }
    function go(){ if(++loaded<total) return; resize(); draw(); if(!reduce) requestAnimationFrame(frame); }
    Object.keys(SRC).forEach(function(k){ var im=new Image(); im.onload=go; im.onerror=go; im.src=SRC[k]; IMG[k]=im; });
    window.addEventListener("resize",onResize);
    window.addEventListener("orientationchange",function(){ clearTimeout(rzT); rzT=setTimeout(resize,200); });
    window.addEventListener("pointermove",function(e){ tmx=(e.clientX/window.innerWidth)-0.5; tmy=(e.clientY/window.innerHeight)-0.5; },{passive:true});
    window.addEventListener("deviceorientation",function(e){ if(e.gamma!=null){ tmx=Math.max(-0.5,Math.min(0.5,e.gamma/40)); tmy=Math.max(-0.5,Math.min(0.5,(e.beta-30)/40)); } });
  }

  /* floating palette switcher — applies data-theme site-wide + persists; wallpaper retints via the --wall CSS var */
  function wireThemeSwitcher(){
    var fab=document.getElementById("themeFab"), pop=document.getElementById("themePop");
    if(!fab||!pop) return;
    var KEY="a1oha-theme", btns=[].slice.call(pop.querySelectorAll("[data-theme-set]"));
    function cur(){ return document.documentElement.getAttribute("data-theme")||"synth"; }
    function mark(){ var c=cur(); btns.forEach(function(b){ b.setAttribute("aria-pressed", b.getAttribute("data-theme-set")===c?"true":"false"); }); }
    function open(o){ pop.classList.toggle("open",o); fab.setAttribute("aria-expanded",o?"true":"false"); }
    function apply(name){ document.documentElement.setAttribute("data-theme",name); try{localStorage.setItem(KEY,name);}catch(e){} mark(); }
    fab.addEventListener("click", function(e){ e.stopPropagation(); open(!pop.classList.contains("open")); });
    btns.forEach(function(b){ b.addEventListener("click", function(){ apply(b.getAttribute("data-theme-set")); open(false); }); });
    document.addEventListener("click", function(e){ if(pop.classList.contains("open") && !pop.contains(e.target) && e.target!==fab) open(false); });
    document.addEventListener("keydown", function(e){ if(e.key==="Escape") open(false); });
    mark();
  }

  /* PIXEL MODE toggle — full-pixel skin site-wide; persists; boot script applies it pre-paint */
  function wirePixelMode(){
    var btn=document.getElementById("pixelToggle"); if(!btn) return;
    var KEY="a1oha-pixel", root=document.documentElement;
    function isOn(){ return root.getAttribute("data-pixel")==="on"; }
    function loadFont(){ if(document.getElementById("pxfont")) return;
      var l=document.createElement("link"); l.id="pxfont"; l.rel="stylesheet";
      l.href="https://fonts.googleapis.com/css2?family=VT323&family=Silkscreen:wght@400;700&display=swap";
      document.head.appendChild(l); }
    function mark(){ btn.setAttribute("aria-checked", isOn()?"true":"false"); }
    if(isOn()) loadFont(); mark();
    btn.addEventListener("click", function(){
      var n=!isOn(); root.setAttribute("data-pixel", n?"on":"off");
      try{ localStorage.setItem(KEY, n?"on":"off"); }catch(e){}
      if(n) loadFont(); mark();
    });
  }

  document.addEventListener("DOMContentLoaded", function(){
    wireStickyHeader();
    wireNav();
    wireThemeSwitcher();
    wirePixelMode();
    wireForm();
    wireSearch();
    wireCounter();
    wireTip();
    wireReadingTime();
    wireTOC();
    wireHudTerminal();
    wirePageFx();
    wirePong();

    wireDecode(); // content scramble — one-shot resolve, runs even with reduced-motion (by request)
    wireRecon();  // live connection trace on the home hero
    wireFeed();   // live threat-intel ticker
    wireCounters(); // animated hero stat counters
    wireCardFx();   // mobile card glitch on scroll-in
    wireTypeRole(); // typewriter rotating role in tagline
    wireSkillsDecrypt(); // rolling decrypt on the skills chips
    wireOpsMap();        // pause 2D fallback map off-screen
    wireGlobe();         // 3D recognition globe (lazy, desktop + mobile)
    wireHomeWall();      // live CC0 pixel-art city parallax wallpaper

    if(reduce) return; // below: continuous motion only when motion is allowed

    var hero = document.querySelector(".glitch-title");
    var primary = hero ||
                  document.querySelector(".post-h1") ||
                  document.querySelector(".page-title");

    bootTitle(primary);
    if(hero) wireBursts(hero);
  });
})();

/* ---- 8-bit boot loader: remove the overlay after the sequence, or on click/key to skip ---- */
(function(){
  var b=document.getElementById("boot");
  if(!b) return;
  function kill(){ if(b&&b.parentNode){ b.parentNode.removeChild(b); b=null; } }
  b.addEventListener("click",kill);
  document.addEventListener("keydown",function(e){ if(e.key==="Escape"||e.key===" "||e.key==="Enter") kill(); });
  setTimeout(kill,2700);
})();

/* ---- 8-bit hover/click sound effects (WebAudio blips) + persisted mute toggle ---- */
(function(){
  var KEY="a1oha-sfx", on=true;
  try{ on=(localStorage.getItem(KEY)!=="off"); }catch(e){}
  var ac=null;
  function ctx(){ if(!ac){ try{ ac=new (window.AudioContext||window.webkitAudioContext)(); }catch(e){} } if(ac&&ac.state==="suspended"){ try{ac.resume();}catch(e){} } return ac; }
  function blip(freq,dur,vol,type){
    if(!on) return; var a=ctx(); if(!a) return;
    var o=a.createOscillator(), g=a.createGain(), t=a.currentTime;
    o.type=type||"square"; o.frequency.value=freq;
    g.gain.setValueAtTime(vol||0.035,t);
    g.gain.exponentialRampToValueAtTime(0.0001,t+(dur||0.06));
    o.connect(g); g.connect(a.destination);
    o.start(t); o.stop(t+(dur||0.07));
  }
  var SEL='a,button,summary,.stat,[role="button"]', lastEl=null;
  document.addEventListener("mouseover",function(e){
    var t=e.target.closest&&e.target.closest(SEL);
    if(!t){ lastEl=null; return; }
    if(t===lastEl) return; lastEl=t;
    if(t.id==="sfxFab") return;
    blip(660,0.045,0.03);
  },true);
  document.addEventListener("click",function(e){
    var t=e.target.closest&&e.target.closest(SEL); if(!t||t.id==="sfxFab") return;
    blip(880,0.08,0.05);
  },true);
  var btn=document.getElementById("sfxFab");
  function mark(){ if(!btn) return; btn.setAttribute("aria-pressed",on?"true":"false"); btn.classList.toggle("muted",!on); }
  if(btn){
    btn.addEventListener("click",function(){
      on=!on; try{ localStorage.setItem(KEY, on?"on":"off"); }catch(e){}
      mark(); if(on){ ctx(); blip(740,0.07,0.05); }
    });
    mark();
  }
})();

/* ---- copy-code buttons on write-up code blocks (scoped to .prose) ---- */
(function(){
  var root=document.querySelector(".prose"); if(!root) return;
  var blocks=[];
  root.querySelectorAll(".highlight").forEach(function(h){ blocks.push(h); });
  root.querySelectorAll("pre > code").forEach(function(c){
    var pre=c.parentNode;
    if(pre.classList.contains("callout")) return;
    if(pre.closest(".highlight")) return;
    blocks.push(pre);
  });
  function fallback(text,done){
    try{ var ta=document.createElement("textarea"); ta.value=text; ta.style.position="fixed"; ta.style.opacity="0"; document.body.appendChild(ta); ta.focus(); ta.select(); document.execCommand("copy"); document.body.removeChild(ta); done(); }catch(e){}
  }
  blocks.forEach(function(b){
    if(b.querySelector(":scope > .cb-copy")) return;
    if(getComputedStyle(b).position==="static") b.style.position="relative";
    var btn=document.createElement("button");
    btn.type="button"; btn.className="cb-copy"; btn.setAttribute("aria-label","Copy code"); btn.textContent="COPY";
    btn.addEventListener("click",function(){
      var code=b.querySelector("code")||b;
      var text=(code.innerText||code.textContent||"").replace(/\n+$/,"");
      var done=function(){ btn.textContent="COPIED"; btn.classList.add("ok"); setTimeout(function(){ btn.textContent="COPY"; btn.classList.remove("ok"); },1400); };
      if(navigator.clipboard&&navigator.clipboard.writeText){ navigator.clipboard.writeText(text).then(done,function(){ fallback(text,done); }); }
      else fallback(text,done);
    });
    b.appendChild(btn);
  });
})();


/* ---- scroll-reveal: home sections fade + rise in only when scrolled into view (not on page load) ---- */
(function(){
  var main=document.getElementById("main"); if(!main) return;
  var secs=main.querySelectorAll(":scope > section:not(.hero)");
  if(!secs.length) return;
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion:reduce)").matches;
  if(reduce || !("IntersectionObserver" in window)) return;   // leave sections fully visible
  document.documentElement.classList.add("reveals-on");
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); } });
  },{ threshold:0, rootMargin:"0px 0px -10% 0px" });
  secs.forEach(function(s){ io.observe(s); });
})();
