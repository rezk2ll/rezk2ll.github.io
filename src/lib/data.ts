import {
	siDocker,
	siFastify,
	siGit,
	siGithubactions,
	siGo,
	siHelm,
	siKubernetes,
	siLinux,
	siNodedotjs,
	siOpenbao,
	siOpenid,
	siPostgresql,
	siRabbitmq,
	siReact,
	siRubyonrails,
	siSentry,
	siSvelte,
	siTailwindcss,
	siTraefikproxy,
	siTypescript,
	siVuedotjs,
	type SimpleIcon
} from 'simple-icons';

export const bio =
	"I'm Tech Lead on Twake Workplace at LINAGORA, an open-source suite with mail, calendar, chat and drive. I own sign-in and accounts: how people log in, and how an account gets created or deleted across every app, in the cloud and on customers' own servers. I write the design decisions down, and I still write the code. On the side I build Dojo, a free daily-practice school for engineers.";

export const technologies: { name: string; icon: SimpleIcon }[] = [
	{ name: 'TypeScript', icon: siTypescript },
	{ name: 'Svelte', icon: siSvelte },
	{ name: 'React', icon: siReact },
	{ name: 'Node.js', icon: siNodedotjs },
	{ name: 'Fastify', icon: siFastify },
	{ name: 'Go', icon: siGo },
	{ name: 'Ruby on Rails', icon: siRubyonrails },
	{ name: 'PostgreSQL', icon: siPostgresql },
	{ name: 'RabbitMQ', icon: siRabbitmq },
	{ name: 'OIDC / LDAP', icon: siOpenid },
	{ name: 'Kubernetes', icon: siKubernetes },
	{ name: 'Helm', icon: siHelm },
	{ name: 'Docker', icon: siDocker },
	{ name: 'Traefik', icon: siTraefikproxy },
	{ name: 'OpenBao', icon: siOpenbao },
	{ name: 'Sentry', icon: siSentry },
	{ name: 'GitHub Actions', icon: siGithubactions },
	{ name: 'Tailwind CSS', icon: siTailwindcss },
	{ name: 'Linux', icon: siLinux },
	{ name: 'Git', icon: siGit },
	{ name: 'Vue.js', icon: siVuedotjs }
];

export type Job = {
	title: string;
	company: string;
	location: string;
	period: string;
	description: string;
	highlights?: string[];
};

export const experience: Job[] = [
	{
		title: 'Technical Lead',
		company: 'LINAGORA',
		location: 'Issy-les-Moulineaux, France',
		period: 'Jun 2025 – Present',
		description:
			'Technical lead for around 20 engineers on Twake Workplace, which serves 7,000 active users and business (B2B) customers. I own sign-in and identity (SSO/OIDC, 2FA, client-side encryption), the RabbitMQ messaging between services, and security hardening. Reviewed 650+ pull requests across 38 repositories.',
		highlights: [
			'Wrote 20+ architecture decision records, on account lifecycle, external SSO, messaging and paid plans.',
			'Made account creation and deletion work the same way in SaaS and on-prem: one event, and every app follows. 50+ merged PRs in the open-source ldap-rest along the way.',
			'Took new collaboration apps from first design to production in weeks (React, Fastify, PostgreSQL, RabbitMQ), wired into mail, calendar, chat and drive.',
			'Shipped two open-source services: one signs a user out everywhere when their account is deleted, the other is a proxy that hides users from third-party content providers.',
			'Built the Twake Dashboard that operators use to run the platform, with role-based access, an audit trail, replay of failed messages and an on-prem mode.',
			'Wired Stripe billing into the product, so billing events show up as banners inside the apps (RabbitMQ across Rails, Go and React services).',
			'Rebuilt the dev Kubernetes cluster with secrets in OpenBao, and ran production rollouts that touched several services at once.',
			'Ran hiring for senior engineers (technical test and interviews). Set up an AI-assisted code review workflow shared with the team.'
		]
	},
	{
		title: 'Senior Full-Stack Developer',
		company: 'LINAGORA',
		location: 'Tunis & Issy-les-Moulineaux, France',
		period: '2022 – 2025',
		description:
			'Built platform services for Twake Workplace, its signup flow and Twake On Matrix (Matrix-based chat). Shipped major features in Cozy Drive and contributed upstream to Cozy. Owned the CI/CD: Docker, GitHub Actions and Helm.'
	},
	{
		title: 'Full-Stack Developer',
		company: 'LINAGORA',
		location: 'Tunis, Tunisia',
		period: '2020 – 2022',
		description:
			'Built the Twake platform and its Matrix invitation system, and contributed to OpenPaaS and SmartSla. Wrote frontends in AngularJS, Vue and React, set up CI/CD pipelines, and kept the integrations between teams working.'
	},
	{
		title: 'Web Developer',
		company: 'LINAGORA',
		location: 'Tunis, Tunisia',
		period: '2017 – 2020',
		description:
			'Built and maintained a managed PKI (digital certificates) platform for ANCE, the Tunisian national certification agency. Ran the client demos and the support.'
	}
];

