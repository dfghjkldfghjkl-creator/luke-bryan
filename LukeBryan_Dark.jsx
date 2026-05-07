import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";

/* ══════════════════════════════════════════════════════
   LUKE BRYAN — DARK CINEMATIC IMMERSIVE PORTAL
   - Pure black/dark background (no bright colors)
   - Gold + deep purple/navy accents only
   - Particles: dark, subtle, cinematic
   - WhatsApp: full animated ring + "Talk to Luke Bryan" label
   - Connect button → WhatsApp
══════════════════════════════════════════════════════ */

const GOLD = "#c9a84c";

/* ── Blue Verified Checkmark — Twitter/X style ── */
function Verified({ size = 18 }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 22 22" fill="none"
      style={{
        display:"inline-block", verticalAlign:"middle",
        marginLeft: size < 16 ? 4 : 6, flexShrink:0,
      }}
      aria-label="Verified"
    >
      <path
        d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816z"
        fill="#1D9BF0"
      />
      <path d="M9.01 13.42L6.44 10.85l-.71.71 3.28 3.28 7.07-7.07-.71-.71z" fill="white"/>
    </svg>
  );
}
const WA_NUMBER = "1XXXXXXXXXX"; // ← Replace with real number
const WA_MSG = encodeURIComponent("Hey Luke! I just visited your official portal and wanted to reach out 🌟");
const WA_URL = `https://wa.me/${WA_NUMBER}?text=${WA_MSG}`;

const SONGS = [
  { title: "Country On",    year: "2022", cat: "Single",   col1: "#c9a84c", col2: "#ff6b35" },
  { title: "One Margarita", year: "2020", cat: "Single",   col1: "#7b2fff", col2: "#00b4d8" },
  { title: "Play It Again", year: "2013", cat: "Classic",  col1: "#ff2d55", col2: "#c9a84c" },
  { title: "Knockin' Boots",year: "2019", cat: "Hit",      col1: "#00b4d8", col2: "#7b2fff" },
  { title: "Drink a Beer",  year: "2012", cat: "Acoustic", col1: "#00c9a7", col2: "#c9a84c" },
  { title: "Most People Are Good", year: "2017", cat: "Story", col1: "#ff6b35", col2: "#ff2d55" },
];

const GALLERY = [
  { cap: "Nashville Nights",    col1: "#c9a84c", col2: "#7b2fff" },
  { cap: "On Stage",            col1: "#ff2d55", col2: "#c9a84c" },
  { cap: "Farm Life",           col1: "#00c9a7", col2: "#c9a84c" },
  { cap: "Sunset Sessions",     col1: "#ff6b35", col2: "#c9a84c" },
  { cap: "Road to the Stadium", col1: "#00b4d8", col2: "#7b2fff" },
  { cap: "Studio Sessions",     col1: "#c9a84c", col2: "#ff2d55" },
];

const REELS_DATA = [
  { title: "Country On",     views: "142M", tag: "Official", col1: "#c9a84c", col2: "#ff6b35" },
  { title: "One Margarita",  views: "98M",  tag: "Live",     col1: "#7b2fff", col2: "#00b4d8" },
  { title: "Knockin' Boots", views: "76M",  tag: "Fan Fav",  col1: "#ff2d55", col2: "#7b2fff" },
  { title: "Play It Again",  views: "211M", tag: "Classic",  col1: "#00c9a7", col2: "#00b4d8" },
  { title: "Drink a Beer",   views: "88M",  tag: "Acoustic", col1: "#c9a84c", col2: "#ff2d55" },
];

const LYRICS = [
  { song: "Play It Again",        line: "She was sitting there on a blanket with her friends", year: "2013" },
  { song: "Drink a Beer",         line: "When I got the news today, I didn't know what to say", year: "2012" },
  { song: "Country On",           line: "Keep on turning it up, keep on turning it up", year: "2022" },
  { song: "One Margarita",        line: "One margarita, two margarita, three margarita, shot", year: "2020" },
  { song: "Most People Are Good", line: "I believe most people are good", year: "2017" },
  { song: "Knockin' Boots",       line: "Baby I've been thinking 'bout you all day long", year: "2019" },
];

const AWARDS = [
  { name: "Entertainer of the Year", org: "ACM Awards",       year: "2013", icon: "★" },
  { name: "Entertainer of the Year", org: "CMA Awards",       year: "2014", icon: "★" },
  { name: "Top Country Artist",      org: "Billboard Awards", year: "2015", icon: "◆" },
  { name: "Best Country Album",      org: "AMA Awards",       year: "2014", icon: "◆" },
  { name: "Male Vocalist of Year",   org: "ACM Awards",       year: "2012", icon: "●" },
  { name: "Favorite Country Artist", org: "People's Choice",  year: "2020", icon: "●" },
];

/* ── Fan Testimonials ── */
const TESTIMONIALS = [
  { name:"Ashley R.",    location:"Nashville, TN",  stars:5, text:"I messaged Luke and actually got a reply. I literally cried. Best day of my life 😭🤍", initials:"AR" },
  { name:"Marcus D.",   location:"Atlanta, GA",    stars:5, text:"Never thought I'd talk to my favourite artist. Messaged him after his show and he responded. Unreal.", initials:"MD" },
  { name:"Kayla M.",    location:"Austin, TX",     stars:5, text:"I told him what Drink a Beer means to me. He said 'thank you from the bottom of my heart.' I'll never forget it.", initials:"KM" },
  { name:"Jake T.",     location:"Nashville, TN",  stars:5, text:"Sent a message not expecting anything. Got a voice note back. I've listened to it 100 times already 🎤", initials:"JT" },
  { name:"Brittany S.", location:"Louisville, KY", stars:5, text:"He's the most real celebrity I've ever seen. Messaged him on WhatsApp and felt like I was texting a friend.", initials:"BS" },
  { name:"Devon L.",    location:"Dallas, TX",     stars:5, text:"My daughter is his biggest fan. We messaged together and got a reply within the hour. She was over the moon 🌙", initials:"DL" },
];

/* ── Press quotes ── */
const PRESS = [
  { quote: "Luke Bryan is the undisputed king of modern country music — a performer who turns stadiums into living rooms.", pub: "Billboard", year: "2023" },
  { quote: "There is no one who commands a stage quite like Luke Bryan. He doesn't perform for the crowd — he performs with them.", pub: "Rolling Stone", year: "2022" },
  { quote: "Bryan's music speaks to the soul of America. Every song feels like a memory you didn't know you had.", pub: "People Magazine", year: "2023" },
  { quote: "A phenomenon. Luke Bryan has redefined what it means to be a country superstar in the modern era.", pub: "Entertainment Weekly", year: "2021" },
  { quote: "His live shows are unlike anything in music today — raw, joyful, and completely unforgettable.", pub: "USA Today", year: "2022" },
  { quote: "Luke Bryan doesn't just have fans. He has a family of millions who show up for him every single night.", pub: "CMT News", year: "2023" },
];

/* ── Next concert countdown target — update this date ── */
const CONCERT_DATE = new Date("2025-08-15T20:00:00");
const CONCERT_NAME = "Farm Tour 2025";

/* ── 3D Scene config ── */
const ALBUM_COLORS = [
  "#c9a84c","#7b2fff","#ff2d55","#00b4d8","#ff6b35","#00c9a7"
];

/* ── Albums for 3D Vinyl ── */
const ALBUMS = [
  { title:"I'll Stay Me",         year:"2007", tracks:["All My Friends Say","We Rode in Trucks","Country Man"], col1:"#c9a84c", col2:"#7a5f25" },
  { title:"Doin' My Thing",       year:"2009", tracks:["Do I","Someone Else Calling You Baby","Rain Is a Good Thing"], col1:"#7b2fff", col2:"#c9a84c" },
  { title:"Tailgates & Tanlines", year:"2011", tracks:["Country Girl","I Don't Want This Night to End","Drunk on You"], col1:"#ff6b35", col2:"#c9a84c" },
  { title:"Spring Break…Here to Break Up", year:"2013", tracks:["That's My Kind of Night","Play It Again","Beer in the Headlights"], col1:"#00b4d8", col2:"#7b2fff" },
  { title:"Kill the Lights",      year:"2015", tracks:["Strip It Down","Home Alone Tonight","Kick the Dust Up"], col1:"#ff2d55", col2:"#c9a84c" },
  { title:"What Makes You Country",year:"2017",tracks:["Most People Are Good","Sunrise, Sunburn, Sunset","Light It Up"], col1:"#00c9a7", col2:"#c9a84c" },
];

/* ── Career timeline for horizontal scroll ── */
const TIMELINE = [
  { year:"2007", title:"The Beginning",    desc:"Luke releases his debut album 'I'll Stay Me' from Leesburg, Georgia. Country radio takes notice.", color:"#c9a84c" },
  { year:"2009", title:"Rising Fast",      desc:"'Doin' My Thing' establishes Luke as a major force. 'Do I' becomes his first #1 hit.", color:"#7b2fff" },
  { year:"2011", title:"Breakthrough",     desc:"'Tailgates & Tanlines' explodes. 'Country Girl' becomes an anthem for a generation.", color:"#ff6b35" },
  { year:"2013", title:"Stadium Status",   desc:"Back-to-back #1 albums. Named ACM Entertainer of the Year for the first time.", color:"#00b4d8" },
  { year:"2015", title:"Ruling Country",   desc:"'Kill the Lights' debuts at #1. Luke sells out stadiums across 45 US cities.", color:"#ff2d55" },
  { year:"2017", title:"The Legacy",       desc:"'Most People Are Good' proves his depth. 7 consecutive #1 albums. A living legend.", color:"#00c9a7" },
  { year:"2022", title:"Country On",       desc:"Returns with 'Country On' — a battle cry for the genre. 75 million monthly listeners.", color:"#c9a84c" },
  { year:"2024", title:"The Reign Continues", desc:"Still selling out stadiums. Still connecting with fans one message at a time.", color:"#e8c96a" },
];

