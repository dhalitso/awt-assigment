import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rtffdmxbphnanwsvtziv.supabase.co';
const supabaseAnonKey = 'sb_publishable_rOAMa9EAeL41LBaiRhK8wg_sXvig71V';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const mockVisitors = [
  { mobile: true, location: 'Maputo, MZ', browser: 'Chrome Mobile', session_time: 120, phone_spec: 'Samsung Galaxy S22' },
  { mobile: true, location: 'Matola, MZ', browser: 'Safari Mobile', session_time: 340, phone_spec: 'iPhone 13 Pro' },
  { mobile: false, location: 'Maputo, MZ', browser: 'Chrome Desktop', session_time: 780, phone_spec: 'MacBook Air' },
  { mobile: true, location: 'Beira, MZ', browser: 'Firefox Focus', session_time: 45, phone_spec: 'Huawei P40 Lite' },
  { mobile: true, location: 'Nampula, MZ', browser: 'Chrome Mobile', session_time: 190, phone_spec: 'Xiaomi Redmi Note 11' },
  { mobile: true, location: 'Maputo, MZ', browser: 'Safari Mobile', session_time: 620, phone_spec: 'iPhone 14' },
  { mobile: false, location: 'Matola, MZ', browser: 'Firefox Desktop', session_time: 1100, phone_spec: 'Dell XPS 15' },
  { mobile: true, location: 'Chimoio, MZ', browser: 'Samsung Internet', session_time: 85, phone_spec: 'Samsung Galaxy A53' },
  { mobile: true, location: 'Maputo, MZ', browser: 'Chrome Mobile', session_time: 310, phone_spec: 'iPhone 11' },
  { mobile: false, location: 'Vilankulo, MZ', browser: 'Safari Desktop', session_time: 450, phone_spec: 'iMac' }
];

async function seed() {
  console.log('Seeding 10 mock visitor records...');
  
  const { data, error } = await supabase
    .from('visitors')
    .insert(mockVisitors)
    .select();
    
  if (error) {
    console.error('Error seeding data:', error.message);
    process.exit(1);
  } else {
    console.log('Successfully seeded 10 visitors! Inserted rows:', data.length);
    process.exit(0);
  }
}

seed();
