import { Trophy, User as UserIcon, Coins, Medal, Crown } from 'lucide-react';
import { useGetLeaderboardQuery, useGetRecentUsersQuery } from '@/store/apiSlice';

const rankIcons = [Crown, Medal, Trophy];

// ─── Winners Ticker ───────────────────────────────────────────────────────────
const WinnersTicker = () => {
  const { data, isLoading } = useGetLeaderboardQuery(undefined, {
    pollingInterval: 60000,
  });

  const leaderboard = data?.data || [];
  const items = leaderboard.length > 0 ? [...leaderboard, ...leaderboard] : [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[340px]">
        <div className="w-5 h-5 border-2 border-[hsl(var(--accent))] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center h-[340px] text-muted-foreground text-sm">
        No winners yet. Be the first to spin!
      </div>
    );
  }

  return (
    <div
      data-testid="dashboard-winners-ticker"
      className="relative h-[340px] overflow-hidden"
    >
      {/* Fade masks */}
      <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white/90 to-transparent z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white/90 to-transparent z-10 pointer-events-none" />

      <div className="animate-leaderboard space-y-2">
        {items.map((entry, index) => {
          const actualIndex = index % leaderboard.length;
          const Icon = rankIcons[actualIndex] || Trophy;
          return (
            <div
              key={`winner-${entry.user?.id}-${index}`}
              className="flex items-center gap-3 rounded-xl bg-[hsl(var(--muted))] px-3 py-2.5"
            >
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0">
                <Icon
                  className={`w-4 h-4 ${
                    actualIndex === 0
                      ? 'text-[hsl(var(--accent))]'
                      : 'text-[hsl(var(--primary))]'
                  }`}
                />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">
                  {entry.user?.username || 'Anonymous'}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  Rank #{entry.rank} • {entry.total_spins} spins
                </p>
              </div>

              <div className="flex items-center gap-1 text-[hsl(var(--accent))]">
                <Coins className="w-3.5 h-3.5" />
                <span className="font-bold">
                  {entry.total_shopping_tokens_earned?.toLocaleString() || 0}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Users Ticker ─────────────────────────────────────────────────────────────
const UsersTicker = () => {
  const { data, isLoading } = useGetRecentUsersQuery(
    { limit: 20 },
    { pollingInterval: 60000 }
  );

  const users = data?.data || [];
  const items = users.length > 0 ? [...users, ...users] : [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[340px]">
        <div className="w-5 h-5 border-2 border-[hsl(var(--primary))] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center h-[340px] text-muted-foreground text-sm">
        No players yet.
      </div>
    );
  }

  return (
    <div
      data-testid="dashboard-users-ticker"
      className="relative h-[340px] overflow-hidden"
    >
      {/* Fade masks */}
      <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white/90 to-transparent z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white/90 to-transparent z-10 pointer-events-none" />

      <div className="animate-leaderboard space-y-2" style={{ animationDuration: '25s' }}>
        {items.map((u, i) => (
          <div
            key={`user-${u.id}-${i}`}
            className="flex items-center gap-3 rounded-xl bg-[hsl(var(--muted))] px-3 py-2.5"
          >
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0">
              <UserIcon className="w-4 h-4 text-[hsl(var(--primary))]" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate">{u.username}</p>
              <p className="text-[10px] text-muted-foreground truncate">{u.full_name}</p>
            </div>

            <span className="text-[10px] text-muted-foreground shrink-0">
              Just joined
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export { WinnersTicker, UsersTicker };