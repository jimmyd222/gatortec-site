// Generate Business → Resources pages (expanded content)
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'site');

function head(title, desc) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title} · GatorTec</title>
<link rel="icon" type="image/png" sizes="32x32" href="../../../assets/img/site/favicon-32.png">
<link rel="icon" type="image/png" sizes="16x16" href="../../../assets/img/site/favicon-16.png">
<link rel="apple-touch-icon" sizes="180x180" href="../../../assets/img/site/apple-touch-icon.png">
<meta name="description" content="${desc}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../../../assets/css/tokens.css">
<link rel="stylesheet" href="../../../assets/css/base.css">
<style>
  .res-body { max-width:760px; }
  .res-body p { font-size:16px; line-height:1.7; color:var(--ink-2); margin:0 0 18px; }
  .res-body h2 { font-family:var(--display); font-weight:700; font-size:26px; line-height:1.25; margin:48px 0 16px; }
  .res-body ul { font-size:16px; line-height:1.7; color:var(--ink-2); margin:0 0 18px; padding-left:22px; }
  .res-body ul li { margin-bottom:8px; }
  .res-body ul li strong { color:var(--ink-1); }
  .res-body a { color:var(--blue); }
</style>
</head><body>`;
}

const HEADER = `<a class="skip-link" href="#main">Skip to main content</a>
<header class="top"><div class="wrap">
<a class="brand" href="../../../index.html" aria-label="GatorTec home"><img src="../../../assets/img/site/gatortec-mark.png" alt="" aria-hidden="true"><span>GatorTec</span></a>
<nav class="main" aria-label="Primary">
<a href="../../../products/index.html">Products</a>
<a href="../../index.html" aria-current="page">For Business</a>
<a href="../../../consumer/index.html">For Home</a>
<a href="../../../service/index.html">Service</a>
<a class="pill" href="../../../contact/index.html">Contact</a>
</nav></div></header>`;

const FOOTER = `<footer class="site"><div class="wrap">
<div class="grid">
<div class="intro">
<a class="brand" href="../../../index.html"><img src="../../../assets/img/site/gatortec-mark.png" alt="" aria-hidden="true"><span>GatorTec</span></a>
<p>North Florida's Apple Premier Partner. Locally owned, Apple-certified, and here since 2010 — helping businesses and individuals choose, source, and own the right Apple devices. Also an Apple Authorized Service Provider.</p>
<div class="sig-row" aria-label="Apple Premier Partner"><img src="../../../assets/signatures/premier-partner-2ln.png" alt="Apple Premier Partner"></div>
</div>
<nav class="col" aria-label="For Business"><h3>For Business</h3>
<a href="../../index.html">Overview</a>
<a href="../../products/index.html">Products</a>
<a href="../../service/index.html">Service</a>
<a href="../../contact/index.html">Request a quote</a>
</nav>
<nav class="col" aria-label="For Home"><h3>For Home</h3>
<a href="../../../consumer/index.html">Overview</a>
<a href="../../../consumer/products/index.html">Products</a>
<a href="../../../consumer/service/index.html">Service</a>
<a href="../../../consumer/contact/index.html">Contact us</a>
</nav>
<nav class="col" aria-label="Company"><h3>Company</h3>
<a href="../../faq/index.html">FAQ</a>
<a href="../../../legal/accessibility.html">Accessibility</a>
<a href="../../../legal/privacy.html">Privacy</a>
<a href="../../../legal/terms.html">Terms</a>
<a href="../../../legal/sms-terms.html">SMS Terms</a>
</nav>
</div>
<div class="legal"><span>© 2010–2026 GatorTec, LLC. All rights reserved.</span><span>Gainesville, FL · <a href="tel:+13525057582">352.505.7582</a></span></div>
<div class="apple-legal">
<p>Apple, the Apple logo, MacBook, MacBook Air, MacBook Pro, MacBook Neo, iMac, Mac mini, Mac Studio, iPad, iPad Air, iPad Pro, iPad mini, Apple Watch, AirPods, AirPods Pro, AirPods Max, Apple TV, AirTag, HomePod, AppleCare, AppleCare+, Apple Premier Partner, and Apple Authorized Service Provider are trademarks of Apple Inc., registered in the U.S. and other countries and regions. iPhone, Apple Intelligence, and the Apple at Work program name are trademarks of Apple Inc.</p>
<p>TM and © 2026 Apple Inc. All rights reserved.</p>
</div></div></footer>`;

// Posts: lede is the opening framing. body is full HTML inside .res-body.
const POSTS = [
  {
    slug: 'apple-business-manager',
    title: 'Apple Business Manager',
    h1: 'Apple Business Manager. <em>Deploy Apple, at scale.</em>',
    lede: 'A web-based portal that helps businesses easily deploy Apple devices, apps, and content. ABM integrates with your MDM solution to automate device deployment and streamline management across your organization.',
    body: `
