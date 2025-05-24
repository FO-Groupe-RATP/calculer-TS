import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

// Vérification et chargement des variables d'environnement
if (
  !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ||
  !process.env.GOOGLE_PRIVATE_KEY ||
  !process.env.SHEET_ID
) {
  throw new Error(
    'Missing required environment variables for Google Sheets API.'
  );
}

// Initialisation de l'authentification avec Google Sheets
const serviceAccountAuth = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Correction du formatage des clés privées
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

// Initialisation de la feuille Google Sheets
const doc = new GoogleSpreadsheet(process.env.SHEET_ID, serviceAccountAuth);

export const POST = async (req: Request) => {
  // Configuration des en-têtes CORS
  const headers = {
    'Access-Control-Allow-Origin': '*', // Remplacez par votre domaine en production
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  try {
    // Extraction des données de la requête
    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return new Response(JSON.stringify({ error: 'Missing parameter' }), {
        status: 400,
        headers,
      });
    }

    // Charger les informations du Google Sheet
    await doc.loadInfo();

    const TARGET_SHEET_INDEX = 0;
    if (doc.sheetsByIndex.length <= TARGET_SHEET_INDEX) {
      throw new Error(
        `Feuille introuvable à l'index ${TARGET_SHEET_INDEX}. ` +
          `Le document n’en contient que ${doc.sheetsByIndex.length}.`
      );
    }
    const sheet = doc.sheetsByIndex[TARGET_SHEET_INDEX];
    await sheet.loadHeaderRow(); // Charge les en-têtes pour éviter l'erreur

    console.log('📊 Sheet headers:', sheet.headerValues);
    if (!sheet) {
      return new Response(JSON.stringify({ error: 'Sheet not found' }), {
        status: 404,
        headers,
      });
    }

    console.log('🛠️ Trying to add row with values:', {
      userId,
    });

    const targetDate = new Date().toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    const rows = await sheet.getRows();

    const rowToUpdate = rows.find((r) => r.get('date') === targetDate);
    if (!rowToUpdate) {
      const addedRow = await sheet.addRow({
        visiteurs_uniques: 1,
        date: targetDate,
      });
      console.log('✅ Row added:', addedRow);
    } else {
      const currentValue = Number(rowToUpdate.get('visiteurs_uniques'));
      rowToUpdate.set('visiteurs_uniques', currentValue + 1);
      await rowToUpdate.save();
    }

    return new Response(
      JSON.stringify({ message: 'Data inserted successfully' }),
      { status: 200, headers }
    );
  } catch (error) {
    console.error('❌ Error inserting data into Google Sheets:', error);

    return new Response(
      JSON.stringify({
        error: 'Failed to insert data',
        details: error instanceof Error ? error.message : String(error),
      }),
      { status: 500, headers }
    );
  }
};
