import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Read .env file directly
const envContent = fs.readFileSync('.env', 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const [k, v] = line.split('=');
  if (k && v) envVars[k.trim()] = v.trim();
});

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseAnonKey = envVars.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY missing in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function upsertLessonToDb(lessonPayload) {
  // Determine highest order_index if not provided
  if (lessonPayload.order_index === undefined) {
    const { data: existingLessons } = await supabase.from('lessons').select('order_index');
    if (Array.isArray(existingLessons) && existingLessons.length > 0) {
      const maxOrder = Math.max(...existingLessons.map(l => Number(l.order_index) || 0));
      lessonPayload.order_index = maxOrder + 1;
    } else {
      lessonPayload.order_index = 1;
    }
  }

  const { data, error } = await supabase
    .from('lessons')
    .upsert(lessonPayload, { onConflict: 'id' })
    .select();

  if (error) {
    console.error('Supabase Upsert Error:', error);
    process.exit(1);
  }

  console.log(`Successfully upserted lesson '${lessonPayload.id}' (order ${lessonPayload.order_index}) into Supabase DB:`, data);

  // Update default assigned lessons for existing students
  const { data: usersData, error: usersErr } = await supabase.from('users').select('id, assigned_lesson_ids');
  if (!usersErr && Array.isArray(usersData)) {
    for (const u of usersData) {
      const assigned = Array.isArray(u.assigned_lesson_ids) ? u.assigned_lesson_ids : [];
      if (!assigned.includes(lessonPayload.id)) {
        await supabase.from('users').update({ assigned_lesson_ids: [...assigned, lessonPayload.id] }).eq('id', u.id);
      }
    }
    console.log('Updated user assigned_lesson_ids in Supabase for all student accounts');
  }

  return data;
}

// CLI Execution if payload file passed as argument
const payloadFilePath = process.argv[2];
if (payloadFilePath) {
  const rawPayload = fs.readFileSync(payloadFilePath, 'utf-8');
  const parsedLesson = JSON.parse(rawPayload);
  upsertLessonToDb(parsedLesson);
}
