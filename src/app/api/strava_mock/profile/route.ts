import { NextRequest } from "next/server";
export const runtime = "edge";

export async function GET(req: NextRequest) {
  return Response.json({
    id: 33062021,
    username: "ajinkyabodke",
    resource_state: 2,
    firstname: "Ajinkya",
    lastname: "Bodke",
    bio: "22 Endurance Athlete 🏊🚴‍♂️🏃 Super Randonneur ⚡ Ultra Cycling 🚴 Trail Running 🏃 Deccan Cliffhanger '24 - P1 🥇(24H 11M)",
    city: "Pune",
    state: "Maharashtra",
    country: null,
    sex: "M",
    premium: false,
    summit: false,
    created_at: "2018-07-24T17:34:17Z",
    updated_at: "2025-04-26T08:52:06Z",
    badge_type_id: 0,
    weight: 59,
    profile_medium:
      "https://dgalywyr863hv.cloudfront.net/pictures/athletes/33062021/29451390/1/medium.jpg",
    profile:
      "https://dgalywyr863hv.cloudfront.net/pictures/athletes/33062021/29451390/1/large.jpg",
    friend: null,
    follower: null,
  });
}