<p>Apple Business Manager (ABM) is designed for organizations of all sizes. With ABM integrated into your mobile device management solution, your IT team can configure devices without ever physically handling them — ensuring a faster, more secure setup process from day one.</p>

<h2>Seamless device deployment</h2>
<p>With Apple Business Manager, you can enroll iPhone, iPad, Mac, and Apple TV devices into your MDM automatically. As soon as employees unbox their new devices, they can start using them immediately with pre-configured settings, apps, and security controls. This zero-touch deployment process saves time, reduces IT workload, and ensures consistent configurations across your organization.</p>

<h2>Manage apps and content with ease</h2>
<p>Apple Business Manager also simplifies app and content management. You can purchase apps and books in bulk through the App Store and assign them directly to users or devices — without needing Apple IDs. Licenses can be easily reassigned, allowing you to manage resources effectively and reduce costs.</p>

<h2>Enhanced security and control</h2>
<p>Through integration with your MDM, ABM offers powerful management capabilities including remote device configuration, software updates, and security policies. In the event of a lost or stolen device, administrators can lock or erase it remotely, protecting sensitive business data.</p>

<h2>Empower your organization with Apple Business Manager</h2>
<p>Whether you're managing a small team or a large enterprise, Apple Business Manager is essential for simplifying and securing your Apple device deployment. Partnering with an Apple Premier Partner like GatorTec ensures expert support and a smooth implementation tailored to your organization's needs.</p>

<p><a href="https://support.apple.com/guide/apple-business-manager/welcome/web" target="_blank" rel="noopener">Read the Apple Business Manager User Guide ›</a></p>
`,
    cta: 'Want help setting up Apple Business Manager and an MDM that fits your environment?',
    summary: 'Web-based portal for deploying Apple devices, apps, and content — integrated with your MDM for zero-touch setup, app management, and remote control.',
  },

  {
    slug: 'applecare-for-enterprise',
    title: 'AppleCare for Enterprise',
    h1: 'AppleCare for Enterprise. <em>Coverage built for IT.</em>',
    lede: 'World-class support, device repair coverage, and service options to keep your Apple products running. Priority access to Apple experts, on-site hardware repairs, and coverage for multiple devices under a single plan.',
    body: `
<p>AppleCare for Enterprise is designed for organizations of all sizes. With it, your business can minimize downtime, reduce IT workload, and keep employees productive across the entire Apple fleet.</p>

<h2>Priority support and fast repairs</h2>
<p>Businesses gain 24/7 access to Apple's dedicated support team, providing fast and expert assistance for both hardware and software issues. This priority support extends to your IT team, giving them direct access to senior technical advisors to quickly resolve complex issues. Additionally, on-site repairs are available for covered hardware, helping minimize disruptions and keep your teams focused on their work.</p>

<h2>Flexible service coverage</h2>
<p>AppleCare for Enterprise provides coverage for all your Apple devices — including Macs, iPads, iPhones, and Apple displays — under one easy-to-manage agreement. Coverage includes unlimited repairs for accidental damage with a per-incident fee, protecting your investment and reducing unexpected costs. Businesses can also choose coverage tiers based on the number of devices, ensuring a plan that scales with your organization.</p>

<h2>Streamlined IT operations</h2>
<p>AppleCare for Enterprise integrates seamlessly with Apple Business Manager, simplifying device deployment and management. Your IT team gains powerful tools for remote configuration, device monitoring, and app distribution — all supported by AppleCare's technical experts. Additionally, the plan includes on-site repairs, often with next-business-day service, helping your IT team resolve issues quickly without sending devices off-site.</p>

<h2>Device lifecycle management</h2>
<p>AppleCare for Enterprise supports your business throughout the entire device lifecycle. From initial deployment to ongoing management and eventual upgrades, AppleCare helps ensure your devices remain productive and secure. With comprehensive coverage and technical support, your business can extend the life of your Apple devices and reduce total cost of ownership.</p>

