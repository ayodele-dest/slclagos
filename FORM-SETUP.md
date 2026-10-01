# SLC Lagos contact form setup

The website sends contact messages to `lagos@slchurchng.org` without placing the mailbox password or delivery secret in browser code.

## 1. Create the Google Apps Script mailer

1. Sign in to the Google account that is allowed to send the church's form notifications.
2. Open https://script.google.com and create a new project named `SLC Lagos Website Form`.
3. Replace the editor contents with `apps-script/Code.gs` from this repository and save it.
4. Open **Project Settings** → **Script Properties** and add `FORM_SHARED_SECRET`. Use a long random value (at least 32 characters).
5. Select **Deploy** → **New deployment** → **Web app**.
6. Set **Execute as** to **Me** and **Who has access** to **Anyone**. Deploy and approve the mail-sending permission.
7. Copy the deployment URL ending in `/exec`.

If the Google Workspace administrator has disabled public Apps Script web apps, that policy must be enabled for this project or the mailer must use a different server-side Google authorization flow.

## 2. Configure Vercel

In the Vercel project, open **Settings** → **Environment Variables** and add these to Production and Preview:

- `GOOGLE_APPS_SCRIPT_URL`: the `/exec` URL from step 1.
- `FORM_SHARED_SECRET`: exactly the same random value saved in Apps Script.

Do not prefix either variable with `VITE_`; that would expose it to the browser bundle. Redeploy the project after saving the variables.

## 3. Test

Submit the Connect form on the deployed website. Confirm that `lagos@slchurchng.org` receives a message and that replying addresses the visitor directly. If it does not arrive, check **Executions** in the Apps Script project and the Vercel Function logs for `/api/contact`.
