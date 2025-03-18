// api/anonymize.ts

import { getAnonymizationConfig } from './anonymization_config'; 
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ message: 'Bad Request: No text provided' });
  }

  let anonymizedText = text as string;

  // Get configuration from the config file
  const config = getAnonymizationConfig();
  console.log(config);

  // Anonymize Names - DO NOT RECOMMEND USING IT (Very naive way of doing it. Basically replaces all 2 consecutive words starting with capital letters. Should be replaced with a better solution, such as checking against a list of names. The new solution should distinguish between names and other capitalized words, such as addresses, countries, cities, etc.)
  if (config.anonymizeNames) {
    const nameRegex = /\b[A-Z][a-z]+\s[A-Z][a-z]+\b/g;
    anonymizedText = anonymizedText.replace(nameRegex, 'Anonim');
  }

  // Anonymize Romanian Phone Numbers
  if (config.anonymizePhoneNumbers) {
    const phoneRegex = /(\+40|0040|0)\d{9}/g;
    anonymizedText = anonymizedText.replace(phoneRegex, '+40*********');
  }

  // Anonymize CNPs (Romanian Personal Identification Number)
  if (config.anonymizeCNPs) {
    const cnpRegex = /\b\d{13}\b/g;
    anonymizedText = anonymizedText.replace(cnpRegex, '*************');
  }

  // Anonymize Emails
  if (config.anonymizeEmails) {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    anonymizedText = anonymizedText.replace(emailRegex, 'anonim@anonim.anonim');
  }

  // Add the rest of your anonymization logic here

  return res.status(200).json({ anonymizedText });
}