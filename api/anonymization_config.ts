export interface AnonymizationConfig {
  anonymizeNames: boolean;
  anonymizePhoneNumbers: boolean;
  anonymizeCNPs: boolean;
  anonymizeEmails: boolean;
}

export function getAnonymizationConfig(): AnonymizationConfig {
  return {
    anonymizeNames: false,
    anonymizePhoneNumbers: true,
    anonymizeCNPs: true,
    anonymizeEmails: true  
  };
}