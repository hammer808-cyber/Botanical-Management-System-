import { useFirebase } from '../contexts/FirebaseContext';

/**
 * Signed-in home. Batch A only keeps this route from crashing and from
 * writing tasks when it opens. The attention list is added in a later batch.
 */
export default function GardenHub() {
  const { user, loading } = useFirebase();

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 space-y-4">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Home</p>
      <h1 className="font-headline text-5xl font-black tracking-tighter italic text-primary">Today</h1>
      <p className="text-on-surface-variant font-medium max-w-xl leading-relaxed">
        {user
          ? 'Nothing is listed here yet. Opening this screen does not add tasks or change your plots and plants.'
          : 'Sign in to see your garden.'}
      </p>
    </div>
  );
}
