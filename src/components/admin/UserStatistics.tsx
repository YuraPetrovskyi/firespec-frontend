type UserStats = {
  total_users: number;
  active_users: number;
  inactive_users: number;
  admin_users: number;
  regular_users: number;
  pending_invitations: number;
};

type Props = {
  stats: UserStats;
};

export default function UserStatistics({ stats }: Props) {
  const cards = [
    { label: 'Total Users', value: stats.total_users, color: 'bg-blue-500' },
    { label: 'Active Users', value: stats.active_users, color: 'bg-green-500' },
    { label: 'Inactive Users', value: stats.inactive_users, color: 'bg-gray-500' },
    { label: 'Admins', value: stats.admin_users, color: 'bg-purple-500' },
    { label: 'Regular Users', value: stats.regular_users, color: 'bg-indigo-500' },
    { label: 'Pending Invitations', value: stats.pending_invitations, color: 'bg-yellow-500' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md p-4">
          <div className={`${card.color} w-12 h-12 rounded-full flex items-center justify-center mb-3`}>
            <span className="text-white text-xl font-bold">{card.value}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">{card.label}</h3>
        </div>
      ))}
    </div>
  );
}
