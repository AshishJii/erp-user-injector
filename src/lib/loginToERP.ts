import { User } from './types';

export async function loginToERP(username: string, password: string): Promise<User | null> {
  console.log('Simulating ERP login...');
  if (username === 'ashish' && password === 'ashish123') {
    return {
      name: 'Ashish Verma',
      roll: '21CS123',
      branch: 'CSE',
      section: 'A',
      email: 'ashish@example.edu',
    };
  }
  if (username === 'ayush' && password === 'ayush123') {
    return {
      name: 'Ayush Bhadauria',
      roll: '24B3422',
      branch: 'IOT',
      section: 'B',
      email: 'ayush@example.edu',
    };
  }
  if (username === 'rahul' && password === 'rahul123') {
    return {
      name: 'Rahul Singh',
      roll: '23DB233',
      branch: 'AIML',
      section: 'C',
      email: 'rahul@example.edu',
    };
  }
  return null;
}