<h2>Why choose AppleCare for Enterprise?</h2>
<ul>
<li><strong>24/7 priority support</strong> — Expert assistance for both your employees and IT team.</li>
<li><strong>On-site hardware service</strong> — Next-business-day repairs to minimize downtime.</li>
<li><strong>Comprehensive coverage</strong> — Protection for accidental damage and hardware issues.</li>
<li><strong>IT integration</strong> — Seamless support for device deployment and management.</li>
<li><strong>Flexible plans</strong> — Scalable coverage to match your business size and needs.</li>
</ul>

<p>AppleCare for Enterprise is more than just a support plan — it's a solution designed to empower your business, reduce risk, and keep your Apple ecosystem running at peak performance. With expert service, comprehensive coverage, and seamless integration into your IT workflows, AppleCare for Enterprise is an essential investment for any organization relying on Apple technology.</p>
`,
    cta: 'Want a quote on AppleCare for Enterprise for your fleet?',
    summary: '24/7 priority support, on-site hardware repairs, and accidental damage coverage — under one agreement that scales with your fleet.',
  },

  {
    slug: 'asset-tagging',
    title: 'Asset Tagging',
    h1: 'Asset Tagging. <em>Track every device, every time.</em>',
    lede: 'A streamlined solution to help you track, manage, and secure your Apple devices throughout their lifecycle. Custom labels, MDM-integrated visibility, and durable tags purpose-built for inventory control.',
    body: `
<p>At GatorTec, we understand the importance of efficiently managing your Apple devices — whether you're overseeing a business, school, or organization. As an Apple Premier Partner, we offer professional asset tagging solutions designed to improve inventory control, enhance security, and simplify IT management.</p>

<h2>Custom labels, durable tags</h2>
<p>Our asset tagging service includes the application of custom labels with unique identifiers — barcodes, QR codes, or serial-numbered tags — ensuring each device is easily trackable within your asset management system. These durable tags help IT teams quickly locate, assign, and monitor devices, reducing the risk of loss, theft, or misplacement. Whether you're deploying a large fleet of iPads in a school environment or managing company-wide MacBook assignments, asset tagging provides the visibility and organization needed to keep operations running smoothly.</p>

<h2>Security and accountability</h2>
<p>Beyond tracking, asset tagging also enhances security and accountability. By integrating asset tags with mobile device management solutions, organizations can maintain control over their Apple devices, enforce security policies, and remotely manage inventory. If a device is lost or stolen, administrators can use the asset tag information to quickly identify and disable the device, protecting sensitive data.</p>

<h2>Simpler maintenance</h2>
<p>Asset tagging simplifies maintenance by allowing IT teams to track warranty status, repair history, and replacement schedules more effectively. No more spreadsheets pieced together from receipts and emails — every device has a single source of truth.</p>

<h2>Customized to your organization</h2>
<p>Our asset tagging service is designed to be seamless and customized to fit your organization's needs. Whether you need serialized labels for internal tracking or custom branding for easy identification, we ensure that each tag meets your specifications. By implementing asset tagging with GatorTec, businesses and schools can reduce administrative workload, improve device accountability, and enhance overall asset management efficiency.</p>
`,
    cta: 'Want to add asset tagging to your next deployment?',
    summary: 'Custom-labeled iPads and Macs with barcodes, QR codes, or serialized tags — applied before deployment and integrated with your MDM.',
  },

  {
    slug: 'business-apps',
    title: 'Business Apps Starter Guide',
    h1: 'Business Apps. <em>Productivity, built right in.</em>',
    lede: 'Apple devices come with powerful built-in apps designed to help your business stay productive, organized, and efficient. Manage projects, collaborate with your team, and get the job done across Mac, iPad, and iPhone.',
    body: `
<p>From managing projects to collaborating with your team, the apps that come with every Apple device are built to work seamlessly across your hardware — whether you're on a Mac, iPad, or iPhone. Here are the essential tools that help you get the job done and keep your business running smoothly.</p>

<h2>Organize, plan, and collaborate</h2>
<ul>
<li><strong>Calendar</strong> — Manage your schedule, set reminders, and coordinate meetings effortlessly. Sync your appointments across all your devices and share calendars with your team to stay on track.</li>
<li><strong>Reminders</strong> — Never miss a deadline. Create to-do lists, set due dates, and organize tasks by priority to stay productive.</li>
<li><strong>Notes</strong> — Capture ideas, meeting notes, and project details. Collaborate in real time by sharing notes with your team and organizing them with tags and folders.</li>
</ul>

