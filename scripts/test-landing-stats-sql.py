"""Run only synthetic fixtures in a disposable, network-isolated Postgres container."""
import json
import subprocess
import time
import uuid
from pathlib import Path

root = Path(__file__).resolve().parents[1]
container = "kickon-landing-stats-test-" + uuid.uuid4().hex[:10]

def command(args, **kwargs):
    return subprocess.run(args, capture_output=True, text=True, timeout=30, **kwargs)

started = command(["docker", "run", "--detach", "--network", "none", "--name", container,
                   "--label", "kickon.test=landing-stats-disposable",
                   "-e", "POSTGRES_PASSWORD=local-fixture-only", "postgres:17"])
if started.returncode:
    raise SystemExit("Could not start isolated test container")

try:
    for _ in range(30):
        if command(["docker", "exec", container, "pg_isready", "-U", "postgres"]).returncode == 0:
            break
        time.sleep(0.5)
    else:
        raise RuntimeError("Local fixture Postgres did not become ready")
    inspected = json.loads(command(["docker", "inspect", container]).stdout)[0]
    assert inspected["HostConfig"]["NetworkMode"] == "none"
    assert not inspected["HostConfig"].get("PortBindings")
    for filename in ["supabase/tests/landing-stats-fixture.sql",
                     "supabase/migrations/202610120001_public_landing_stats.sql",
                     "supabase/tests/landing-stats-test.sql",
                     "supabase/rollback/202610120001_public_landing_stats.sql"]:
        result = command(["docker", "exec", "-i", container, "psql", "-U", "postgres", "-X", "-v", "ON_ERROR_STOP=1"],
                         input=(root / filename).read_text())
        if result.returncode:
            raise RuntimeError(filename + ": " + result.stderr)
        print(filename + ": PASS")
    result = command(["docker", "exec", container, "psql", "-U", "postgres", "-X", "-At", "-c",
                      "select to_regprocedure('public.public_landing_stats()') is null;"])
    assert result.returncode == 0 and result.stdout.strip() == "t"
    print("Rollback removes only the new function: PASS")
finally:
    command(["docker", "rm", "--force", container])
