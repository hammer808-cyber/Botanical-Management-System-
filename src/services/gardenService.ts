import { db } from '../firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  doc
} from 'firebase/firestore';

export const addTask = async (task: any) => {
  return await addDoc(collection(db, 'tasks'), task);
};

export const getTasks = async (uid: string) => {
  const q = query(collection(db, 'tasks'), where('ownerUid', '==', uid));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const completeTask = async (taskId: string) => {
  await updateDoc(doc(db, 'tasks', taskId), {
    completed: true
  });
};

export const addLog = async (log: any) => {
  return await addDoc(collection(db, 'logs'), log);
};

export const getLogs = async (uid: string) => {
  const q = query(collection(db, 'logs'), where('ownerUid', '==', uid));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};