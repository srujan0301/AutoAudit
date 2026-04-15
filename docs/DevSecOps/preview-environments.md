# Preview Environments

Preview environments let reviewers spin up a fully isolated, running instance of AutoAudit directly from a pull request. Each preview gets its own database branch, backend service, and frontend deploy. They are created on demand and torn down when no longer needed.

## Scope

The preview environment includes the frontend and backend only. The scanning engine is not spun up as part of a preview — running it alongside Cloud Run would push memory and compute usage beyond the free tier limits on both GCP and Neon. Previews are intended for reviewing frontend and backend changes (UI, API behaviour, authentication, data display) rather than full end-to-end scan execution.

## Why on demand

Neon's free tier allows 10 database branches. With 15+ PRs typically open at once, auto-deploying on every PR would exhaust that limit immediately. The label-based trigger means a Neon branch only exists while a reviewer is actively using the preview.

## How to use

From any open PR, apply a label using the Labels panel on the right side of the PR page.

| Label | Effect |
|---|---|
| `deploy-preview` | Spins up the preview environment. The label is removed automatically once the workflow starts. |
| `teardown-preview` | Tears down the preview environment. The label is removed automatically once the workflow starts. |

The environment is also torn down automatically when the PR is closed or merged.

Preview URLs are posted as a comment on the PR by the GitHub Actions bot once the deploy completes (around 5 minutes).

## Architecture

The deploy runs as a linear chain of jobs in `.github/workflows/preview-deploy.yml`:

```
Label: deploy-preview
        |
       gate              resolves PR number and short commit SHA, removes label
        |
build-push-backend-image  builds Docker image tagged pr-<N>-<sha>, pushes to Docker Hub
        |
deploy-backend-preview    provisions Neon DB branch, deploys image to Cloud Run,
                          sets BACKEND_PUBLIC_URL once the Cloud Run URL is known
        |
build-frontend            builds React app with VITE_API_URL pointing at the Cloud Run URL,
                          deploys to Netlify draft
        |
post-preview-comment      posts or updates the preview URLs comment on the PR
```

The frontend build runs after the backend is deployed because the Cloud Run URL is only known after the first deploy, and it needs to be baked into the Vite bundle at build time.

## Services

| Service | Role | Resource per PR |
|---|---|---|
| Docker Hub | Stores the backend image | Image tag `autoaudit-backend:pr-<N>-<sha>` |
| Google Cloud Run | Hosts the backend | Service `autoaudit-pr-<N>` in `us-central1` |
| Neon | Isolated Postgres database | Branch `pr-<N>` (reused across deploys of the same PR) |
| Upstash | Redis cache | Shared across all previews |
| Netlify | Hosts the frontend | Draft deploy at `pr-<N>--<site>.netlify.app` |

## Secrets

All secrets are stored as GitHub Actions repository secrets.

| Secret | Service |
|---|---|
| `PREVIEW_NETLIFY_AUTH_TOKEN` | Netlify |
| `PREVIEW_NETLIFY_SITE_ID` | Netlify |
| `PREVIEW_DOCKER_HUB_USERNAME` | Docker Hub |
| `PREVIEW_DOCKER_HUB_TOKEN` | Docker Hub |
| `PREVIEW_GCP_CREDENTIALS` | Google Cloud Run (service account JSON) |
| `PREVIEW_GCP_PROJECT_ID` | Google Cloud Run |
| `PREVIEW_NEON_API_KEY` | Neon |
| `PREVIEW_NEON_PROJECT_ID` | Neon |
| `PREVIEW_UPSTASH_REDIS_URL` | Upstash |

## Staying in the free tier

### Google Cloud Run

Free tier per billing account per month: 2M requests, 360K GB-seconds memory, 180K vCPU-seconds, 1GB egress.

The following flags keep idle preview costs at $0:

- `--min-instances 0` scales to zero when there is no traffic
- `--max-instances 3` caps runaway scaling
- `--memory 512Mi` avoids overprovisioning
- CPU throttling is left on (no `--no-cpu-throttling`) so CPU is only allocated during active requests

Secrets are passed via `--set-env-vars` rather than GCP Secret Manager to avoid Secret Manager costs.

Set a GCP billing alert at $1 as a safety net: Billing → Budgets & alerts → Create budget.

### Neon

Free tier: 1 project, 10 branches, 0.5 GB storage. Compute auto-suspends after 5 minutes of inactivity, so idle preview databases cost nothing. The 10-branch limit is the main constraint — the on-demand label trigger exists specifically to stay within it.

### Netlify

Free tier: 100 GB bandwidth per month, 300 build minutes per month, unlimited sites. Preview deploys are draft deploys (not production), so they do not count against the production build quota separately. The teardown workflow deletes Netlify deploys explicitly because Netlify only auto-expires them after 90 days.

### Upstash

Free tier: 10,000 commands per day, 256 MB max data size, 1 database. Redis is shared across all active previews rather than provisioned per PR, so usage stays well within the daily command limit.

### Docker Hub

Free tier: 1 private repository, unlimited public repositories. The backend images are pushed to the one private repository and tagged per PR and commit (`pr-<N>-<sha>`). Old tags should be cleaned up periodically from Docker Hub to avoid accumulation.

## Teardown

Teardown is handled by `.github/workflows/preview-teardown.yml`. It:

1. Deletes the Cloud Run service
2. Deletes the Neon branch
3. Deletes the Netlify deploys for the branch (Netlify's free tier only auto-expires after 90 days)
4. Updates the PR comment to confirm the environment is torn down

## Handover note

The GCP free tier runs on a 90-day trial with $300 in credits. Once the credits or trial period expire, Cloud Run will begin billing the account on file. The other services (Neon, Netlify, Upstash, Docker Hub) are permanent free tiers with no expiry.

If you are taking over this project after the original GCP account has expired, create a new GCP account and follow the steps below. No workflow changes are needed — only the two GCP repository secrets need updating.

### Setting up GCP from scratch

**1. Create a GCP account**

Sign up at [cloud.google.com](https://cloud.google.com) to get a new 90-day free trial with $300 in credits. Create a new project and note the project ID.

**2. Enable required APIs**

In the GCP CLI run:

```bash
gcloud services enable run.googleapis.com iamgoogleapis.com --project <YOUR_PROJECT_ID>
```

**3. Create a service account**

Go to IAM and Admin > Service Accounts > Create Service Account. Give it the following roles:

- Cloud Run Admin
- Service Account Key Admin

**4. Create a JSON key**

In the service account, go to Keys > Add Key > Create New Key and select JSON. Download the file — this becomes the `PREVIEW_GCP_CREDENTIALS` repository secret.

> Before creating the key you may need to disable an Organisation Policy that blocks JSON key creation. To do this, go to IAM and Admin > Roles and grant the **Organisation Admin** role to your main Google account (not the service account). This unlocks the ability to create JSON keys under the project.

**5. Update the GitHub repository secrets**

Go to the repository Settings > Secrets and variables > Actions and update:

| Secret | Value |
|---|---|
| `PREVIEW_GCP_CREDENTIALS` | The full contents of the downloaded JSON key file |
| `PREVIEW_GCP_PROJECT_ID` | Your GCP project ID |

## Why labels instead of comment commands

GitHub Actions evaluates `issue_comment` event workflows from the repository's default branch, not the PR branch. This means a comment trigger only works after the workflow file has been merged to main, making pre-merge testing impossible.

`pull_request` events (including `labeled`) are evaluated from the PR branch HEAD, so the label trigger works on any open PR without needing to merge first.
