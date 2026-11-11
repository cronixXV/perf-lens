import type { AnalysisRepository } from '@domain/analysis/analysis-repository';
import type { ISavedAnalysis } from '@shared/contracts/saved-analysis';

import { database } from './database';

interface IAnalysisRow {
  id: string;
  url: string;
  created_at: string;
  data: string;
}

export class SqliteAnalysisRepository implements AnalysisRepository {
  async save(analysis: ISavedAnalysis): Promise<ISavedAnalysis> {
    const statement = database.prepare(`
      INSERT INTO analyses (id, url, created_at, data)
      VALUES (?, ?, ?, ?)
    `);

    statement.run(
      analysis.id,
      analysis.analysis.url,
      analysis.createdAt,
      JSON.stringify(analysis.analysis)
    );

    return analysis;
  }

  async findById(id: string): Promise<ISavedAnalysis | null> {
    const statement = database.prepare(`
      SELECT id, url, created_at, data
      FROM analyses
      WHERE id = ?
    `);

    const row = statement.get(id) as IAnalysisRow | undefined;

    if (!row) {
      return null;
    }

    return {
      id: row.id,
      createdAt: row.created_at,
      analysis: JSON.parse(row.data)
    };
  }

  async findAll(): Promise<ISavedAnalysis[]> {
    const statement = database.prepare(`
      SELECT id, url, created_at, data
      FROM analyses
      ORDER BY created_at DESC
    `);

    const rows = statement.all() as IAnalysisRow[];

    return rows.map((row) => ({
      id: row.id,
      createdAt: row.created_at,
      analysis: JSON.parse(row.data)
    }));
  }

  async findByUrl(url: string): Promise<ISavedAnalysis[]> {
    const statement = database.prepare(`
      SELECT id, url, created_at, data
      FROM analyses
      WHERE url = ?
      ORDER BY created_at DESC
    `);

    const rows = statement.all(url) as IAnalysisRow[];

    return rows.map((row) => ({
      id: row.id,
      createdAt: row.created_at,
      analysis: JSON.parse(row.data)
    }));
  }
}
