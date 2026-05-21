"""
serve.py — Local preview server for LOCKimmo
- Runs build-tokens.py on startup
- Watches lockimmo-tokens.json and rebuilds on change
- Serves the project on PORT (default 4000)
"""

import os, http.server, socketserver, subprocess, threading, time
from pathlib import Path

ROOT        = Path(__file__).parent.parent
TOKEN_FILE  = ROOT / "lockimmo-tokens.json"
BUILD       = ROOT / "build-tokens.py"
PORT        = int(os.environ.get("PORT", 4000))


def run_build():
    result = subprocess.run(
        ["python3", str(BUILD)],
        cwd=str(ROOT),
        capture_output=True,
        text=True
    )
    if result.stdout:
        print(result.stdout, flush=True)
    if result.returncode != 0 and result.stderr:
        print(result.stderr, flush=True)


def watcher():
    last_mtime = None
    while True:
        try:
            mtime = TOKEN_FILE.stat().st_mtime
            if mtime != last_mtime:
                if last_mtime is not None:   # skip the initial trigger (already built)
                    print(f"\n[{time.strftime('%H:%M:%S')}] JSON changed — rebuilding…", flush=True)
                    run_build()
                last_mtime = mtime
        except Exception as e:
            print(f"Watcher error: {e}", flush=True)
        time.sleep(1)


# ── Initial build ──
print("🔨 Initial build…", flush=True)
run_build()

# ── Start watcher thread ──
t = threading.Thread(target=watcher, daemon=True)
t.start()
print(f"👁  Watching {TOKEN_FILE.name} for changes…", flush=True)

# ── Serve ──
os.chdir(ROOT)
handler = http.server.SimpleHTTPRequestHandler
with socketserver.TCPServer(("", PORT), handler) as httpd:
    print(f"🌐 Serving on http://localhost:{PORT}", flush=True)
    httpd.serve_forever()