/* ─── CSS ─── */
function injectStyles() {
  if (document.getElementById("lb-styles")) return;
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&family=Cormorant+Garamond:ital,wght@0,300;1,300&display=swap');
    *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
    :root{
      --gold:#c9a84c;--gold2:#e8c96a;--gold-dim:#7a5f25;
      --black:#02020a;--deep:#05050f;--charcoal:#0a0a18;
      --glass:rgba(255,255,255,0.03);--glass-b:rgba(201,168,76,0.15);
    }
    html{scroll-behavior:smooth;overflow-x:hidden}
    body{background:var(--black);color:#fff;font-family:'Space Mono',monospace;overflow-x:hidden;cursor:none}

    /* CURSOR */
    #cur{position:fixed;width:10px;height:10px;background:var(--gold);border-radius:50%;pointer-events:none;z-index:9999;transform:translate(-50%,-50%);mix-blend-mode:difference}
    #cur-ring{position:fixed;width:38px;height:38px;border:1px solid rgba(201,168,76,.4);border-radius:50%;pointer-events:none;z-index:9998;transform:translate(-50%,-50%);transition:all .15s ease}
    #cur-ring.big{width:60px;height:60px;border-color:var(--gold)}

    /* BG CANVAS */
    #bg-canvas{position:fixed;inset:0;z-index:0;pointer-events:none}

    /* NAV */
    nav{position:fixed;top:0;left:0;right:0;z-index:200;padding:20px 5%;display:flex;justify-content:space-between;align-items:center}
    nav.solid{background:rgba(2,2,10,.92);backdrop-filter:blur(20px);border-bottom:1px solid rgba(201,168,76,.08)}
    .nav-logo{font-family:'Bebas Neue',sans-serif;font-size:26px;background:linear-gradient(135deg,var(--gold2),var(--gold));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;letter-spacing:.15em}
    .nav-links{display:flex;gap:28px;list-style:none}
    .nav-links a{font-size:9px;letter-spacing:.25em;color:rgba(255,255,255,.4);text-decoration:none;text-transform:uppercase;transition:color .3s}
    .nav-links a:hover{color:var(--gold)}

    /* HERO */
    #hero{position:relative;height:100vh;width:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:10;overflow:hidden}
    .hero-vignette{position:absolute;inset:0;background:radial-gradient(ellipse 80% 70% at 50% 50%,transparent 30%,rgba(2,2,10,.7) 100%);pointer-events:none}
    .hero-glow{position:absolute;inset:0;background:radial-gradient(ellipse 50% 40% at 50% 55%,rgba(201,168,76,.04),transparent 70%);pointer-events:none}
    .hero-eyebrow{font-size:10px;letter-spacing:.55em;color:var(--gold);text-transform:uppercase;margin-bottom:18px;opacity:0;animation:fadeUp .8s .4s forwards}
    .hero-name{font-family:'Bebas Neue',sans-serif;font-size:clamp(80px,16vw,190px);line-height:.85;letter-spacing:.06em;text-align:center;position:relative;opacity:0;animation:fadeUp 1s .6s forwards}
    .hero-name .l1{display:block;background:linear-gradient(135deg,#fff 0%,var(--gold2) 45%,var(--gold) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
    .hero-name .l2{display:block;background:linear-gradient(135deg,var(--gold) 0%,var(--gold-dim) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
    /* Glitch */
    .hero-name::before,.hero-name::after{content:attr(data-text);position:absolute;top:0;left:0;width:100%;font-family:'Bebas Neue',sans-serif;font-size:inherit;line-height:inherit;letter-spacing:inherit}
    .hero-name::before{left:2px;background:linear-gradient(135deg,rgba(201,168,76,.6),rgba(255,255,255,.3));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:g1 5s infinite;clip-path:polygon(0 18%,100% 18%,100% 32%,0 32%)}
    .hero-name::after{left:-2px;background:linear-gradient(135deg,rgba(201,168,76,.4),rgba(255,255,255,.2));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:g2 5s infinite;clip-path:polygon(0 62%,100% 62%,100% 76%,0 76%)}
    @keyframes g1{0%,93%,100%{transform:translate(0);opacity:0}94%{transform:translate(-3px,1px);opacity:.9}96%{transform:translate(3px,-1px);opacity:.6}98%{transform:translate(0);opacity:0}}
    @keyframes g2{0%,91%,100%{transform:translate(0);opacity:0}92%{transform:translate(3px,2px);opacity:.8}94%{transform:translate(-2px,-1px);opacity:.5}96%{transform:translate(0);opacity:0}}
    .hero-sub{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:clamp(16px,2vw,22px);letter-spacing:.14em;color:rgba(255,255,255,.4);margin-top:22px;text-align:center;opacity:0;animation:fadeUp .8s 1s forwards}
    .hero-divider{width:80px;height:1px;background:linear-gradient(90deg,transparent,var(--gold),transparent);margin:24px auto 0;opacity:0;animation:fadeUp .6s 1.3s forwards}
    .hero-scroll{position:absolute;bottom:38px;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:8px;opacity:0;animation:fadeUp .8s 1.6s forwards}
    .hero-scroll span{font-size:8px;letter-spacing:.45em;color:rgba(255,255,255,.25);text-transform:uppercase}
    .scroll-line{width:1px;height:48px;background:linear-gradient(to bottom,var(--gold),transparent);animation:scr 2s ease-in-out infinite}
    @keyframes scr{0%,100%{opacity:.3;transform:scaleY(1)}50%{opacity:1;transform:scaleY(1.15)}}
    @keyframes fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}

    /* SECTIONS */
    .section{position:relative;z-index:10;padding:clamp(70px,11vh,130px) 5%}
    .sec-label{font-size:9px;letter-spacing:.6em;color:var(--gold);text-transform:uppercase;margin-bottom:12px;display:flex;align-items:center;gap:12px}
    .sec-label::before{content:'';width:28px;height:1px;background:var(--gold)}
    .sec-title{font-family:'Bebas Neue',sans-serif;font-size:clamp(44px,7.5vw,100px);line-height:.92;letter-spacing:.04em;margin-bottom:56px}
    .sec-title .g{background:linear-gradient(135deg,var(--gold2),var(--gold));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}

    /* ABOUT */
    #about{background:linear-gradient(to bottom,var(--black),var(--deep),var(--black))}
    .about-grid{max-width:1280px;margin:0 auto;display:grid;grid-template-columns:1fr 1.1fr;gap:72px;align-items:center}
    .about-text p{font-family:'Cormorant Garamond',serif;font-size:17px;line-height:1.9;color:rgba(255,255,255,.55);margin-bottom:16px}
    .stats-row{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-top:44px}
    .stat-box{padding:18px;border:1px solid rgba(201,168,76,.12);background:rgba(201,168,76,.02);position:relative;overflow:hidden}
    .stat-box::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--gold),transparent)}
    .stat-n{font-family:'Bebas Neue',sans-serif;font-size:40px;background:linear-gradient(135deg,var(--gold2),var(--gold));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
    .stat-l{font-size:8px;letter-spacing:.2em;color:rgba(255,255,255,.3);text-transform:uppercase;margin-top:3px}
    .about-frame{position:relative;aspect-ratio:3/4;background:linear-gradient(145deg,#0d0d1a,#060610);border:1px solid rgba(201,168,76,.12);display:flex;align-items:center;justify-content:center;overflow:hidden}
    .about-frame canvas{position:absolute;inset:0;width:100%!important;height:100%!important}
    .about-frame-lb{position:absolute;z-index:2;font-family:'Bebas Neue',sans-serif;font-size:160px;color:rgba(201,168,76,.04);letter-spacing:.1em;user-select:none}
    .corner-tr{position:absolute;top:14px;right:14px;width:56px;height:56px;border-top:1px solid var(--gold);border-right:1px solid var(--gold)}
    .corner-bl{position:absolute;bottom:14px;left:14px;width:56px;height:56px;border-bottom:1px solid var(--gold-dim);border-left:1px solid var(--gold-dim)}

    /* CAROUSEL */
    #music{background:var(--black);overflow:hidden;padding-bottom:80px}
    .carousel-wrap{position:relative;height:500px;width:100%;perspective:1100px}
    #c-track{position:absolute;top:50%;left:50%;transform-style:preserve-3d;transform:translate(-50%,-50%) rotateY(0deg);transition:transform .85s cubic-bezier(.25,.46,.45,.94)}
    .card3d{position:absolute;width:300px;height:400px;cursor:pointer;transform-style:preserve-3d;transition:opacity .5s}
    .card-body{width:100%;height:100%;background:rgba(255,255,255,.03);border:1px solid rgba(201,168,76,.1);backdrop-filter:blur(18px);border-radius:3px;display:flex;flex-direction:column;overflow:hidden;position:relative}
    .card-body::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.06) 0%,transparent 45%);pointer-events:none;z-index:1}
    .card-art{flex:1;position:relative;overflow:hidden}
    .card-art canvas{position:absolute;inset:0;width:100%!important;height:100%!important}
    .card-info{padding:18px;background:rgba(2,2,10,.75);position:relative;z-index:2}
    .card-cat{font-size:8px;letter-spacing:.4em;color:var(--gold);text-transform:uppercase;margin-bottom:5px}
    .card-title{font-family:'Bebas Neue',sans-serif;font-size:26px;letter-spacing:.06em;line-height:1}
    .card-year{font-size:9px;color:rgba(255,255,255,.3);margin-top:3px;letter-spacing:.2em}
    .c-controls{display:flex;justify-content:center;align-items:center;gap:14px;margin-top:32px;position:relative;z-index:20}
    .c-btn{width:44px;height:44px;border:1px solid rgba(201,168,76,.25);background:rgba(201,168,76,.04);color:var(--gold);font-size:18px;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .3s}
    .c-btn:hover{background:rgba(201,168,76,.12);border-color:var(--gold)}
    .c-dot{width:8px;height:8px;border-radius:50%;border:1px solid var(--gold-dim);cursor:pointer;transition:all .3s}
    .c-dot.on{background:var(--gold);border-color:var(--gold)}

    /* REELS */
    #reels{background:linear-gradient(to bottom,var(--black),var(--deep),var(--black))}
    .reels-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:14px;max-width:1380px;margin:0 auto}
    .reel{position:relative;cursor:pointer;overflow:hidden;border:1px solid rgba(255,255,255,.05);transition:border-color .4s,transform .4s}
    .reel:hover{border-color:var(--gold);transform:translateY(-5px)}
    .reel-art{aspect-ratio:9/16;position:relative;overflow:hidden}
    .reel-art canvas{position:absolute;inset:0;width:100%!important;height:100%!important}
    .reel-play{position:absolute;z-index:2;width:48px;height:48px;border-radius:50%;background:rgba(201,168,76,.12);border:1px solid rgba(201,168,76,.35);display:flex;align-items:center;justify-content:center;transition:all .3s;backdrop-filter:blur(8px)}
    .reel:hover .reel-play{background:rgba(201,168,76,.3);transform:scale(1.1)}
    .reel-tag{position:absolute;top:10px;left:10px;z-index:3;font-size:8px;letter-spacing:.2em;text-transform:uppercase;padding:3px 7px;background:rgba(201,168,76,.88);color:#000}
    .reel-foot{padding:11px 13px;background:rgba(2,2,10,.92)}
    .reel-name{font-size:10px;letter-spacing:.1em;margin-bottom:3px}
    .reel-views{font-size:8px;color:rgba(255,255,255,.3);letter-spacing:.15em}

    /* GALLERY */
    #gallery{background:var(--black)}
    .gal-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;max-width:1380px;margin:0 auto}
    .gal-grid .gi:nth-child(1){grid-column:span 2;grid-row:span 2}
    .gal-grid .gi:nth-child(5){grid-column:span 2}
    .gi{position:relative;overflow:hidden;cursor:pointer;background:var(--deep);min-height:190px;border:1px solid rgba(255,255,255,.04);transition:border-color .4s}
    .gi:hover{border-color:rgba(201,168,76,.3)}
    .gi-inner{width:100%;height:100%;min-height:inherit;position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center;transition:transform .6s cubic-bezier(.25,.46,.45,.94)}
    .gi:hover .gi-inner{transform:scale(1.04)}
    .gi-inner canvas{position:absolute;inset:0;width:100%!important;height:100%!important}
    .gi-ov{position:absolute;inset:0;background:linear-gradient(to top,rgba(2,2,10,.95) 0%,transparent 55%);opacity:0;transition:opacity .4s;display:flex;align-items:flex-end;padding:18px;z-index:2}
    .gi:hover .gi-ov{opacity:1}
    .gi-cap{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:17px;color:#fff;letter-spacing:.06em}

    /* CONNECT */
    #connect{background:linear-gradient(to bottom,var(--black),var(--charcoal),var(--black));text-align:center;position:relative;overflow:hidden}
    .connect-glow{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:700px;height:500px;background:radial-gradient(ellipse,rgba(201,168,76,.04),transparent 70%);pointer-events:none}
    .connect-inner{max-width:560px;margin:0 auto;position:relative;z-index:1}
    .c-in{width:100%;background:rgba(255,255,255,.02);border:1px solid rgba(201,168,76,.12);color:#fff;padding:15px 18px;margin-bottom:12px;font-family:'Space Mono',monospace;font-size:11px;letter-spacing:.08em;outline:none;transition:border-color .3s}
    .c-in:focus{border-color:var(--gold)}
    .c-in::placeholder{color:rgba(255,255,255,.2)}
    textarea.c-in{resize:vertical;min-height:105px}
    /* CONNECT → WHATSAPP BUTTON */
    .wa-connect-btn{
      width:100%;padding:20px;border:none;cursor:pointer;
      position:relative;overflow:hidden;
      background:linear-gradient(135deg,#1a5c2a,#0d3318);
      display:flex;align-items:center;justify-content:center;gap:14px;
      transition:all .35s;
    }
    .wa-connect-btn:hover{background:linear-gradient(135deg,#25D366,#1a8c40);transform:translateY(-2px);box-shadow:0 10px 40px rgba(37,211,102,.3)}
    .wa-connect-btn .wa-icon{flex-shrink:0}
    .wa-connect-btn .wa-txt{display:flex;flex-direction:column;align-items:flex-start}
    .wa-connect-btn .wa-txt-top{font-family:'Bebas Neue',sans-serif;font-size:18px;letter-spacing:.3em;color:#fff}
    .wa-connect-btn .wa-txt-sub{font-size:8px;letter-spacing:.25em;color:rgba(255,255,255,.6);text-transform:uppercase;margin-top:2px}
    .wa-connect-btn::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.06) 0%,transparent 50%);pointer-events:none}
    .wa-connect-btn::after{
      content:'';position:absolute;top:-50%;left:-60%;
      width:40%;height:200%;
      background:linear-gradient(90deg,transparent,rgba(255,255,255,.08),transparent);
      transform:skewX(-20deg);
      transition:left .6s ease;
    }
    .wa-connect-btn:hover::after{left:120%}

    /* FOOTER */
    footer{position:relative;z-index:10;background:rgba(2,2,10,.97);border-top:1px solid rgba(201,168,76,.08);padding:32px 5%;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:14px}
    .f-logo{font-family:'Bebas Neue',sans-serif;font-size:20px;color:var(--gold);letter-spacing:.2em}
    .f-copy{font-size:9px;color:rgba(255,255,255,.2);letter-spacing:.15em}
    .f-socs{display:flex;gap:10px}
    .f-s{width:32px;height:32px;border:1px solid rgba(255,255,255,.08);display:flex;align-items:center;justify-content:center;font-size:9px;color:rgba(255,255,255,.35);text-decoration:none;transition:all .3s;letter-spacing:.05em}
    .f-s:hover{border-color:var(--gold);color:var(--gold)}

    /* ══ WHATSAPP FLOAT — PREMIUM NOTICEABLE ══ */
    #wa-float{
      position:fixed;right:20px;bottom:28px;z-index:9000;
      display:flex;flex-direction:column;align-items:flex-end;gap:12px;
    }

    /* Pill label — always visible, not just on hover */
    .wa-pill{
      display:flex;align-items:center;gap:10px;
      background:linear-gradient(135deg,rgba(10,30,15,.97),rgba(5,18,8,.97));
      border:1px solid rgba(37,211,102,.35);
      backdrop-filter:blur(20px);
      padding:10px 18px 10px 14px;
      border-radius:50px;
      box-shadow:0 4px 24px rgba(37,211,102,.15), 0 0 0 1px rgba(255,255,255,.04) inset;
      cursor:pointer;text-decoration:none;
      transition:all .3s cubic-bezier(.25,.46,.45,.94);
      -webkit-tap-highlight-color:rgba(37,211,102,.15);
      touch-action:manipulation;
      animation:pillFloat 3s ease-in-out infinite;
      position:relative;overflow:hidden;
    }
    /* shimmer sweep on the pill */
    .wa-pill::before{
      content:'';position:absolute;
      top:0;left:-100%;width:60%;height:100%;
      background:linear-gradient(90deg,transparent,rgba(255,255,255,.06),transparent);
      animation:pillShimmer 3s ease-in-out infinite;
      pointer-events:none;
    }
    @keyframes pillShimmer{0%{left:-100%}100%{left:200%}}
    @keyframes pillFloat{
      0%,100%{transform:translateY(0px)}
      50%{transform:translateY(-5px)}
    }
    .wa-pill:hover{
      border-color:rgba(37,211,102,.7);
      box-shadow:0 8px 40px rgba(37,211,102,.35), 0 0 0 1px rgba(255,255,255,.08) inset;
      transform:translateY(-3px) scale(1.02);
      animation:none;
    }
    .wa-pill:active{transform:scale(.97)}

    /* green dot indicator — alive/online feel */
    .wa-online-dot{
      width:8px;height:8px;border-radius:50%;
      background:#25D366;flex-shrink:0;
      box-shadow:0 0 0 0 rgba(37,211,102,.6);
      animation:onlinePing 2s ease-out infinite;
    }
    @keyframes onlinePing{
      0%{box-shadow:0 0 0 0 rgba(37,211,102,.7)}
      70%{box-shadow:0 0 0 8px rgba(37,211,102,0)}
      100%{box-shadow:0 0 0 0 rgba(37,211,102,0)}
    }

    /* pill text block */
    .wa-pill-txt{display:flex;flex-direction:column;gap:1px}
    .wa-pill-top{
      font-family:'Bebas Neue',sans-serif;font-size:15px;
      letter-spacing:.12em;color:#fff;line-height:1;
    }
    .wa-pill-sub{
      font-size:8px;letter-spacing:.2em;
      color:rgba(255,255,255,.5);text-transform:uppercase;
    }

    /* WA icon in pill */
    .wa-pill-icon{flex-shrink:0;display:flex;align-items:center;justify-content:center}

    /* Main round button — sits separately below pill */
    .wa-circle-wrap{
      position:relative;width:68px;height:68px;
      display:flex;align-items:center;justify-content:center;
      pointer-events:none;
    }
    /* triple glow rings — decorative, no touch */
    .wa-glow-ring{
      position:absolute;border-radius:50%;
      border:1px solid rgba(37,211,102,.5);
      pointer-events:none;
    }
    .wa-glow-ring:nth-child(1){width:68px;height:68px;animation:glowRing 2.5s ease-out infinite}
    .wa-glow-ring:nth-child(2){width:68px;height:68px;animation:glowRing 2.5s ease-out infinite;animation-delay:.8s}
    .wa-glow-ring:nth-child(3){width:68px;height:68px;animation:glowRing 2.5s ease-out infinite;animation-delay:1.6s}
    @keyframes glowRing{
      0%{transform:scale(1);opacity:.8;border-color:rgba(37,211,102,.6)}
      100%{transform:scale(2.4);opacity:0;border-color:rgba(37,211,102,0)}
    }
    /* gold orbit */
    .wa-gold-orbit{
      position:absolute;width:84px;height:84px;border-radius:50%;
      border:1px solid transparent;
      border-top-color:var(--gold);border-right-color:var(--gold);
      animation:waOrbit2 5s linear infinite;pointer-events:none;
    }
    @keyframes waOrbit2{from{transform:rotate(0)}to{transform:rotate(360deg)}}
    .wa-gold-dot{
      position:absolute;width:7px;height:7px;background:var(--gold);
      border-radius:50%;top:-3.5px;left:50%;transform:translateX(-50%);
      box-shadow:0 0 10px var(--gold),0 0 20px rgba(201,168,76,.4);
      pointer-events:none;
    }
    /* THE CIRCLE BUTTON */
    .wa-circle-btn{
      position:absolute;z-index:9999;
      width:68px;height:68px;border-radius:50%;
      background:linear-gradient(145deg,#0a2a10,#051508);
      border:2px solid rgba(37,211,102,.5);
      display:flex;align-items:center;justify-content:center;
      text-decoration:none;
      -webkit-tap-highlight-color:rgba(37,211,102,.2);
      touch-action:manipulation;cursor:pointer;
      transition:all .25s;
      box-shadow:
        0 4px 20px rgba(37,211,102,.25),
        0 0 40px rgba(37,211,102,.08),
        inset 0 1px 0 rgba(255,255,255,.08);
      outline:20px solid transparent;
    }
    .wa-circle-btn:hover,.wa-circle-btn:active{
      border-color:#25D366;
      box-shadow:0 6px 32px rgba(37,211,102,.45),0 0 60px rgba(37,211,102,.15);
      transform:scale(1.1);
    }
    /* rotating "TALK TO LUKE BRYAN" around the circle */
    .wa-orbit-text{
      position:absolute;width:110px;height:110px;
      animation:rotateTxt2 10s linear infinite;
      pointer-events:none;z-index:1;
    }
    @keyframes rotateTxt2{from{transform:rotate(0)}to{transform:rotate(360deg)}}

    /* DIVIDER */
    .divider{position:relative;z-index:10;height:1px;margin:0 5%;background:linear-gradient(90deg,transparent,rgba(201,168,76,.25),rgba(201,168,76,.1),transparent)}

    /* REVEAL */
    .reveal{opacity:0;transform:translateY(36px);transition:opacity .9s ease,transform .9s ease}
    .reveal.visible{opacity:1;transform:none}

    /* RESPONSIVE */
    @media(max-width:768px){
      .about-grid{grid-template-columns:1fr;gap:36px}
      .about-frame{order:-1;aspect-ratio:16/9}
      .stats-row{grid-template-columns:repeat(2,1fr)}
      .gal-grid{grid-template-columns:repeat(2,1fr)}
      .gal-grid .gi:nth-child(1){grid-column:span 2;grid-row:span 1}
      .gal-grid .gi:nth-child(5){grid-column:span 2}
      .nav-links{display:none}
      footer{flex-direction:column;text-align:center}
      .wa-rotating-text{display:none}
      .lyric-line{font-size:clamp(28px,7vw,56px)!important}
      .awards-grid{grid-template-columns:1fr!important}
      .lb-modal-nav{width:44px!important;height:44px!important}
      .press-grid{grid-template-columns:1fr!important}
      .countdown-row{gap:16px!important}
      .cd-num{font-size:clamp(52px,14vw,90px)!important}
      .vinyl-grid{grid-template-columns:repeat(2,1fr)!important}
      .tl-track{min-width:85vw!important}
      .chapter-title{font-size:clamp(52px,14vw,100px)!important}
      .mag-grid{grid-template-columns:1fr!important}
      .testi-grid{grid-template-columns:1fr}
      .hero-wa-btn{padding:14px 20px;gap:10px}
      .hero-wa-top{font-size:16px}
    }

    .hero-video-wrap{
      position:absolute;inset:0;z-index:0;
      overflow:hidden;
      background:#02020a;
    }
    .hero-video-wrap canvas{
      position:absolute;inset:0;
      width:100%!important;height:100%!important;
      display:block;
    }
    /* hero parallax bg */
    .hero-parallax-bg{
      position:absolute;inset:-5%;z-index:0;
      will-change:transform;
    }

    /* ══ 2. HORIZONTAL TIMELINE ══ */
    #timeline{
      position:relative;z-index:10;
      background:var(--black);
      padding:clamp(60px,10vh,120px) 0;
      overflow:hidden;
    }
    .tl-header{padding:0 5%;margin-bottom:48px}
    .tl-scroll{
      display:flex;gap:0;
      overflow-x:auto;
      scroll-snap-type:x mandatory;
      scrollbar-width:none;
      padding:0 5% 40px;
      cursor:grab;
    }
    .tl-scroll::-webkit-scrollbar{display:none}
    .tl-scroll.grabbing{cursor:grabbing}
    .tl-track{
      flex:0 0 min(520px,80vw);
      scroll-snap-align:start;
      padding:0 40px 0 0;
      position:relative;
    }
    /* year bubble */
    .tl-year{
      font-family:'Bebas Neue',sans-serif;
      font-size:clamp(72px,10vw,120px);
      line-height:1;letter-spacing:.04em;
      opacity:.08;
      position:absolute;top:0;left:0;
      pointer-events:none;
      transition:opacity .4s,transform .4s;
    }
    .tl-track:hover .tl-year{opacity:.18;transform:scale(1.03)}
    .tl-card{
      margin-top:60px;
      padding:32px;
      background:rgba(255,255,255,.03);
      border:1px solid rgba(255,255,255,.07);
      position:relative;overflow:hidden;
      transition:border-color .4s,transform .4s;
    }
    .tl-card:hover{border-color:var(--gold);transform:translateY(-4px)}
    .tl-card::before{
      content:'';position:absolute;top:0;left:0;right:0;height:2px;
      transition:background .4s;
    }
    .tl-card:hover::before{background:linear-gradient(90deg,transparent,var(--gold),transparent)}
    .tl-dot{
      width:12px;height:12px;border-radius:50%;
      border:2px solid;margin-bottom:20px;
      box-shadow:0 0 12px currentColor;
    }
    .tl-title{
      font-family:'Bebas Neue',sans-serif;font-size:28px;
      letter-spacing:.06em;margin-bottom:12px;
    }
    .tl-desc{
      font-family:'Cormorant Garamond',serif;font-style:italic;
      font-size:16px;line-height:1.75;color:rgba(255,255,255,.55);
    }
    /* horizontal progress line */
    .tl-line{
      position:absolute;bottom:100px;left:5%;right:5%;
      height:1px;background:rgba(255,255,255,.06);
    }
    .tl-drag-hint{
      text-align:center;
      font-size:9px;letter-spacing:.3em;color:rgba(255,255,255,.2);
      text-transform:uppercase;margin-top:16px;padding:0 5%;
      animation:hintFade 2s ease-in-out infinite;
    }
    @keyframes hintFade{0%,100%{opacity:.4}50%{opacity:1}}

    /* ══ 3. PARALLAX HERO ══ */
    /* handled via JS inline styles on hero elements */
    .hero-parallax-bg{
      position:absolute;inset:-10%;z-index:0;
      will-change:transform;
      transition:transform .1s linear;
    }
    .hero-parallax-mid{
      position:relative;z-index:2;
      will-change:transform;
    }

    /* ══ 4. MAGNETIC BUTTONS ══ */
    .magnetic{
      display:inline-block;
      transition:transform .4s cubic-bezier(.25,.46,.45,.94);
      will-change:transform;
    }

    /* ══ 6. SMOOTH SECTION TRANSITIONS — gold curtain ══ */
    .curtain{
      position:fixed;top:0;left:0;right:0;bottom:0;
      z-index:8000;pointer-events:none;
      transform:scaleY(0);transform-origin:bottom;
      background:linear-gradient(135deg,var(--black) 0%,rgba(201,168,76,.08) 50%,var(--black) 100%);
    }
    .curtain.drop{animation:curtainDrop .6s cubic-bezier(.76,0,.24,1) forwards}
    .curtain.lift{animation:curtainLift .6s cubic-bezier(.76,0,.24,1) forwards}
    @keyframes curtainDrop{0%{transform:scaleY(0);transform-origin:bottom}100%{transform:scaleY(1);transform-origin:bottom}}
    @keyframes curtainLift{0%{transform:scaleY(1);transform-origin:top}100%{transform:scaleY(0);transform-origin:top}}

    /* ══ 7. TILT CARD ══ */
    .tilt{
      transform-style:preserve-3d;
      transition:transform .1s ease;
      will-change:transform;
    }
    .tilt-shine{
      position:absolute;inset:0;
      background:radial-gradient(circle at 50% 50%,rgba(255,255,255,.08),transparent 60%);
      pointer-events:none;z-index:10;
      transition:background .15s ease;
    }

    /* ══ 13. SIGNATURE SVG ANIMATION ══ */
    #signature-section{
      position:relative;z-index:10;
      padding:clamp(40px,6vh,80px) 5%;
      display:flex;align-items:center;justify-content:center;
      overflow:hidden;
      background:var(--black);
    }
    .sig-svg{
      width:min(600px,90vw);height:auto;
      overflow:visible;
    }
    .sig-path{
      fill:none;stroke:var(--gold);stroke-width:1.5;
      stroke-linecap:round;stroke-linejoin:round;
      stroke-dasharray:2000;stroke-dashoffset:2000;
      filter:drop-shadow(0 0 6px rgba(201,168,76,.5));
    }
    .sig-path.drawn{
      animation:sigDraw 2.5s cubic-bezier(.4,0,.2,1) forwards;
    }
    @keyframes sigDraw{to{stroke-dashoffset:0}}

    /* ══ 17. 3D VINYL RECORDS ══ */
    #vinyl{
      position:relative;z-index:10;
      background:linear-gradient(to bottom,var(--black),var(--deep),var(--black));
      padding:clamp(70px,11vh,130px) 5%;
      overflow:hidden;
    }
    .vinyl-grid{
      display:grid;grid-template-columns:repeat(3,1fr);
      gap:32px;max-width:1280px;margin:0 auto;
    }
    .vinyl-card{
      position:relative;cursor:pointer;
      transition:transform .4s cubic-bezier(.25,.46,.45,.94);
    }
    .vinyl-card:hover{transform:translateY(-8px)}
    .vinyl-scene{
      position:relative;width:100%;padding-bottom:100%;
      perspective:600px;margin-bottom:20px;
    }
    .vinyl-disc{
      position:absolute;inset:0;border-radius:50%;
      background:radial-gradient(circle at 30% 30%,#2a2a2a,#0a0a0a);
      box-shadow:
        0 20px 60px rgba(0,0,0,.8),
        inset 0 1px 0 rgba(255,255,255,.05);
      transform-style:preserve-3d;
      animation:vinylSpin 8s linear infinite paused;
      transition:animation-play-state .3s;
    }
    .vinyl-card:hover .vinyl-disc{animation-play-state:running}
    @keyframes vinylSpin{from{transform:rotateY(-15deg) rotateX(5deg) rotate(0deg)}to{transform:rotateY(-15deg) rotateX(5deg) rotate(360deg)}}
    /* grooves */
    .vinyl-disc::before{
      content:'';position:absolute;inset:8%;border-radius:50%;
      border:1px solid rgba(255,255,255,.03);
      box-shadow:
        0 0 0 8px rgba(255,255,255,.02),
        0 0 0 16px rgba(255,255,255,.015),
        0 0 0 24px rgba(255,255,255,.01),
        0 0 0 32px rgba(255,255,255,.008);
    }
    /* center label */
    .vinyl-label{
      position:absolute;top:50%;left:50%;
      transform:translate(-50%,-50%);
      width:32%;height:32%;border-radius:50%;
      display:flex;align-items:center;justify-content:center;
      flex-direction:column;gap:2px;
      z-index:2;
    }
    .vinyl-label-text{
      font-family:'Bebas Neue',sans-serif;font-size:clamp(7px,1.2vw,10px);
      letter-spacing:.1em;text-align:center;line-height:1.2;
    }
    .vinyl-hole{
      width:8px;height:8px;border-radius:50%;
      background:#000;border:1px solid rgba(255,255,255,.1);
      margin:0 auto;
    }
    /* light reflection on vinyl */
    .vinyl-disc::after{
      content:'';position:absolute;inset:0;border-radius:50%;
      background:linear-gradient(135deg,rgba(255,255,255,.08) 0%,transparent 40%,transparent 60%,rgba(255,255,255,.02) 100%);
      pointer-events:none;
    }
    .vinyl-info{text-align:center}
    .vinyl-title{
      font-family:'Bebas Neue',sans-serif;font-size:18px;
      letter-spacing:.1em;margin-bottom:4px;
    }
    .vinyl-year{font-size:9px;letter-spacing:.25em;color:rgba(255,255,255,.3);text-transform:uppercase}
    /* track listing on hover */
    .vinyl-tracks{
      margin-top:10px;opacity:0;transform:translateY(6px);
      transition:opacity .3s,transform .3s;
    }
    .vinyl-card:hover .vinyl-tracks{opacity:1;transform:none}
    .vinyl-track{
      font-size:9px;letter-spacing:.1em;color:rgba(255,255,255,.4);
      padding:3px 0;border-bottom:1px solid rgba(255,255,255,.04);
    }

    /* ══ 20. NUMBER COUNTER ══ */
    .stat-n{
      font-family:'Bebas Neue',sans-serif;font-size:40px;
      background:linear-gradient(135deg,var(--gold2),var(--gold));
      -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
      display:inline-block;min-width:60px;
    }

    /* ══ LOADING SCREEN ══ */
    #loader{
      position:fixed;inset:0;z-index:9999;
      background:var(--black);
      display:flex;flex-direction:column;
      align-items:center;justify-content:center;
      transition:opacity .8s ease, visibility .8s ease;
    }
    #loader.hidden{opacity:0;visibility:hidden;pointer-events:none}
    .loader-canvas{position:absolute;inset:0;pointer-events:none}
    .loader-content{position:relative;z-index:2;text-align:center}
    .loader-lb{
      font-family:'Bebas Neue',sans-serif;
      font-size:clamp(80px,20vw,180px);
      letter-spacing:.1em;line-height:1;
      background:linear-gradient(135deg,#fff 0%,var(--gold2) 40%,var(--gold) 70%,var(--gold-dim) 100%);
      -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
      animation:loaderPulse 1.5s ease-in-out infinite alternate;
    }
    @keyframes loaderPulse{
      from{filter:drop-shadow(0 0 20px rgba(201,168,76,.3))}
      to{filter:drop-shadow(0 0 60px rgba(201,168,76,.8))}
    }
    .loader-sub{
      font-family:'Cinzel',serif;font-size:clamp(9px,1.5vw,13px);
      letter-spacing:.6em;color:var(--gold);text-transform:uppercase;
      margin-top:16px;opacity:.7;
    }
    .loader-bar-wrap{
      width:200px;height:1px;background:rgba(201,168,76,.15);
      margin:32px auto 0;overflow:hidden;
    }
    .loader-bar{
      height:100%;width:0%;
      background:linear-gradient(90deg,transparent,var(--gold),var(--gold2));
      animation:loaderFill 2.2s cubic-bezier(.4,0,.2,1) forwards;
    }
    @keyframes loaderFill{from{width:0%}to{width:100%}}
    .loader-dots{
      display:flex;gap:8px;justify-content:center;margin-top:20px;
    }
    .loader-dot{
      width:4px;height:4px;border-radius:50%;background:var(--gold);opacity:.3;
      animation:loaderDot 1.2s ease-in-out infinite;
    }
    .loader-dot:nth-child(2){animation-delay:.2s}
    .loader-dot:nth-child(3){animation-delay:.4s}
    @keyframes loaderDot{0%,100%{opacity:.3;transform:scale(1)}50%{opacity:1;transform:scale(1.5)}}
    /* WhatsApp CTA on loader */
    .loader-wa{
      display:flex;align-items:center;gap:8px;
      margin-top:32px;
      padding:10px 22px;
      background:rgba(37,211,102,.08);
      border:1px solid rgba(37,211,102,.25);
      border-radius:50px;
      animation:loaderWaFade 1s ease .8s both;
    }
    @keyframes loaderWaFade{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
    .loader-wa span{
      font-family:'Bebas Neue',sans-serif;
      font-size:13px;letter-spacing:.2em;
      color:rgba(255,255,255,.7);text-transform:uppercase;
    }

    /* ══ CURSOR TRAIL ══ */
    .trail-dot{
      position:fixed;pointer-events:none;z-index:9997;
      border-radius:50%;transform:translate(-50%,-50%);
      mix-blend-mode:screen;
    }

    /* ══ COUNTDOWN ══ */
    #countdown{
      position:relative;z-index:10;
      background:linear-gradient(to bottom,var(--black),#08081a,var(--black));
      padding:clamp(60px,10vh,120px) 5%;
      text-align:center;overflow:hidden;
    }
    .countdown-glow{
      position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
      width:800px;height:400px;
      background:radial-gradient(ellipse,rgba(201,168,76,.05),transparent 70%);
      pointer-events:none;
    }
    .countdown-event{
      font-family:'Cinzel',serif;font-size:clamp(9px,1.5vw,12px);
      letter-spacing:.5em;color:var(--gold);text-transform:uppercase;
      margin-bottom:8px;
    }
    .countdown-title{
      font-family:'Bebas Neue',sans-serif;font-size:clamp(36px,6vw,80px);
      letter-spacing:.06em;margin-bottom:48px;
    }
    .countdown-title span{
      background:linear-gradient(135deg,var(--gold2),var(--gold));
      -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
    }
    .countdown-row{
      display:flex;justify-content:center;align-items:flex-start;
      gap:clamp(16px,4vw,60px);flex-wrap:wrap;
      max-width:800px;margin:0 auto;
    }
    .cd-unit{display:flex;flex-direction:column;align-items:center;gap:10px}
    .cd-num{
      font-family:'Bebas Neue',sans-serif;
      font-size:clamp(64px,12vw,120px);
      line-height:1;letter-spacing:.04em;
      background:linear-gradient(135deg,#fff 0%,var(--gold2) 50%,var(--gold) 100%);
      -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
      /* flip animation on change */
      transition:transform .15s ease,opacity .15s ease;
      display:block;min-width:2ch;text-align:center;
    }
    .cd-num.flip{transform:rotateX(90deg);opacity:0}
    .cd-sep{
      font-family:'Bebas Neue',sans-serif;
      font-size:clamp(48px,8vw,90px);
      color:rgba(201,168,76,.4);line-height:1;
      margin-top:4px;
    }
    .cd-label{
      font-size:8px;letter-spacing:.4em;
      color:rgba(255,255,255,.3);text-transform:uppercase;
    }
    /* glass box around each number */
    .cd-box{
      padding:16px 20px;
      background:rgba(201,168,76,.03);
      border:1px solid rgba(201,168,76,.12);
      position:relative;overflow:hidden;min-width:90px;text-align:center;
    }
    .cd-box::before{
      content:'';position:absolute;top:0;left:0;right:0;height:1px;
      background:linear-gradient(90deg,transparent,var(--gold),transparent);
    }

    /* ══ PRESS SECTION ══ */
    #press{
      background:var(--black);
      padding:clamp(70px,11vh,130px) 5%;
      position:relative;overflow:hidden;
    }
    #press::before{
      content:'';position:absolute;inset:0;
      background:radial-gradient(ellipse 70% 50% at 50% 50%,rgba(201,168,76,.025),transparent 70%);
      pointer-events:none;
    }
    .press-grid{
      display:grid;grid-template-columns:repeat(3,1fr);
      gap:1px;background:rgba(201,168,76,.07);
      max-width:1280px;margin:0 auto;
      border:1px solid rgba(201,168,76,.07);
    }
    .press-card{
      background:var(--black);padding:40px 32px;
      position:relative;overflow:hidden;
      transition:background .4s;
    }
    .press-card:hover{background:rgba(201,168,76,.02)}
    /* quote mark */
    .press-quote-mark{
      font-family:'Cormorant Garamond',serif;font-size:80px;
      line-height:.8;color:rgba(201,168,76,.15);
      margin-bottom:16px;display:block;
    }
    .press-text{
      font-family:'Cormorant Garamond',serif;font-style:italic;
      font-size:clamp(15px,1.4vw,18px);line-height:1.75;
      color:rgba(255,255,255,.7);margin-bottom:24px;
      position:relative;z-index:1;
    }
    .press-footer{
      display:flex;align-items:center;gap:12px;
    }
    .press-line{width:24px;height:1px;background:var(--gold)}
    .press-pub{
      font-family:'Bebas Neue',sans-serif;font-size:14px;
      letter-spacing:.2em;color:var(--gold);
    }
    .press-year{
      font-size:9px;letter-spacing:.2em;color:rgba(255,255,255,.25);
      margin-left:auto;
    }
    /* shimmer on hover */
    .press-card::after{
      content:'';position:absolute;top:0;left:-100%;width:50%;height:100%;
      background:linear-gradient(90deg,transparent,rgba(201,168,76,.04),transparent);
      transition:left .6s ease;pointer-events:none;
    }
    .press-card:hover::after{left:150%}
    /* top accent line */
    .press-card::before{
      content:'';position:absolute;top:0;left:0;right:0;height:1px;
      background:linear-gradient(90deg,transparent,rgba(201,168,76,.3),transparent);
      transform:scaleX(0);transition:transform .5s ease;transform-origin:left;
    }
    .press-card:hover::before{transform:scaleX(1)}

    /* ══ HERO WHATSAPP BUTTON ══ */
    .hero-wa-btn{
      position:relative;
      display:inline-flex;align-items:center;gap:14px;
      padding:16px 28px;
      margin-top:28px;
      background:linear-gradient(135deg,rgba(10,40,18,.97),rgba(5,22,10,.97));
      border:1px solid rgba(37,211,102,.45);
      border-radius:60px;
      text-decoration:none;
      overflow:hidden;
      /* Touch — instant response, zero delay */
      touch-action:manipulation;
      -webkit-tap-highlight-color:rgba(37,211,102,.2);
      cursor:pointer;
      transition:transform .2s ease, box-shadow .2s ease, border-color .2s ease;
      box-shadow:
        0 0 0 1px rgba(255,255,255,.04) inset,
        0 6px 32px rgba(37,211,102,.2),
        0 0 60px rgba(37,211,102,.08);
      animation:heroWaFloat 3s ease-in-out infinite;
      z-index:3;
    }
    @keyframes heroWaFloat{
      0%,100%{transform:translateY(0)}
      50%{transform:translateY(-6px)}
    }
    /* Glowing shimmer sweep */
    .hero-wa-btn::before{
      content:'';position:absolute;
      top:0;left:-100%;width:55%;height:100%;
      background:linear-gradient(90deg,transparent,rgba(37,211,102,.08),transparent);
      animation:heroWaShimmer 2.5s ease-in-out infinite;
      pointer-events:none;
    }
    @keyframes heroWaShimmer{0%{left:-100%}100%{left:200%}}
    .hero-wa-btn:hover,.hero-wa-btn:active{
      border-color:rgba(37,211,102,.85);
      box-shadow:0 8px 48px rgba(37,211,102,.4),0 0 80px rgba(37,211,102,.12);
      transform:translateY(-4px) scale(1.02);
      animation:none;
    }
    .hero-wa-btn:active{transform:scale(.97)!important}
    /* Pulse rings */
    .hero-wa-ring{
      position:absolute;inset:0;border-radius:60px;
      border:1px solid rgba(37,211,102,.5);
      animation:heroRing 2.5s ease-out infinite;
      pointer-events:none;
    }
    .hero-wa-ring:nth-child(2){animation-delay:1.2s}
    @keyframes heroRing{
      0%{transform:scale(1);opacity:.7}
      100%{transform:scale(1.12);opacity:0}
    }
    /* Online dot */
    .hero-wa-online{
      position:absolute;top:14px;right:28px;
      width:7px;height:7px;border-radius:50%;
      background:#25D366;
      box-shadow:0 0 0 0 rgba(37,211,102,.6);
      animation:onlinePing2 2s ease-out infinite;
      pointer-events:none;
    }
    @keyframes onlinePing2{
      0%{box-shadow:0 0 0 0 rgba(37,211,102,.7)}
      70%{box-shadow:0 0 0 8px rgba(37,211,102,0)}
      100%{box-shadow:0 0 0 0 rgba(37,211,102,0)}
    }
    .hero-wa-top{
      display:block;
      font-family:'Bebas Neue',sans-serif;
      font-size:clamp(16px,2.5vw,22px);
      letter-spacing:.15em;color:#fff;line-height:1;
    }
    .hero-wa-sub{
      display:block;
      font-size:10px;letter-spacing:.2em;
      color:rgba(255,255,255,.45);margin-top:3px;
      text-transform:uppercase;
    }

    /* ══ FAN TESTIMONIALS ══ */
    #testimonials{
      background:linear-gradient(to bottom,var(--black),var(--deep),var(--black));
      padding:clamp(70px,11vh,130px) 5%;
      position:relative;overflow:hidden;
    }
    #testimonials::before{
      content:'';position:absolute;inset:0;
      background:radial-gradient(ellipse 70% 50% at 50% 50%,rgba(37,211,102,.02),transparent 70%);
      pointer-events:none;
    }
    .testi-grid{
      display:grid;grid-template-columns:repeat(3,1fr);
      gap:16px;max-width:1280px;margin:0 auto;
    }
    .testi-card{
      background:rgba(255,255,255,.025);
      border:1px solid rgba(255,255,255,.07);
      padding:28px;position:relative;overflow:hidden;
      transition:border-color .4s,background .4s,transform .4s;
    }
    .testi-card:hover{
      border-color:rgba(37,211,102,.25);
      background:rgba(37,211,102,.03);
      transform:translateY(-4px);
    }
    /* Green top accent on hover */
    .testi-card::before{
      content:'';position:absolute;top:0;left:0;right:0;height:1px;
      background:linear-gradient(90deg,transparent,rgba(37,211,102,.5),transparent);
      transform:scaleX(0);transition:transform .5s;transform-origin:left;
    }
    .testi-card:hover::before{transform:scaleX(1)}
    /* Stars */
    .testi-stars{
      display:flex;gap:3px;margin-bottom:16px;
    }
    .testi-star{
      color:#25D366;font-size:14px;
      filter:drop-shadow(0 0 4px rgba(37,211,102,.5));
    }
    .testi-text{
      font-family:'Cormorant Garamond',serif;font-style:italic;
      font-size:clamp(15px,1.3vw,17px);line-height:1.75;
      color:rgba(255,255,255,.75);margin-bottom:20px;
    }
    .testi-footer{display:flex;align-items:center;gap:12px}
    /* Avatar circle */
    .testi-avatar{
      width:40px;height:40px;border-radius:50%;
      background:linear-gradient(135deg,rgba(37,211,102,.2),rgba(37,211,102,.05));
      border:1px solid rgba(37,211,102,.25);
      display:flex;align-items:center;justify-content:center;
      flex-shrink:0;
      font-family:'Bebas Neue',sans-serif;font-size:13px;
      color:rgba(37,211,102,.8);letter-spacing:.05em;
    }
    .testi-name{
      font-family:'Bebas Neue',sans-serif;font-size:14px;
      letter-spacing:.12em;color:#fff;
    }
    .testi-loc{font-size:9px;letter-spacing:.18em;color:rgba(255,255,255,.3);margin-top:2px}
    /* WA badge on card */
    .testi-wa-badge{
      position:absolute;top:16px;right:16px;
      display:flex;align-items:center;gap:5px;
      padding:4px 8px;
      background:rgba(37,211,102,.1);
      border:1px solid rgba(37,211,102,.2);
      border-radius:20px;
    }
    .testi-wa-badge span{font-size:8px;letter-spacing:.15em;color:rgba(37,211,102,.8);text-transform:uppercase}
    /* CTA below grid */
    .testi-cta-wrap{
      text-align:center;margin-top:48px;
    }
    .testi-cta{
      display:inline-flex;align-items:center;gap:12px;
      padding:18px 36px;border-radius:60px;
      background:linear-gradient(135deg,#0a2a12,#051508);
      border:1px solid rgba(37,211,102,.4);
      text-decoration:none;
      font-family:'Bebas Neue',sans-serif;font-size:16px;
      letter-spacing:.2em;color:#fff;
      touch-action:manipulation;
      -webkit-tap-highlight-color:rgba(37,211,102,.25);
      cursor:pointer;
      transition:all .25s;
      box-shadow:0 4px 28px rgba(37,211,102,.18);
    }
    .testi-cta:hover,.testi-cta:active{
      border-color:#25D366;
      box-shadow:0 8px 40px rgba(37,211,102,.35);
      transform:translateY(-2px);
    }
    .testi-cta:active{transform:scale(.97)}
    .testi-counter{
      font-family:'Cormorant Garamond',serif;font-style:italic;
      font-size:15px;color:rgba(255,255,255,.4);
      margin-top:16px;letter-spacing:.06em;
    }
    .testi-counter strong{color:rgba(37,211,102,.7);font-style:normal;font-family:'Bebas Neue',sans-serif;font-size:18px}
    @media(max-width:768px){
      .testi-grid{grid-template-columns:1fr}
      .hero-wa-btn{padding:14px 20px;gap:10px}
      .hero-wa-top{font-size:16px}
    }
    .lb-overlay{
      position:fixed;inset:0;z-index:1000;
      display:flex;align-items:center;justify-content:center;
      opacity:0;pointer-events:none;
      transition:opacity .4s ease;
    }
    .lb-overlay.open{opacity:1;pointer-events:all}
    /* dark blurred backdrop */
    .lb-backdrop{
      position:absolute;inset:0;
      background:rgba(2,2,10,.92);
      backdrop-filter:blur(24px);
      -webkit-backdrop-filter:blur(24px);
    }
    /* frosted glass panel — like the video */
    .lb-panel{
      position:relative;z-index:2;
      width:min(92vw,900px);
      max-height:92vh;
      background:rgba(255,255,255,.04);
      border:1px solid rgba(201,168,76,.2);
      backdrop-filter:blur(40px);
      -webkit-backdrop-filter:blur(40px);
      box-shadow:
        0 0 0 1px rgba(255,255,255,.06) inset,
        0 40px 80px rgba(0,0,0,.8),
        0 0 120px rgba(201,168,76,.06);
      display:flex;flex-direction:column;
      overflow:hidden;
      transform:scale(.92) translateY(20px);
      transition:transform .45s cubic-bezier(.25,.46,.45,.94);
    }
    .lb-overlay.open .lb-panel{transform:scale(1) translateY(0)}
    /* live animated background inside the glass panel */
    .lb-art{
      position:relative;width:100%;
      aspect-ratio:16/9;overflow:hidden;flex-shrink:0;
    }
    .lb-art canvas{position:absolute;inset:0;width:100%!important;height:100%!important}
    /* glitch scanline overlay on the art */
    .lb-art::after{
      content:'';position:absolute;inset:0;
      background:repeating-linear-gradient(
        0deg,
        transparent,transparent 2px,
        rgba(0,0,0,.08) 2px,rgba(0,0,0,.08) 4px
      );
      pointer-events:none;z-index:2;
      animation:scanlines 8s linear infinite;
    }
    @keyframes scanlines{0%{background-position:0 0}100%{background-position:0 40px}}
    /* gold shimmer sweep across glass */
    .lb-art::before{
      content:'';position:absolute;
      top:0;left:-100%;width:60%;height:100%;
      background:linear-gradient(90deg,transparent,rgba(201,168,76,.06),transparent);
      animation:glassShimmer 4s ease-in-out infinite;
      z-index:3;pointer-events:none;
    }
    @keyframes glassShimmer{0%{left:-100%}100%{left:200%}}
    .lb-info{
      padding:28px 32px;
      background:rgba(2,2,10,.6);
      border-top:1px solid rgba(201,168,76,.1);
    }
    .lb-cat{font-size:8px;letter-spacing:.5em;color:var(--gold);text-transform:uppercase;margin-bottom:8px}
    .lb-title{font-family:'Bebas Neue',sans-serif;font-size:clamp(28px,4vw,48px);letter-spacing:.06em;line-height:1}
    .lb-desc{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:15px;color:rgba(255,255,255,.45);margin-top:10px;letter-spacing:.04em;line-height:1.7}
    /* corner accents on the glass panel */
    .lb-corner{position:absolute;width:20px;height:20px;z-index:4}
    .lb-corner.tl{top:0;left:0;border-top:1px solid var(--gold);border-left:1px solid var(--gold)}
    .lb-corner.tr{top:0;right:0;border-top:1px solid var(--gold);border-right:1px solid var(--gold)}
    .lb-corner.bl{bottom:0;left:0;border-bottom:1px solid var(--gold);border-left:1px solid var(--gold)}
    .lb-corner.br{bottom:0;right:0;border-bottom:1px solid var(--gold);border-right:1px solid var(--gold)}
    /* close button */
    .lb-close{
      position:absolute;top:16px;right:16px;z-index:10;
      width:40px;height:40px;
      background:rgba(2,2,10,.7);border:1px solid rgba(201,168,76,.25);
      color:rgba(255,255,255,.6);font-size:18px;
      display:flex;align-items:center;justify-content:center;
      cursor:pointer;transition:all .25s;
      backdrop-filter:blur(8px);
      -webkit-tap-highlight-color:transparent;touch-action:manipulation;
    }
    .lb-close:hover{background:rgba(201,168,76,.15);color:#fff;border-color:var(--gold)}
    /* prev/next nav */
    .lb-nav{
      position:absolute;top:50%;transform:translateY(-50%);z-index:10;
      width:52px;height:52px;
      background:rgba(2,2,10,.6);border:1px solid rgba(201,168,76,.2);
      color:var(--gold);font-size:22px;
      display:flex;align-items:center;justify-content:center;
      cursor:pointer;transition:all .25s;backdrop-filter:blur(8px);
      -webkit-tap-highlight-color:transparent;touch-action:manipulation;
    }
    .lb-nav:hover{background:rgba(201,168,76,.12);border-color:var(--gold)}
    .lb-nav.prev{left:-26px}
    .lb-nav.next{right:-26px}
    /* dot indicators */
    .lb-dots{display:flex;gap:8px;justify-content:center;margin-top:16px}
    .lb-dot{width:6px;height:6px;border-radius:50%;border:1px solid rgba(201,168,76,.4);cursor:pointer;transition:all .3s}
    .lb-dot.on{background:var(--gold);border-color:var(--gold)}
    /* expand icon on gallery items */
    .gi-expand{
      position:absolute;top:14px;right:14px;z-index:3;
      width:32px;height:32px;
      background:rgba(2,2,10,.6);border:1px solid rgba(201,168,76,.3);
      display:flex;align-items:center;justify-content:center;
      opacity:0;transition:opacity .3s;backdrop-filter:blur(8px);
    }
    .gi:hover .gi-expand{opacity:1}

    /* ══ LYRICS SECTION ══ */
    #lyrics{
      background:var(--black);
      padding:clamp(70px,11vh,130px) 0;
      overflow:hidden;position:relative;
    }
    .lyrics-header{padding:0 5%;margin-bottom:60px}
    .lyric-item{
      position:relative;
      padding:40px 5%;
      border-top:1px solid rgba(201,168,76,.06);
      overflow:hidden;
      cursor:default;
      transition:background .4s;
    }
    .lyric-item:hover{background:rgba(201,168,76,.02)}
    /* animated glow behind each lyric on hover */
    .lyric-item::before{
      content:'';position:absolute;inset:0;
      background:radial-gradient(ellipse 60% 80% at 50% 50%,rgba(201,168,76,.04),transparent);
      opacity:0;transition:opacity .6s;pointer-events:none;
    }
    .lyric-item:hover::before{opacity:1}
    .lyric-num{
      font-size:9px;letter-spacing:.4em;color:rgba(201,168,76,.4);
      text-transform:uppercase;margin-bottom:12px;
    }
    .lyric-line{
      font-family:'Cormorant Garamond',serif;font-style:italic;
      font-size:clamp(32px,5vw,72px);
      font-weight:300;line-height:1.1;
      color:rgba(255,255,255,.85);
      letter-spacing:-.01em;
      /* word-by-word reveal handled by JS */
    }
    .lyric-line .word{
      display:inline-block;
      opacity:0;transform:translateY(20px);
      transition:opacity .5s,transform .5s;
      margin-right:.25em;
    }
    .lyric-item.visible .word{opacity:1;transform:none}
    .lyric-meta{
      display:flex;align-items:center;gap:20px;margin-top:16px;
    }
    .lyric-song{
      font-family:'Bebas Neue',sans-serif;font-size:14px;
      letter-spacing:.15em;color:var(--gold);
    }
    .lyric-year{font-size:9px;letter-spacing:.3em;color:rgba(255,255,255,.25)}
    /* vertical gold line on hover */
    .lyric-item::after{
      content:'';position:absolute;left:0;top:0;bottom:0;width:2px;
      background:linear-gradient(to bottom,transparent,var(--gold),transparent);
      transform:scaleY(0);transition:transform .4s;transform-origin:center;
    }
    .lyric-item:hover::after{transform:scaleY(1)}

    /* ══ AWARDS SECTION ══ */
    #awards{
      background:linear-gradient(to bottom,var(--black),var(--deep),var(--black));
      padding:clamp(70px,11vh,130px) 5%;
      position:relative;overflow:hidden;
    }
    /* ambient gold glow in background */
    #awards::before{
      content:'';position:absolute;inset:0;
      background:radial-gradient(ellipse 80% 60% at 50% 50%,rgba(201,168,76,.03),transparent 70%);
      pointer-events:none;
    }
    .awards-grid{
      display:grid;grid-template-columns:repeat(3,1fr);
      gap:1px;background:rgba(201,168,76,.08);
      max-width:1280px;margin:0 auto;
      border:1px solid rgba(201,168,76,.08);
    }
    .award-card{
      background:var(--black);
      padding:40px 32px;position:relative;overflow:hidden;
      transition:background .4s;cursor:default;
    }
    .award-card:hover{background:rgba(201,168,76,.025)}
    /* shimmer sweep on hover */
    .award-card::before{
      content:'';position:absolute;
      top:0;left:-100%;width:50%;height:100%;
      background:linear-gradient(90deg,transparent,rgba(201,168,76,.05),transparent);
      transition:left .6s ease;pointer-events:none;
    }
    .award-card:hover::before{left:150%}
    /* top gold line that grows on hover */
    .award-card::after{
      content:'';position:absolute;top:0;left:0;right:0;height:1px;
      background:linear-gradient(90deg,transparent,var(--gold),transparent);
      transform:scaleX(0);transition:transform .5s ease;transform-origin:left;
    }
    .award-card:hover::after{transform:scaleX(1)}
    .award-icon{
      font-size:32px;margin-bottom:20px;
      display:flex;align-items:center;
    }
    /* animated gold star icon */
    .award-star{
      width:44px;height:44px;position:relative;
      display:flex;align-items:center;justify-content:center;
    }
    .award-star svg{
      width:44px;height:44px;
      filter:drop-shadow(0 0 8px rgba(201,168,76,.4));
      animation:starPulse 3s ease-in-out infinite;
    }
    @keyframes starPulse{
      0%,100%{filter:drop-shadow(0 0 6px rgba(201,168,76,.3))}
      50%{filter:drop-shadow(0 0 18px rgba(201,168,76,.7))}
    }
    .award-card:hover .award-star svg{animation-duration:1s}
    .award-name{
      font-family:'Bebas Neue',sans-serif;font-size:22px;
      letter-spacing:.06em;line-height:1.1;
      margin-bottom:10px;color:#fff;
    }
    .award-org{
      font-size:9px;letter-spacing:.3em;color:var(--gold);
      text-transform:uppercase;margin-bottom:6px;
    }
    .award-year{font-size:9px;letter-spacing:.2em;color:rgba(255,255,255,.25)}
    /* rotating ring behind star on hover */
    .award-ring{
      position:absolute;width:60px;height:60px;
      border-radius:50%;border:1px solid rgba(201,168,76,.15);
      animation:awardRing 4s linear infinite;pointer-events:none;
    }
    @keyframes awardRing{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  `;
  const el = document.createElement("style");
  el.id = "lb-styles";
  el.textContent = css;
  document.head.appendChild(el);
}

/* ══════════════════════════════════════════════════════
   DARK WEBGL BACKGROUND — gold particles only
══════════════════════════════════════════════════════ */
function createBgRenderer(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x02020a, 1);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 5;

  const COUNT = 2800;
  const pos = new Float32Array(COUNT * 3);
  const col = new Float32Array(COUNT * 3);
  const sz  = new Float32Array(COUNT);

  // Color palette: dark gold, dim gold, near-white, deep navy accent
  const palette = [
    new THREE.Color("#c9a84c"), new THREE.Color("#e8c96a"),
    new THREE.Color("#7a5f25"), new THREE.Color("#ffffff"),
    new THREE.Color("#3a2800"), new THREE.Color("#9a7830"),
  ];

  for (let i = 0; i < COUNT; i++) {
    pos[i*3]   = (Math.random()-.5)*22;
    pos[i*3+1] = (Math.random()-.5)*22;
    pos[i*3+2] = (Math.random()-.5)*10;
    const c = palette[Math.floor(Math.random() * palette.length)];
    col[i*3]=c.r; col[i*3+1]=c.g; col[i*3+2]=c.b;
    sz[i] = Math.random() * 2.2 + 0.4;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("color",    new THREE.BufferAttribute(col, 3));
  geo.setAttribute("size",     new THREE.BufferAttribute(sz,  1));

  const mat = new THREE.ShaderMaterial({
    vertexColors: true, transparent: true, depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uTime: {value:0}, uMouse: {value: new THREE.Vector2()} },
    vertexShader:`
      attribute float size;
      uniform float uTime; uniform vec2 uMouse;
      varying vec3 vColor;
      void main(){
        vColor=color;
        vec3 p=position;
        p.y+=sin(uTime*.25+position.x*.4)*.25;
        p.x+=cos(uTime*.18+position.y*.35)*.18;
        p.xy+=uMouse*.5;
        vec4 mv=modelViewMatrix*vec4(p,1.);
        gl_PointSize=size*(280./-mv.z);
        gl_Position=projectionMatrix*mv;
      }
    `,
    fragmentShader:`
      varying vec3 vColor;
      void main(){
        float d=length(gl_PointCoord-vec2(.5));
        if(d>.5) discard;
        float a=1.-smoothstep(.25,.5,d);
        gl_FragColor=vec4(vColor,a*.55);
      }
    `,
  });

  const pts = new THREE.Points(geo, mat);
  scene.add(pts);

  // Subtle gold fog blobs (very dark, additive)
  const fogColors = ["#3a2000","#1a1000","#0a0800","#2a1800"];
  fogColors.forEach((fc, i) => {
    const g = new THREE.SphereGeometry(3, 16, 16);
    const m = new THREE.MeshBasicMaterial({
      color: new THREE.Color(fc), transparent: true, opacity: 0.06,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    const mesh = new THREE.Mesh(g, m);
    mesh.position.set((i%2===0?-1:1)*3, (i<2?1:-1)*2, -3);
    mesh.userData = { ox: mesh.position.x, oy: mesh.position.y, spd: .15+i*.08 };
    scene.add(mesh);
  });

  const mouse = { x:0,y:0,tx:0,ty:0 };
  let raf;

  const onResize = () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  };
  window.addEventListener("resize", onResize);

  const animate = (t) => {
    raf = requestAnimationFrame(animate);
    const time = t * .001;
    mouse.tx += (mouse.x - mouse.tx) * .04;
    mouse.ty += (mouse.y - mouse.ty) * .04;
    mat.uniforms.uTime.value = time;
    mat.uniforms.uMouse.value.set(mouse.tx*.25, mouse.ty*.18);
    pts.rotation.y = time * .015;
    renderer.render(scene, camera);
  };
  animate(0);

  return {
    setMouse:(x,y)=>{ mouse.x=x; mouse.y=y; },
    dispose:()=>{ cancelAnimationFrame(raf); window.removeEventListener("resize",onResize); renderer.dispose(); },
  };
}

/* ─── Animated canvas for cards — VISIBLE colors ─── */
function DarkCanvas({ col1, col2 }) {
  const ref = useRef();
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    let raf, t = 0;
    const draw = () => {
      raf = requestAnimationFrame(draw); t += .005;
      const w = c.width = c.offsetWidth || 320;
      const h = c.height = c.offsetHeight || 420;

      // Dark base
      ctx.fillStyle = "#04040e";
      ctx.fillRect(0, 0, w, h);

      // Primary animated blob — high opacity so it shows
      const gx = w * (.25 + Math.sin(t) * .2);
      const gy = h * (.35 + Math.cos(t * .7) * .2);
      const r1 = Math.max(w, h) * .7;
      const g1 = ctx.createRadialGradient(gx, gy, 0, gx, gy, r1);
      g1.addColorStop(0, col1 + "cc");
      g1.addColorStop(0.4, col1 + "55");
      g1.addColorStop(1, "transparent");
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, w, h);

      // Secondary blob
      const gx2 = w * (.7 + Math.cos(t * .6) * .2);
      const gy2 = h * (.65 + Math.sin(t * .5) * .2);
      const r2 = Math.max(w, h) * .55;
      const g2 = ctx.createRadialGradient(gx2, gy2, 0, gx2, gy2, r2);
      g2.addColorStop(0, col2 + "aa");
      g2.addColorStop(0.5, col2 + "33");
      g2.addColorStop(1, "transparent");
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, w, h);

      // Dark vignette overlay to keep edges dark
      const vign = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, Math.max(w,h)*.7);
      vign.addColorStop(0, "transparent");
      vign.addColorStop(1, "rgba(4,4,14,.75)");
      ctx.fillStyle = vign;
      ctx.fillRect(0, 0, w, h);

      // Gold shimmer line
      const shimX = ((Math.sin(t * .4) + 1) / 2) * w;
      const gs = ctx.createLinearGradient(shimX - 40, 0, shimX + 40, 0);
      gs.addColorStop(0, "transparent");
      gs.addColorStop(.5, "rgba(201,168,76,.12)");
      gs.addColorStop(1, "transparent");
      ctx.fillStyle = gs;
      ctx.fillRect(0, 0, w, h);

      // Subtle grain
      for (let i = 0; i < 120; i++) {
        ctx.fillStyle = `rgba(255,255,255,${Math.random() * .018})`;
        ctx.fillRect(Math.random() * w, Math.random() * h, 1, 1);
      }
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [col1, col2]);
  return (
    <canvas
      ref={ref}
      style={{ position:"absolute", inset:0, width:"100%", height:"100%" }}
    />
  );
}

/* ─── 3D Carousel ─── */
function Carousel() {
  const [active, setActive] = useState(0);
  const trackRef = useRef();
  const total = SONGS.length;
  const RADIUS = 460;

  const rotateTo = useCallback((idx) => {
    setActive(idx);
    if (trackRef.current) {
      trackRef.current.style.transform = `translate(-50%,-50%) rotateY(${-(idx/total)*360}deg)`;
    }
  }, [total]);

  useEffect(() => {
    if (!trackRef.current) return;
    trackRef.current.querySelectorAll(".card3d").forEach((card, i) => {
      const angle = (i/total)*360;
      const rad = angle*Math.PI/180;
      const x = Math.sin(rad)*RADIUS;
      const z = Math.cos(rad)*RADIUS - RADIUS;
      card.style.transform = `translateX(${x-150}px) translateZ(${z}px) rotateY(${-angle}deg)`;
    });
  }, [total]);

  return (
    <div>
      <div className="carousel-wrap">
        <div id="c-track" ref={trackRef}>
          {SONGS.map((s,i)=>(
            <div key={i} className="card3d" onClick={()=>rotateTo(i)} style={{opacity:i===active?1:.5}}>
              <div className="card-body">
                <div className="card-art"><DarkCanvas col1={s.col1} col2={s.col2}/></div>
                <div className="card-info">
                  <div className="card-cat">{s.cat}</div>
                  <div className="card-title">{s.title}</div>
                  <div className="card-year">{s.year}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="c-controls">
        <button className="c-btn" onClick={()=>rotateTo((active-1+total)%total)}>←</button>
        {SONGS.map((_,i)=>(
          <div key={i} className={`c-dot${i===active?" on":""}`} onClick={()=>rotateTo(i)}/>
        ))}
        <button className="c-btn" onClick={()=>rotateTo((active+1)%total)}>→</button>
      </div>
    </div>
  );
}

/* ─── WhatsApp rotating text SVG ─── */
function WaRotatingText() {
  const text = "TALK TO LUKE BRYAN  •  TALK TO LUKE BRYAN  •  ";
  const r = 46;
  const circumference = 2 * Math.PI * r;
  return (
    <svg className="wa-rotating-text" viewBox="0 0 110 110" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <path id="circle-path" d={`M 55,55 m -${r},0 a ${r},${r} 0 1,1 ${r*2},0 a ${r},${r} 0 1,1 -${r*2},0`}/>
      </defs>
      <text fontSize="7.5" fill={GOLD} letterSpacing="1.8" fontFamily="'Bebas Neue', sans-serif">
        <textPath href="#circle-path">{text}</textPath>
      </text>
    </svg>
  );
}

/* ══════════════════════════════════════════════════════
   LIGHTBOX — frosted glass panel like the video
══════════════════════════════════════════════════════ */
function Lightbox({ items, startIndex, onClose }) {
  const [idx, setIdx] = useState(startIndex);
  const item = items[idx];
  const touchX = useRef(null);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIdx(i => (i+1)%items.length);
      if (e.key === "ArrowLeft")  setIdx(i => (i-1+items.length)%items.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [items, onClose]);

  return (
    <div className="lb-overlay open" onClick={onClose}>
      <div className="lb-backdrop"/>
      <div className="lb-panel"
        onClick={e=>e.stopPropagation()}
        onTouchStart={e=>{touchX.current=e.touches[0].clientX}}
        onTouchEnd={e=>{
          const dx=e.changedTouches[0].clientX-touchX.current;
          if(dx<-50) setIdx(i=>(i+1)%items.length);
          if(dx>50)  setIdx(i=>(i-1+items.length)%items.length);
        }}
      >
        <div className="lb-corner tl"/><div className="lb-corner tr"/>
        <div className="lb-corner bl"/><div className="lb-corner br"/>
        <button className="lb-close" onClick={onClose}>✕</button>
        <button className="lb-nav prev" onClick={()=>setIdx(i=>(i-1+items.length)%items.length)}>‹</button>
        <button className="lb-nav next" onClick={()=>setIdx(i=>(i+1)%items.length)}>›</button>
        <div className="lb-art">
          <DarkCanvas key={idx} col1={item.col1} col2={item.col2}/>
        </div>
        <div className="lb-info">
          <div className="lb-cat">Exclusive Gallery · {idx+1} / {items.length}</div>
          <div className="lb-title">{item.cap}</div>
          <div className="lb-desc">An intimate moment from Luke Bryan's world — part of the official visual archive.</div>
          <div className="lb-dots">
            {items.map((_,i)=>(
              <div key={i} className={`lb-dot${i===idx?" on":""}`} onClick={()=>setIdx(i)}/>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   LYRICS SECTION — word-by-word cinematic reveal
══════════════════════════════════════════════════════ */
function LyricsSection() {
  const itemRefs = useRef([]);
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.querySelectorAll(".word").forEach((w,i) => {
          setTimeout(()=>{ w.style.opacity="1"; w.style.transform="none"; }, i*75);
        });
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.25 });
    itemRefs.current.forEach(el=>el&&obs.observe(el));
    return ()=>obs.disconnect();
  }, []);

  return (
    <section id="lyrics">
      <div className="lyrics-header reveal">
        <p className="sec-label">In His Words</p>
        <h2 className="sec-title">Iconic <span className="g">Lyrics</span></h2>
      </div>
      {LYRICS.map((l,i)=>(
        <div key={i} className="lyric-item" ref={el=>itemRefs.current[i]=el}>
          <div className="lyric-num">0{i+1}</div>
          <div className="lyric-line">
            {l.line.split(" ").map((word,wi)=>(
              <span key={wi} className="word" style={{transitionDelay:`${wi*75}ms`}}>{word}</span>
            ))}
          </div>
          <div className="lyric-meta">
            <span className="lyric-song">{l.song}</span>
            <span className="lyric-year">{l.year}</span>
          </div>
        </div>
      ))}
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   AWARDS SECTION — animated glass trophy cards
══════════════════════════════════════════════════════ */
function AwardsSection() {
  return (
    <section id="awards">
      <div className="reveal" style={{maxWidth:1280,margin:"0 auto 56px"}}>
        <p className="sec-label">Accolades</p>
        <h2 className="sec-title">Awards &amp; <span className="g">Honours</span></h2>
      </div>
      <div className="awards-grid">
        {AWARDS.map((a,i)=>(
          <div key={i} className="award-card reveal">
            <div className="award-star">
              <div className="award-ring"/>
              <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <polygon
                  points="20,3 24.5,14.5 37,15.5 27.5,23.5 30.5,36 20,29.5 9.5,36 12.5,23.5 3,15.5 15.5,14.5"
                  fill="none" stroke="#c9a84c" strokeWidth="1.2"
                  style={{filter:"drop-shadow(0 0 6px #c9a84c)"}}
                />
                <polygon
                  points="20,8 23.5,16 32,16.8 25.5,22.8 27.8,31.5 20,27 12.2,31.5 14.5,22.8 8,16.8 16.5,16"
                  fill="rgba(201,168,76,0.15)"
                />
              </svg>
            </div>
            <div className="award-org">{a.org}</div>
            <div className="award-name">{a.name}</div>
            <div className="award-year">{a.year}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function VideoHeroBg() {
  const ref = useRef();
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    let t = 0, raf;

    const resize = () => {
      c.width  = window.innerWidth;
      c.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      raf = requestAnimationFrame(draw);
      t += .004;
      const w = c.width, h = c.height;

      // Deep black base
      ctx.fillStyle = "#02020a";
      ctx.fillRect(0, 0, w, h);

      // Stage light beams — 3 colored radial gradients from top
      const beams = [
        { x: .18, col: "#c9a84c", phase: 0 },
        { x: .50, col: "#7b2fff", phase: 1.5 },
        { x: .82, col: "#ff2d55", phase: 3 },
      ];
      beams.forEach(b => {
        const bx = w * (b.x + Math.sin(t + b.phase) * .12);
        const g = ctx.createRadialGradient(bx, 0, 0, bx, h * .9, w * .55);
        g.addColorStop(0,   b.col + "55");
        g.addColorStop(0.5, b.col + "18");
        g.addColorStop(1,   "transparent");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      });

      // Bottom ambient glow — warm gold
      const bg = ctx.createRadialGradient(w*.5, h, 0, w*.5, h, w*.7);
      bg.addColorStop(0,   "rgba(201,168,76,0.08)");
      bg.addColorStop(1,   "transparent");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Crowd dots — warm flickering specks in lower 40%
      for (let i = 0; i < 80; i++) {
        const dx = ((Math.sin(i * 137.5 + t * .3) + 1) / 2) * w;
        const dy = h * (.62 + Math.sin(i * 73 + t * .5) * .18);
        const alpha = .05 + Math.abs(Math.sin(i * .7 + t * 1.5)) * .08;
        ctx.beginPath();
        ctx.arc(dx, dy, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,230,180,${alpha})`;
        ctx.fill();
      }

      // Slow horizontal gold shimmer sweep
      const sx = ((Math.sin(t * .25) + 1) / 2) * w;
      const sg = ctx.createLinearGradient(sx - 120, 0, sx + 120, 0);
      sg.addColorStop(0,   "transparent");
      sg.addColorStop(.5,  "rgba(201,168,76,0.07)");
      sg.addColorStop(1,   "transparent");
      ctx.fillStyle = sg;
      ctx.fillRect(0, 0, w, h);

      // Top fade to black
      const tf = ctx.createLinearGradient(0, 0, 0, h * .35);
      tf.addColorStop(0, "rgba(2,2,10,0.85)");
      tf.addColorStop(1, "transparent");
      ctx.fillStyle = tf;
      ctx.fillRect(0, 0, w, h);

      // Bottom fade to black
      const bf = ctx.createLinearGradient(0, h * .65, 0, h);
      bf.addColorStop(0, "transparent");
      bf.addColorStop(1, "rgba(2,2,10,0.95)");
      ctx.fillStyle = bf;
      ctx.fillRect(0, 0, w, h);
    };

    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      style={{
        position: "absolute", inset: 0,
        width: "100%", height: "100%",
        display: "block",
        filter: "brightness(0.9) saturate(1.3)",
      }}
    />
  );
}

