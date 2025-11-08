export interface SignupField {
  key: string;
  label: string;
  enabled: boolean;
  required: boolean;
}

export const defaultSignupFields: SignupField[] = [
  { key: 'firstName', label: 'First Name', enabled: true, required: true },
  { key: 'lastName', label: 'Last Name', enabled: true, required: true },
  { key: 'company', label: 'Company', enabled: false, required: false }
];

