import { useEffect, useState } from 'react';
import { getTasks, getLogs } from '../services/gardenService';

export const useGardenData = (uid: string) => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    if (!uid) return;

    const load = async () => {
      const t = await getTasks(uid);
      const l = await getLogs(uid);

      setTasks(t);
      setLogs(l);
    };

    load();
  }, [uid]);

  return { tasks, logs };
};