/* ══════════════════════════════════════════════════════
   2. HORIZONTAL TIMELINE
══════════════════════════════════════════════════════ */
function Timeline() {
  const scrollRef = useRef();
  useEffect(() => {
    const el = scrollRef.current; if (!el) return;
    let isDown=false, startX=0, scrollLeft=0;
    const down = e => { isDown=true; el.classList.add("grabbing"); startX=e.pageX-el.offsetLeft; scrollLeft=el.scrollLeft; };
    const up   = () => { isDown=false; el.classList.remove("grabbing"); };
    const move = e => { if(!isDown) return; e.preventDefault(); const x=e.pageX-el.offsetLeft; el.scrollLeft=scrollLeft-(x-startX)*1.5; };
    el.addEventListener("mousedown",down); el.addEventListener("mouseleave",up);
    el.addEventListener("mouseup",up); el.addEventListener("mousemove",move);
    return () => { el.removeEventListener("mousedown",down); el.removeEventListener("mouseleave",up); el.removeEventListener("mouseup",up); el.removeEventListener("mousemove",move); };
  },[]);
  return (
    <section id="timeline">
      <div className="tl-header reveal">
        <p className="sec-label">Career Story</p>
        <h2 className="sec-title">The <span className="g">Journey</span></h2>
      </div>
      <div className="tl-line"/>
      <div className="tl-scroll" ref={scrollRef}>
        {TIMELINE.map((t,i) => (
          <div key={i} className="tl-track">
            <div className="tl-year" style={{color:t.color}}>{t.year}</div>
            <div className="tl-card">
              <div className="tl-dot" style={{color:t.color,borderColor:t.color}}/>
              <div className="tl-title" style={{color:t.color}}>{t.title}</div>
              <div className="tl-desc">{t.desc}</div>
            </div>
          </div>
        ))}
      </div>
      <p className="tl-drag-hint">← Drag to explore his journey →</p>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   3. PARALLAX — applied to hero via scroll listener
   4. MAGNETIC BUTTONS — via useMagnetic hook
   6. GOLD CURTAIN TRANSITION
══════════════════════════════════════════════════════ */
function useParallax() {
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const bg = document.querySelector(".hero-parallax-bg");
      const mid = document.querySelector(".hero-parallax-mid");
      if (bg)  bg.style.transform  = `translateY(${y*.4}px)`;
      if (mid) mid.style.transform = `translateY(${y*.15}px)`;
    };
    window.addEventListener("scroll", onScroll, {passive:true});
    return () => window.removeEventListener("scroll", onScroll);
  },[]);
}

