import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const BATCH_SIZE = 50; // safe batch size for memory-heavy inserts

async function main() {
  console.log('🚀 Starting database seed...');

  // === ADMIN USER ===
  const adminEmail = 'admin@example.com';
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!existingAdmin) {
    const password = await bcrypt.hash('admin123', 10);
    await prisma.user.create({
      data: {
        name: 'Main Admin',
        email: adminEmail,
        password,
        role: 'ADMIN',
      },
    });
    console.log('✅ Admin user created!');
  } else {
    console.log('⚠️ Admin already exists, skipping creation.');
  }

  // === ABOUT SECTION ===
  console.log('🌱 Seeding About section...');
  const existingAbout = await prisma.aboutIntro.findFirst();
  let aboutId: string;
  if (!existingAbout) {
    const about = await prisma.aboutIntro.create({
      data: {
        subtitle: 'Who We Are',
        title:
          'Flare is a web/software development Agency. We design thoughtful digital experiences and beautiful brand aesthetics.',
        description:
          'At Flare we ignite digital transformation through intelligent technology solutions and strategic IT consulting. We help businesses from startups to enterprises simplify complexity, modernize their systems, and scale with confidence in the digital age.',
        photoUrl: 'https://example.com/flare-about-photo.jpg',
      },
    });
    aboutId = about.id;

    const aboutSteps = [
      {
        title: 'Define',
        description:
          'We start by understanding you—your business goals, audience, and the challenges holding you back. Through strategy sessions, research, and technical consultation, we define what your users need, what your systems require, and how technology can best serve your vision.',
        order: 1,
        aboutIntroId: aboutId,
      },
      {
        title: 'Design',
        description:
          'Once we have clarity, our creative and technical teams bring your ideas to life visually. We focus on clean, modern, and user-friendly interfaces that reflect your brand identity and drive real engagement.',
        order: 2,
        aboutIntroId: aboutId,
      },
      {
        title: 'Build',
        description:
          "We don't just build — we engineer possibility. Every design, every line of code, and every feature is built with intention — optimized for speed, usability, and scalability.",
        order: 3,
        aboutIntroId: aboutId,
      },
      {
        title: 'Launch',
        description:
          'Where vision takes flight. The moment your product goes live, it’s your beginning. Our launch process ensures everything runs seamlessly: fast deployment, flawless function, and a strategy that gets you noticed.',
        order: 4,
        aboutIntroId: aboutId,
      },
    ];

    for (let i = 0; i < aboutSteps.length; i += BATCH_SIZE) {
      const batch = aboutSteps.slice(i, i + BATCH_SIZE);
      await prisma.aboutStep.createMany({ data: batch });
    }

    console.log('✅ About section created successfully!');
  } else {
    aboutId = existingAbout.id;
    console.log('⚠️ About section already exists, skipping.');
  }

  // === SERVICES ===
  console.log('🌱 Seeding Services...');
  const serviceCount = await prisma.service.count();
  if (serviceCount === 0) {
    const services = [
      {
        title: 'Product Design | UI/UX.',
        description:
          'We build and design fast, responsive, and reliable digital products that work seamlessly across all devices.',
        iconClass: 'service-icon--product-design',
        order: 1,
      },
      {
        title: 'Full-Stack DEV',
        description:
          'Our backend systems are secure, scalable, and built to handle real-world traffic. We integrate APIs, databases, and third-party services that keep your product running smoothly and efficiently.',
        iconClass: 'service-icon--branding',
        order: 2,
      },
      {
        title: 'App Scaling, Optimization & Cloud Deployment',
        description:
          'We optimize for performance, deploy to the cloud, and ensure your product stays fast, secure, and stable under pressure.',
        iconClass: 'service-icon--frontend',
        order: 3,
      },
      {
        title: 'Maintenance, Security & Long-Term Support',
        description:
          'We provide ongoing maintenance, security updates, and technical support to keep your digital products safe, updated, and performing at their best.',
        iconClass: 'service-icon--research',
        order: 4,
      },
    ];
    await prisma.service.createMany({ data: services });
    console.log('✅ Services seeded successfully!');
  } else {
    console.log('⚠️ Services already exist, skipping.');
  }

  // === PORTFOLIO ===
  console.log('🌱 Seeding Portfolio...');
  const portfolioCount = await prisma.portfolio.count();
  if (portfolioCount === 0) {
    const portfolioItems = [
      {
        title: 'The Red Wheel',
        category: 'Branding',
        thumbUrl: 'images/portfolio/red-wheel.jpg',
        thumb2xUrl: 'images/portfolio/red-wheel@2x.jpg',
        fullUrl: 'images/portfolio/gallery/g-red-wheel.jpg',
        fullSize: '1050x700',
        projectUrl: 'https://www.behance.net/',
        description:
          'Vero molestiae sed aut natus excepturi. Et tempora numquam. Temporibus iusto quo. Unde dolorem corrupti neque nisi.',
        order: 1,
      },
      {
        title: 'Music Life',
        category: 'Frontend Design',
        thumbUrl: 'images/portfolio/music-life.jpg',
        thumb2xUrl: 'images/portfolio/music-life@2x.jpg',
        fullUrl: 'images/portfolio/gallery/g-music-life.jpg',
        fullSize: '1050x700',
        projectUrl: 'https://www.behance.net/',
        description:
          'Vero molestiae sed aut natus excepturi. Et tempora numquam. Temporibus iusto quo. Unde dolorem corrupti neque nisi.',
        order: 2,
      },
      {
        title: 'OI Logo',
        category: 'Branding',
        thumbUrl: 'images/portfolio/oi-logo.jpg',
        thumb2xUrl: 'images/portfolio/oi-logo@2x.jpg',
        fullUrl: 'images/portfolio/gallery/g-oi-logo.jpg',
        fullSize: '1050x700',
        projectUrl: 'https://www.behance.net/',
        description:
          'Vero molestiae sed aut natus excepturi. Et tempora numquam. Temporibus iusto quo. Unde dolorem corrupti neque nisi.',
        order: 3,
      },
      {
        title: 'Corrugated Sheets',
        category: 'Frontend Design',
        thumbUrl: 'images/portfolio/corrugated-sheets.jpg',
        thumb2xUrl: 'images/portfolio/corrugated-sheets@2x.jpg',
        fullUrl: 'images/portfolio/gallery/g-corrugated-sheets.jpg',
        fullSize: '1050x700',
        projectUrl: 'https://www.behance.net/',
        description:
          'Vero molestiae sed aut natus excepturi. Et tempora numquam. Temporibus iusto quo. Unde dolorem corrupti neque nisi.',
        order: 4,
      },
      {
        title: 'Woodcraft',
        category: 'Frontend Design',
        thumbUrl: 'images/portfolio/woodcraft.jpg',
        thumb2xUrl: 'images/portfolio/woodcraft@2x.jpg',
        fullUrl: 'images/portfolio/gallery/g-woodcraft.jpg',
        fullSize: '1050x700',
        projectUrl: 'https://www.behance.net/',
        description:
          'Vero molestiae sed aut natus excepturi. Et tempora numquam. Temporibus iusto quo. Unde dolorem corrupti neque nisi.',
        order: 5,
      },
      {
        title: 'The Lamp',
        category: 'Frontend Design',
        thumbUrl: 'images/portfolio/lamp.jpg',
        thumb2xUrl: 'images/portfolio/lamp@2x.jpg',
        fullUrl: 'images/portfolio/gallery/g-lamp.jpg',
        fullSize: '1050x700',
        projectUrl: 'https://www.behance.net/',
        description:
          'Vero molestiae sed aut natus excepturi. Et tempora numquam. Temporibus iusto quo. Unde dolorem corrupti neque nisi.',
        order: 6,
      },
    ];

    for (let i = 0; i < portfolioItems.length; i += BATCH_SIZE) {
      const batch = portfolioItems.slice(i, i + BATCH_SIZE);
      await prisma.portfolio.createMany({ data: batch });
    }
    console.log('✅ Portfolio seeded successfully!');
  } else {
    console.log('⚠️ Portfolio already exists, skipping.');
  }

  // === CLIENTS ===
  console.log('🌱 Seeding Clients...');
  const clientCount = await prisma.client.count();
  if (clientCount === 0) {
    const clients = [
      { name: 'Dropbox', logoUrl: 'images/icons/clients/dropbox.svg', linkUrl: '#0', order: 1 },
      { name: 'Atom', logoUrl: 'images/icons/clients/atom.svg', linkUrl: '#0', order: 2 },
      { name: 'GitHub', logoUrl: 'images/icons/clients/github.svg', linkUrl: '#0', order: 3 },
      { name: 'Red Hat', logoUrl: 'images/icons/clients/redhat.svg', linkUrl: '#0', order: 4 },
      { name: 'Medium', logoUrl: 'images/icons/clients/medium.svg', linkUrl: '#0', order: 5 },
      { name: 'Messenger', logoUrl: 'images/icons/clients/messenger.svg', linkUrl: '#0', order: 6 },
      { name: 'Steam', logoUrl: 'images/icons/clients/steam.svg', linkUrl: '#0', order: 7 },
      { name: 'Spotify', logoUrl: 'images/icons/clients/spotify.svg', linkUrl: '#0', order: 8 },
    ];
    await prisma.client.createMany({ data: clients });
    console.log('✅ Clients seeded successfully!');
  } else {
    console.log('⚠️ Clients already exist, skipping.');
  }

  // === TESTIMONIALS ===
  console.log('🌱 Seeding Testimonials...');
  const testimonialCount = await prisma.testimonial.count();
  if (testimonialCount === 0) {
    const testimonials = [
      {
        content:
          'Molestiae incidunt consequatur quis ipsa autem nam sit enim magni. Voluptas tempore rem. Explicabo a quaerat sint autem dolore ducimus ut consequatur neque. Nisi dolores quaerat fuga rem nihil nostrum. Laudantium quia consequatur molestias delectus culpa.',
        authorName: 'Caleb',
        authorTitle: 'CEO, CXP, NG',
        authorImage: 'images/avatars/user-02.jpg',
        order: 1,
      },
      {
        content:
          'Excepturi nam cupiditate culpa doloremque deleniti repellat. Veniam quos repellat voluptas animi adipisci. Nisi eaque consequatur. Voluptatem dignissimos ut ducimus accusantium perspiciatis.',
        authorName: 'Sundar Pichai',
        authorTitle: 'CEO, Google',
        authorImage: 'images/avatars/user-01.jpg',
        order: 2,
      },
      {
        content:
          'Repellat dignissimos libero. Qui sed at corrupti expedita voluptas odit. Nihil ea quia nesciunt. Ducimus aut sed ipsam. Autem eaque officia cum exercitationem sunt voluptatum accusamus.',
        authorName: 'Satya Nadella',
        authorTitle: 'CEO, Microsoft',
        authorImage: 'images/avatars/user-04.jpg',
        order: 3,
      },
      {
        content:
          'Nunc interdum lacus sit amet orci. Vestibulum dapibus nunc ac augue. Fusce vel dui. In ac felis quis tortor malesuada pretium.',
        authorName: 'Jeff Bezos',
        authorTitle: 'CEO, Amazon',
        authorImage: 'images/avatars/user-05.jpg',
        order: 4,
      },
    ];

    for (let i = 0; i < testimonials.length; i += BATCH_SIZE) {
      const batch = testimonials.slice(i, i + BATCH_SIZE);
      await prisma.testimonial.createMany({ data: batch });
    }
    console.log('✅ Testimonials seeded successfully!');
  } else {
    console.log('⚠️ Testimonials already exist, skipping.');
  }

  // === CONTACT INFO ===
  console.log('🌱 Seeding Contact Info...');
  const existingContact = await prisma.contactInfo.findFirst();
  if (!existingContact) {
    await prisma.contactInfo.create({
      data: {
        email: 'bitflow.com@gmail.com',
        phone: '+234-916-036-4498',
        address: '1600 Amphitheatre Parkway\nMile 3, PH RIVERS\nNIGERIA',
      },
    });
    console.log('✅ Contact Info created!');
  } else {
    console.log('⚠️ Contact Info already exists, skipping.');
  }

  // === SOCIAL LINKS ===
  console.log('🌱 Seeding Social Links...');
  const socialCount = await prisma.socialLink.count();
  if (socialCount === 0) {
    const socials = [
      { platform: 'Facebook', url: '#0', order: 1 },
      { platform: 'Twitter', url: '#0', order: 2 },
      { platform: 'Instagram', url: '#0', order: 3 },
      { platform: 'Whatsapp', url: 'https://wa.me/+2349160364498', order: 4 },
    ];
    await prisma.socialLink.createMany({ data: socials });
    console.log('✅ Social Links seeded successfully!');
  } else {
    console.log('⚠️ Social Links already exist, skipping.');
  }

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
