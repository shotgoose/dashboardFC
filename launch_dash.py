import os, sys, time, subprocess, signal, socket, shutil
from urllib.parse import urlparse

# ---- CONFIG ----
URL = "http://localhost:8000"
PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "ui/server.py")
SERVER_CMD = [sys.executable, "-u", "server.py"]
CHROMIUM_CANDIDATES = ["chrome.exe", "chromium.exe", "msedge.exe"]

CHROME_FLAGS = [
    "--kiosk",
    "--start-fullscreen",
    "--incognito",
    "--no-first-run",
    "--disable-infobars",
    "--disable-session-crashed-bubble",
    "--overscroll-history-navigation=0",
]

# ---- HELPERS ----
def which_chromium():
    for exe in CHROMIUM_CANDIDATES:
        path = shutil.which(exe)
        if path:
            return path
    raise RuntimeError("Could not find Chrome/Chromium executable in PATH.")

def wait_for_url(url, timeout=20.0, interval=0.25):
    """Wait until TCP port is open."""
    parsed = urlparse(url)
    host = parsed.hostname or "localhost"
    port = parsed.port or (443 if parsed.scheme == "https" else 80)
    deadline = time.time() + timeout
    while time.time() < deadline:
        try:
            with socket.create_connection((host, port), timeout=1.0):
                return True
        except OSError:
            time.sleep(interval)
    return False

# ---- MAIN ----
def main():
    # Start the server
    # log_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "logs")
    # os.makedirs(log_dir, exist_ok=True)
    # log_path = os.path.join(log_dir, "server.out.log")
    # server_log = open(log_path, "ab", buffering=0)
    server = subprocess.Popen(
        SERVER_CMD,
        # stdout=server_log,
        stderr=subprocess.STDOUT,
        cwd=os.path.dirname(os.path.abspath(__file__)),
        creationflags=subprocess.CREATE_NEW_PROCESS_GROUP  # Windows equivalent of setsid
    )

    # Wait for the server to come up
    print("Starting server...")
    if not wait_for_url(URL, 30.0):
        print("Server not reachable yet; launching browser anyway.")

    # Launch Chromium or Chrome
    chrome_path = which_chromium()
    chrome_cmd = [chrome_path, *CHROME_FLAGS, URL]
    browser = subprocess.Popen(chrome_cmd)

    print("Dashboard launched.")
    try:
        while True:
            time.sleep(0.5)
            if server.poll() is not None:
                print("Server exited. Closing browser...")
                browser.terminate()
                break
            if browser.poll() is not None:
                print("Browser closed. Stopping server...")
                server.terminate()
                break
    except KeyboardInterrupt:
        print("Interrupted; shutting down.")
        browser.terminate()
        server.terminate()
    # finally:
        # server_log.close()

if __name__ == "__main__":
    main()
