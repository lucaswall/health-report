import type { FitbitClient } from './fitbit-client.js';
import type { FitbitProfile } from '../types/fitbit.js';

export async function fetchProfile(client: FitbitClient): Promise<FitbitProfile> {
  return client.get<FitbitProfile>('/1/user/-/profile.json');
}
