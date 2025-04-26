import { NextRequest } from "next/server";
export const runtime = "edge";

export async function GET(req: NextRequest) {
  return Response.json({
    biggest_ride_distance: 645153,
    biggest_climb_elevation_gain: 807.3000000000002,
    recent_ride_totals: {
      count: 16,
      distance: 1704211.28125,
      moving_time: 216103,
      elapsed_time: 220814,
      elevation_gain: 12606.969543457031,
      achievement_count: 89,
    },
    all_ride_totals: {
      count: 672,
      distance: 40555183.58026123,
      moving_time: 6243084,
      elapsed_time: 7416124,
      elevation_gain: 341348.28212428093,
    },
    recent_run_totals: {
      count: 0,
      distance: 0,
      moving_time: 0,
      elapsed_time: 0,
      elevation_gain: 0,
      achievement_count: 0,
    },
    all_run_totals: {
      count: 41,
      distance: 234847.34991455078,
      moving_time: 106077,
      elapsed_time: 110869,
      elevation_gain: 2171.344158411026,
    },
    recent_swim_totals: {
      count: 0,
      distance: 0,
      moving_time: 0,
      elapsed_time: 0,
      elevation_gain: 0,
      achievement_count: 0,
    },
    all_swim_totals: {
      count: 0,
      distance: 0,
      moving_time: 0,
      elapsed_time: 0,
      elevation_gain: 0,
    },
    ytd_ride_totals: {
      count: 55,
      distance: 5760253,
      moving_time: 727163,
      elapsed_time: 748601,
      elevation_gain: 46199.390716552734,
    },
    ytd_run_totals: {
      count: 0,
      distance: 0,
      moving_time: 0,
      elapsed_time: 0,
      elevation_gain: 0,
    },
    ytd_swim_totals: {
      count: 0,
      distance: 0,
      moving_time: 0,
      elapsed_time: 0,
      elevation_gain: 0,
    },
  });
}
