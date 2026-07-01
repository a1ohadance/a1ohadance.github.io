+++
title = "badges"
metaTitle = "a1ohadance // creds, recognition"
metaDescription = "Creds / recognition for Muhammad Fitri Mohd Sultan (a1ohadance): Hall of Fame, published CVEs, and certifications."
url = "/badges/"
+++

<header class="page-head wrap">
<p class="page-path">// <b>/lib/creds</b> · DECRYPTING RECOGNITION</p>
<h1 class="page-title" data-text="CREDS // RECOGNITION">CREDS // RECOGNITION</h1>
<p class="page-sub">Recovered signals of recognition: Hall of Fame acknowledgements, published CVEs, and certifications. Every entry links to an independent source you can verify.</p>
</header>

<!-- ===================== HALL OF FAME ===================== -->
<section class="section wrap no-top" aria-labelledby="hof-title">
<div class="sec-head">
<span class="sec-kicker">// {{< pico trophy "#ffb02e" >}} HALL OF FAME</span>
<h2 class="sec-title" id="hof-title">hall of fame</h2>
<span class="sec-meta">8 ON RECORD</span>
</div>

<div class="hof-grid">

<article class="hof-card">
<span class="logo-chip"><img src="/assets/creds/hof_nasa.png" alt="NASA logo" width="100" height="72" loading="lazy" decoding="async"></span>
<h3 class="hof-name">NASA</h3>
<a class="verify-link" href="https://bugcrowd.com/h/alohadance" target="_blank" rel="noopener noreferrer">verify</a>
</article>

<article class="hof-card">
<span class="logo-chip"><img src="/assets/creds/hof_who.png" alt="WHO (World Health Organization) logo" width="100" height="72" loading="lazy" decoding="async"></span>
<h3 class="hof-name">WHO</h3>
<a class="verify-link" href="https://www.who.int/about/cybersecurity/vulnerability-hall-of-fame/ethical-hacker-list" target="_blank" rel="noopener noreferrer">verify</a>
</article>

<article class="hof-card">
<span class="logo-chip"><img src="/assets/creds/hof_unicef.png" alt="UNICEF logo" width="100" height="72" loading="lazy" decoding="async"></span>
<h3 class="hof-name">UNICEF</h3>
<a class="verify-link" href="https://www.unicef.org/digitalimpact/unicef-information-security-hall-fame" target="_blank" rel="noopener noreferrer">verify</a>
</article>

<article class="hof-card">
<span class="logo-chip"><img src="/assets/creds/hof_unesco.png" alt="UNESCO logo" width="100" height="72" loading="lazy" decoding="async"></span>
<h3 class="hof-name">UNESCO</h3>
<a class="verify-link" href="https://www.unesco.org/en/vulnerability-disclosure" target="_blank" rel="noopener noreferrer">verify</a>
</article>

<article class="hof-card">
<span class="logo-chip"><img src="/assets/creds/hof_ferrari.png" alt="Ferrari logo" width="100" height="72" loading="lazy" decoding="async"></span>
<h3 class="hof-name">Ferrari</h3>
<a class="verify-link" href="https://www.ferrari.com/en-MY/hall-of-fame-responsible-disclosure-programme" target="_blank" rel="noopener noreferrer">verify</a>
</article>

<article class="hof-card">
<span class="logo-chip"><img src="/assets/creds/hof_bayer.svg" alt="Bayer logo" width="74" height="64" loading="lazy" decoding="async"></span>
<h3 class="hof-name">Bayer</h3>
<a class="verify-link" href="https://www.bayer.com/en/cybersecurity-hall-of-fame" target="_blank" rel="noopener noreferrer">verify</a>
</article>

<article class="hof-card" title="U.S. Department of Education">
<span class="logo-chip"><img src="/assets/creds/hof_doed.svg" alt="U.S. Department of Education seal" width="64" height="64" loading="lazy" decoding="async"></span>
<h3 class="hof-name" style="text-transform:none">U.S. DoED</h3>
<a class="verify-link" href="https://www.synack.com/vdp/ed/acknowledgements/" target="_blank" rel="noopener noreferrer">verify</a>
</article>

<article class="hof-card">
<span class="logo-chip"><img src="/assets/creds/hof_nokia.svg" alt="Nokia logo" width="110" height="26" loading="lazy" decoding="async"></span>
<h3 class="hof-name">Nokia</h3>
<a class="verify-link" href="https://www.nokia.com/we-are-nokia/security/products/cvd/hall-of-fame/" target="_blank" rel="noopener noreferrer">verify</a>
</article>

