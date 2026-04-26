import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, getDocs, getDoc, doc, query, orderBy, limit, DocumentData, QueryDocumentSnapshot, where } from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config';
import type { Film, AfterglowEpisode, Config } from './types';

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

const fromSnap = <T>(snap: QueryDocumentSnapshot<DocumentData>): T => ({
  id: snap.id,
  ...snap.data(),
} as T);

export async function getFilms(count?: number): Promise<Film[]> {
  try {
    const filmsRef = collection(db, 'salon');
    const q = count 
      ? query(filmsRef, orderBy('createdAt', 'desc'), limit(count))
      : query(filmsRef, orderBy('createdAt', 'desc'));
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => fromSnap<Film>(doc));
  } catch (error) {
    return [];
  }
}

export async function getFilmById(id: string): Promise<Film | null> {
  try {
    const docRef = doc(db, 'salon', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Film;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}

export async function getFilmBySlug(slug: string): Promise<Film | null> {
  try {
    const filmsRef = collection(db, 'salon');
    const q = query(filmsRef, where("slug", "==", slug), limit(1));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const docSnap = querySnapshot.docs[0];
      return { id: docSnap.id, ...docSnap.data() } as Film;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}


export async function getAfterglowEpisodes(count?: number): Promise<AfterglowEpisode[]> {
  try {
    const episodesRef = collection(db, 'afterglow');
     const q = count 
      ? query(episodesRef, orderBy('createdAt', 'desc'), limit(count))
      : query(episodesRef, orderBy('createdAt', 'desc'));

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => fromSnap<AfterglowEpisode>(doc));
  } catch (error) {
    return [];
  }
}

export async function getConfig(): Promise<Config | null> {
  try {
    const docRef = doc(db, 'config', 'main');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as Config;
    } else {
      return {
        socialLinks: {
          instagram: "https://www.instagram.com/salonderechazados/",
          tiktok: "https://www.tiktok.com/@_miguelburgos",
          youtube: "https://www.youtube.com/@salonderechazados",
        },
        aboutUsContent: "Contenido predeterminado de 'Conócenos'. Edítalo en el panel de administración."
      }
    }
  } catch (error) {
    return null;
  }
}
