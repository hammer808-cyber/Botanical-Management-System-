import { useEffect, useState } from 'react';
import { useGardenData } from '../hooks/useGardenData';
import { addTask, completeTask, addLog } from '../services/gardenService';
import { generateTasksForPlants } from '../services/taskEngine';

const GardenHub = ({ user, plants }: any) => {
  const { tasks, logs } = useGardenData(user.uid);
  const [newLog, setNewLog] = useState('');

  useEffect(() => {
    const autoTasks = generateTasksForPlants(plants, user.uid);

    autoTasks.forEach(t => addTask(t));
  }, [plants]);

  const handleComplete = async (id: string) => {
    await completeTask(id);
    window.location.reload();
  };

  const handleLog = async () => {
    if (!newLog) return;

    await addLog({
      message: newLog,
      createdAt: new Date().toISOString(),
      ownerUid: user.uid
    });

    setNewLog('');
    window.location.reload();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🌿 Garden Dashboard</h2>

      <h3>📅 Tasks</h3>
      {tasks.map((t: any) => (
        <div key={t.id}>
          <span>{t.title}</span>
          {!t.completed && (
            <button onClick={() => handleComplete(t.id)}>Done</button>
          )}
        </div>
      ))}

      <h3>📝 Quick Log</h3>
      <input
        value={newLog}
        onChange={e => setNewLog(e.target.value)}
        placeholder="What happened?"
      />
      <button onClick={handleLog}>Add</button>

      <h3>📜 Activity</h3>
      {logs.map((l: any) => (
        <div key={l.id}>{l.message}</div>
      ))}
    </div>
  );
};

export default GardenHub;