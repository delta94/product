import { useState, useEffect } from 'react';
import { db } from '../helpers/firebase.module';

const useFirestore = collection => {
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    const unsub = db
      .collection(collection)
      .where('isVerified', '==', false)
      .orderBy('creationDate', 'desc')
      .onSnapshot(snap => {
        let documents = [];
        snap.forEach(doc => {
          documents.push({ ...doc.data(), id: doc.id });
        });
        setDocs(documents);
      });
    return () => unsub();
  }, [collection]);
  return { docs };
};

export default useFirestore;