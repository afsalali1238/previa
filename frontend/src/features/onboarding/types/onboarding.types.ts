export interface Authority {
    id: string;
    name: string;
    fullName: string;
    emoji: string;
    flag: string;
    color: string;
}

export type Territory = Authority;

export interface Specialty {
    id: string;
    name: string;
    icon: string;
}

export interface OnboardingData {
    territory: Territory | null;
    specialty: Specialty | null;
    contractSigned: boolean;
}

export interface ContractData {
    signature: string; // base64
    agreedAt: Date;
}

export const AUTHORITIES: Authority[] = [
    { id: 'DHA', name: 'DHA', fullName: 'Dubai Health Authority', emoji: '🏙️', flag: '🇦🇪', color: '#2563eb' },
    { id: 'MOH', name: 'MOH', fullName: 'Ministry of Health', emoji: '🇦🇪', flag: '🇦🇪', color: '#22c55e' },
    { id: 'HAAD', name: 'HAAD', fullName: 'Health Authority Abu Dhabi', emoji: '🕌', flag: '🇦🇪', color: '#f59e0b' },
];

export const TERRITORIES = AUTHORITIES; // Alias for backward compatibility if needed

export const SPECIALTIES: Specialty[] = [
    { id: 'nurse', name: 'Nurse', icon: '👩‍⚕️' },
    { id: 'pharmacist', name: 'Pharmacist', icon: '💊' },
    { id: 'gp', name: 'General Practitioner', icon: '👨‍⚕️' },
    { id: 'dentist', name: 'Dentist', icon: '🦷' },
    { id: 'lab', name: 'Lab Technician', icon: '🔬' },
];
