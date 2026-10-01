import React, {useEffect, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {site, links, community} from './data';
import './styles.css';
import './slc.css';
import './pages.css';
import './home.css';
import './figma-home.css';
import './figma-pages.css';
import './figma-pages-overrides.css';
import './polish.css';

const Arrow=()=> <span className="arrow" aria-hidden="true">›</span>;

async function sendContact(form,extra={}){
 const payload={...Object.fromEntries(new FormData(form).entries()),...extra};
 const response=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
 const result=await response.json().catch(()=>({}));
 if(!response.ok)throw new Error(result.error||'We could not send your message. Please try again.');
}

function ContactSheet({open,onClose,initial='General enquiry'}){
  const [reason,setReason]=useState(initial),[sent,setSent]=useState(false),[sending,setSending]=useState(false),[error,setError]=useState(''),[startedAt,setStartedAt]=useState(Date.now);
  useEffect(()=>{setReason(initial);setSent(false);setError('');setStartedAt(Date.now())},[initial,open]);
  const reasons=["I’m new here",'I want to join a Trybe','I need prayer','I have a testimony','I want to serve','General enquiry'];
  async function submit(e){e.preventDefault();const form=e.currentTarget;setSending(true);setError('');try{await sendContact(form,{reason,startedAt});form.reset();setSent(true)}catch(err){setError(err.message)}finally{setSending(false)}}
  if(!open)return null;
  return <div className="sheet-wrap" role="dialog" aria-modal="true" aria-label="Talk to SLC Lagos" onMouseDown={e=>e.target===e.currentTarget&&onClose()}>
    <section className="sheet"><button className="handle" onClick={onClose} aria-label="Close form"/><div className="sheet-head"><div><span className="kicker">WE’RE HERE</span><h2>How can we help?</h2></div><button className="close" onClick={onClose}>×</button></div>
    {sent?<div className="success"><b>Thank you — we’ve got it.</b><p>Someone from the SLC Lagos family will reach out soon.</p><button onClick={onClose}>Done</button></div>:<>
      <div className="chips">{reasons.map(r=><button key={r} className={reason===r?'active':''} onClick={()=>setReason(r)}>{r}</button>)}</div>
      <form onSubmit={submit}><div className="form-trap" aria-hidden="true"><label>Company<input name="company" tabIndex="-1" autoComplete="off"/></label></div><label>Full Name<input required name="name" autoComplete="name" maxLength="100"/></label><div className="form-row"><label>Email<input required type="email" name="email" autoComplete="email" maxLength="254"/></label><label>Phone<input required type="tel" name="phone" autoComplete="tel" maxLength="40"/></label></div><label>Message<textarea required name="message" rows="3" minLength="10" maxLength="3000" placeholder={`Tell us a little about ${reason.toLowerCase()}…`}/></label>{error&&<p className="form-error" role="alert">{error}</p>}<button className="submit" disabled={sending}>{sending?'Sending…':'Send message'}</button></form></>}
    </section></div>
}

const routes={watch:'Messages',visit:'Plan your visit',events:'Events',trybe:'Find your Trybe',connect:'Connect',give:'Give'};

function App(){
 const getRoute=()=>location.hash.replace('#/','')||'home';
 const [route,setRoute]=useState(getRoute),[sheet,setSheet]=useState(false),[reason,setReason]=useState('General enquiry'),[loading,setLoading]=useState(true);
 useEffect(()=>{
  const first=setTimeout(()=>setLoading(false),850);
  const sync=()=>{setLoading(true);setRoute(getRoute());scrollTo(0,0);setTimeout(()=>setLoading(false),520)};
  addEventListener('hashchange',sync);
  return()=>{clearTimeout(first);removeEventListener('hashchange',sync)};
 },[]);
 const go=r=>{location.hash=r==='home'?'':'/'+r};
 const open=(r='General enquiry')=>{setReason(r);setSheet(true)};
 return <><div className={`site-loader${loading?' is-visible':''}`} role="status" aria-live="polite" aria-label="Loading SLC Lagos"><div><img src="/logo-mark-exact.svg" alt=""/><strong>SLC Lagos</strong><span><i/></span></div></div><main key={route} className={route==='home'?'home-view':'page-view'}>
  {route==='home'?<Home go={go} open={open}/>:<InnerPage route={route} go={go} open={open}/>} 
 </main>{!['home','trybe','connect'].includes(route)&&<Footer go={go}/>}<ContactSheet open={sheet} onClose={()=>setSheet(false)} initial={reason}/></>
}

function BrandBar({back}){return <div className="topline page-top"><div className="brand-lockup"><img className="avatar" src="/slc-logo.svg" alt="Supernatural Life Church"/><span>Lagos branch</span></div>{back?<button className="back" onClick={back}>← Home</button>:<a className="parent" href={site.mainSite} target="_blank">slchurchng.org</a>}</div>}

function Home({go}){return <div className="figma-home">
 <section className="figma-hero exact"><div className="hero-reel" aria-hidden="true"><img src="/hero-reel-strip.png" alt=""/><img src="/hero-reel-strip.png" alt=""/></div><img className="hero-person" src="/hero-mask-group.png" alt="" fetchPriority="high"/><img className="hero-experience" src="/logo-experience.svg" alt="The SLC Experience"/><div className="figma-top-mark"><img src="/logo-mark-exact.svg" alt="SLC"/></div><div className="hero-title-art" aria-label="This is the SLC you heard about"><span>This is the</span><strong>SLC&nbsp; YOU</strong><b>HEARD ABOUT</b></div></section>
 <section className="figma-welcome"><span>WELCOME HOME TO</span><h2>SLC Lagos</h2><p>A Lagos expression of Supernatural Life Church</p><small>A people touched by God’s love, changed by His Word,<br/>influencing the world for God.</small></section>
 <section className="service-card"><img src="/service.png" alt="SLC Lagos auditorium" loading="lazy" decoding="async"/><div><span>SERVICE TIME</span><h3>Sundays <b>·</b> 9:30 AM</h3><a className="locate-link" href="https://maps.app.goo.gl/HyiiuV72HSzELwep6" target="_blank" rel="noreferrer">Locate us <img src="/icon-location-exact.svg" alt=""/></a></div></section>
 <section className="figma-access"><h2>QUICK ACCESS</h2>
  <a className="visual-link watch-link exact-card" href="https://youtube.com/playlist?list=PLzL5gyO9pXv65v2TgJeASD2yYU-iSXUxT" target="_blank" rel="noreferrer"><img src="https://i.ytimg.com/vi/sdpyaS5ts5Q/maxresdefault.jpg" alt="Watch the latest SLC Lagos service on YouTube"/><span><b>Watch our latest service</b><small>A word/worship for right where you are</small></span><i aria-hidden="true">▶</i></a>
  <button className="visual-link trybe-link" onClick={()=>go('trybe')}><img src="/trybe-base.png" alt="Members of an SLC Lagos Trybe" loading="lazy" decoding="async"/><span><b>Join a trybe.</b><small>Join a family in a location close to you.</small></span></button>
  <button className="access-row" onClick={()=>go('connect')}><i><img src="/icon-connect.svg" alt=""/></i><span><b>Connect with us.</b><small>Have a question or want to share what’s in your heart?</small></span><Arrow/></button>
  <a className="access-row" href="https://t.me/+Rm8VxoHyhLEyYTZk" target="_blank" rel="noreferrer"><i><img src="/icon-pray.svg" alt=""/></i><span><b>Join the prayer chain</b><small>We gather to seek God’s face together.</small></span><Arrow/></a>
  <a className="access-row learn-row" href={site.mainSite} target="_blank"><img src="/logo-mark-link-exact.svg" alt=""/><span><b>Learn more about SLC</b><small>Visit our main website</small></span><Arrow/></a>
 </section>
 <section className="figma-social"><div><a href={site.instagram} aria-label="Instagram"><img src="/icon-instagram.svg" alt=""/></a><a href={site.tiktok} aria-label="TikTok"><img src="/icon-tiktok.svg" alt=""/></a></div><small>Come and be a part of Supernatural Life Church</small><img className="footer-experience" src="/logo-footer-crop-exact.png" alt="The SLC Experience"/></section>
 </div>}

function ConnectForm(){
 const [sent,setSent]=useState(false),[sending,setSending]=useState(false),[error,setError]=useState(''),[startedAt,setStartedAt]=useState(Date.now);
 async function submit(e){e.preventDefault();const form=e.currentTarget;setSending(true);setError('');try{await sendContact(form,{startedAt});form.reset();setSent(true)}catch(err){setError(err.message)}finally{setSending(false)}}
 if(sent)return <div className="content-card form-success" role="status"><span>Message sent</span><h2>Thank you for reaching out.</h2><p>Someone from the SLC Lagos family will get back to you soon.</p><button className="page-action full" onClick={()=>{setSent(false);setStartedAt(Date.now())}}>Send another message</button></div>;
 return <form className="connect-form" onSubmit={submit}>
  <div className="form-trap" aria-hidden="true"><label>Company<input name="company" tabIndex="-1" autoComplete="off"/></label></div>
  <label>What can we help with?<select name="reason" defaultValue="General enquiry"><option>I’m new here</option><option>I want to join a Trybe</option><option>I need prayer</option><option>I have a testimony</option><option>I want to serve</option><option>General enquiry</option></select></label>
  <label>Full name<input required name="name" autoComplete="name" maxLength="100"/></label>
  <label>Email address<input required type="email" name="email" autoComplete="email" maxLength="254"/></label>
  <label>Phone number<input required type="tel" name="phone" autoComplete="tel" maxLength="40"/></label>
  <label>Message<textarea required name="message" rows="4" minLength="10" maxLength="3000" placeholder="Tell us what’s on your heart…"/></label>
  {error&&<p className="form-error" role="alert">{error}</p>}
  <button className="page-action full" type="submit" disabled={sending}>{sending?'Sending…':'Send message'}</button>
 </form>
}

const trybeGroups=[
 {name:'Mainland Central',image:'/trybe-mainland.png',areas:['Gbagada','Maryland/Anthony','Ogudu/Ojota','Ketu','Magodo','Ikorodu','Ogba','Ikeja','Ojodu/Berger']},
 {name:'Alimosho–Ijaiye',image:'/trybe-alimosho.png',areas:['Iju Ishaga','Agege','Ayobo','Ikotun','Ipaja','Command','Abule Egba','Ijaiye Ojokoro','Alagbado','Iyana Ipaja','Egbeda']},
 {name:'Yaba–Surulere',image:'/trybe-yaba.png',areas:['Yaba','Mushin','Bariga','UNILAG','Costain','Surulere','Somolu','Ilupeju','Palmgrove','Obanikoro']},
 {name:'Island',image:'/trybe-island.png',areas:['Obalende','VI','Lekki','Ikoyi','Ajah','Chevron Drive','VGC']},
 {name:'Oshodi–Festac',image:'/trybe-oshodi.png',areas:['Oshodi','Ajao-Estate','Cele–Ijesha','Festac Town','Mile 2','Magodo','Amuwo Odofin','Apapa','Ojo']}
];

function FigmaPageHeader({go}){return <header className="fp-header"><img src="/logo-mark-exact.svg" alt="SLC"/><button onClick={()=>go('home')}>← <span>Go back</span></button></header>}
function FigmaPageFooter(){return <section className="figma-social"><div><a href={site.instagram} aria-label="Instagram"><img src="/icon-instagram.svg" alt=""/></a><a href={site.tiktok} aria-label="TikTok"><img src="/icon-tiktok.svg" alt=""/></a></div><small>Come and be a part of Supernatural Life Church</small><img className="footer-experience" src="/logo-footer-crop-exact.png" alt="The SLC Experience"/></section>}
function TrybePage({go}){return <div className="figma-subpage"><FigmaPageHeader go={go}/><section className="fp-intro"><h1>Join a trybe.</h1><p>Be a part of the family</p><button onClick={()=>go('connect')}>Join A trybe</button></section><section className="trybe-list">{trybeGroups.map(group=><article key={group.name}><img src={group.image} alt="" loading="lazy" decoding="async"/><div><h2>{group.name}</h2><div>{group.areas.map(area=><span key={area}>{area}</span>)}</div></div></article>)}</section><FigmaPageFooter/></div>}
function ConnectPage({go}){return <div className="figma-subpage"><FigmaPageHeader go={go}/><section className="fp-intro connect-title"><h1>Connect</h1><p>You don’t have to figure it out alone. Tell us what brought you here and your message will reach the right people.</p></section><ConnectForm/><FigmaPageFooter/></div>}

function InnerPage({route,go,open}){if(route==='trybe')return <TrybePage go={go}/>;if(route==='connect')return <ConnectPage go={go}/>;return <><BrandBar back={()=>go('home')}/><header className="page-header"><span className="page-kicker">SLC Lagos</span><h1>{routes[route]||'SLC Lagos'}</h1></header>
 {route==='watch'&&<><div className="video"><iframe src="https://www.youtube.com/embed/videoseries?list=PLzL5gyO9pXv65v2TgJeASD2yYU-iSXUxT" title="SLC Lagos messages playlist" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen/></div><div className="content-card"><span>Latest message</span><h2>From the house</h2><p>Watch the latest teaching from Supernatural Life Church and grow with the family wherever you are.</p><a className="page-action" href="https://youtube.com/playlist?list=PLzL5gyO9pXv65v2TgJeASD2yYU-iSXUxT" target="_blank" rel="noreferrer">Open playlist</a></div></>}
 {route==='visit'&&<><div className="content-card accent"><span>This Sunday</span><h2>We’ll be glad to welcome you.</h2><p>Service begins at 9:30 AM. Come a little early, meet the family and settle in before worship.</p><dl><div><dt>When</dt><dd>Sunday · 9:30 AM</dd></div><div><dt>Church</dt><dd>SLC Lagos</dd></div></dl></div><button className="page-action full" onClick={()=>open("I’m new here")}>Tell us you’re coming</button></>}
 {route==='events'&&<><section className="featured detail-feature"><div className="event-tag">Upcoming event</div><p>Wind of the Spirit</p><h2>ELSHADDAI</h2><small>The God of All Possibilities</small></section><div className="content-card"><span>Stay in the loop</span><h2>More from SLC Lagos</h2><p>New gatherings and family moments will appear here as details are confirmed.</p><button className="text-action" onClick={()=>open('General enquiry')}>Ask about an event</button></div></>}
 {route==='trybe'&&<><section className="trybe-card"><span className="kicker">Trybes</span><h2>Big church.<br/>Smaller family.</h2><p>Find people close to you, build friendships, pray together, grow together and do life beyond Sundays.</p></section><div className="gallery page-gallery">{community.map(c=><figure key={c.label}><img src={c.image} alt={`${c.label} at SLC Lagos`}/><figcaption>{c.label}</figcaption></figure>)}</div><button className="page-action full" onClick={()=>open('I want to join a Trybe')}>Help me find a Trybe</button></>}
 {route==='connect'&&<><div className="connect-intro"><p>You don’t have to figure it out alone. Tell us what brought you here and your message will reach the right people.</p></div><ConnectForm/></>}
 {route==='give'&&<><div className="content-card accent"><span>Give</span><h2>Partner with what God is doing.</h2><p>Giving at SLC is handled through verified bank-transfer details on the main church website.</p></div><a className="page-action full" href={site.mainSite} target="_blank">Continue to giving</a><p className="fine-print">You’ll leave this hub and continue securely on slchurchng.org.</p></>}
 </>}

function Footer({go}){return <footer className="inner-footer"><div><b>SLC Lagos</b><span>Part of Supernatural Life Church</span></div><p>Sundays · 9:30 AM</p><nav><button onClick={()=>go('home')}>Home</button><a href={site.instagram}>Instagram</a><a href={site.pastor}>Pastor Philip</a></nav><small>One house. A Lagos expression.</small></footer>}
createRoot(document.getElementById('root')).render(<App/>);