<h2>Communicate and connect seamlessly</h2>
<ul>
<li><strong>Mail</strong> — Stay on top of your inbox. Integrates easily with business email services like Microsoft Exchange and Google Workspace. Use smart filters to organize your messages and boost productivity.</li>
<li><strong>Messages and FaceTime</strong> — Collaborate quickly with your team through Messages for instant communication, or use FaceTime for high-quality video calls and virtual meetings.</li>
</ul>

<h2>Create, analyze, and present with confidence</h2>
<ul>
<li><strong>Pages</strong> — Design professional reports, proposals, and documents with intuitive features and customizable templates. Collaborate with your team in real time.</li>
<li><strong>Numbers</strong> — Build detailed spreadsheets, analyze business data, and track performance. Create charts, tables, and dashboards to visualize what matters.</li>
<li><strong>Keynote</strong> — Deliver impactful presentations with animations, transitions, and collaboration tools that captivate your audience.</li>
</ul>

<h2>Stay secure and in control</h2>
<p>Apple's built-in business apps are designed with privacy and security in mind. End-to-end encryption, secure sign-ins with Face ID or Touch ID, and seamless integration with Apple Business Manager keep your sensitive business data safe and protected.</p>

<h2>Get more done with the App Store</h2>
<p>In addition to built-in apps, the App Store offers thousands of powerful business apps to meet your needs. From project management tools like Trello and Asana to finance apps like QuickBooks, and the full Microsoft 365 and Google Workspace suites — you'll find solutions that help your business stay efficient and productive.</p>

<h2>Getting started is easy</h2>
<p>All of these apps are ready to use the moment you power on your device. Plus, with iCloud, your documents, notes, and calendars sync seamlessly across all your Apple devices. Whether you're in the office or on the go, you'll always have the tools you need to get the job done. Apple means business — powerful tools, intuitive design, and seamless collaboration, all built right in.</p>
`,
    cta: 'Want help planning the right app stack for your team?',
    summary: 'Mac, iPad, and iPhone come with powerful apps for organizing, communicating, creating, and analyzing — designed to work seamlessly across devices.',
  },

  {
    slug: 'kitting',
    title: 'Kitting',
    h1: 'Kitting. <em>Devices ready to use, day one.</em>',
    lede: 'A comprehensive solution designed to streamline the deployment process for iPads, Macs, iPhones, and accessories — devices arrive fully prepared, pre-configured, and ready for immediate use.',
    body: `
<p>At GatorTec, we know that setting up new Apple devices for your business or organization can be time-consuming and complex. That's why we offer kitting services. As an Apple Premier Partner, we ensure your devices arrive fully prepared, pre-configured, and ready for immediate use — reducing downtime and IT workload.</p>

<h2>End-to-end preparation</h2>
<p>Our kitting process goes beyond just packaging devices. We handle everything from device configuration and labeling to bundling necessary accessories — power adapters, cases, keyboards, and Apple Pencils. Each kit is custom-built to meet your organization's specific needs, ensuring that users receive a complete, organized package tailored to their workflows.</p>

<p>Whether you're deploying hundreds of iPads in a school district or rolling out new MacBooks for employees, GatorTec ensures every device is prepped, protected, and efficiently packaged for easy distribution.</p>

<h2>Efficiency and consistency at scale</h2>
<p>Kitting also enhances efficiency and consistency across large-scale deployments. By standardizing device setups — including pre-installed software, asset tagging, and enrollment into mobile device management solutions — GatorTec helps IT teams simplify onboarding and maintain compliance with security policies. Users can unbox their devices and start working immediately, without requiring time-consuming manual setup or IT intervention.</p>

<h2>A turnkey deployment solution</h2>
<p>With GatorTec's kitting services, your organization gains a turnkey deployment solution that saves time, improves user experience, and ensures a smooth rollout of Apple devices. Whether you need devices ready for a corporate deployment, educational program, or retail solution, we provide a tailored approach that meets your unique requirements.</p>

<p>Let us handle the details — so you can focus on what matters most.</p>
`,
    cta: 'Want a quote on kitting for your next Apple rollout?',
    summary: 'Custom-built kits — devices pre-configured, accessories bundled, asset-tagged, and packaged — so users unbox and start working with zero IT involvement.',
  },

  {
    slug: 'lifecycle-management',
    title: 'Lifecycle Management',
    h1: 'Lifecycle Management. <em>Refresh, recover value, recycle responsibly.</em>',
    lede: 'A hassle-free buyback program designed to help you get the most value from your aging Apple devices while making it easier to refresh your technology — secure data wipe and environmentally responsible disposal included.',
    body: `
