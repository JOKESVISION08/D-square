export interface SARData {
  soil_moisture: string;
  deformation: string;
  vibration: string;
  region: string;
  disaster_type: 'earthquake' | 'landslide' | 'flood' | 'normal' | 'tsunami';
  risk: 'low' | 'medium' | 'high';
  people_affected: number;
  safety_action: string;
}

export interface Alert {
  id: string;
  type: string;
  location: string;
  time: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  peopleAffected: number;
  status: 'ACTIVE' | 'RESOLVED';
}
