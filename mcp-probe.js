// mcp-probe.js — 前端 MCP 探测小组件
(function(){
  const urls = (window.__MCP_PROBE_URLS__ && window.__MCP_PROBE_URLS__) || [
    'ws://localhost:9222',
    'ws://127.0.0.1:9222'
  ];

  function createWidget(){
    const w = document.createElement('div');
    w.id = 'mcp-status-widget';
    w.style.position = 'fixed';
    w.style.right = '16px';
    w.style.bottom = '16px';
    w.style.padding = '10px 12px';
    w.style.borderRadius = '12px';
    w.style.boxShadow = '0 8px 24px rgba(2,6,23,0.08)';
    w.style.fontFamily = 'inherit';
    w.style.fontSize = '13px';
    w.style.zIndex = 9999;
    w.style.background = 'rgba(255,255,255,0.9)';
    w.style.color = '#111827';
    w.innerText = 'MCP: searching...';
    document.body.appendChild(w);
    return w;
  }

  const widget = createWidget();

  let connected = false;

  function tryConnect(wsUrl, timeout=3000){
    return new Promise((resolve)=>{
      let done=false;
      try {
        const ws = new WebSocket(wsUrl);
        const t = setTimeout(()=>{
          if (done) return; done=true; try{ ws.close(); }catch{}; resolve(false);
        }, timeout);
        ws.addEventListener('open', ()=>{
          if (done) return; done=true; clearTimeout(t); ws.close(); resolve(true);
        });
        ws.addEventListener('error', ()=>{
          if (done) return; done=true; clearTimeout(t); try{ ws.close(); }catch{}; resolve(false);
        });
      } catch(e){ resolve(false); }
    });
  }

  async function probeAll(){
    for (const u of urls){
      widget.innerText = `MCP: probing ${u} ...`;
      try{
        const ok = await tryConnect(u, 2500);
        if (ok){
          widget.innerText = `MCP: connected ${u}`;
          widget.style.background = 'linear-gradient(90deg,#e6fffb,#d1f7ff)';
          widget.style.color = '#034047';
          connected = true;
          return;
        }
      } catch(e){}
    }
    widget.innerText = 'MCP: not found (local)';
    widget.style.background = 'rgba(246,247,251,0.95)';
    widget.style.color = '#6b7280';
    connected = false;
  }

  // initial probe and periodic re-probe
  probeAll();
  setInterval(probeAll, 5000);

})();
