"""
M1 distributor: polls jobs.status='pending' every 10 s, spawns one worker.py
process per pending job. The worker flips status to 'downloading' immediately,
and the distributor also remembers which jobs it already started, so a job is
never picked up twice by the same distributor.

Reads SUPABASE_URL + SUPABASE_SECRET_KEY from AWS Secrets Manager.
Same auth model as worker.py — the IAM instance profile grants
`secretsmanager:GetSecretValue` on the supabase-* secret names.

Known limitation (acceptable for M1): if the distributor restarts while a job is
still 'pending', it may be started again. M4 replaces this with Lambda + Fargate.
"""
import os
import subprocess
import sys
import time
from pathlib import Path

import boto3
from supabase import create_client


def _load_secrets() -> dict[str, str]:
    sm = boto3.client("secretsmanager")
    return {
        "SUPABASE_URL": sm.get_secret_value(SecretId="supabase-url")["SecretString"].strip(),
        "SUPABASE_SECRET_KEY": sm.get_secret_value(SecretId="supabase-secret-key")["SecretString"].strip(),
    }


_secrets = _load_secrets()
db = create_client(_secrets["SUPABASE_URL"], _secrets["SUPABASE_SECRET_KEY"])

WORKER = Path(__file__).parent / "worker.py"
PYTHON = sys.executable  # use the same venv we're running in

# job id -> worker process, so a still-pending job isn't spawned twice.
running: dict[str, subprocess.Popen] = {}


def poll_once() -> None:
    for job_id, proc in list(running.items()):
        if proc.poll() is not None:
            print(f"worker for job {job_id} exited with code {proc.returncode}", flush=True)
            del running[job_id]

    rows = db.table("jobs").select("id").eq("status", "pending").execute().data
    for row in rows:
        if row["id"] in running:
            continue
        env = {**os.environ, "JOB_ID": row["id"]}
        running[row["id"]] = subprocess.Popen([PYTHON, str(WORKER)], env=env)
        print(f"spawned worker for job {row['id']}", flush=True)


def main() -> None:
    print("distributor: polling every 10s. Ctrl+C to stop.", flush=True)
    while True:
        try:
            poll_once()
        except Exception as e:
            print(f"poll error: {e}", file=sys.stderr, flush=True)
        time.sleep(10)


if __name__ == "__main__":
    main()