</div>
</section>

<!-- ===================== LETTERS OF RECOGNITION ===================== -->
<section class="section wrap" aria-labelledby="letters-title">
<div class="sec-head">
<span class="sec-kicker">// {{< pico letter "#00e5ff" >}} LETTERS OF RECOGNITION</span>
<h2 class="sec-title" id="letters-title">letters of recognition</h2>
<span class="sec-meta">1 ON RECORD</span>
</div>

<div class="letters-grid">

<article class="letter-card letter-card--big">
<a class="letter-frame" href="/assets/letters/nasa_letter.pdf" target="_blank" rel="noopener noreferrer" aria-label="Open NASA Letter of Recognition (full PDF, opens in new tab)">
<img class="letter-img" src="/assets/letters/nasa_letter_preview.png" alt="NASA Letter of Recognition" loading="lazy" decoding="async">
</a>
<div class="letter-row">
<h3 class="letter-cap">NASA Letter of Recognition</h3>
<a class="letter-open" href="/assets/letters/nasa_letter.pdf" target="_blank" rel="noopener noreferrer">open full PDF</a>
</div>
</article>

</div>
</section>

<!-- ===================== PUBLISHED CVEs ===================== -->
<section class="section wrap" aria-labelledby="cve-title">
<div class="sec-head">
<span class="sec-kicker">// {{< pico invader "#ff003c" >}} PUBLISHED CVEs</span>
<h2 class="sec-title" id="cve-title">published cves</h2>
<span class="sec-meta">2 ON RECORD</span>
</div>

<div class="cve-grid">

<article class="cve-card cve-card--crit">
<div class="cve-top">
<h3 class="cve-id">CVE-2026-38360</h3>
<span class="sev sev-crit">CRITICAL · CVSS 9.8</span>
</div>
<p class="cve-chain">Path Traversal <span class="cve-arrow">→</span> Remote Code Execution</p>
<p class="cve-desc"><span class="cve-desc-text">Unauthenticated path traversal in <code>dash-uploader</code>'s HTTP handler, where <code>upload_id</code> / <code>resumableFilename</code> reach <code>os.path.join()</code> &amp; <code>os.makedirs()</code> unsanitized. A single <code>POST</code> with <code>../</code> writes files anywhere the process can; drop a <code>.pth</code> into <code>site-packages</code> and you get code execution on interpreter start.</span></p>
<dl class="cve-meta">
<div><dt>Package</dt><dd>dash-uploader <span class="eco">PyPI</span></dd></div>
<div><dt>Affected</dt><dd>≥ 0.1.0, ≤ 0.7.0a2</dd></div>
<div><dt>Weakness</dt><dd>CWE-22 · Path Traversal</dd></div>
<div><dt>Disclosed</dt><dd>2026</dd></div>
<div class="cve-vec"><dt>Vector</dt><dd><code>CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H</code></dd></div>
</dl>
<div class="cve-links">
<a href="https://nvd.nist.gov/vuln/detail/CVE-2026-38360" target="_blank" rel="noopener noreferrer">NVD</a>
<a href="https://github.com/advisories/GHSA-3rf6-x59v-5jfv" target="_blank" rel="noopener noreferrer">GHSA</a>
<a href="https://github.com/a1ohadance/CVE-2026-38360" target="_blank" rel="noopener noreferrer">PoC</a>
</div>
</article>

<article class="cve-card cve-card--high">
<div class="cve-top">
<h3 class="cve-id">CVE-2026-38361</h3>
<span class="sev sev-high">HIGH · CVSS 7.5</span>
</div>
<p class="cve-chain">Uncontrolled Resource Consumption <span class="cve-arrow">→</span> Denial of Service</p>
<p class="cve-desc"><span class="cve-desc-text">Unbounded file-upload handling (<code>max_file_size</code>) in <code>dash-uploader</code> lets an unauthenticated attacker exhaust resources and take the service down, with no auth and no user interaction.</span></p>
<dl class="cve-meta">
<div><dt>Package</dt><dd>dash-uploader <span class="eco">PyPI</span></dd></div>
<div><dt>Affected</dt><dd>v0.1.0 to v0.7.0a2</dd></div>
<div><dt>Weakness</dt><dd>CWE-400 · Resource Consumption</dd></div>
<div><dt>Disclosed</dt><dd>2026</dd></div>
<div class="cve-vec"><dt>Vector</dt><dd><code>CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:H</code></dd></div>
</dl>
<div class="cve-links">
<a href="https://nvd.nist.gov/vuln/detail/CVE-2026-38361" target="_blank" rel="noopener noreferrer">NVD</a>
<a href="https://github.com/advisories/GHSA-xp7f-v245-w3w8" target="_blank" rel="noopener noreferrer">GHSA</a>
<a href="https://github.com/a1ohadance/CVE-2026-38361" target="_blank" rel="noopener noreferrer">PoC</a>
</div>
</article>

