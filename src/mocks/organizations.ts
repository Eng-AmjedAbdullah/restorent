import type { Organization } from '@/types/domain';

export const mockOrganizations: Organization[] = [
  {
    id: 'org-1',
    name: {
      ar: 'مجموعة ريستورا الدولية للضيافة',
      en: 'Restora Hospitality Group International'
    },
    code: 'RHG-CORP',
    tax_number: '310984729100003',
    commercial_registration: '1010892341',
    country: 'SA',
    city: { ar: 'الرياض', en: 'Riyadh' },
    subscription_plan: 'enterprise',
    status: 'active',
    created_at: '2024-01-10T08:00:00Z',
    updated_at: '2026-03-01T12:00:00Z'
  }
];
