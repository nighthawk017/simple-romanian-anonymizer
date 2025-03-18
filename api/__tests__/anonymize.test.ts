import handler from '../anonymize';
import { NextApiRequest, NextApiResponse } from 'next';
import * as configModule from '../anonymization_config';

jest.mock('../anonymization_config');

describe('Anonymize API', () => {
  let req: Partial<NextApiRequest>;
  let res: Partial<NextApiResponse>;
  let json: jest.Mock;

  beforeEach(() => {
    json = jest.fn();
    res = {
      status: jest.fn(() => res) as any,
      json
    };
  });

  it('should anonymize names', () => {
    jest.spyOn(configModule, 'getAnonymizationConfig').mockReturnValue({
      anonymizeNames: true,
      anonymizePhoneNumbers: false,
      anonymizeCNPs: false,
      anonymizeEmails: false,
      anonymizeCompanyNames: false
    });

    req = {
      method: 'POST',
      body: { text: 'Buna ziua, eu sunt Vasile Ion.' }
    };

    handler(req as NextApiRequest, res as NextApiResponse);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({ anonymizedText: 'Buna ziua, eu sunt Anonim.' });
  });

  it('should anonymize phone numbers', () => {
    jest.spyOn(configModule, 'getAnonymizationConfig').mockReturnValue({
      anonymizeNames: false,
      anonymizePhoneNumbers: true,
      anonymizeCNPs: false,
      anonymizeEmails: false,
      anonymizeCompanyNames: false
    });

    req = {
      method: 'POST',
      body: { text: 'Numarul meu este +40712345678' }
    };

    handler(req as NextApiRequest, res as NextApiResponse);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({ anonymizedText: 'Numarul meu este +40*********' });
  });

  it('should anonymize CNPs', () => {
    jest.spyOn(configModule, 'getAnonymizationConfig').mockReturnValue({
      anonymizeNames: false,
      anonymizePhoneNumbers: false,
      anonymizeCNPs: true,
      anonymizeEmails: false,
      anonymizeCompanyNames: false
    });

    req = {
      method: 'POST',
      body: { text: 'CNP-ul meu este 1234567890123' }
    };

    handler(req as NextApiRequest, res as NextApiResponse);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({ anonymizedText: 'CNP-ul meu este *************' });
  });

  it('should anonymize emails', () => {
    jest.spyOn(configModule, 'getAnonymizationConfig').mockReturnValue({
      anonymizeNames: false,
      anonymizePhoneNumbers: false,
      anonymizeCNPs: false,
      anonymizeEmails: true,
      anonymizeCompanyNames: false
    });

    req = {
      method: 'POST',
      body: { text: 'john.doe@example.com' }
    };

    handler(req as NextApiRequest, res as NextApiResponse);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({ anonymizedText: 'anonim@anonim.anonim' });
  });

  it('should anonymize multiple names', () => {
    jest.spyOn(configModule, 'getAnonymizationConfig').mockReturnValue({
      anonymizeNames: true,
      anonymizePhoneNumbers: false,
      anonymizeCNPs: false,
      anonymizeEmails: false,
      anonymizeCompanyNames: false
    });

    req = {
      method: 'POST',
      body: { text: 'Buna ziua, eu sunt Vasile Ion si acesta este prietenul meu, Mihai Popescu.' }
    };

    handler(req as NextApiRequest, res as NextApiResponse);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({ anonymizedText: 'Buna ziua, eu sunt Anonim si acesta este prietenul meu, Anonim.' });
  });

  it('should anonymize multiple phone numbers', () => {
    jest.spyOn(configModule, 'getAnonymizationConfig').mockReturnValue({
      anonymizeNames: false,
      anonymizePhoneNumbers: true,
      anonymizeCNPs: false,
      anonymizeEmails: false,
      anonymizeCompanyNames: false
    });

    req = {
      method: 'POST',
      body: { text: 'Numerele mele sunt +40712345678 si 0040723456789.' }
    };

    handler(req as NextApiRequest, res as NextApiResponse);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({ anonymizedText: 'Numerele mele sunt +40********* si +40*********.' });
  });

  it('should anonymize multiple CNPs', () => {
    jest.spyOn(configModule, 'getAnonymizationConfig').mockReturnValue({
      anonymizeNames: false,
      anonymizePhoneNumbers: false,
      anonymizeCNPs: true,
      anonymizeEmails: false,
      anonymizeCompanyNames: false
    });

    req = {
      method: 'POST',
      body: { text: 'CNP-urile noastre sunt 1234567890123 si 9876543210987.' }
    };

    handler(req as NextApiRequest, res as NextApiResponse);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({ anonymizedText: 'CNP-urile noastre sunt ************* si *************.' });
  });

  it('should anonymize multiple emails', () => {
    jest.spyOn(configModule, 'getAnonymizationConfig').mockReturnValue({
      anonymizeNames: false,
      anonymizePhoneNumbers: false,
      anonymizeCNPs: false,
      anonymizeEmails: true,
      anonymizeCompanyNames: false
    });

    req = {
      method: 'POST',
      body: { text: 'Emailurile noastre sunt john.doe@example.com si jane.doe@example.com.' }
    };

    handler(req as NextApiRequest, res as NextApiResponse);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({ anonymizedText: 'Emailurile noastre sunt anonim@anonim.anonim si anonim@anonim.anonim.' });
  });

  it('should anonymize multiple types of data', () => {
    jest.spyOn(configModule, 'getAnonymizationConfig').mockReturnValue({
      anonymizeNames: true,
      anonymizePhoneNumbers: true,
      anonymizeCNPs: true,
      anonymizeEmails: true,
      anonymizeCompanyNames: false
    });

    req = {
      method: 'POST',
      body: { text: 'Buna ziua, eu sunt Vasile Ion. Numarul meu este +40712345678. CNP-ul meu este 1234567890123. Emailul meu este john.doe@example.com.' }
    };

    handler(req as NextApiRequest, res as NextApiResponse);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({ anonymizedText: 'Buna ziua, eu sunt Anonim. Numarul meu este +40*********. CNP-ul meu este *************. Emailul meu este anonim@anonim.anonim.' });
  });

  it('should only anonymize names when only anonymizeNames is true', () => {
    jest.spyOn(configModule, 'getAnonymizationConfig').mockReturnValue({
      anonymizeNames: true,
      anonymizePhoneNumbers: false,
      anonymizeCNPs: false,
      anonymizeEmails: false,
      anonymizeCompanyNames: false
    });

    req = {
      method: 'POST',
      body: { text: 'Buna ziua, eu sunt Vasile Ion. Numarul meu este +40712345678. CNP-ul meu este 1234567890123. Emailul meu este john.doe@example.com.' }
    };

    handler(req as NextApiRequest, res as NextApiResponse);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({ anonymizedText: 'Buna ziua, eu sunt Anonim. Numarul meu este +40712345678. CNP-ul meu este 1234567890123. Emailul meu este john.doe@example.com.' });
  });

  it('should only anonymize phone numbers when only anonymizePhoneNumbers is true', () => {
    jest.spyOn(configModule, 'getAnonymizationConfig').mockReturnValue({
      anonymizeNames: false,
      anonymizePhoneNumbers: true,
      anonymizeCNPs: false,
      anonymizeEmails: false,
      anonymizeCompanyNames: false
    });

    req = {
      method: 'POST',
      body: { text: 'Buna ziua, eu sunt Vasile Ion. Numarul meu este +40712345678. CNP-ul meu este 1234567890123. Emailul meu este john.doe@example.com.' }
    };

    handler(req as NextApiRequest, res as NextApiResponse);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({ anonymizedText: 'Buna ziua, eu sunt Vasile Ion. Numarul meu este +40*********. CNP-ul meu este 1234567890123. Emailul meu este john.doe@example.com.' });
  });

  it('should only anonymize CNPs when only anonymizeCNPs is true', () => {
    jest.spyOn(configModule, 'getAnonymizationConfig').mockReturnValue({
      anonymizeNames: false,
      anonymizePhoneNumbers: false,
      anonymizeCNPs: true,
      anonymizeEmails: false,
      anonymizeCompanyNames: false
    });

    req = {
      method: 'POST',
      body: { text: 'Buna ziua, eu sunt Vasile Ion. Numarul meu este +40712345678. CNP-ul meu este 1234567890123. Emailul meu este john.doe@example.com.' }
    };

    handler(req as NextApiRequest, res as NextApiResponse);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({ anonymizedText: 'Buna ziua, eu sunt Vasile Ion. Numarul meu este +40712345678. CNP-ul meu este *************. Emailul meu este john.doe@example.com.' });
  });

  it('should only anonymize emails when only anonymizeEmails is true', () => {
    jest.spyOn(configModule, 'getAnonymizationConfig').mockReturnValue({
      anonymizeNames: false,
      anonymizePhoneNumbers: false,
      anonymizeCNPs: false,
      anonymizeEmails: true,
      anonymizeCompanyNames: false
    });

    req = {
      method: 'POST',
      body: { text: 'Buna ziua, eu sunt Vasile Ion. Numarul meu este +40712345678. CNP-ul meu este 1234567890123. Emailul meu este john.doe@example.com.' }
    };

    handler(req as NextApiRequest, res as NextApiResponse);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({ anonymizedText: 'Buna ziua, eu sunt Vasile Ion. Numarul meu este +40712345678. CNP-ul meu este 1234567890123. Emailul meu este anonim@anonim.anonim.' });
  });

  it('should return 405 for non-POST methods', () => {
    req = {
      method: 'GET'
    };

    handler(req as NextApiRequest, res as NextApiResponse);

    expect(res.status).toHaveBeenCalledWith(405);
    expect(json).toHaveBeenCalledWith({ message: 'Method Not Allowed' });
  });

  it('should return 400 if no text is provided', () => {
    req = {
      method: 'POST',
      body: {}
    };

    handler(req as NextApiRequest, res as NextApiResponse);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({ message: 'Bad Request: No text provided' });
  });
});