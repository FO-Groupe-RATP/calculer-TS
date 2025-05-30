'use client';

import Input from './input';
import Button from './Button';
import Select from './select';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import grillesJson from '@/grilles.json';
import { postRequest } from '../../../lib/utils';

type GrilleType = {
  [compensation: string]: {
    [bc: string]: { [echelon: string]: string };
  };
};

const grilles: GrilleType = grillesJson;

// Fonction pour générer un identifiant unique
const generateUniqueId = () => {
  return `user-  ${Math.random().toString(36).substr(2, 9)}`;
};

// Fonction pour définir un cookie
const setCookie = (name: string, value: string, days: number) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000); // Cookie valable pendant 'days' jours
  document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/`;
};

// Fonction pour récupérer un cookie
const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
};

function formule(
  ts: number,
  bc: string | number,
  echelon: string | number,
  compensation: string | number
) {
  return (
    ((ts * parseFloat(grilles[compensation][bc][echelon])) / 152 / 60) * 1.25
  );
}

function LoginForm() {
  useEffect(() => {
    const fetchData = async () => {
      let userId = getCookie('user_id');
      if (!userId) {
        userId = generateUniqueId();
        setCookie('user_id', userId, 365); // expire dans 365 jours
      }

      const today = new Date().toISOString().split('T')[0];
      const lastVisit = getCookie('last_visit_date');
      if (lastVisit !== today) {
        setCookie('last_visit_date', today, 365);
        console.log('api:' + 'https://calculer-ts.vercel.app/api/newVisit');
        try {
          await postRequest('https://calculer-ts.vercel.app/api/newVisit', {
            id_visiteur: userId,
          });
        } catch (err) {
          console.error('Erreur envoi postRequest:', err);
        }
      }
    };
    fetchData();
  }, []);

  const [validated, setValidated] = useState(false);
  const [ts, setTs] = useState<number>(0);
  const [bc, setBc] = useState<string>('BC1');
  const [echelon, setEchelon] = useState<string>('2');
  const [compensation, setCompensation] = useState<string>('NON');

  const optionsBC = [
    { value: 'BC1', label: 'BC1' },
    { value: 'BC2', label: 'BC2' },
    { value: 'BC3', label: 'BC3' },
    { value: 'BC4', label: 'BC4' },
    { value: 'BC5', label: 'BC5' },
    { value: 'BC5 M2R', label: 'BC5 M2R' },
    { value: 'BC6 M2R', label: 'BC6 M2R' },
    { value: 'BC7 M2R', label: 'BC7 M2R' },
    { value: 'BC8 M2R', label: 'BC8 M2R' },
  ];

  const optionsEchelon = [
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4' },
    { value: '5', label: '5' },
    { value: '6', label: '6' },
    { value: '7', label: '7' },
    { value: '8', label: '8' },
    { value: '10', label: '10' },
    { value: '11', label: '11' },
    { value: '12', label: '12' },
    { value: '13', label: '13' },
    { value: '14', label: '14' },
    { value: '16', label: '16' },
    { value: '26', label: '26' },
    { value: '28', label: '28' },
    { value: '30', label: '30' },
  ];

  const optionsCompensation = [
    { value: 'NON', label: 'NON' },
    { value: 'OUI', label: 'OUI' },
  ];

  const validate = async (event: React.FormEvent) => {
    event.preventDefault(); // Empêche le rechargement de la page
    setValidated(true);
    console.log('api:' + 'https://calculer-ts.vercel.app/api/logButtonClick');
    try {
      await postRequest('https://calculer-ts.vercel.app/api/logButtonClick', {
        id_visiteur: getCookie('user_id'),
        ts,
        bc,
        echelon,
        compensation,
        montant: `${formule(ts, bc, echelon, compensation).toFixed(2)} €`,
      });
    } catch (err) {
      console.error('Erreur envoi postRequest:', err);
    }
  };

  const handleChange =
    <T,>(setter: React.Dispatch<React.SetStateAction<T>>) =>
    (value: T) => {
      setter(value);
      setValidated(false);
    };

  const calcul = () => {
    if (!grilles) {
      return (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <strong>Erreur, veuillez réessayer.</strong>
        </div>
      );
    }

    // Récupérer la valeur dynamiquement
    const salaireStatutaireBrut = grilles[compensation]?.[bc]?.[echelon] || '0';

    if (salaireStatutaireBrut === undefined) {
      return (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <strong>
            Erreur, les paramètres renseignés ne correspondent à aucune valeur
            dans notre base de données.
          </strong>
        </div>
      );
    }
    const valeur = ((ts * parseFloat(salaireStatutaireBrut)) / 152 / 60) * 1.25;
    return (
      <div className="mt-4 p-4 bg-gray-100 rounded-lg">
        Pour un TS de <strong>{ts}</strong> min, un BC de <strong>{bc}</strong>,
        à l&apos;échelon <strong>{echelon}</strong>,{' '}
        <strong>
          {compensation.toUpperCase() === 'NON' ? 'sans' : 'avec'}
        </strong>{' '}
        compensation CTMR, le montant BRUT est de{' '}
        <strong>{valeur.toFixed(2)} €</strong>.
      </div>
    );
  };

  return (
    <div
      className="
        mt-8
        sm:mx-auto
        sm:w-full
        sm:max-w-md"
    >
      <div
        style={{ borderRadius: '0.5rem' }}
        className="
        bg-primary
        text-text
        px-4
        py-8
        shadow-md
        sm:px-10
        shadow-slate-900"
      >
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Image
            className="mx-auto w-auto"
            src="./LogoFO.jpg"
            alt="Logo"
            width="80"
            height="80"
          />
          <h2
            className="
                mt-8
                mb-16
                text-center
                text-3xl
                font-bold
                tracking-tight
                text-text
              "
          >
            Calculer votre TS
          </h2>
        </div>
        <form className="space-y-6" onSubmit={validate}>
          <Input
            id="ts"
            label="TS (min) :"
            type="number"
            value={ts}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange(setTs)(Number(e.target.value))
            }
          />
          <Select
            label="BC :"
            id="bc"
            options={optionsBC}
            value={bc}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              handleChange(setBc)(e.target.value)
            }
          />
          <Select
            label="Échelon :"
            id="echelon"
            options={optionsEchelon}
            value={echelon}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              handleChange(setEchelon)(e.target.value)
            }
          />
          <Select
            label="CTMR :"
            id="compensation"
            options={optionsCompensation}
            value={compensation}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              handleChange(setCompensation)(e.target.value)
            }
          />
          {validated && calcul()}
          <div>
            <Button fullWidth type="submit" border violetFonce>
              VALIDER
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
