import Latex from 'react-latex-next';

/*
* Name: LatexLine.js
* Author: Jacob Warren
* Description: A single line of latex.
*/

const LatexLine = ({ string }) => {
    return (
        <div>
            <Latex strict>{string}</Latex>
        </div>
    );
};

export default LatexLine;