<p>At GatorTec, we understand that upgrading your Apple devices is an essential part of keeping your business, school, or organization running smoothly. As an Apple Premier Partner, our buyback service allows you to trade in your used Macs, iPads, iPhones, and accessories in exchange for credit toward the latest Apple products — reducing your overall technology costs and simplifying your IT asset management.</p>

<h2>Streamlined trade-in</h2>
<p>Our trade-in process ensures that your organization receives fair market value for your devices without the headache of managing resales or disposals. Simply provide your devices for evaluation, and our team of experts will assess their condition and offer competitive trade-in credit that can be applied toward new Apple hardware. This cost-effective approach helps businesses and schools stay ahead with the latest technology while minimizing upfront expenses.</p>

<h2>Secure data erasure</h2>
<p>Security is at the forefront of our buyback program. We ensure that all data is securely wiped from returned devices, protecting your organization from potential data breaches or compliance risks. Using certified data erasure methods, we guarantee that no sensitive information remains on your devices before they are resold, refurbished, or responsibly recycled. This gives your IT team peace of mind, knowing that your company's data is protected throughout the transition process.</p>

<h2>Environmentally responsible</h2>
<p>At GatorTec, we are also committed to environmental responsibility. Through our buyback program, we help organizations participate in sustainable device recycling by ensuring that retired Apple products are either refurbished for secondary use or disposed of in an eco-friendly manner. By working with us, your business can align with Apple's environmental initiatives while reducing electronic waste and supporting sustainability goals.</p>

<h2>Seamless, secure, sustainable</h2>
<p>With GatorTec's buyback program, upgrading your Apple technology has never been easier or more cost-effective. Whether you're managing a corporate IT refresh, a school-wide device update, or simply looking to trade in older Apple devices, we provide a seamless, secure, and sustainable solution. Let us help you maximize the value of your Apple investments.</p>
`,
    cta: 'Want a buyback quote on devices you\'re ready to retire?',
    summary: 'A hassle-free buyback and trade-in program for Macs, iPads, and iPhones — secure data wipe, fair market value, and environmentally responsible disposal.',
  },

  {
    slug: 'mac-adoption-blueprint',
    title: 'Mac Adoption Blueprint',
    h1: 'Mac Adoption Blueprint. <em>A strategic guide to bringing Mac to your team.</em>',
    lede: 'In today\'s dynamic business landscape, providing employees with the right tools is paramount to fostering innovation and productivity. Apple\'s Mac Adoption Blueprint is a comprehensive guide that outlines effective strategies for seamlessly incorporating Mac into your business environment.',
    body: `
<p>Many organizations are integrating Mac into their IT infrastructure — for better security, higher user satisfaction, and the talent advantages that come with letting employees choose their tools. The Mac Adoption Blueprint is Apple's playbook for doing that well.</p>

<h2>Securing executive buy-in</h2>
<p>A successful Mac adoption begins with obtaining support from key stakeholders, including C-suite executives and line-of-business managers. Their endorsement is crucial for driving the initiative forward and ensuring alignment with organizational goals. The blueprint provides insights into articulating the benefits of Mac — enhanced security, user satisfaction, and potential cost savings — to gain executive approval.</p>

<h2>Empowering employee choice</h2>
<p>Empowering employees to choose their preferred devices can lead to increased job satisfaction and productivity. The blueprint discusses the advantages of offering Mac as an option, highlighting how it can attract top talent and reduce turnover. By providing flexible financing models and clear choices within IT-supported products, businesses can create a more engaged and efficient workforce.</p>

<h2>Streamlining deployment and management</h2>
<p>Integrating Mac into an existing IT ecosystem requires careful planning to ensure seamless deployment and management. The blueprint outlines best practices for over-the-air device deployment, leveraging tools like Apple Business Manager and mobile device management solutions. These strategies enable IT teams to efficiently manage Mac devices, enforce security policies, and provide necessary support without disrupting operations.</p>

<h2>Personalizing the user experience</h2>
<p>Beyond standard configurations, allowing employees to personalize their devices fosters a sense of ownership and can enhance productivity. The Mac Adoption Blueprint emphasizes the importance of enabling personalization while maintaining corporate standards. This balance ensures that devices meet both organizational requirements and individual user needs, leading to a more harmonious and effective work environment.</p>

