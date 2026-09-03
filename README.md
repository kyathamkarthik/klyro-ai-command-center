# Klyro AI Command Center

"Build an enterprise-grade SaaS dashboard for 'Klyro AI', an autonomous AI recovery agent for SAP Integration Suite. Use the attached image as the official company logo in the top-left corner of the sidebar navigation. The aesthetic should be highly professional, minimalistic, and inspired by SAP Fiori / SAP BTP Cockpit (slate grays, clean white cards, subtle blue primary accents to match the logo, sharp borders).

Include a sidebar navigation with 4 main tabs:

Tenant & Connection Hub: A form to input 'Tenant ID', 'Client ID', and 'Client Secret' (masked). Include a 'Connect' button. Below the form, show a connection status card displaying a green 'Active' indicator and mock environment toggles (Dev, QA, Prod).

IFlow & MPL Observer: A data table displaying mock failed SAP Message Processing Logs (MPLs) pulled via OData APIs. Columns: MPL ID, IFlow Name, Error Code, Timestamp, Status.

Autonomous Healing: A view showing AI-corrected payloads. Include a visual 'Circuit Breaker' status and semantic mapping logs.

HITL Escalation Queue: A master data review screen. Show a split-screen view: the original failed payload on the left (JSON format), and the AI-suggested fix on the right. Include 'Approve & Re-trigger' and 'Reject' buttons.

Use dummy data to populate the tables and metrics so the UI looks active. Add a user profile dropdown in the top right corner for Google/SSO login settings."

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/a4aebe55-f5a2-48ca-bea1-795306ba2e9e).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
