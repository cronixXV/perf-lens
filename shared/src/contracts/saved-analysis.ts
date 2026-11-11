import { IAnalysis } from './analysis';

export interface ISavedAnalysis {
  id: string;
  createdAt: string;
  analysis: IAnalysis;
}
