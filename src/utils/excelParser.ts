import * as XLSX from 'xlsx';
import type { RoadmapData, RoadmapItem, RoadmapGoal } from '../types';
import { parse } from 'date-fns';

export const parseExcel = async (file: File): Promise<RoadmapData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary', cellDates: true });
        
        let jsonData: any[] = [];
        let foundSheet = false;

        // Find a sheet with "Name" column
        for (const sheetName of workbook.SheetNames) {
          const sheet = workbook.Sheets[sheetName];
          const tempJson = XLSX.utils.sheet_to_json(sheet);
          if (tempJson.length > 0 && 'Name' in (tempJson[0] as any)) {
            jsonData = tempJson as any[];
            foundSheet = true;
            break;
          }
        }

        if (!foundSheet) {
          // Fallback to first sheet if no "Name" column found (might be empty or different format)
           const sheetName = workbook.SheetNames[0];
           const sheet = workbook.Sheets[sheetName];
           jsonData = XLSX.utils.sheet_to_json(sheet) as any[];
        }

        if (jsonData.length === 0) {
          resolve({ goals: [], ungroupedItems: [] });
          return;
        }

        // Detect Type based on "Goal" column existence
        const firstRow = jsonData[0];
        const isType2 = 'Goal' in firstRow;

        const items = jsonData.map((row: any): RoadmapItem | null => {
          // Basic validation: Name is required
          if (!row.Name) return null;

          const parseDate = (val: any): Date | undefined => {
             if (!val) return undefined;
             if (val instanceof Date) return val;
             if (typeof val === 'string') {
               // Try parsing DD.MM.YYYY
               const parsed = parse(val, 'dd.MM.yyyy', new Date());
               if (!isNaN(parsed.getTime())) return parsed;
               // Fallback to standard Date parsing
               const standard = new Date(val);
               return isNaN(standard.getTime()) ? undefined : standard;
             }
             return undefined;
          };

          return {
            id: String(row.ID || Math.random().toString(36).substr(2, 9)),
            name: row.Name,
            description: row.Description,
            acceptanceCriteria: row['Acceptance Criteria'],
            start: parseDate(row.Start),
            end: parseDate(row.End),
            pd: String(row.PD || ''),
            cost: String(row.Cost || ''),
            goalId: isType2 ? row.Goal : undefined,
          };
        }).filter((item): item is RoadmapItem => item !== null);

        if (isType2) {
          const goalsMap = new Map<string, RoadmapGoal>();
          const ungrouped: RoadmapItem[] = [];

          items.forEach(item => {
            if (item.goalId) {
              if (!goalsMap.has(item.goalId)) {
                goalsMap.set(item.goalId, {
                  id: item.goalId, // Use name as ID for simplicity
                  name: item.goalId,
                  items: []
                });
              }
              goalsMap.get(item.goalId)?.items.push(item);
            } else {
              ungrouped.push(item);
            }
          });

          resolve({
            goals: Array.from(goalsMap.values()),
            ungroupedItems: ungrouped
          });
        } else {
          resolve({
            goals: [],
            ungroupedItems: items
          });
        }

      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => reject(error);
    reader.readAsBinaryString(file);
  });
};
