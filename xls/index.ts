import xlsx from 'node-xlsx';
import unzip from 'unzipper';
import fs from 'fs';
import { XMLParser } from 'fast-xml-parser';
import { columnLetters, NA } from './constants';

let numberOfColumns: number;
const filePath = __dirname + '/excel/- WANT LIST Audible Books.xlsx';
// const filePath = __dirname + '/excel/TABS Covid 2021.xlsx';

interface Sheet {
  name: string;
  data: unknown[];
}

type Column = {
  columnTitle: string;
  columnLetter: string;
};

type Hyperlink = {
  ref: string;
  display: string;
};

type Dict = {
  [key: string]: string;
};

function readZippedFiles() {
  const stream = fs.createReadStream(filePath);
  const xmlParser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '',
  });

  return new Promise((resolve, reject) => {
    stream
      .pipe(unzip.Parse())
      .on('entry', (entry) => {
        if (entry.path === 'xl/worksheets/sheet1.xml') {
          console.log('this has the hyperlinks...');
          entry.buffer().then((val: any) => {
            const xml = val.toString('utf-8');
            const p = xmlParser.parse(xml);
            resolve(p.worksheet.hyperlinks.hyperlink);
          });
        }
      })
      .on('error', (err) => reject(err));
  });
}

function makeRefHyperlinkMap(hyperlinks: Hyperlink[]) {
  return hyperlinks.reduce((acc, currentHyperlink, index) => {
    const { ref, display } = currentHyperlink;
    acc[ref] = display;
    return acc;
  }, {} as Dict);
}

function replaceSpaces(str: string) {
  return str.replace(/ /g, '_');
}

function getColumns(arr: string[]) {
  return arr.reduce((acc, curr, index) => {
    acc.push({
      columnTitle: replaceSpaces(curr),
      columnLetter: columnLetters[index],
    });
    return acc;
  }, [] as Column[]);
}

function getRow(
  rawRow: string[],
  cols: Column[],
  excelIndex: number,
  hyperlinksMap: Dict
): Dict {
  const parsedRow = {} as Dict;

  for (let i = 0; i < numberOfColumns; ++i) {
    const { columnLetter, columnTitle } = cols[i];
    const cellNumber = `${columnLetter}${excelIndex}`;
    const hyperlink = hyperlinksMap[cellNumber];
    if (hyperlink) {
      parsedRow[`${columnTitle}_text`] = rawRow[i];
      parsedRow[`${columnTitle}_url`] = hyperlinksMap[cellNumber];
    } else {
      parsedRow[columnTitle] = rawRow[i] || NA;
    }
  }
  return parsedRow;
}

function readXls(hyperlinksMap: Dict) {
  const sheets = xlsx.parse(fs.readFileSync(filePath));

  numberOfColumns = (sheets[0].data[0] as string[]).length;
  console.log('number of cols: ', numberOfColumns);
  const masterColumns = getColumns(sheets[0].data[0] as string[]);
  const parsed = sheets[0].data.reduce((acc, currentRow, index) => {
    const excelIndex = index + 1;
    (acc as any[]).push(
      getRow(currentRow as string[], masterColumns, excelIndex, hyperlinksMap)
    );
    return acc;
  }, []);

  return parsed;
}

(async () => {
  try {
    const hyperlinks = await readZippedFiles();
    const hyperlinksMap = makeRefHyperlinkMap(hyperlinks as Hyperlink[]);
    const parsedXl = readXls(hyperlinksMap);
    // console.log(parsedXl);
    fs.writeFileSync(
      'test-output-5-col.json',
      JSON.stringify((parsedXl as unknown as any[]).slice(1), null, 2)
    );
  } catch (err) {
    console.error(err);
  }
})();
