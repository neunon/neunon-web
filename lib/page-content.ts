import fs from 'node:fs';
import path from 'node:path';

export type HomeProblem = {
  visible: boolean;
  title: string;
  intro: string;
  opportunities: { title: string; body: string[] }[];
  studentTitle: string;
  studentBody: string;
  businessTitle: string;
  businessBody: string;
};

export type AboutContent = {
  heroLead: string;
  mission: { visible: boolean; title: string; body: string };
  people: {
    visible: boolean;
    title: string;
    introTitle: string;
    introParagraphs: string[];
    points: { title: string; paragraphs: string[] }[];
  };
  companyVisible: boolean;
};

function readPage<T>(name: string): T {
  return JSON.parse(fs.readFileSync(path.join(process.cwd(), 'content/pages', `${name}.json`), 'utf8')) as T;
}

export const getHomeProblem = (): HomeProblem => readPage<{ problem: HomeProblem }>('home').problem;
export const getAboutContent = (): AboutContent => readPage<AboutContent>('about');
