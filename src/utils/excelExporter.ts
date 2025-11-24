import ExcelJS from 'exceljs';
import type { RoadmapData } from '../types';
import { GOAL_COLORS } from './colors';

// Convert color class to hex color
const colorMap: { [key: string]: string } = {
  'from-blue-600 to-indigo-600 border-blue-500/30': '4F46E5',
  'from-emerald-600 to-teal-600 border-emerald-500/30': '059669',
  'from-purple-600 to-fuchsia-600 border-purple-500/30': '9333EA',
  'from-amber-600 to-orange-600 border-amber-500/30': 'D97706',
  'from-rose-600 to-pink-600 border-rose-500/30': 'E11D48',
  'from-cyan-600 to-sky-600 border-cyan-500/30': '0891B2',
  'from-lime-600 to-green-600 border-lime-500/30': '65A30D',
  'from-violet-600 to-purple-600 border-violet-500/30': '7C3AED',
};

const getColorHex = (colorClass: string): string => {
  return colorMap[colorClass] || '6B7280'; // Default to gray
};

export const exportRoadmapWithVisualization = async (
  originalFile: File,
  data: RoadmapData,
  year: number
): Promise<void> => {
  try {
    // Strategy: Load the original Excel file, copy all sheets (data and styles only),
    // then add the visualization sheet. This approach loses Excel Table definitions
    // but preserves all data, formatting, and formulas.
    
    const originalArrayBuffer = await originalFile.arrayBuffer();
    
    // Create a temporary workbook with ONLY the visualization sheet
    const tempWorkbook = new ExcelJS.Workbook();
    const vizSheet = tempWorkbook.addWorksheet('Roadmap Visualization', {
      properties: {
        defaultRowHeight: 18
      }
    });

  // Define months and quarters
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const quarters = [
    { name: 'Q1', span: 3 },
    { name: 'Q2', span: 3 },
    { name: 'Q3', span: 3 },
    { name: 'Q4', span: 3 },
  ];

  // Configure column widths
  vizSheet.getColumn(1).width = 30; // Item name column
  for (let i = 2; i <= 13; i++) {
    vizSheet.getColumn(i).width = 8; // Month columns
  }

  // Add title row
  const titleRow = vizSheet.getRow(1);
  titleRow.height = 25;
  titleRow.getCell(1).value = `Roadmap Visualization - ${year}`;
  titleRow.getCell(1).font = { bold: true, size: 14 };
  titleRow.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
  vizSheet.mergeCells(1, 1, 1, 13);

  // Add quarters row
  const quarterRow = vizSheet.getRow(2);
  quarterRow.height = 20;
  quarterRow.getCell(1).value = 'Roadmap Items';
  quarterRow.getCell(1).font = { bold: true };
  quarterRow.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
  quarterRow.getCell(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF1F2937' }
  };
  quarterRow.getCell(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

  let colIndex = 2;
  quarters.forEach((q, qIdx) => {
    const startCol = colIndex;
    const endCol = colIndex + q.span - 1;
    vizSheet.mergeCells(2, startCol, 2, endCol);
    const cell = quarterRow.getCell(startCol);
    cell.value = q.name;
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: qIdx % 2 === 0 ? 'FF374151' : 'FF4B5563' }
    };
    // Apply border to all cells in the merged range
    for (let c = startCol; c <= endCol; c++) {
      quarterRow.getCell(c).border = {
        right: { style: 'thin', color: { argb: 'FF6B7280' } }
      };
    }
    colIndex += q.span;
  });

  // Add months row
  const monthRow = vizSheet.getRow(3);
  monthRow.height = 18;
  monthRow.getCell(1).value = '';
  monthRow.getCell(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF111827' }
  };
  months.forEach((month, idx) => {
    const cell = monthRow.getCell(idx + 2);
    cell.value = month;
    cell.font = { size: 10, color: { argb: 'FF9CA3AF' } };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1F2937' }
    };
    cell.border = {
      right: { style: 'thin', color: { argb: 'FF374151' } },
      bottom: { style: 'thin', color: { argb: 'FF6B7280' } }
    };
  });

  // Helper function to determine which months an item spans
  const getMonthSpan = (start: Date | undefined, end: Date | undefined): boolean[] => {
    const monthsSpanned = new Array(12).fill(false);
    if (!start || !end) return monthsSpanned;

    const startYear = start.getFullYear();
    const endYear = end.getFullYear();
    
    if (startYear === year || endYear === year) {
      const effectiveStart = startYear === year ? start : new Date(year, 0, 1);
      const effectiveEnd = endYear === year ? end : new Date(year, 11, 31);
      
      const startMonth = effectiveStart.getMonth();
      const endMonth = effectiveEnd.getMonth();
      
      for (let m = startMonth; m <= endMonth; m++) {
        monthsSpanned[m] = true;
      }
    }
    
    return monthsSpanned;
  };

  // Add data rows
  let currentRow = 4;

  // Process goals
  data.goals.forEach((goal, goalIdx) => {
    const colorClass = GOAL_COLORS[goalIdx % GOAL_COLORS.length];
    const colorHex = getColorHex(colorClass);

    // Add goal header
    const goalRow = vizSheet.getRow(currentRow);
    goalRow.height = 22;
    goalRow.getCell(1).value = goal.name;
    goalRow.getCell(1).font = { bold: true, size: 11, color: { argb: 'FFFFFFFF' } };
    goalRow.getCell(1).alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
    goalRow.getCell(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: `FF${colorHex}` }
    };
    goalRow.getCell(1).border = {
      left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
      right: { style: 'thin', color: { argb: 'FFE5E7EB' } },
      bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } }
    };
    
    // Fill goal row with lighter color and subtle borders
    for (let col = 2; col <= 13; col++) {
      const cell = goalRow.getCell(col);
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: `FF${colorHex}` }
      };
      cell.border = {
        right: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } }
      };
    }
    
    currentRow++;

    // Add items for this goal
    goal.items.forEach((item) => {
      const itemRow = vizSheet.getRow(currentRow);
      itemRow.height = 18;
      
      const nameCell = itemRow.getCell(1);
      nameCell.value = item.name;
      nameCell.font = { size: 10 };
      nameCell.alignment = { vertical: 'middle', horizontal: 'left', indent: 2 };
      nameCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFFFF' }
      };
      nameCell.border = {
        left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        right: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } }
      };

      const monthsSpanned = getMonthSpan(item.start, item.end);
      
      for (let monthIdx = 0; monthIdx < 12; monthIdx++) {
        const cell = itemRow.getCell(monthIdx + 2);
        if (monthsSpanned[monthIdx]) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: `FF${colorHex}` }
          };
        } else {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFFFFFF' }
          };
        }
        cell.border = {
          right: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } }
        };
      }
      
      currentRow++;
    });
    
    // Add a subtle spacing row after each goal group
    if (goalIdx < data.goals.length - 1) {
      currentRow++;
    }
  });

  // Process ungrouped items
  if (data.ungroupedItems.length > 0) {
    if (data.goals.length > 0) {
      // Add a blank row for spacing
      currentRow++;
      
      // Add "Other Items" separator with subtle styling
      const separatorRow = vizSheet.getRow(currentRow);
      separatorRow.height = 20;
      separatorRow.getCell(1).value = 'Other Items';
      separatorRow.getCell(1).font = { bold: true, size: 10, color: { argb: 'FF6B7280' } };
      separatorRow.getCell(1).alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
      separatorRow.getCell(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFF3F4F6' }
      };
      separatorRow.getCell(1).border = {
        left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        right: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } }
      };
      
      for (let col = 2; col <= 13; col++) {
        const cell = separatorRow.getCell(col);
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFF3F4F6' }
        };
        cell.border = {
          right: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } }
        };
      }
      
      currentRow++;
    }

    data.ungroupedItems.forEach((item, itemIdx) => {
      const colorClass = GOAL_COLORS[(itemIdx + data.goals.length) % GOAL_COLORS.length];
      const colorHex = getColorHex(colorClass);
      
      const itemRow = vizSheet.getRow(currentRow);
      itemRow.height = 18;
      
      const nameCell = itemRow.getCell(1);
      nameCell.value = item.name;
      nameCell.font = { size: 10 };
      nameCell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
      nameCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFFFF' }
      };
      nameCell.border = {
        left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        right: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } }
      };

      const monthsSpanned = getMonthSpan(item.start, item.end);
      
      for (let monthIdx = 0; monthIdx < 12; monthIdx++) {
        const cell = itemRow.getCell(monthIdx + 2);
        if (monthsSpanned[monthIdx]) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: `FF${colorHex}` }
          };
        } else {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFFFFFF' }
          };
        }
        cell.border = {
          right: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } }
        };
      }
      
      currentRow++;
    });
  }

  // Now we need to merge: Load original with ExcelJS, but we'll create a completely new workbook
  // by reading the original's data values only (not the table structures)
  const finalWorkbook = new ExcelJS.Workbook();
  
  // Load original to copy sheets
  const originalWorkbook = new ExcelJS.Workbook();
  await originalWorkbook.xlsx.load(originalArrayBuffer);
  
  // Copy all worksheets from original (this will lose table definitions but preserve data)
  for (const worksheet of originalWorkbook.worksheets) {
    const newSheet = finalWorkbook.addWorksheet(worksheet.name);
    
    // Copy column widths
    worksheet.columns.forEach((col, idx) => {
      if (col.width) {
        newSheet.getColumn(idx + 1).width = col.width;
      }
    });
    
    // Copy all rows with their values and styles
    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      const newRow = newSheet.getRow(rowNumber);
      newRow.height = row.height;
      
      row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        const newCell = newRow.getCell(colNumber);
        newCell.value = cell.value;
        newCell.style = cell.style;
      });
    });
    
    // Copy merged cells
    if (worksheet.model.merges) {
      worksheet.model.merges.forEach((merge: string) => {
        newSheet.mergeCells(merge);
      });
    }
  }
  
  // Now add the visualization sheet to the final workbook
  const finalVizSheet = finalWorkbook.addWorksheet('Roadmap Visualization', {
    properties: {
      defaultRowHeight: 18
    }
  });
  
  // Copy all content from temp viz sheet to final viz sheet
  vizSheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    const newRow = finalVizSheet.getRow(rowNumber);
    newRow.height = row.height;
    
    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      const newCell = newRow.getCell(colNumber);
      newCell.value = cell.value;
      newCell.style = cell.style;
    });
  });
  
  // Copy column widths from viz sheet
  vizSheet.columns.forEach((col, idx) => {
    if (col.width) {
      finalVizSheet.getColumn(idx + 1).width = col.width;
    }
  });
  
  // Copy merged cells from viz sheet
  if (vizSheet.model.merges) {
    vizSheet.model.merges.forEach((merge: string) => {
      finalVizSheet.mergeCells(merge);
    });
  }

  // Generate and download the file
    const buffer = await finalWorkbook.xlsx.writeBuffer({
      useStyles: true,
      useSharedStrings: true
    });
    const blob = new Blob([buffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `roadmap_with_visualization_${year}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting roadmap:', error);
    throw error;
  }
};
