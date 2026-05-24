const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export const apiClient = async (
  endpoint: string,
  options: RequestInit = {},
  token?: string,
) => {
  let authToken = token;
  if (!authToken) {
    const { supabase } = await import("@/lib/supabase");
    const { data } = await supabase.auth.getSession();
    authToken = data.session?.access_token;
  }

  const url = `${BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }

  return response.json();
};
