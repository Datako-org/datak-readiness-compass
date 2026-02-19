import { createClient } from '@supabase/supabase-js';

interface NetlifyEvent {
  httpMethod: string;
  headers: Record<string, string | undefined>;
  queryStringParameters: Record<string, string> | null;
  body: string | null;
}

interface NetlifyResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}

const corsHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, x-admin-password',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

export const handler = async (event: NetlifyEvent): Promise<NetlifyResponse> => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  const providedPassword = event.headers['x-admin-password'];
  if (!providedPassword || providedPassword !== process.env.ADMIN_PASSWORD) {
    return {
      statusCode: 401,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Unauthorized' }),
    };
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Server configuration error' }),
    };
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const params = event.queryStringParameters || {};

  // Detail view — single diagnostic with answers
  if (params.id) {
    const { data, error } = await supabase
      .from('diagnostics')
      .select(`
        id, total_score, maturity_level, status, completed_at, axis_scores,
        organizations(name, sector, country, size),
        respondents(name, email, phone, role),
        answers(id, question_id, answer_value, score)
      `)
      .eq('id', params.id)
      .single();

    if (error) {
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ error: error.message }),
      };
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ data }),
    };
  }

  // List view — all completed diagnostics
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query = supabase
    .from('diagnostics')
    .select(`
      id, total_score, maturity_level, status, completed_at, axis_scores,
      organizations(name, sector, country, size),
      respondents(name, email, phone, role)
    `)
    .eq('status', 'completed')
    .order('completed_at', { ascending: false });

  // Optional server-side filters (for future use)
  if (params.sector) {
    query = query.eq('organizations.sector', params.sector);
  }

  const { data, error } = await query;

  if (error) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: error.message }),
    };
  }

  // Flatten nested join objects
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const flatData = (data || []).map((row: any) => ({
    id: row.id,
    completed_at: row.completed_at,
    total_score: row.total_score,
    maturity_level: row.maturity_level,
    axis_scores: row.axis_scores,
    org_name: row.organizations?.name ?? '',
    sector: row.organizations?.sector ?? '',
    country: row.organizations?.country ?? '',
    size: row.organizations?.size ?? '',
    respondent_name: row.respondents?.name ?? '',
    email: row.respondents?.email ?? '',
    role: row.respondents?.role ?? '',
    phone: row.respondents?.phone ?? null,
  }));

  const total = flatData.length;
  const avgScore =
    total > 0
      ? Math.round(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          flatData.reduce((sum: number, d: any) => sum + (d.total_score || 0), 0) / total
        )
      : 0;

  const sectorCounts: Record<string, number> = {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  flatData.forEach((d: any) => {
    if (d.sector) sectorCounts[d.sector] = (sectorCounts[d.sector] || 0) + 1;
  });

  const advancedCount = flatData.filter(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (d: any) => d.maturity_level === 'avance' || d.maturity_level === 'expert'
  ).length;
  const advancedPercent = total > 0 ? Math.round((advancedCount / total) * 100) : 0;

  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({
      data: flatData,
      count: total,
      stats: { total, avgScore, sectorCounts, advancedPercent },
    }),
  };
};