function useMagnetic() {
  useEffect(() => {
    const els = document.querySelectorAll(".magnetic");
    const handlers = [];
    els.forEach(el => {
      const move = e => {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width/2, cy = r.top + r.height/2;
        const dx = (e.clientX - cx) * .25, dy = (e.clientY - cy) * .25;
        el.style.transform = `translate(${dx}px,${dy}px)`;
      };
      const leave = () => { el.style.transform = "translate(0,0)"; };
      el.addEventListener("mousemove", move);
      el.addEventListener("mouseleave", leave);
      handlers.push({el,move,leave});
    });
    return () => handlers.forEach(({el,move,leave}) => { el.removeEventListener("mousemove",move); el.removeEventListener("mouseleave",leave); });
  },[]);
}

function useTilt() {
  useEffect(() => {
    const els = document.querySelectorAll(".tilt");
    const handlers = [];
    els.forEach(el => {
      const shine = document.createElement("div");
      shine.className = "tilt-shine";
      el.style.position = "relative";
      el.appendChild(shine);
      const move = e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width  - .5;
        const y = (e.clientY - r.top)  / r.height - .5;
        el.style.transform = `perspective(600px) rotateY(${x*14}deg) rotateX(${-y*10}deg) scale3d(1.02,1.02,1.02)`;
        shine.style.background = `radial-gradient(circle at ${(x+.5)*100}% ${(y+.5)*100}%,rgba(255,255,255,.1),transparent 60%)`;
      };
      const leave = () => { el.style.transform = "perspective(600px) rotateY(0) rotateX(0) scale3d(1,1,1)"; shine.style.background=""; };
      el.addEventListener("mousemove",move); el.addEventListener("mouseleave",leave);
      handlers.push({el,move,leave,shine});
    });
    return () => handlers.forEach(({el,move,leave,shine}) => { el.removeEventListener("mousemove",move); el.removeEventListener("mouseleave",leave); shine.remove(); });
  },[]);
}

