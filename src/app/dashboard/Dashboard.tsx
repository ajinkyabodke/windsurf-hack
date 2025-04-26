"use client";

type StravaStats = {
  recent_ride_totals?: {
    count: number;
    distance: number;
    moving_time: number;
    elapsed_time: number;
    elevation_gain: number;
  };
  recent_run_totals?: {
    count: number;
    distance: number;
    moving_time: number;
    elapsed_time: number;
    elevation_gain: number;
  };
  all_ride_totals?: {
    count: number;
    distance: number;
    moving_time: number;
    elapsed_time: number;
    elevation_gain: number;
  };
  all_run_totals?: {
    count: number;
    distance: number;
    moving_time: number;
    elapsed_time: number;
    elevation_gain: number;
  };
};

type StravaActivity = {
  id: number;
  name: string;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  total_elevation_gain: number;
  type: string;
  start_date: string;
};

type StravaProfile = {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  city: string;
  country: string;
  profile: string;
};

type DashboardProps = {
  stravaData?: {
    stats?: StravaStats;
    activities?: StravaActivity[];
    profile?: StravaProfile;
  };
  athleteId?: number;
  stravaFetchedAt?: Date;
};

export function Dashboard({
  stravaData,
  athleteId,
  stravaFetchedAt,
}: DashboardProps) {
  const formattedTime = stravaFetchedAt
    ? new Date(stravaFetchedAt).toLocaleString()
    : "Never";

  return (
    <div className="container mx-auto px-4 py-8">
      {stravaData?.profile && (
        <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
          <div className="flex items-center gap-4">
            {stravaData.profile.profile && (
              <div className="relative h-20 w-20 overflow-hidden rounded-full">
                <img
                  src={stravaData.profile.profile}
                  alt="Profile"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
            )}
            <div>
              <h2 className="text-2xl font-bold">
                {stravaData.profile.firstname} {stravaData.profile.lastname}
              </h2>
              {stravaData.profile.city && stravaData.profile.country && (
                <p className="text-gray-600">
                  {stravaData.profile.city}, {stravaData.profile.country}
                </p>
              )}
              {stravaData.profile.username && (
                <p className="text-sm text-gray-500">
                  @{stravaData.profile.username}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mb-6">
        <h2 className="mb-2 text-2xl font-bold">Your Strava Stats</h2>
        {stravaFetchedAt && (
          <p className="text-sm text-gray-500">Last updated: {formattedTime}</p>
        )}
      </div>

      {stravaData ? (
        <div>
          {stravaData.activities && stravaData.activities.length > 0 && (
            <div className="mb-8">
              <h3 className="mb-4 text-xl font-semibold">Recent Activities</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 text-left">Name</th>
                      <th className="p-2 text-left">Type</th>
                      <th className="p-2 text-left">Date</th>
                      <th className="p-2 text-right">Distance</th>
                      <th className="p-2 text-right">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stravaData.activities.slice(0, 5).map((activity) => (
                      <tr
                        key={activity.id}
                        className="border-b border-gray-200"
                      >
                        <td className="p-2">{activity.name}</td>
                        <td className="p-2">{activity.type}</td>
                        <td className="p-2">
                          {new Date(activity.start_date).toLocaleDateString()}
                        </td>
                        <td className="p-2 text-right">
                          {(activity.distance / 1000).toFixed(1)} km
                        </td>
                        <td className="p-2 text-right">
                          {formatTime(activity.moving_time)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <StatsCard
              title="Recent Rides"
              stats={stravaData.stats?.recent_ride_totals}
            />
            <StatsCard
              title="Recent Runs"
              stats={stravaData.stats?.recent_run_totals}
            />
            <StatsCard
              title="All Rides"
              stats={stravaData.stats?.all_ride_totals}
            />
            <StatsCard
              title="All Runs"
              stats={stravaData.stats?.all_run_totals}
            />
          </div>
        </div>
      ) : (
        <div className="rounded-lg bg-gray-100 p-6 text-center">
          <p>
            No Strava data available. Connect your Strava account to see your
            stats.
          </p>
        </div>
      )}
    </div>
  );
}

function StatsCard({
  title,
  stats,
}: {
  title: string;
  stats?: {
    count: number;
    distance: number;
    moving_time: number;
    elapsed_time: number;
    elevation_gain: number;
  };
}) {
  if (!stats) {
    return null;
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h3 className="mb-4 text-xl font-semibold">{title}</h3>
      <ul className="space-y-2">
        <li className="flex justify-between">
          <span className="text-gray-600">Activities:</span>
          <span className="font-medium">{stats.count}</span>
        </li>
        <li className="flex justify-between">
          <span className="text-gray-600">Distance:</span>
          <span className="font-medium">
            {(stats.distance / 1000).toFixed(1)} km
          </span>
        </li>
        <li className="flex justify-between">
          <span className="text-gray-600">Moving Time:</span>
          <span className="font-medium">{formatTime(stats.moving_time)}</span>
        </li>
        <li className="flex justify-between">
          <span className="text-gray-600">Elevation Gain:</span>
          <span className="font-medium">{stats.elevation_gain} m</span>
        </li>
      </ul>
    </div>
  );
}

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  return `${hours}h ${minutes}m`;
}