<h2>Comprehensive resources for a smooth transition</h2>
<p>To support businesses in this journey, the blueprint offers a wealth of resources — including deployment guides, communication kits, and training materials. These tools are designed to assist IT teams in planning and executing a successful Mac adoption strategy, ensuring that both technical and cultural aspects are addressed.</p>

<p>For a detailed roadmap and actionable insights on integrating Mac into your business, ask us about the full Mac Adoption Blueprint.</p>
`,
    cta: 'Want help building your Mac adoption plan?',
    summary: 'Apple\'s playbook for integrating Mac into your business — executive buy-in, employee choice, deployment, management, and personalization.',
  },

  {
    slug: 'mac-employee-starter-guide',
    title: 'Mac Employee Starter Guide',
    h1: 'Mac Employee Starter Guide. <em>For new Mac users at work.</em>',
    lede: 'Switching to a Mac at work? Whether you\'re a longtime Apple user or completely new to macOS, getting comfortable with your new device is easy with the right resources. Apple\'s Mac Employee Starter Guide walks you through everything from setting up your Mac to mastering powerful built-in apps designed to boost your productivity.',
    body: `
<p>This guide is a fantastic tool to help you get up to speed quickly. Here are some of the highlights you'll find in it.</p>

<h2>Getting started with Mac basics</h2>
<p>When you power on your Mac for the first time, you'll be guided through a quick and easy setup process. The guide emphasizes the importance of enrolling your device into your company's systems to gain access to essential services — email, calendars, and Wi-Fi. You'll also get familiar with the macOS interface: the Dock for launching your favorite apps, Finder for organizing your files, and System Settings to personalize your Mac to suit your work style and preferences.</p>

<h2>Boosting productivity with built-in apps</h2>
<p>One of the greatest benefits of using a Mac for work is the suite of powerful apps that come pre-installed. A few that the guide covers:</p>
<ul>
<li><strong>Mail</strong> — Manage your work email efficiently and sync with your corporate email service.</li>
<li><strong>Calendar</strong> — Stay on top of meetings and appointments with scheduling tools that integrate with your email and contacts.</li>
<li><strong>Notes</strong> — Jot down ideas, take meeting notes, and collaborate with colleagues by sharing notes.</li>
<li><strong>Reminders</strong> — Keep track of deadlines with lists and task alerts.</li>
</ul>

<p>You'll also learn about iWork, Apple's productivity suite:</p>
<ul>
<li><strong>Pages</strong> for word processing</li>
<li><strong>Numbers</strong> for spreadsheets</li>
<li><strong>Keynote</strong> for presentations</li>
</ul>

<p>For businesses using Microsoft Office, the guide explains how you can seamlessly use <strong>Word</strong>, <strong>Excel</strong>, and <strong>PowerPoint</strong> on your Mac to collaborate with your team — they run natively on Apple silicon.</p>

<h2>Collaborating across devices with Continuity</h2>
<p>If you use an iPhone or iPad alongside your Mac, Apple's Continuity features make your workflow seamless:</p>
<ul>
<li><strong>Handoff</strong> — Start a project on your iPhone and finish it on your Mac without missing a beat.</li>
<li><strong>AirDrop</strong> — Share files instantly between your Apple devices.</li>
<li><strong>Universal Clipboard</strong> — Copy text or images on one device and paste them on another.</li>
</ul>

<p>These tools help you stay productive whether you're at your desk or on the go.</p>

<h2>Finding support and resources</h2>
<p>Apple has built an extensive support ecosystem to help you get the most out of your Mac. The Help menu is built into every app for quick assistance, and Apple's website offers detailed user manuals and video tutorials. You can also reach out to your company's IT department for additional support with business-specific tools and software.</p>

<h2>Get the full guide</h2>
<p>For a deeper dive into everything your new Mac can do, ask us about the official Mac Employee Starter Guide from Apple. It's a must-read for new users and a handy reference even for seasoned Mac pros.</p>
`,
    cta: 'Want a starter guide branded to your company for new hire onboarding?',
    summary: 'A quick guide to getting comfortable with macOS at work — setup, built-in apps, Continuity features across iPhone/iPad/Mac, and where to find support.',
  },

  {
    slug: 'volume-purchasing',
    title: 'Volume Purchasing',
    h1: 'Volume Purchasing. <em>Bulk discounts on Mac and iPad.</em>',
    lede: 'Cost savings when buying Macs and iPads in bulk. Designed for commercial customers, these discounts help companies equip their teams with cutting-edge Apple technology while managing budgets effectively.',
    body: `
