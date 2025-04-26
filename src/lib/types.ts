export type OverallStats = {
  biggest_ride_distance: number;
  biggest_climb_elevation_gain: number;
  recent_ride_totals: Totals;
  all_ride_totals: Totals;
  recent_run_totals: Totals;
  all_run_totals: Totals;
  recent_swim_totals: Totals;
  all_swim_totals: Totals;
  ytd_ride_totals: Totals;
  ytd_run_totals: Totals;
  ytd_swim_totals: Totals;
};

export type AthleteProfile = {
  id: number;
  username: string;
  resource_state: number;
  bio: string;
  firstname: string;
  lastname: string;
  city: string | null;
  state: string | null;
  country: string | null;
  sex: string;
  premium: boolean;
  created_at: Date | string;
  updated_at: Date | string;
  badge_type_id: number;
  profile_medium: string;
  profile: string;
  friend?: null;
  follower?: null;
  follower_count?: number;
  friend_count?: number;
  mutual_friend_count?: number;
  athlete_type?: number;
  date_preference?: string;
  measurement_preference?: string;
  ftp?: null;
  weight?: number;
  summit?: boolean;
};

export type AthleteActivity = {
  resource_state: number;
  athlete: Athlete;
  name: string;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  total_elevation_gain: number;
  type: string;
  sport_type: string;
  workout_type?: number;
  id: number;
  external_id: string;
  upload_id: number;
  start_date: Date | string;
  start_date_local: Date | string;
  timezone: string;
  utc_offset: number;
  start_latlng: number[] | null;
  end_latlng: number[] | null;
  location_city?: string | null;
  location_state?: string | null;
  location_country?: string | null;
  achievement_count: number;
  kudos_count: number;
  comment_count: number;
  athlete_count: number;
  photo_count: number;
  map: Map;
  trainer: boolean;
  commute: boolean;
  manual: boolean;
  private: boolean;
  flagged: boolean;
  visibility?: string;
  gear_id: string | null;
  from_accepted_tag: boolean;
  average_speed: number;
  max_speed: number;
  average_cadence?: number;
  average_watts?: number;
  weighted_average_watts?: number;
  kilojoules?: number;
  device_watts?: boolean;
  has_heartrate: boolean;
  heartrate_opt_out?: boolean;
  display_hide_heartrate_option?: boolean;
  elev_high?: number;
  elev_low?: number;
  upload_id_str?: string;
  average_heartrate?: number;
  max_heartrate?: number;
  max_watts?: number;
  pr_count: number;
  total_photo_count: number;
  has_kudoed: boolean;
  suffer_score?: number;
  description?: string;
  calories?: number;
  segment_efforts?: SegmentEffort[];
  splits_metric?: Split[];
  laps?: Lap[];
  gear?: Gear;
  partner_brand_tag?: string | null;
  photos?: Photos;
  highlighted_kudosers?: KudosUser[];
  hide_from_home?: boolean;
  device_name?: string;
  embed_token?: string;
  segment_leaderboard_opt_out?: boolean;
  leaderboard_opt_out?: boolean;
};

export type Athlete = {
  id: number;
  resource_state: number;
};

export type Map = {
  id: string;
  summary_polyline: string | null;
  resource_state: number;
};

export type Totals = {
  count: number;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  elevation_gain: number;
  achievement_count?: number;
};

export type SegmentEffort = {
  id: number;
  resource_state: number;
  name: string;
  activity: { id: number; resource_state: number };
  athlete: { id: number; resource_state: number };
  elapsed_time: number;
  moving_time: number;
  start_date: Date | string;
  start_date_local: Date | string;
  distance: number;
  start_index: number;
  end_index: number;
  average_cadence?: number;
  device_watts?: boolean;
  average_watts?: number;
  segment: Segment;
  kom_rank?: number | null;
  pr_rank?: number | null;
  achievements?: unknown[]; // Replace with a more specific type if available
  hidden?: boolean;
};

export type Segment = {
  id: number;
  resource_state: number;
  name: string;
  activity_type: string;
  distance: number;
  average_grade: number;
  maximum_grade: number;
  elevation_high: number;
  elevation_low: number;
  start_latlng: number[];
  end_latlng: number[];
  climb_category: number;
  city?: string;
  state?: string;
  country?: string;
  private: boolean;
  hazardous?: boolean;
  starred?: boolean;
};

export type Split = {
  distance: number;
  elapsed_time: number;
  elevation_difference: number;
  moving_time: number;
  split: number;
  average_speed: number;
  pace_zone: number;
};

export type Lap = {
  id: number;
  resource_state: number;
  name: string;
  activity: { id: number; resource_state: number };
  athlete: { id: number; resource_state: number };
  elapsed_time: number;
  moving_time: number;
  start_date: Date | string;
  start_date_local: Date | string;
  distance: number;
  start_index: number;
  end_index: number;
  total_elevation_gain: number;
  average_speed: number;
  max_speed: number;
  average_cadence?: number;
  device_watts?: boolean;
  average_watts?: number;
  lap_index: number;
  split: number;
};

export type Gear = {
  id: string;
  primary: boolean;
  name: string;
  resource_state: number;
  distance?: number;
};

export type Photos = {
  primary?: {
    id?: string | null;
    unique_id: string;
    urls: Record<string, string>;
    source: number;
  };
  use_primary_photo?: boolean;
  count: number;
};

export type KudosUser = {
  destination_url: string;
  display_name: string;
  avatar_url: string;
  show_name: boolean;
};

export type StravaStats = {
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

export type StravaActivity = {
  id: number;
  name: string;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  total_elevation_gain: number;
  type: string;
  start_date: string;
};

export type StravaProfile = {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  city: string;
  country: string;
  profile: string;
};

export type Activity = {
  id: number;
  name: string;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  type: string;
  sport_type: string;
  start_date: string;
  start_date_local: string;
  timezone: string;
  utc_offset: number;
  start_latlng?: number[] | null;
  end_latlng?: number[] | null;
  total_elevation_gain: number;
  elev_high?: number;
  elev_low?: number;
  average_speed: number;
  max_speed: number;
  average_watts?: number;
  weighted_average_watts?: number;
  kilojoules?: number;
  device_watts?: boolean;
  average_heartrate?: number;
  max_heartrate?: number;
  average_cadence?: number;
  max_watts?: number;
  calories?: number;
  description?: string;
  photos?: {
    primary?: {
      urls: Record<string, string>;
    };
    count: number;
  };
  map?: {
    id?: string;
    polyline?: string;
    summary_polyline: string;
  };
  gear?: {
    id: string;
    name: string;
    distance?: number;
  };
  private: boolean;
  visibility?: string;
  flagged: boolean;
  workout_type?: number;
  upload_id?: number;
  external_id?: string;
  from_accepted_tag?: boolean;
  has_kudoed?: boolean;
  kudos_count?: number;
  comment_count?: number;
  athlete_count?: number;
  photo_count?: number;
  trainer?: boolean;
  commute?: boolean;
  manual?: boolean;
  device_name?: string;
  embed_token?: string;
  achievement_count?: number;
  kudos?: Array<{
    destination_url: string;
    display_name: string;
    avatar_url: string;
    show_name: boolean;
  }>;
};