</div>
</section>

<!-- ===================== CERTIFICATIONS ===================== -->
<section class="section wrap" aria-labelledby="cert-title">
<div class="sec-head">
<span class="sec-kicker">// {{< pico cap "#36e27a" >}} CERTIFICATIONS</span>
<h2 class="sec-title" id="cert-title">certifications</h2>
<span class="sec-meta">5 ON RECORD</span>
</div>

<div class="cert-grid">

<article class="cert-card">
<span class="logo-chip"><img src="/assets/creds/cert_gdat.png" alt="GIAC GDAT certification badge" width="74" height="74" loading="lazy" decoding="async"></span>
<div class="cert-body">
<span class="cert-abbr">GDAT</span>
<span class="cert-name">GIAC Defending Advanced Threats</span>
<span class="cert-meta"><span class="issuer">GIAC</span> <span class="cert-year">2024</span></span>
<a class="verify-link" href="https://www.giac.org/certified-professional/Muhammad-Fitri-Mohd-Sultan/240813" target="_blank" rel="noopener noreferrer">verify</a>
</div>
</article>

<article class="cert-card">
<span class="logo-chip"><img src="/assets/creds/cert_ceh.png" alt="EC-Council CEH certification badge" width="74" height="74" loading="lazy" decoding="async"></span>
<div class="cert-body">
<span class="cert-abbr">CEH</span>
<span class="cert-name">Certified Ethical Hacker</span>
<span class="cert-meta"><span class="issuer">EC-Council</span> <span class="cert-year">2024</span></span>
<a class="verify-link" href="https://aspen.eccouncil.org/VerifyBadge?type=certification&a=KZyiLz6qMNR+vA1iR+e61ZTZP/qtB6vOrpwpdLjMrgo=" target="_blank" rel="noopener noreferrer">verify</a>
</div>
</article>

<article class="cert-card">
<span class="logo-chip"><img src="/assets/creds/cert_cc.png" alt="(ISC)² Certified in Cybersecurity badge" width="74" height="74" loading="lazy" decoding="async"></span>
<div class="cert-body">
<span class="cert-abbr">CC</span>
<span class="cert-name">Certified in Cybersecurity</span>
<span class="cert-meta"><span class="issuer">(ISC)²</span> <span class="cert-year">2023</span></span>
<a class="verify-link" href="https://www.credly.com/badges/da40be5e-e050-48d0-a142-483e5625fe13/public_url" target="_blank" rel="noopener noreferrer">verify</a>
</div>
</article>

<article class="cert-card">
<span class="logo-chip"><img src="/assets/creds/cert_ccna.png" alt="Cisco CCNA certification badge" width="74" height="74" loading="lazy" decoding="async"></span>
<div class="cert-body">
<span class="cert-abbr">CCNA</span>
<span class="cert-name">Cisco Certified Network Associate</span>
<span class="cert-meta"><span class="issuer">Cisco</span> <span class="cert-year">2023</span></span>
<a class="verify-link" href="https://www.credly.com/badges/7be92268-642b-40de-b5b4-4c0d379abbc9/public_url" target="_blank" rel="noopener noreferrer">verify</a>
</div>
</article>

<article class="cert-card">
<span class="logo-chip"><img src="/assets/creds/cert_rcce.png" alt="Rocheston RCCE certification badge" width="74" height="74" loading="lazy" decoding="async"></span>
<div class="cert-body">
<span class="cert-abbr">RCCE</span>
<span class="cert-name">Rocheston Certified Cybersecurity Engineer</span>
<span class="cert-meta"><span class="issuer">Rocheston</span> <span class="cert-year">2023</span></span>
<a class="verify-link" href="https://www.credly.com/badges/f74cd57f-d469-469d-b252-60b29d9dc27a/public_url" target="_blank" rel="noopener noreferrer">verify</a>
</div>
</article>

</div>
</section>