export type Project = { name: string; description: string; tech: string[]; url: string };

export const projects: Project[] = [
	{
		name: 'Dojo',
		description:
			'Short daily lessons for software engineers on architecture, DevOps, databases, security and more, in French and English. Works offline, and spaced repetition brings old topics back before you forget them.',
		tech: ['SvelteKit', 'PWA', 'Mermaid'],
		url: 'https://ferjani.dev/dojo'
	},
	{
		name: 'Claude Agents Indicator',
		description:
			'Shows which Claude Code session is waiting on you, from the Linux panel: a Wingpanel indicator for elementary OS, a tray app for KDE, GNOME and Xfce, and a waybar module. Packaged for Ubuntu, Debian, Fedora and Arch.',
		tech: ['Vala', 'GTK', 'D-Bus'],
		url: 'https://github.com/rezk2ll/claude-agents-indicator'
	},
	{
		name: 'tuxmedic',
		description:
			'A terminal app that finds what is wrong with a Linux desktop and says it in plain words: crashes, Wi-Fi, sound, screens, battery and 30 checks in all, each with the command that fixes it on your distro. Works on any distro and any terminal size, without root.',
		tech: ['Go', 'Bubble Tea', 'D-Bus'],
		url: 'https://github.com/rezk2ll/tuxmedic'
	},
	{
		name: 'Vetixa',
		description: 'Veterinary clinic management system, in production at vetixa.tn',
		tech: ['SvelteKit', 'PocketBase', 'TailwindCSS', 'Zod'],
		url: 'https://github.com/rezk2ll/vetixa'
	},
	{
		name: 'Eat Explained',
		description: 'Interactive guide to nutrition',
		tech: ['SvelteKit', 'TailwindCSS'],
		url: 'https://eatexplained.github.io/'
	},
	{
		name: 'svelte-num-otp',
		description: 'OTP input component for Svelte, published on npm',
		tech: ['Svelte', 'TailwindCSS'],
		url: 'https://github.com/rezk2ll/svelte-num-otp'
	}
];

export const openSource: Project[] = [
	{
		name: 'ldap-rest',
		description:
			'REST API for LDAP directories that also publishes every change as an event. 50+ merged PRs.',
		tech: ['TypeScript', 'LDAP', 'RabbitMQ'],
		url: 'https://github.com/linagora/ldap-rest'
	},
	{
		name: 'twake-sessions-service',
		description: 'Ends SSO sessions when an account is deleted, driven by RabbitMQ events',
		tech: ['TypeScript', 'LemonLDAP::NG', 'RabbitMQ'],
		url: 'https://github.com/linagora/twake-sessions-service'
	},
	{
		name: 'twake-common-proxy',
		description: 'Privacy proxy so third-party content providers never see who the user is',
		tech: ['TypeScript', 'OIDC', 'Prometheus'],
		url: 'https://github.com/linagora/twake-common-proxy'
	},
	{
		name: '@linagora/rabbitmq-client',
		description: 'RabbitMQ client library shared by all the platform services',
		tech: ['TypeScript', 'RabbitMQ'],
		url: 'https://www.npmjs.com/package/@linagora/rabbitmq-client'
	}
];

export const alsoContributed = ['cozy-stack', 'validator.js'];

export const ai = {
	intro:
		'I use Claude Code every day. The agents are fast; the part I care about is the guardrails I wrote around them, so nothing skips review.',
	points: [
		'No pull request opens until code review, an over-engineering check, comment cleanup and local tests have run.',
		'Merges, secrets and destructive commands need my explicit go.',
		'PR descriptions, issues and commit messages are linted against my writing rules.',
		'About fifteen custom skills for PRs, releases, ADRs, postmortems and dependency triage.',
		'For work across repositories, one agent per repository, coordinated by an orchestrator.'
	]
};