/* ══════════════════════════════════════════════════════
   13. SIGNATURE ANIMATION
══════════════════════════════════════════════════════ */
function SignatureSection() {
  const pathRef = useRef();
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if(e.isIntersecting) { pathRef.current?.classList.add("drawn"); obs.disconnect(); } });
    },{threshold:.5});
    if(pathRef.current) obs.observe(pathRef.current.closest("section"));
    return () => obs.disconnect();
  },[]);
  return (
    <section id="signature-section">
      <div style={{textAlign:"center",position:"relative",zIndex:1}}>
        <p className="sec-label" style={{justifyContent:"center",marginBottom:24}}>A Personal Touch</p>
        <svg className="sig-svg" viewBox="0 0 600 120" xmlns="http://www.w3.org/2000/svg">
          {/* Luke Bryan signature path — stylized cursive */}
          <path ref={pathRef} className="sig-path"
            d="M 40,80 C 50,40 70,30 90,50 C 110,70 100,90 80,85 C 60,80 65,55 85,52
               M 95,52 C 120,30 150,25 160,50 C 170,75 155,90 140,80 C 125,70 130,50 150,48 C 170,46 180,65 175,80
               M 185,80 L 190,30 C 200,55 210,70 220,60
               M 235,48 C 250,30 275,35 270,60 C 265,80 245,85 235,75 C 225,65 230,48 250,48
               M 280,80 C 290,55 310,40 320,55 C 330,70 320,85 305,80
               M 340,80 L 345,30
               M 345,55 C 355,40 375,38 380,55 C 385,72 370,85 355,78
               M 390,48 C 405,30 425,35 420,58 C 415,78 395,85 390,72 L 395,88 C 400,95 420,92 430,85
               M 450,30 L 445,85 M 440,55 C 450,40 470,38 475,55
               M 490,48 C 505,30 525,35 520,58 C 515,78 495,82 490,70 C 485,58 495,42 515,45
               M 540,48 L 545,85 M 555,48 L 550,85"
          />
        </svg>
        <p style={{fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",fontSize:13,color:"rgba(255,255,255,.25)",letterSpacing:".2em",marginTop:16,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
          Luke Bryan<Verified size={12}/> — Official
        </p>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   17. 3D VINYL RECORDS
══════════════════════════════════════════════════════ */
function VinylSection() {
  return (
    <section id="vinyl">
      <div className="reveal" style={{maxWidth:1280,margin:"0 auto 56px"}}>
        <p className="sec-label">Discography</p>
        <h2 className="sec-title">The <span className="g">Albums</span></h2>
      </div>
      <div className="vinyl-grid">
        {ALBUMS.map((a,i) => (
          <div key={i} className="vinyl-card reveal tilt">
            <div className="vinyl-scene">
              <div className="vinyl-disc">
                <div className="vinyl-label" style={{background:`radial-gradient(circle,${a.col1}33,${a.col2}22)`}}>
                  <div className="vinyl-label-text" style={{color:a.col1,fontSize:"clamp(6px,1vw,9px)"}}>LB</div>
                  <div className="vinyl-hole"/>
                  <div className="vinyl-label-text" style={{color:"rgba(255,255,255,.4)",fontSize:"6px"}}>{a.year}</div>
                </div>
              </div>
            </div>
            <div className="vinyl-info">
              <div className="vinyl-title">{a.title}</div>
              <div className="vinyl-year">{a.year}</div>
              <div className="vinyl-tracks">
                {a.tracks.map((tr,ti) => (
                  <div key={ti} className="vinyl-track">
                    <span style={{color:"rgba(201,168,76,.4)",marginRight:8}}>{String(ti+1).padStart(2,"0")}</span>{tr}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   20. COUNTER ANIMATION HOOK
══════════════════════════════════════════════════════ */
function AnimatedStat({ target, label }) {
  const [val, setVal] = useState(0);
  const ref = useRef();
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      obs.disconnect();
      const num = parseFloat(target.replace(/[^0-9.]/g,""));
      const suffix = target.replace(/[0-9.]/g,"");
      const dur = 1800, start = performance.now();
      const tick = now => {
        const p = Math.min((now-start)/dur,1);
        const ease = 1-Math.pow(1-p,3);
        setVal(Math.floor(ease*num) + suffix);
        if(p<1) requestAnimationFrame(tick);
        else setVal(target);
      };
      requestAnimationFrame(tick);
    },{threshold:.5});
    if(ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  },[target]);
  return (
    <div className="stat-box" ref={ref}>
      <div className="stat-n">{val||"0"}</div>
      <div className="stat-l">{label}</div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   7. FAN TESTIMONIALS
══════════════════════════════════════════════════════ */
function FanTestimonials() {
  const [count] = useState(12847);
  return (
    <section id="testimonials">
      <div className="reveal" style={{maxWidth:1280,margin:"0 auto 48px"}}>
        <p className="sec-label">Fan Stories</p>
        <h2 className="sec-title">Fans Who <span className="g">Messaged Luke</span></h2>
      </div>
      <div className="testi-grid">
        {TESTIMONIALS.map((t,i)=>(
          <div key={i} className="testi-card reveal">
            {/* WA badge */}
            <div className="testi-wa-badge">
              <svg width="10" height="10" viewBox="0 0 32 32" fill="none">
                <path d="M16 2C8.268 2 2 8.268 2 16c0 2.468.647 4.784 1.779 6.789L2 30l7.418-1.745A13.93 13.93 0 0 0 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2z" fill="#25D366"/>
              </svg>
              <span>Via WhatsApp</span>
            </div>
            {/* Stars */}
            <div className="testi-stars">
              {[...Array(t.stars)].map((_,si)=>(
                <span key={si} className="testi-star">★</span>
              ))}
            </div>
            <p className="testi-text">"{t.text}"</p>
            <div className="testi-footer">
              <div className="testi-avatar">{t.initials}</div>
              <div>
                <div className="testi-name">{t.name}</div>
                <div className="testi-loc">{t.location}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* CTA below cards */}
      <div className="testi-cta-wrap reveal">
        <a
          href={WA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="testi-cta"
          style={{touchAction:"manipulation",WebkitTapHighlightColor:"rgba(37,211,102,.25)"}}
        >
          <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
            <path d="M16 2C8.268 2 2 8.268 2 16c0 2.468.647 4.784 1.779 6.789L2 30l7.418-1.745A13.93 13.93 0 0 0 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2z" fill="#25D366"/>
            <path d="M22.5 19.5c-.4-.2-2.3-1.1-2.7-1.3-.4-.1-.6-.2-.9.2-.3.4-1 1.3-1.2 1.5-.2.2-.5.3-.9.1-.4-.2-1.7-.6-3.2-2-1.2-1.1-2-2.4-2.2-2.8-.2-.4 0-.6.2-.8l.6-.7c.2-.2.2-.4.3-.6.1-.2 0-.5-.1-.7-.1-.2-.9-2.1-1.2-2.9-.3-.8-.6-.7-.9-.7h-.7c-.2 0-.6.1-1 .5-.4.4-1.4 1.3-1.4 3.2s1.4 3.7 1.6 4c.2.3 2.8 4.3 6.8 5.9 4 1.6 4 1.1 4.7 1 .7-.1 2.3-.9 2.6-1.8.3-.9.3-1.6.2-1.8-.1-.2-.3-.3-.7-.5z" fill="white"/>
          </svg>
          Add Your Story — Message Luke Now
        </a>
        <p className="testi-counter">
          Join <strong>{count.toLocaleString()}</strong> fans who have already messaged Luke
        </p>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   1. LOADING SCREEN — cinematic gold particle intro
══════════════════════════════════════════════════════ */
function LoadingScreen({ onDone }) {
  const canvasRef = useRef();
  useEffect(() => {
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext("2d");
    c.width = window.innerWidth; c.height = window.innerHeight;
    // Gold particles bursting from center
    const particles = Array.from({ length: 120 }, () => ({
      x: c.width / 2, y: c.height / 2,
      vx: (Math.random() - .5) * 8,
      vy: (Math.random() - .5) * 8,
      r: Math.random() * 2.5 + .5,
      alpha: 1,
      col: Math.random() > .5 ? "#c9a84c" : "#e8c96a",
    }));
    let raf;
    const draw = () => {
      ctx.fillStyle = "rgba(2,2,10,.12)";
      ctx.fillRect(0, 0, c.width, c.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        p.vy += .08; p.alpha -= .008;
        p.vx *= .99;
        if (p.alpha <= 0) {
          p.x = c.width/2; p.y = c.height/2;
          p.vx = (Math.random()-.5)*8; p.vy = (Math.random()-.5)*8;
          p.alpha = 1;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.fillStyle = p.col + Math.floor(p.alpha*255).toString(16).padStart(2,"0");
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    // Hide after 2.6s
    const t = setTimeout(() => {
      cancelAnimationFrame(raf);
      onDone();
    }, 2600);
    return () => { cancelAnimationFrame(raf); clearTimeout(t); };
  }, [onDone]);

  return (
    <div id="loader">
      <canvas className="loader-canvas" ref={canvasRef}/>
      <div className="loader-content">
        <div className="loader-lb">LB</div>
        <div className="loader-sub" style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
          Luke Bryan<Verified size={13}/> · Official Portal
        </div>
        <div className="loader-bar-wrap"><div className="loader-bar"/></div>
        <div className="loader-dots">
          <div className="loader-dot"/><div className="loader-dot"/><div className="loader-dot"/>
        </div>
        {/* WhatsApp CTA on loader */}
        <div className="loader-wa">
          <svg width="16" height="16" viewBox="0 0 32 32" fill="none" style={{flexShrink:0}}>
            <path d="M16 2C8.268 2 2 8.268 2 16c0 2.468.647 4.784 1.779 6.789L2 30l7.418-1.745A13.93 13.93 0 0 0 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2z" fill="#25D366"/>
            <path d="M22.5 19.5c-.4-.2-2.3-1.1-2.7-1.3-.4-.1-.6-.2-.9.2-.3.4-1 1.3-1.2 1.5-.2.2-.5.3-.9.1-.4-.2-1.7-.6-3.2-2-1.2-1.1-2-2.4-2.2-2.8-.2-.4 0-.6.2-.8l.6-.7c.2-.2.2-.4.3-.6.1-.2 0-.5-.1-.7-.1-.2-.9-2.1-1.2-2.9-.3-.8-.6-.7-.9-.7h-.7c-.2 0-.6.1-1 .5-.4.4-1.4 1.3-1.4 3.2s1.4 3.7 1.6 4c.2.3 2.8 4.3 6.8 5.9 4 1.6 4 1.1 4.7 1 .7-.1 2.3-.9 2.6-1.8.3-.9.3-1.6.2-1.8-.1-.2-.3-.3-.7-.5z" fill="white"/>
          </svg>
          <span>Talk to Luke Bryan on WhatsApp</span>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   10. CURSOR TRAIL — gold sparkle particles
══════════════════════════════════════════════════════ */
function CursorTrail() {
  useEffect(() => {
    const dots = [];
    const MAX = 18;
    for (let i = 0; i < MAX; i++) {
      const d = document.createElement("div");
      d.className = "trail-dot";
      const size = Math.max(2, (MAX - i) * .5);
      d.style.cssText = `width:${size}px;height:${size}px;background:${i<4?"#e8c96a":"#c9a84c"};opacity:0`;
      document.body.appendChild(d);
      dots.push({ el: d, x: 0, y: 0 });
    }
    let mx = 0, my = 0;
    const onMove = e => { mx = e.clientX; my = e.clientY; };
    window.addEventListener("mousemove", onMove);
    let raf;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      let x = mx, y = my;
      dots.forEach((dot, i) => {
        dot.x += (x - dot.x) * (0.28 - i * .01);
        dot.y += (y - dot.y) * (0.28 - i * .01);
        x = dot.x; y = dot.y;
        const alpha = (1 - i / MAX) * 0.7;
        dot.el.style.left = dot.x + "px";
        dot.el.style.top  = dot.y + "px";
        dot.el.style.opacity = alpha;
        dot.el.style.transform = `translate(-50%,-50%) scale(${1 - i/MAX/1.5})`;
      });
    };
    animate();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      dots.forEach(d => d.el.remove());
    };
  }, []);
  return null;
}

/* ══════════════════════════════════════════════════════
   7. COUNTDOWN TIMER — live ticking to next concert
══════════════════════════════════════════════════════ */
function Countdown() {
  const calc = () => {
    const diff = CONCERT_DATE - new Date();
    if (diff <= 0) return { d:"00", h:"00", m:"00", s:"00", over:true };
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    const pad = n => String(n).padStart(2,"0");
    return { d:pad(d), h:pad(h), m:pad(m), s:pad(s), over:false };
  };
  const [time, setTime] = useState(calc());
  const prevS = useRef(time.s);

  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, []);

  const Unit = ({ val, label, flip }) => (
    <div className="cd-unit">
      <div className="cd-box">
        <span className={`cd-num${flip?" flip":""}`}>{val}</span>
      </div>
      <div className="cd-label">{label}</div>
    </div>
  );

  return (
    <section id="countdown">
      <div className="countdown-glow"/>
      <div className="reveal">
        <div className="countdown-event">{CONCERT_NAME}</div>
        <h2 className="countdown-title">Next <span>Show Countdown</span></h2>
        {time.over ? (
          <p style={{fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",fontSize:24,color:"rgba(255,255,255,.5)"}}>
            The show is happening now — enjoy every moment 🎸
          </p>
        ) : (
          <div className="countdown-row">
            <Unit val={time.d} label="Days"/>
            <div className="cd-sep">:</div>
            <Unit val={time.h} label="Hours"/>
            <div className="cd-sep">:</div>
            <Unit val={time.m} label="Minutes"/>
            <div className="cd-sep">:</div>
            <Unit val={time.s} label="Seconds" flip={prevS.current !== time.s}/>
          </div>
        )}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   14. PRESS / MEDIA SECTION
══════════════════════════════════════════════════════ */
function PressSection() {
  return (
    <section id="press">
      <div className="reveal" style={{maxWidth:1280,margin:"0 auto 56px"}}>
        <p className="sec-label">As Seen In</p>
        <h2 className="sec-title">What the World <span className="g">Says</span></h2>
      </div>
      <div className="press-grid">
        {PRESS.map((p,i) => (
          <div key={i} className="press-card reveal">
            <span className="press-quote-mark">"</span>
            <p className="press-text">{p.quote}</p>
            <div className="press-footer">
              <div className="press-line"/>
              <span className="press-pub">{p.pub}</span>
              <span className="press-year">{p.year}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════════════ */
export default function LukeBryanDark() {
  const bgCanvasRef = useRef();
  const bgRef       = useRef();
  const curRef      = useRef();
  const curRingRef  = useRef();
  const [navSolid, setNavSolid]   = useState(false);
  const [lightbox, setLightbox]   = useState(null);
  const [loaded, setLoaded]       = useState(false);

  const handleLoaded = useCallback(() => {
    setLoaded(true);
    // lock scroll during load, release after
    document.body.style.overflow = "";
  }, []);

  useEffect(() => {
    // prevent scroll during loading
    document.body.style.overflow = "hidden";
  }, []);

  useEffect(()=>{ injectStyles(); },[]);
  useParallax();
  useMagnetic();
  useTilt();

  useEffect(()=>{
    if(!bgCanvasRef.current) return;
    bgRef.current = createBgRenderer(bgCanvasRef.current);
    return ()=> bgRef.current?.dispose();
  },[]);

  useEffect(()=>{
    const onMove = e => {
      const nx=(e.clientX/window.innerWidth-.5)*2;
      const ny=-(e.clientY/window.innerHeight-.5)*2;
      bgRef.current?.setMouse(nx,ny);
      if(curRef.current){ curRef.current.style.left=e.clientX+"px"; curRef.current.style.top=e.clientY+"px"; }
      if(curRingRef.current){ curRingRef.current.style.left=e.clientX+"px"; curRingRef.current.style.top=e.clientY+"px"; }
    };
    const onScroll = ()=> setNavSolid(window.scrollY>60);
    window.addEventListener("mousemove",onMove);
    window.addEventListener("scroll",onScroll);
    setTimeout(()=>{
      document.querySelectorAll("a,button,.reel,.gi,.card3d").forEach(el=>{
        el.addEventListener("mouseenter",()=>curRingRef.current?.classList.add("big"));
        el.addEventListener("mouseleave",()=>curRingRef.current?.classList.remove("big"));
      });
    },600);
    return ()=>{ window.removeEventListener("mousemove",onMove); window.removeEventListener("scroll",onScroll); };
  },[]);

  useEffect(()=>{
    const obs = new IntersectionObserver(entries=>{
      entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add("visible"); obs.unobserve(e.target); } });
    },{threshold:.08});
    const t = setTimeout(()=>{ document.querySelectorAll(".reveal").forEach(el=>obs.observe(el)); },400);
    return ()=>{ clearTimeout(t); obs.disconnect(); };
  },[]);

  return (
    <>
      {/* LOADING SCREEN */}
      {!loaded && <LoadingScreen onDone={handleLoaded}/>}

      {/* GOLD CURSOR TRAIL — desktop only */}
      <CursorTrail/>

      <div id="cur" ref={curRef}/>
      <div id="cur-ring" ref={curRingRef}/>
      <canvas id="bg-canvas" ref={bgCanvasRef}/>

      {/* NAV */}
      <nav className={navSolid?"solid":""}>
        <div className="nav-logo" style={{display:"flex",alignItems:"center"}}>Luke Bryan<Verified size={16}/></div>
        <ul className="nav-links">
          {["About","Music","Reels","Gallery","Lyrics","Awards","Press","Connect"].map(l=>(
            <li key={l}><a href={`#${l.toLowerCase()}`}>{l}</a></li>
          ))}
        </ul>
      </nav>

      {/* HERO */}
      <section id="hero">
        {/* 1. Video/cinematic background */}
        <div className="hero-video-wrap hero-parallax-bg">
          <VideoHeroBg/>
        </div>
        <div className="hero-vignette"/>
        <div className="hero-glow"/>
        {/* 3. Parallax mid layer */}
        <div className="hero-parallax-mid" style={{textAlign:"center",position:"relative",zIndex:3}}>
          <p className="hero-eyebrow">Official Artist Portal</p>
          <h1 className="hero-name" data-text="LUKE BRYAN">
            <span className="l1">LUKE</span>
            <span className="l2" style={{display:"flex",alignItems:"center",justifyContent:"center",gap:14}}>
              BRYAN<Verified size={42}/>
            </span>
          </h1>
          <p className="hero-sub">Country Music's Reigning Force</p>
          <div className="hero-divider"/>
          {/* 4. Magnetic + 2. WhatsApp button */}
          <a
            href={WA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hero-wa-btn magnetic"
            style={{touchAction:"manipulation",WebkitTapHighlightColor:"rgba(37,211,102,.25)"}}
          >
            <span className="hero-wa-ring"/>
            <span className="hero-wa-ring"/>
            <span className="hero-wa-online"/>
            <svg width="26" height="26" viewBox="0 0 32 32" fill="none" style={{flexShrink:0,position:"relative",zIndex:2}}>
              <path d="M16 2C8.268 2 2 8.268 2 16c0 2.468.647 4.784 1.779 6.789L2 30l7.418-1.745A13.93 13.93 0 0 0 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2z" fill="#25D366"/>
              <path d="M22.5 19.5c-.4-.2-2.3-1.1-2.7-1.3-.4-.1-.6-.2-.9.2-.3.4-1 1.3-1.2 1.5-.2.2-.5.3-.9.1-.4-.2-1.7-.6-3.2-2-1.2-1.1-2-2.4-2.2-2.8-.2-.4 0-.6.2-.8l.6-.7c.2-.2.2-.4.3-.6.1-.2 0-.5-.1-.7-.1-.2-.9-2.1-1.2-2.9-.3-.8-.6-.7-.9-.7h-.7c-.2 0-.6.1-1 .5-.4.4-1.4 1.3-1.4 3.2s1.4 3.7 1.6 4c.2.3 2.8 4.3 6.8 5.9 4 1.6 4 1.1 4.7 1 .7-.1 2.3-.9 2.6-1.8.3-.9.3-1.6.2-1.8-.1-.2-.3-.3-.7-.5z" fill="white"/>
            </svg>
            <span className="hero-wa-text" style={{position:"relative",zIndex:2}}>
              <span className="hero-wa-top">Message Luke on WhatsApp</span>
              <span className="hero-wa-sub">Tap to connect directly</span>
            </span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.5)" strokeWidth="2" style={{flexShrink:0,position:"relative",zIndex:2}}>
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </div>
        <div className="hero-scroll">
          <span>Scroll</span>
          <div className="scroll-line"/>
        </div>
      </section>

      {/* COUNTDOWN */}
      <Countdown/>

      <div className="divider"/>

      {/* ABOUT */}
      <section className="section" id="about">
        <div className="about-grid">
          <div className="reveal">
            <p className="sec-label">The Legend</p>
            <h2 className="sec-title">Born to <span className="g">Run</span><br/>the Stage</h2>
            <div className="about-text">
              <p>From the red clay of Leesburg, Georgia to sold-out stadiums across America — <span style={{display:"inline-flex",alignItems:"center",gap:4}}>Luke Bryan<Verified size={13}/></span> is not just a performer. He is a force of nature wrapped in rhinestones and raw emotion.</p>
              <p>Seven consecutive #1 albums. Dozens of platinum singles. A legacy carved in heartland anthems and unforgettable live shows that stretch past midnight.</p>
            </div>
            <div className="stats-row">
              {[["75M+","Monthly Listeners"],["7×","Platinum Albums"],["25+","ACM Awards"],["200+","Tour Dates/Yr"]].map(([n,l])=>(
                <AnimatedStat key={l} target={n} label={l}/>
              ))}
            </div>
          </div>
          <div className="about-frame reveal">
            <DarkCanvas col1="#c9a84c" col2="#7b2fff"/>
            <div className="about-frame-lb">LB</div>
            <div className="corner-tr"/><div className="corner-bl"/>
          </div>
        </div>
      </section>

      <div className="divider"/>

      {/* 2. HORIZONTAL TIMELINE */}
      <Timeline/>

      <div className="divider"/>

      {/* MUSIC */}
      <section className="section" id="music">
        <div className="reveal" style={{maxWidth:1280,margin:"0 auto"}}>
          <p className="sec-label">Discography</p>
          <h2 className="sec-title">The <span className="g">Music</span></h2>
        </div>
        <div className="reveal"><Carousel/></div>
      </section>

      <div className="divider"/>

      {/* 17. VINYL RECORDS */}
      <VinylSection/>

      <div className="divider"/>

      {/* REELS */}
      <section className="section" id="reels">
        <div className="reveal" style={{maxWidth:1380,margin:"0 auto"}}>
          <p className="sec-label">Short Form</p>
          <h2 className="sec-title"><span className="g">Reels</span> &amp; Clips</h2>
        </div>
        <div className="reels-grid">
          {REELS_DATA.map((r,i)=>(
            <div className="reel reveal" key={i}>
              <div className="reel-art">
                <DarkCanvas col1={r.col1} col2={r.col2}/>
                <div className="reel-play">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill={GOLD}><polygon points="5,3 19,12 5,21"/></svg>
                </div>
                <span className="reel-tag">{r.tag}</span>
              </div>
              <div className="reel-foot">
                <div className="reel-name">{r.title}</div>
                <div className="reel-views">{r.views} views</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="divider"/>

      {/* GALLERY */}
      <section className="section" id="gallery">
        <div className="reveal" style={{maxWidth:1380,margin:"0 auto"}}>
          <p className="sec-label">Visual Archive</p>
          <h2 className="sec-title">Exclusive <span className="g">Gallery</span></h2>
        </div>
        <div className="gal-grid">
          {GALLERY.map((g,i)=>(
            <div className="gi reveal tilt" key={i} onClick={()=>setLightbox({index:i})} style={{cursor:"pointer"}}>
              <div className="gi-inner">
                <DarkCanvas col1={g.col1} col2={g.col2}/>
                {/* expand icon — appears on hover */}
                <div className="gi-expand">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2">
                    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
                  </svg>
                </div>
                <div className="gi-ov"><span className="gi-cap">{g.cap}</span></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="divider"/>

      {/* 13. SIGNATURE */}
      <SignatureSection/>

      <div className="divider"/>

      {/* LYRICS */}
      <LyricsSection/>

      <div className="divider"/>

      {/* AWARDS */}
      <AwardsSection/>

      <div className="divider"/>

      {/* CONNECT */}
      <section className="section" id="connect">
        <div className="connect-glow"/>
        <div className="connect-inner reveal">
          <p className="sec-label" style={{justifyContent:"center"}}>Fan Portal</p>
          <h2 className="sec-title" style={{marginBottom:12}}>
            Connect with <span className="g">Luke</span><Verified size={32}/>
          </h2>
          <p style={{fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",fontSize:17,color:"rgba(255,255,255,.35)",letterSpacing:".06em",marginBottom:36}}>
            Leave a message. Share your story. Be heard.
          </p>
          <input className="c-in" placeholder="Your Name" type="text"/>
          <input className="c-in" placeholder="Your Email" type="email"/>
          <textarea className="c-in" placeholder="Your message to Luke..."/>
          {/* Connect button → WhatsApp */}
          <a className="wa-connect-btn" href={WA_URL} target="_blank" rel="noopener noreferrer">
            <span className="wa-icon">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                <path d="M16 2C8.268 2 2 8.268 2 16c0 2.468.647 4.784 1.779 6.789L2 30l7.418-1.745A13.93 13.93 0 0 0 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2z" fill="#25D366"/>
                <path d="M22.5 19.5c-.4-.2-2.3-1.1-2.7-1.3-.4-.1-.6-.2-.9.2-.3.4-1 1.3-1.2 1.5-.2.2-.5.3-.9.1-.4-.2-1.7-.6-3.2-2-1.2-1.1-2-2.4-2.2-2.8-.2-.4 0-.6.2-.8l.6-.7c.2-.2.2-.4.3-.6.1-.2 0-.5-.1-.7-.1-.2-.9-2.1-1.2-2.9-.3-.8-.6-.7-.9-.7h-.7c-.2 0-.6.1-1 .5-.4.4-1.4 1.3-1.4 3.2s1.4 3.7 1.6 4c.2.3 2.8 4.3 6.8 5.9 4 1.6 4 1.1 4.7 1 .7-.1 2.3-.9 2.6-1.8.3-.9.3-1.6.2-1.8-.1-.2-.3-.3-.7-.5z" fill="white"/>
              </svg>
            </span>
            <span className="wa-txt">
              <span className="wa-txt-top">Send Message on WhatsApp</span>
              <span className="wa-txt-sub" style={{display:"flex",alignItems:"center",gap:4}}>Connect directly with Luke Bryan<Verified size={10}/></span>
            </span>
          </a>
        </div>
      </section>

      {/* PRESS */}
      <PressSection/>

      <div className="divider"/>

      {/* FAN TESTIMONIALS */}
      <FanTestimonials/>

      <div className="divider"/>

      {/* FOOTER */}
      <footer>
        <div className="f-logo" style={{display:"flex",alignItems:"center"}}>Luke Bryan<Verified size={15}/></div>
        <div className="f-copy" style={{display:"flex",alignItems:"center",gap:4}}>© 2025 Luke Bryan<Verified size={11}/>. All rights reserved.</div>
        <div className="f-socs">
          {["IG","TT","FB","YT","SP"].map(s=>(
            <a className="f-s" href="#" key={s}>{s}</a>
          ))}
        </div>
      </footer>

      {/* WHATSAPP FLOAT — PREMIUM NOTICEABLE */}
      <div id="wa-float">

        {/* PILL — always visible, floats, invites a tap */}
        <a className="wa-pill" href={WA_URL} target="_blank" rel="noopener noreferrer"
          style={{textDecoration:"none"}}
        >
          <span className="wa-online-dot"/>
          <span className="wa-pill-txt">
            <span className="wa-pill-top">Talk to Luke Bryan</span>
            <span className="wa-pill-sub">Available on WhatsApp</span>
          </span>
          <span className="wa-pill-icon">
            <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
              <path d="M16 2C8.268 2 2 8.268 2 16c0 2.468.647 4.784 1.779 6.789L2 30l7.418-1.745A13.93 13.93 0 0 0 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2z" fill="#25D366"/>
              <path d="M22.5 19.5c-.4-.2-2.3-1.1-2.7-1.3-.4-.1-.6-.2-.9.2-.3.4-1 1.3-1.2 1.5-.2.2-.5.3-.9.1-.4-.2-1.7-.6-3.2-2-1.2-1.1-2-2.4-2.2-2.8-.2-.4 0-.6.2-.8l.6-.7c.2-.2.2-.4.3-.6.1-.2 0-.5-.1-.7-.1-.2-.9-2.1-1.2-2.9-.3-.8-.6-.7-.9-.7h-.7c-.2 0-.6.1-1 .5-.4.4-1.4 1.3-1.4 3.2s1.4 3.7 1.6 4c.2.3 2.8 4.3 6.8 5.9 4 1.6 4 1.1 4.7 1 .7-.1 2.3-.9 2.6-1.8.3-.9.3-1.6.2-1.8-.1-.2-.3-.3-.7-.5z" fill="white"/>
            </svg>
          </span>
        </a>

        {/* CIRCLE BUTTON — with decorative rings behind it */}
        <div className="wa-circle-wrap">
          {/* Pulse rings — decorative only */}
          <div className="wa-glow-ring"/>
          <div className="wa-glow-ring"/>
          <div className="wa-glow-ring"/>
          {/* Gold orbit ring */}
          <div className="wa-gold-orbit"><div className="wa-gold-dot"/></div>
          {/* Rotating text */}
          <svg className="wa-orbit-text" viewBox="0 0 110 110" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <path id="wcp" d="M 55,55 m -42,0 a 42,42 0 1,1 84,0 a 42,42 0 1,1 -84,0"/>
            </defs>
            <text fontSize="7" fill={GOLD} letterSpacing="2" fontFamily="'Bebas Neue',sans-serif">
              <textPath href="#wcp">TALK TO LUKE BRYAN  •  MESSAGE NOW  •  </textPath>
            </text>
          </svg>
          {/* THE BUTTON — sits above all decorative elements */}
          <a className="wa-circle-btn" href={WA_URL} target="_blank" rel="noopener noreferrer" aria-label="Talk to Luke Bryan on WhatsApp">
            <svg width="30" height="30" viewBox="0 0 32 32" fill="none">
              <path d="M16 2C8.268 2 2 8.268 2 16c0 2.468.647 4.784 1.779 6.789L2 30l7.418-1.745A13.93 13.93 0 0 0 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2z" fill="#25D366"/>
              <path d="M22.5 19.5c-.4-.2-2.3-1.1-2.7-1.3-.4-.1-.6-.2-.9.2-.3.4-1 1.3-1.2 1.5-.2.2-.5.3-.9.1-.4-.2-1.7-.6-3.2-2-1.2-1.1-2-2.4-2.2-2.8-.2-.4 0-.6.2-.8l.6-.7c.2-.2.2-.4.3-.6.1-.2 0-.5-.1-.7-.1-.2-.9-2.1-1.2-2.9-.3-.8-.6-.7-.9-.7h-.7c-.2 0-.6.1-1 .5-.4.4-1.4 1.3-1.4 3.2s1.4 3.7 1.6 4c.2.3 2.8 4.3 6.8 5.9 4 1.6 4 1.1 4.7 1 .7-.1 2.3-.9 2.6-1.8.3-.9.3-1.6.2-1.8-.1-.2-.3-.3-.7-.5z" fill="white"/>
            </svg>
          </a>
        </div>

      </div>
      {/* LIGHTBOX */}
      {lightbox !== null && (
        <Lightbox
          items={GALLERY}
          startIndex={lightbox.index}
          onClose={()=>setLightbox(null)}
        />
      )}
    </>
  );
}
