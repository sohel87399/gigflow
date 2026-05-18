import 'dotenv/config';
import mongoose from 'mongoose';
import { User } from '../models/User.model';
import { Lead } from '../models/Lead.model';
import { LeadStatus, LeadSource } from '../types';

const MONGO_URI =
  process.env.MONGO_URI ?? 'mongodb://localhost:27017/smartleads';

const LEAD_STATUSES: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Lost'];
const LEAD_SOURCES: LeadSource[] = ['Website', 'Instagram', 'Referral'];

const SAMPLE_NAMES = [
  'Alice Johnson',
  'Bob Martinez',
  'Carol White',
  'David Brown',
  'Emma Davis',
  'Frank Wilson',
  'Grace Lee',
  'Henry Taylor',
  'Isabella Anderson',
  'James Thomas',
  'Karen Jackson',
  'Liam Harris',
  'Mia Thompson',
  'Noah Garcia',
  'Olivia Martinez',
  'Paul Robinson',
  'Quinn Clark',
  'Rachel Lewis',
  'Samuel Walker',
  'Tina Hall',
  'Uma Allen',
  'Victor Young',
  'Wendy King',
  'Xavier Wright',
  'Yara Scott',
];

const randomItem = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

const seed = async (): Promise<void> => {
  await mongoose.connect(MONGO_URI);
  console.info('Connected to MongoDB');

  // Clear existing data
  await Promise.all([User.deleteMany({}), Lead.deleteMany({})]);
  console.info('Cleared existing users and leads');

  // Create admin user
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@demo.com',
    password: 'Admin@123',
    role: 'admin',
  });
  console.info(`Created admin: ${admin.email}`);

  // Create sales user
  const salesUser = await User.create({
    name: 'Sales User',
    email: 'sales@demo.com',
    password: 'Sales@123',
    role: 'sales_user',
  });
  console.info(`Created sales user: ${salesUser.email}`);

  // Create 25 sample leads
  const leadsData = SAMPLE_NAMES.map((name, index) => ({
    name,
    email: `${name.toLowerCase().replace(/\s+/g, '.')}${index + 1}@example.com`,
    status: randomItem(LEAD_STATUSES),
    source: randomItem(LEAD_SOURCES),
    createdBy: index % 3 === 0 ? admin._id : salesUser._id,
  }));

  await Lead.insertMany(leadsData);
  console.info(`Created ${leadsData.length} sample leads`);

  console.info('\n✅ Seed completed successfully!');
  console.info('─────────────────────────────────');
  console.info('Demo credentials:');
  console.info('  Admin:      admin@demo.com  / Admin@123');
  console.info('  Sales User: sales@demo.com  / Sales@123');
  console.info('─────────────────────────────────');

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((error: unknown) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
