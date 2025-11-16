#!/usr/bin/env node
import WebSocket from 'ws';

const url = process.argv[2] || '';
if (!url) {
  console.log('No MCP URL provided. Skipping probe.');
  process.exit(0);
}

console.log(`Attempting WebSocket connection to ${url} ...`);
const ws = new WebSocket(url, { handshakeTimeout: 5000 });
let done = false;
ws.on('open', () => {
  if (done) return;
  done = true;
  console.log('MCP probe: connected');
  ws.close();
  process.exit(0);
});
ws.on('error', (err) => {
  if (done) return;
  done = true;
  console.error('MCP probe: connection error', err.message || err);
  process.exit(2);
});
ws.on('close', (code, reason) => {
  if (done) return;
  done = true;
  console.log('MCP probe: closed', code, reason);
  process.exit(0);
});
