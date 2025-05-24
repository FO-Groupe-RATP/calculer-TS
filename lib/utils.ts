export function getUserId() {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; user_id=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
}

export async function postRequest(
  url: string | URL | Request,
  body: {
    id_visiteur: string | undefined;
    ts?: number;
    bc?: string;
    echelon?: string;
    compensation?: string;
    montant?: string;
    timestamp?: string;
  }
) {
  if (!body.id_visiteur) {
    body.id_visiteur = getUserId();
  }
  body.timestamp = new Date().toISOString();

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (response.ok) {
      console.log(`✅ ${url} :`, data.message);
      // if (onSuccess) onSuccess(data)
    } else {
      console.error(`❌ ${url} :`, data.message);
      console.error(`❌ ${url} :`, data.error);
      // if (onError) onError(data)
    }
  } catch (error) {
    console.error(`🔥 Request Failed ${url} :`, error);
    // if (onError) onError(error)
  }
}
