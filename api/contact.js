const REASONS=new Set(['General enquiry',"I’m new here",'I want to join a trybe','I want to join a connect group','I need prayer','I want to share a testimony','I want to be a member']);

function clean(value,max){return typeof value==='string'?value.trim().slice(0,max):''}

export default async function handler(request,response){
 if(request.method!=='POST')return response.status(405).json({error:'Method not allowed.'});
 if(!process.env.GOOGLE_APPS_SCRIPT_URL||!process.env.FORM_SHARED_SECRET)return response.status(503).json({error:'The contact form is not configured yet.'});

 let body;
 try{body=typeof request.body==='string'?JSON.parse(request.body||'{}'):(request.body||{})}catch{return response.status(400).json({error:'Invalid request.'})}
 const submission={
  reason:clean(body.reason,80),name:clean(body.name,100),email:clean(body.email,254),
  phone:clean(body.phone,40),message:clean(body.message,3000),company:clean(body.company,100)
 };
 const startedAt=Number(body.startedAt);
 const age=Date.now()-startedAt;
 const emailOkay=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(submission.email);
 if(submission.company)return response.status(200).json({ok:true});
 if(!REASONS.has(submission.reason)||submission.name.length<2||!emailOkay||submission.phone.length<5||submission.message.length<10||!Number.isFinite(startedAt)||age<1500||age>7200000){
  return response.status(400).json({error:'Please check the form and try again.'});
 }

 try{
  const controller=new AbortController();
  const timeout=setTimeout(()=>controller.abort(),12000);
  const upstream=await fetch(process.env.GOOGLE_APPS_SCRIPT_URL,{
   method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},redirect:'follow',signal:controller.signal,
   body:JSON.stringify({...submission,secret:process.env.FORM_SHARED_SECRET})
  });
  clearTimeout(timeout);
  const result=await upstream.json().catch(()=>({ok:false}));
  if(!upstream.ok||!result.ok)throw new Error('Delivery failed');
  return response.status(200).json({ok:true});
 }catch(error){
  return response.status(502).json({error:error.name==='AbortError'?'Email delivery timed out. Please try again.':'We could not send your message. Please try again shortly.'});
 }
}
