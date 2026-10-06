"""Narrow, guarded registration in the shared origin robots.txt. Run on the VPS.

Usage: python3 register-sitemap.py EXPECTED_SHA256 [--apply]
Preserves all existing directives; backup is outside the public web root.
"""
from pathlib import Path
from datetime import datetime, timezone
import hashlib
import json
import os
import shutil
import sys
import tempfile

target = Path('/var/www/marketing.parkskazka.ru/robots.txt')
backup_dir = Path('/var/www/.mg-group-backups')
line = b'Sitemap: https://marketing.parkskazka.ru/mg-group/sitemap.xml'
sha = lambda data: hashlib.sha256(data).hexdigest()
assert not target.is_symlink(), 'Inspect symlink before replacing robots.txt'
before = target.read_bytes()
assert sha(before) == sys.argv[1], 'Concurrent robots.txt edit; re-read before proceeding'
if line in before.splitlines():
    print(json.dumps({'status': 'already_registered', 'sha256': sha(before)}))
    sys.exit(0)
newline = b'\r\n' if b'\r\n' in before else b'\n'
after = before + (b'' if before.endswith(b'\n') else newline) + newline + b'# MG Group project sitemap' + newline + line + newline
receipt = {'path': str(target), 'beforeSha256': sha(before), 'afterSha256': sha(after), 'addedSitemap': line.decode().split(': ', 1)[1], 'status': 'prepared'}
if '--apply' in sys.argv:
    backup_dir.mkdir(exist_ok=True)
    stamp = datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%SZ')
    backup = backup_dir / ('robots-' + stamp + '.txt')
    assert not backup.exists()
    shutil.copy2(target, backup)
    info = target.stat()
    fd, staging = tempfile.mkstemp(prefix='.mg-robots-', dir=target.parent)
    try:
        with os.fdopen(fd, 'wb') as output:
            output.write(after)
            output.flush()
            os.fsync(output.fileno())
        os.chmod(staging, info.st_mode)
        os.chown(staging, info.st_uid, info.st_gid)
        assert target.read_bytes() == before, 'Concurrent robots.txt edit'
        os.replace(staging, target)
        assert target.read_bytes() == after
    finally:
        if os.path.exists(staging):
            os.unlink(staging)
    receipt.update(status='registered', backup=str(backup))
    (backup_dir / ('robots-' + stamp + '.json')).write_text(json.dumps(receipt, indent=2))
print(json.dumps(receipt))
