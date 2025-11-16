// live-reload.js — simple client-side listener for common livereload WS
(function(){
  const livereloadUrl = 'ws://localhost:35729';
  try {
    const ws = new WebSocket(livereloadUrl);
    ws.addEventListener('open', ()=>{
      console.log('[live-reload] connected to', livereloadUrl);
    });
    ws.addEventListener('message', (ev)=>{
      try {
        const data = JSON.parse(ev.data);
        if (data && (data.command === 'reload' || data.title === 'LiveReload')) {
          console.log('[live-reload] reload message received');
          window.location.reload();
        }
      } catch(e) {
        // some servers send plain text — reload anyway
        if (typeof ev.data === 'string' && ev.data.indexOf('reload') !== -1) {
          window.location.reload();
        }
      }
    });
    ws.addEventListener('error', ()=>{
      // silent
    });
  } catch(e){
    // ignore
  }
})();
