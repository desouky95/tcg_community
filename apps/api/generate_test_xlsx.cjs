const XLSX = require('xlsx');
const path = require('path');

const wb = XLSX.utils.book_new();

// Single Sheet: Cards Only
const cards = [
  { 'Number': '001', 'Title': 'Bulbasaur', 'Type': 'Grass', 'Section': 'Base' },
  { 'Number': '002', 'Title': 'Ivysaur', 'Type': 'Grass', 'Section': 'Base' },
  { 'Number': '003', 'Title': 'Venusaur', 'Type': 'Grass', 'Section': 'Base' },
  { 'Number': '004', 'Title': 'Charmander', 'Type': 'Fire', 'Section': 'Base' },
  { 'Number': '005', 'Title': 'Charmeleon', 'Type': 'Fire', 'Section': 'Base' }
];
const wsCards = XLSX.utils.json_to_sheet(cards);
XLSX.utils.book_append_sheet(wb, wsCards, 'Cards');

const filePath = path.join(__dirname, 'test_checklist_cards.xlsx');
XLSX.writeFile(wb, filePath);
console.log('Cards-only Test XLSX created at:', filePath);
