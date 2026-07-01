+++
title = "Inside 1 Million+ Stolen Credentials"
kicker = "A real-life example of Stealer Logs"
summary = "A real-world teardown of stealer logs: text/CSV files pairing credentials with their URLs, traded free or behind paid subscriptions, at massive scale."
date = 2024-10-30
author = "Fitri Sultan"
cover = "/assets/covers/stealer-logs.svg"
coverAlt = "Terminal decoding a stealer log of over one million stolen url:username:password credentials"
tags = ["credential-theft", "info-stealer", "malware", "trojan"]
categories = ["Threat Intel", "Threat Hunting"]
metaDescription = "A real-life example of stealer logs: Fitri Sultan analyses 5,000+ Valorant combos and 1,000,000+ browser-stored credentials."
+++

<p class="lede">Info-stealer logs are text/CSV files of credentials paired with their URLs, usually formatted <code>username:password</code> or <code>url:username:password</code>.</p>

During research I found platforms where huge collections of stealer logs circulate: some free, some behind paid subscriptions; some general user data, some from privileged accounts.

Two samples analysed: 5,000+ Valorant <code>username:password</code> combos, and 1,000,000+ compiled browser-stored credentials.

<pre class="callout"><span class="cmt"># sample format: stealer log line</span>
<span class="cmt">url:username:password</span>
https://auth.riotgames.com:<span class="u">player_one</span>:<span class="p">hunter2!</span>
https://www.facebook.com:<span class="u">victim.name</span>:<span class="p">Summer2024</span>
https://accounts.google.com:<span class="u">victim@gmail.com</span>:<span class="p">qwerty123</span></pre>

## Valorant credentials

Tested random credentials via Burp Suite as an intermediary; most were valid and current. Many accounts had MFA enabled, which blocked access. One account lacked MFA, so I accessed it, then immediately terminated the session to avoid misuse.

## Browser-stored credentials

The 1M+ set spanned Facebook, Gmail, Instagram, Microsoft, Netflix, PayPal, Epic Games, online banking, and OnlyFans. Filtering surfaced:

- 10,000+ unique victim Instagram credentials
- 17,000+ Facebook credentials

And that was within this single log file.

## Recommendations

- Enable MFA.
- Use strong, unique passwords per account.
- Monitor account activity.
- Be cautious with links and downloads.
- Stay informed about emerging threats.

<p class="note">// <b>NOTE:</b> Conducted for educational and defensive security research only. The single account accessed without MFA was logged out immediately and no data was exfiltrated.</p>