<p>Whether you're outfitting your workforce with MacBooks or deploying iPads for sales teams or field operations, volume purchasing offers significant savings and streamlined procurement.</p>

<h2>Maximize savings with bulk orders</h2>
<p>Volume pricing is ideal for organizations standardizing their technology across teams or multiple office locations. The savings scale with order size and can also include discounted rates on AppleCare+ for Business, providing extended coverage and priority support to protect your investment and minimize downtime.</p>

<h2>Seamless deployment and management</h2>
<p>Volume purchases through GatorTec integrate with Apple Business Manager for zero-touch deployment. Devices arrive pre-configured with company apps, settings, and security protocols, ready for immediate use. This streamlined approach reduces the burden on IT teams and ensures consistency across your organization's devices.</p>

<h2>Flexible financing and leasing options</h2>
<p>To help businesses manage cash flow, volume purchases can be paired with flexible financing or leasing options. Companies can acquire the latest Apple technology without a large upfront cost — preserving capital while keeping teams equipped with high-performance devices.</p>

<h2>Ongoing support from an Apple Premier Partner</h2>
<p>Partnering with GatorTec ensures a smooth purchasing experience, from procurement to deployment and beyond. Expert teams provide personalized recommendations, assist with bulk orders, and offer ongoing technical support to help your business maximize its investment in Apple technology.</p>

<p>Volume purchasing discounts on Macs and iPads are an ideal solution for commercial customers — offering cost savings, operational efficiency, and enterprise-level support to drive productivity and growth.</p>
`,
    cta: 'Want a quote on a volume order?',
    summary: 'Significant cost savings on bulk Mac and iPad orders — paired with zero-touch deployment, AppleCare options, and flexible financing.',
  },
];

function build(post) {
  return `${head(post.title, post.summary)}
${HEADER}
<main id="main">

<section class="cat-hero" aria-labelledby="h1"><div class="wrap" style="max-width:880px">
<nav class="crumbs" aria-label="Breadcrumb">
<a href="../../../index.html">Home</a><span class="sep" aria-hidden="true">›</span>
<a href="../../index.html">For Business</a><span class="sep" aria-hidden="true">›</span>
<a href="../index.html">Resources</a><span class="sep" aria-hidden="true">›</span>
<span class="current">${post.title}</span>
</nav>
<span class="ptag">Resource</span>
<h1 id="h1">${post.h1}</h1>
<p class="lede">${post.lede}</p>
</div></section>

<section class="section"><div class="wrap res-body">
${post.body}
</div></section>

<section class="section alt" aria-labelledby="cta-h"><div class="wrap" style="max-width:880px">
<div class="shead"><span class="eyebrow"><span class="dot" aria-hidden="true"></span>Next step</span><h2 id="cta-h">${post.cta}</h2>
<p>Talk to a GatorTec account manager — we'll scope what fits your team and get you a clear plan.</p></div>
<div class="dual-cta">
<a class="dcta biz" href="../../contact/index.html"><span class="dlabel">For Business</span><h3>Request a quote</h3>
<p>Your account manager, scoped to your timeline and team size.</p>
<span class="arrow">Get a B2B quote <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>
</a>
<a class="dcta home" href="../index.html"><span class="dlabel">Resources</span><h3>More Resources</h3>
<p>Browse the full Resources library — Apple Business Manager, AppleCare for Enterprise, kitting, lifecycle, more.</p>
<span class="arrow">All Resources <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>
</a>
</div>
</div></section>

</main>
${FOOTER}
</body></html>`;
}

function buildIndex() {
  const cards = POSTS.map(p => `<a class="rcard" href="${p.slug}/index.html">
