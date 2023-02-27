const fs = require('fs');

function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}
const convertSvgToReactComponent = (inputFilePath, outputDirectoryPath) => {
    fs.readFile(inputFilePath, 'utf8', (err, svgCode) => {
      if (err) throw err;
  
      // Get the attributes of the top-level SVG tag
      const svgAttributesRegex = /<svg([^>]*)>/;
      const svgAttributesMatch = svgCode.match(svgAttributesRegex);
      const svgAttributes = svgAttributesMatch ? svgAttributesMatch[1] : '';
  
      // Replace all HTML SVG attributes with their equivalent JSX syntax
      const convertedSvgCode = svgCode.replace(/<svg([^>]*)>/, '')
        .replace(/class="/g, 'className="')
        .replace(/stroke-width="/g, 'strokeWidth="')
        .replace(/fill-opacity="/g, 'fillOpacity="')
        .replace(/stroke-opacity="/g, 'strokeOpacity="')
        .replace(/clip-path="/g, 'clipPath="')
        .replace(/stroke-dasharray="/g, 'strokeDasharray="')
        .replace(/stroke-linecap="/g, 'strokeLinecap="')
        .replace(/stroke-linejoin="/g, 'strokeLinejoin="')
        .replace(/text-anchor="/g, 'textAnchor="')
        .replace(/alignment-baseline="/g, 'alignmentBaseline="')
        .replace(/fill-rule="/g, 'fillRule="')
        .replace(/clip-rule="/g, 'clipRule="')
        .replace(/stroke-miterlimit="/g, 'strokeMiterlimit="')
        .replace(/color-interpolation="/g, 'colorInterpolation="')
        .replace(/color-interpolation-filters="/g, 'colorInterpolationFilters="')
        .replace(/font-family="/g, 'fontFamily="')
        .replace(/font-size="/g, 'fontSize="')
        .replace(/font-weight="/g, 'fontWeight="')
        .replace(/font-style="/g, 'fontStyle="')
        .replace(/letter-spacing="/g, 'letterSpacing="')
        .replace(/text-decoration="/g, 'textDecoration="')
        .replace(/word-spacing="/g, 'wordSpacing="')
        .replace(/visibility="/g, 'visibility="')
        .replace(/xmlns="/g, 'xmlns="http://www.w3.org/2000/svg" ')
        .replace('</svg>', '');
  
      // Create the output directory if it doesn't exist
      if (!fs.existsSync(outputDirectoryPath)) {
        fs.mkdirSync(outputDirectoryPath, { recursive: true });
      }
  
       // Convert field names to capital case and replace symbols
        const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
        const replaceSymbols = (str) =>
        str
            .replace(/-/g, ' ')
            .replace(/\./g, ' ')
            .replace(/:/g, ' ');

        const outputFileName = inputFilePath
        .replace(/^.*[\\/]/, '')
        .replace('.svg', '')
        .split('-')
        .map((str) => capitalize(replaceSymbols(str)).replace(/\s/g, ''))
        .join('');
        const outputFilePath = `${outputDirectoryPath}/${outputFileName}.tsx`;

      const componentCode = `import { createSvgIcon } from '@mui/material/utils';
  
const ${outputFileName} = createSvgIcon(
    <>${convertedSvgCode}</>,
    '${outputFileName}'
);
  
export default ${outputFileName};
`;
  
      fs.writeFile(outputFilePath, componentCode, (err) => {
        if (err) throw err;
        console.log(`Converted ${inputFilePath} to ${outputFilePath}`);
      });
    });
  };


[
    'arrows',
    'business',
    'communication',
    'device',
    'ecommerce',
    'editor',
    'education',
    'files and folder',
    'finance and payment',
    'health',
    'interface',
    'menu',
    'multimedia and audio',
    'navigation maps',
    'notes and task',
    'shipping and delivery',
    'smart house',
    'social',
    'time and date',
    'user',
].forEach(path => {
    const inputDirectoryPath = `./svg-files/${path}/outline`;
    const outputDirectoryPath = `./react-components/${path}/outline`;

    fs.readdir(inputDirectoryPath, (err, files) => {
        if(err) throw err;
    
        files.forEach((file) => {
            if(file.endsWith('.svg')) {
                const inputFilePath = `${inputDirectoryPath}/${file}`;
                convertSvgToReactComponent(inputFilePath, outputDirectoryPath);
            }
        });
    });
})
