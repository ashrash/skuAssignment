import { promises } from 'fs';

const readJSONFile = async <T>(fileName: string) => {
    const fileBuffer: Buffer = await promises.readFile(fileName);
    if(fileBuffer) {
        const jsonData: T = JSON.parse(fileBuffer.toString());
        return jsonData;
    }
}

export default readJSONFile;