<h3>${p.title}</h3>
<p>${p.summary}</p>
<span class="more">Read more →</span>
</a>`).join('\n\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Resources for Business · GatorTec</title>
<link rel="icon" type="image/png" sizes="32x32" href="../../assets/img/site/favicon-32.png">
<link rel="icon" type="image/png" sizes="16x16" href="../../assets/img/site/favicon-16.png">
<link rel="apple-touch-icon" sizes="180x180" href="../../assets/img/site/apple-touch-icon.png">
<meta name="description" content="GatorTec resources for business — Apple Business Manager, AppleCare for Enterprise, kitting, asset tagging, lifecycle management, volume purchasing.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../../assets/css/tokens.css">
<link rel="stylesheet" href="../../assets/css/base.css">
</head><body>

<a class="skip-link" href="#main">Skip to main content</a>

<header class="top"><div class="wrap">
<a class="brand" href="../../index.html" aria-label="GatorTec home"><img src="../../assets/img/site/gatortec-mark.png" alt="" aria-hidden="true"><span>GatorTec</span></a>
<nav class="main" aria-label="Primary">
<a href="../../products/index.html">Products</a>
<a href="../index.html" aria-current="page">For Business</a>
<a href="../../consumer/index.html">For Home</a>
<a href="../../service/index.html">Service</a>
<a class="pill" href="../../contact/index.html">Contact</a>
</nav></div></header>

<main id="main">

<section class="cat-hero" aria-labelledby="h1"><div class="wrap">
<nav class="crumbs" aria-label="Breadcrumb">
<a href="../../index.html">Home</a><span class="sep" aria-hidden="true">›</span>
<a href="../index.html">For Business</a><span class="sep" aria-hidden="true">›</span>
<span class="current">Resources</span>
</nav>
<h1 id="h1">Resources for Business. <em>Everything you need to roll out Apple.</em></h1>
<p class="lede">Practical, scope-ready guides on Apple Business Manager, kitting, asset tagging, lifecycle management, volume purchasing, AppleCare for Enterprise, and more. Use them to plan your next deployment — or talk to a GatorTec account manager to scope a project.</p>
</div></section>

<section class="section"><div class="wrap">
<div class="res" role="list">
${cards}
</div>
</div></section>

</main>

<footer class="site"><div class="wrap">
<div class="grid">
<div class="intro">
<a class="brand" href="../../index.html"><img src="../../assets/img/site/gatortec-mark.png" alt="" aria-hidden="true"><span>GatorTec</span></a>
<p>North Florida's Apple Premier Partner. Locally owned, Apple-certified, and here since 2010 — helping businesses and individuals choose, source, and own the right Apple devices. Also an Apple Authorized Service Provider.</p>
<div class="sig-row" aria-label="Apple Premier Partner"><img src="../../assets/signatures/premier-partner-2ln.png" alt="Apple Premier Partner"></div>
</div>
<nav class="col" aria-label="For Business"><h3>For Business</h3>
<a href="../index.html">Overview</a>
<a href="../products/index.html">Products</a>
<a href="../service/index.html">Service</a>
<a href="../contact/index.html">Request a quote</a>
</nav>
<nav class="col" aria-label="For Home"><h3>For Home</h3>
<a href="../../consumer/index.html">Overview</a>
<a href="../../consumer/products/index.html">Products</a>
<a href="../../consumer/service/index.html">Service</a>
<a href="../../consumer/contact/index.html">Contact us</a>
</nav>
<nav class="col" aria-label="Company"><h3>Company</h3>
<a href="../faq/index.html">FAQ</a>
<a href="../../legal/accessibility.html">Accessibility</a>
<a href="../../legal/privacy.html">Privacy</a>
<a href="../../legal/terms.html">Terms</a>
<a href="../../legal/sms-terms.html">SMS Terms</a>
</nav>
</div>
<div class="legal"><span>© 2010–2026 GatorTec, LLC. All rights reserved.</span><span>Gainesville, FL · <a href="tel:+13525057582">352.505.7582</a></span></div>
<div class="apple-legal">
<p>Apple, the Apple logo, MacBook, MacBook Air, MacBook Pro, MacBook Neo, iMac, Mac mini, Mac Studio, iPad, iPad Air, iPad Pro, iPad mini, Apple Watch, AirPods, AirPods Pro, AirPods Max, Apple TV, AirTag, HomePod, AppleCare, AppleCare+, Apple Premier Partner, and Apple Authorized Service Provider are trademarks of Apple Inc., registered in the U.S. and other countries and regions. iPhone, Apple Intelligence, and the Apple at Work program name are trademarks of Apple Inc.</p>
<p>TM and © 2026 Apple Inc. All rights reserved.</p>
</div></div></footer>

</body></html>`;
}

const resourcesDir = path.join(ROOT, 'business', 'resources');
fs.mkdirSync(resourcesDir, { recursive: true });
fs.writeFileSync(path.join(resourcesDir, 'index.html'), buildIndex());
console.log('wrote Resources index');

for (const post of POSTS) {
  const d = path.join(resourcesDir, post.slug);
  fs.mkdirSync(d, { recursive: true });
  fs.writeFileSync(path.join(d, 'index.html'), build(post));
  console.log('wrote:', post.slug);
}
console.log('Done.');
