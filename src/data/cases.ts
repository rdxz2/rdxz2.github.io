// Case studies, one page each at /work/<slug>/, linked from their journey entry.
// Facts come from the owner's answers and timeline.ts. Numbers only by metric id.

export interface Case {
  slug: string;
  entry: string; // id of the timeline entry this case expands
  title: string;
  summary: string;
  metrics: string[];
  sections: { heading: string; body: string[]; links?: { label: string; href: string }[] }[];
}

export const cases: Case[] = [
  {
    slug: 'underwriting',
    entry: 'realtime-underwriting',
    title: 'Re-platforming real-time loan underwriting',
    summary:
      "Moved the service that scores every loan application off a Python 3.6 stack on another team's infrastructure onto one the data team owns. It moved endpoint by endpoint, and neither its logic nor the backend changed.",
    metrics: ['underwriting-cutover'],
    sections: [
      {
        heading: 'Context',
        body: [
          'Every loan application at JULO is scored in real time: features are generated, scoring models run, and business approval rules decide.',
          "The service that orchestrated this ran on Python 3.6 with old libraries, on the backend team's infrastructure rather than ours. Jenkins deployed it as three separate instances (API, worker and scheduler), with Celery on a RabbitMQ broker.",
          'Its runtime had fallen behind the infrastructure around it, so upgrading it in place was risky. Scoring models had already moved into their own containers, and features into a real-time feature service. This was the last piece.',
        ],
      },
      {
        heading: 'Constraints',
        body: [
          'The backend could not change: same endpoint, same payload.',
          'Business logic and flows had to stay exactly as they were, and the old and new systems had to run side by side during the move.',
        ],
      },
      {
        heading: 'Decisions',
        body: [
          'Keep the orchestration code as it is. Neither of us designed it, but it is legacy code that still does its job, so I moved it with minimal changes (imports, names, small adjustments) and no redesign. With the same code on both sides, a new business rule could ship to both systems at once.',
          'Change what runs underneath: Python 3.14 with uv, everything in Docker, deployed through our own self-service data-ops platform.',
          'One VM instead of three, because the service is light: it mostly calls other services, with only small rule calculations of its own.',
          "Redis instead of RabbitMQ as the task broker, because at our traffic RabbitMQ's extra complexity wasn't worth running.",
        ],
      },
      {
        heading: 'Rollout',
        body: [
          'I planned the rollout, with input from another engineer. First, the new system was built all the way to production.',
          'Then endpoints moved over a few at a time, behind an experiment group: for those endpoints the old service stopped running the logic and forwarded each call to the new system instead.',
          'Each step ran for several days while we watched performance and scale, then the next endpoints moved.',
          'At 100%, we dropped the experiment and removed the migrated code from the old service.',
        ],
      },
      {
        heading: 'Result',
        body: [
          'All real-time underwriting traffic has run on the new system since September 2026, and the backend needed no change.',
          'It has been more stable since, and because we now run the whole stack ourselves, we can trace code and deployment errors end to end.',
        ],
      },
      {
        heading: 'Who else can run it',
        body: [
          "Both engineers on the team can deploy, debug and fix it. What you need to know is in code comments and the repo's AI-assistant docs.",
        ],
      },
    ],
  },
  {
    slug: 'cdc',
    entry: 'cdc-gcp-alibaba-gcp',
    title: 'Moving CDC streaming next to the databases',
    summary:
      'Moved the streamers that copy every Postgres change into BigQuery next to the databases they read, twice: Google Cloud → Alibaba Cloud, then back to Google Cloud when the databases moved there. No data gap. A teammate designed the system. I scaled, migrated and run it.',
    metrics: ['cdc-tables'],
    sections: [
      {
        heading: 'Context',
        body: [
          "JULO's app databases are Postgres. Our change-data-capture (CDC) pipeline reads each database's write-ahead log (WAL) through a logical replication stream and loads the changes into BigQuery.",
          'When we built it, the data infrastructure had already moved to Google Cloud, but the Postgres databases still lived in Alibaba Cloud.',
        ],
      },
      {
        heading: 'Three places it ran',
        body: [
          'Google Cloud, reading Alibaba Cloud: the streamer read the WAL over the public internet, through an SSH tunnel to a jumpbox and then to Postgres. Streaming WAL across clouds is costly and risky, even over an interconnect. Replication lagged even under normal traffic, and a lagging stream puts the source database itself at risk.',
          'Inside Alibaba Cloud: we moved the streamer right next to the databases. That removed the jumpbox and the public-internet hop, the lag went away, and there was no extra network cost.',
          'Back to Google Cloud: when the databases moved to Google Cloud, the streamer moved back with them. Since then it is Google Cloud to Google Cloud, simple and predictable.',
        ],
      },
      {
        heading: 'Who did what',
        body: [
          "A teammate designed the core streamer and nightly merger, and made the call to move them. That's why this one is co-owned.",
          'I migrated the streamers, including those for the largest databases, onboarded new database sources, and fixed partitioned and NULL-safe incremental merges.',
        ],
      },
      {
        heading: 'How we cut over',
        body: [
          'For each database, two streamers ran side by side, old and new, each on its own replication slot, both loading into BigQuery.',
          'Duplicates in the log tables are fine: the merge keeps only the latest version of each row.',
          'Once both streamers had caught up with the database, we dropped the old replication slot and stopped the old streamer.',
        ],
      },
      {
        heading: 'Result',
        body: [
          'Every streamer now runs on Google Cloud, next to both the databases it reads and the BigQuery it loads into, with no data gap.',
          'Keeping the raw change log paid off later too, because it let us rebuild tables to a point in time.',
        ],
      },
      {
        heading: "What I'd do differently",
        body: [
          "The loading step. All data goes into BigQuery through batch load jobs. I prototyped streaming it through the BigQuery Storage Write API instead, in my public CDC-from-scratch project, but that API is paid, so we haven't moved to it.",
        ],
        links: [{ label: 'CDC from scratch on GitHub', href: 'https://github.com/rdxz2/demo' }],
      },
      {
        heading: 'Who else can run it',
        body: ['Both engineers on the team can operate, fix and deploy it.'],
      },
    ],
  },
  {
    slug: 'data-ops-platform',
    entry: 'data-ops-self-service',
    title: 'A self-service data-ops platform for a two-person team',
    summary:
      'One internal web app that turned data-team tickets and command-line chores into self-service workflows with approvals and audit trails, including our own deploy pipeline.',
    metrics: ['self-service-users', 'self-service-requests', 'access-decision-time', 'deploy-coverage', 'metabase-managed-access'],
    sections: [
      {
        heading: 'Context',
        body: [
          'Two data engineers serve the whole company. Requests for data access, table syncs, file exports and deploys used to reach us through Slack, and each one was manual work: a pull request, a server login, terminal commands or several clicks in Metabase.',
        ],
      },
      {
        heading: 'What it does',
        body: [
          'People open a menu, fill in what they need, and an approver signs off. Every action is logged and gets a Slack thread.',
          'Approving a Postgres → BigQuery table sync opens the pipeline pull request and runs the first copy.',
          'Metabase access is time-boxed: a grant revokes itself when its time is up, and every permission group in use is created and managed by the platform.',
          "It also runs file exports, temporary ML machine upgrades that downgrade at midnight, SQL formatting to the team's house style, and the semantic-layer sync into Metabase.",
        ],
      },
      {
        heading: 'Deploys: build, not buy',
        body: [
          "When the engineering team's CI runners were switched off company-wide, we needed our own deploy path. I took ideas from GitHub Actions and Jenkins and built a small Jenkins-style deploy page into the platform: pick a service → environment → git ref, and it runs.",
          "Image builds that used to run on GitHub's runners now run on our own infrastructure: fetch the code → build and push the image → deploy to VMs or Cloud Run.",
          'You can watch every run live with its log, and each one is audited.',
        ],
      },
      {
        heading: 'Result',
        body: [
          "I haven't measured hours saved. What changed is that these tasks no longer wait on a data engineer: people do them in a few clicks, guided by the page.",
          'Access requests that need an approver are timed from request to decision, so how long people wait is measured (see the numbers at the top).',
        ],
      },
      {
        heading: 'Who else can run it',
        body: [
          "I built it solo, but both engineers on the team can deploy, debug and fix it. What you need to know is in code comments and the repo's AI-assistant docs.",
        ],
      },
    ],
  },
];
